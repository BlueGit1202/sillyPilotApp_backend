Quick Start
To get started, you can use OpenRouter via API like this:

typescript
python
ruby
shell

Copy
fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "openai/gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })
});
You can also use OpenRouter with OpenAI's client API:

typescript
python

Copy
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: $OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": $YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": $YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  }
})

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages: [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })

  console.log(completion.choices[0].message)
}
main()
Principles



Requests
OpenRouter's request and response schemas are very similar to the OpenAI Chat API, with a few small differences. At a high level, OpenRouter normalizes the schema across models and providers so you only need to learn one.

Request Body
Here's the request schema as a TypeScript type. This will be the body of your POST request to the /api/v1/chat/completions endpoint (see the quick start above for an example).

typescript

// Definitions of subtypes are below
type Request = {
  // Either "messages" or "prompt" is required
  messages?: Message[];
  prompt?: string;

  // If "model" is unspecified, uses the user's default
  model?: string; // See "Supported Models" section

  // Allows to force the model to produce specific output format.
  // Only supported by OpenAI models, Nitro models, and some others - check the
  // providers on the model page on openrouter.ai/models to see if it's supported,
  // and set `require_parameters` to true in your Provider Preferences. See
  // openrouter.ai/docs/provider-routing
  response_format?: { type: 'json_object' };

  stop?: string | string[];
  stream?: boolean; // Enable streaming

  // See LLM Parameters (openrouter.ai/docs/parameters)
  max_tokens?: number; // Range: [1, context_length)
  temperature?: number; // Range: [0, 2]
  top_p?: number; // Range: (0, 1]
  top_k?: number; // Range: [1, Infinity) Not available for OpenAI models
  frequency_penalty?: number; // Range: [-2, 2]
  presence_penalty?: number; // Range: [-2, 2]
  repetition_penalty?: number; // Range: (0, 2]
  seed?: number; // OpenAI only

  // Tool calling
  // Will be passed down as-is for providers implementing OpenAI's interface.
  // For providers with custom interfaces, we transform and map the properties.
  // Otherwise, we transform the tools into a YAML template. The model responds with an assistant message.
  // See models supporting tool calling: openrouter.ai/models?supported_parameters=tools
  tools?: Tool[];
  tool_choice?: ToolChoice;

  // Additional optional parameters
  logit_bias?: { [key: number]: number };

  // OpenRouter-only parameters
  // See "Prompt Transforms" section: openrouter.ai/docs/transforms
  transforms?: string[];
  // See "Model Routing" section: openrouter.ai/docs/model-routing
  models?: string[];
  route?: 'fallback';
  // See "Provider Routing" section: openrouter.ai/docs/provider-routing
  provider?: ProviderPreferences;
};

// Subtypes:

type TextContent = {
  type: 'text';
  text: string;
};

type ImageContentPart = {
  type: 'image_url';
  image_url: {
    url: string; // URL or base64 encoded image data
    detail?: string; // Optional, defaults to 'auto'
  };
};

type ContentPart = TextContent | ImageContentPart;

type Message =
  | {
      role: 'user' | 'assistant' | 'system';
      // ContentParts are only for the 'user' role:
      content: string | ContentPart[];
      // If "name" is included, it will be prepended like this
      // for non-OpenAI models: `{name}: {content}`
      name?: string;
    }
  | {
      role: 'tool';
      content: string;
      tool_call_id: string;
      name?: string;
    };

type FunctionDescription = {
  description?: string;
  name: string;
  parameters: object; // JSON Schema object
};

type Tool = {
  type: 'function';
  function: FunctionDescription;
};

type ToolChoice =
  | 'none'
  | 'auto'
  | {
      type: 'function';
      function: {
        name: string;
      };
    };
Request Headers
OpenRouter allows you to specify an optional HTTP-Referer header to identify your app and make it discoverable to users on openrouter.ai. You can also include an optional X-Title header to set or modify the title of your app. Example:

javascript

Copy
fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "mistralai/mixtral-8x7b-instruct",
    "messages": [
      
      {"role": "user", "content": "Who are you?"},
      
    ],
  })
});
Model routing: If the model parameter is omitted, the user or payer's default is used. Otherwise, remember to select a value for model from the supported models or API, and include the organization prefix. OpenRouter will select the least expensive and best GPUs available to serve the request, and fall back to other providers or GPUs if it receives a 5xx response code or if you are rate-limited.

Streaming: Server-Sent Events (SSE) are supported as well, to enable streaming for all models. Simply send stream: true in your request body. The SSE stream will occasionally contain a "comment" payload, which you should ignore (noted below).

Non-standard parameters: If the chosen model doesn't support a request parameter (such as logit_bias in non-OpenAI models, or top_k for OpenAI), then the parameter is ignored. The rest are forwarded to the underlying model API.

Assistant Prefill: OpenRouter supports asking models to complete a partial response. This can be useful for guiding models to respond in a certain way.

To use this features, simply include a message with role: "assistant" at the end of your messages array. Example:

javascript

Copy
fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "mistralai/mixtral-8x7b-instruct",
    "messages": [
      
      {"role": "user", "content": "Who are you?"},
      {"role": "assistant", "content": "I'm not sure, but my best guess is"},
    ],
  })
});
Images & Multimodal Requests
Multimodal requests are only available via the /api/v1/chat/completions API with a multi-part messages parameter. The image_url can either be a URL or a data-base64 encoded image. Example:

javascript

Copy
...
"messages": [
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "What's in this image?"
      },
      {
        "type": "image_url",
        "image_url": {
          "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
        }
      }
    ]
  }
]
Sample LLM's response:

json

{
  "choices": [
    {
      "role": "assistant",
      "content": "This image depicts a scenic natural landscape featuring a long wooden boardwalk that stretches out through an expansive field of green grass. The boardwalk provides a clear path and invites exploration through the lush environment. The scene is surrounded by a variety of shrubbery and trees in the background, indicating a diverse plant life in the area."
    }
  ]
}
Uploading base64 encoded images
For locally stored images, you can send them to the model using base64 encoding. Here's an example:

typescript

import { readFile } from 'fs/promises';

const getFlowerImage = async (): Promise<string> => {
  const imagePath = new URL('flower.jpg', import.meta.url);
  const imageBuffer = await readFile(imagePath);
  const base64Image = imageBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64Image}`;
};

...

'messages': [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: "What's in this image?",
      },
      {
        type: 'image_url',
        image_url: {
          url: `${await getFlowerImage()}`,
        },
      },
    ],
  },
];
When sending data-base64 string, ensure it contains the content-type of the image. Example:

javascript

Copy
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII
Supported content types are:

image/png
image/jpeg
image/webp
Tool Calls
Tool calls (also known as function calling) allow you to give an LLM access to external tools. The LLM does not call the tools directly. Instead, it suggests the tool to call. The user then calls the tool separately and provides the results back to the LLM. Finally, the LLM formats the response into an answer to the user's original question.

An example of the five-turn sequence:

The user asks a question, while supplying a list of available tools in a JSON schema format:
json

Copy
...
"messages": [{
  "role": "user",
  "content": "What is the weather like in Boston?"
}],
"tools": [{
  "type": "function",
  "function": {
    "name": "get_current_weather",
    "description": "Get the current weather in a given location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "The city and state, e.g. San Francisco, CA"
        },
        "unit": {
          "type": "string",
          "enum": [
            "celsius",
            "fahrenheit"
          ]
        }
      },
      "required": [
        "location"
      ]
    }
  }
}],
The LLM responds with tool suggestion, together with appropriate arguments:
json

Copy
// Some models might include their reasoning in content
"message": {
  "role": "assistant",
  "content": null,
  "tool_calls": [
    {
      "id": "call_9pw1qnYScqvGrCH58HWCvFH6",
      "type": "function",
      "function": {
        "name": "get_current_weather",
        "arguments": "{ \"location\": \"Boston, MA\"}"
      }
    }
  ]
},
The user calls the tool separately:
typescript

const weather = await getWeather({ location: 'Boston, MA' });
console.log(weather); // { "temperature": "22", "unit": "celsius", "description": "Sunny"}
The user provides the tool results back to the LLM:
json

Copy
...
"messages": [
  {
    "role": "user",
    "content": "What is the weather like in Boston?"
  },
  {
    "role": "assistant",
    "content": null,
    "tool_calls": [
      {
        "id": "call_9pw1qnYScqvGrCH58HWCvFH6",
        "type": "function",
        "function": {
          "name": "get_current_weather",
          "arguments": "{ \"location\": \"Boston, MA\"}"
        }
      }
    ]
  },
  {
    "role": "tool",
    "name": "get_current_weather",
    "tool_call_id": "call_9pw1qnYScqvGrCH58HWCvFH6",
    "content": "{\"temperature\": \"22\", \"unit\": \"celsius\", \"description\": \"Sunny\"}"
  }
],
The LLM formats the tool result into a natural language response:
json

...
"message": {
  "role": "assistant",
  "content": "The current weather in Boston, MA is sunny with a temperature of 22°C."
}
OpenRouter standardizes the tool calling interface. However, different providers and models may support less tool calling features and arguments. (ex: tool_choice, tool_use, tool_result)

Stream Cancellation
For some providers, streaming requests can be canceled by aborting the connection or simply disconnecting.

When aborting the connection to a provider that supports stream cancellation, the model will stop processing the request, and billing will stop as soon as the upstream provider detects the disconnection.

If you're using the Fetch API, you can use the AbortController to cancel the stream. Here's an example:

typescript

const controller = new AbortController();

fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: ...,
  body: ...,
  signal: controller.signal
})

...

// Later, to cancel the stream:
controller.abort();
NOTE: Aborting/disconnecting from a non-stream request or a stream request to a provider that does not support stream cancellation will not halt the model's processing in the background. You will still be billed for the rest of the completion.

API Keys
Responses

API Keys
Users or developers can cover model costs with normal API keys. This allows you to use curl or the OpenAI SDK directly with OpenRouter. Just create an API key, set the api_base, and optionally set a referrer header to make your app discoverable to others on OpenRouter.

Note: API keys on OpenRouter are more powerful than keys used directly for model APIs. They allow users to set credit limits for apps, and they can be used in OAuth flows.

Example code:

python
typescript
shell

Copy
import openai

openai.api_base = "https://openrouter.ai/api/v1"
openai.api_key = $OPENROUTER_API_KEY

response = openai.ChatCompletion.create(
  model="openai/gpt-3.5-turbo",
  messages=[...],
  headers={
    "HTTP-Referer": $YOUR_SITE_URL, # Optional, for including your app on openrouter.ai rankings.
    "X-Title": $YOUR_APP_NAME, # Optional. Shows in rankings on openrouter.ai.
  },
)

reply = response.choices[0].message
To stream with Python, see this example from OpenAI.

OAuth PKCE
Requests

OAuth PKCE
Users can connect to OpenRouter in one click using Proof Key for Code Exchange (PKCE). Here's an example, and here's a step-by-step:

Step 1: Send your user to OpenRouter
Send your user to https://openrouter.ai/auth?callback_url=YOUR_SITE_URL

You can optionally include a code_challenge (random password up to 256 digits) for extra security.
For maximum security, we recommend also setting code_challenge_method to S256, and then setting code_challenge to the base64 encoding of the sha256 hash of code_verifier, which you will submit in Step 2. More info in Auth0's docs.
Example URLs
OAuth without code challenge: https://openrouter.ai/auth?callback_url=YOUR_SITE_URL

With code challenge (Plain method): https://openrouter.ai/auth?callback_url=YOUR_SITE_URL&code_challenge=5f6525766c064480ac25bd493d121377e6b57d2fa52c0245fbbd51e9&code_challenge_method=plain

With code challenge (S256 method, Recommended): https://openrouter.ai/auth?callback_url=YOUR_SITE_URL&code_challenge=17T2L7LU0IJwCoMiyYkRjTGk4b73xzc309jM2t--AfA&code_challenge_method=S256

Step 2: Exchange the code for a user-controlled API key
Once logged in, they'll be redirected back to your site with a code in the URL. Make an API call (can be frontend or backend) to exchange the code for a user-controlled API key. And that's it for PKCE!

Look for the code query parameter, e.g. ?code=....
typescript

fetch('https://openrouter.ai/api/v1/auth/keys', {
  method: 'POST',
  body: JSON.stringify({
    code: $CODE_FROM_QUERY_PARAM,
    code_verifier: $CODE_VERIFIER, // Only needed if you sent a code_challenge in Step 1
    code_challenge_method: $CODE_CHALLENGE_METHOD, // Only needed if you sent a code_challenge_method in Step 1
  }),
});
Step 3: Use the API key
A fresh API key will be in the result under "key". Store it securely and make OpenAI-style requests (supports streaming as well):

typescript

Copy
fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "openai/gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"},
      
    ],
  })
});
You can use JavaScript or any server-side framework, like Streamlit. The linked example shows multiple models and file Q&A.

Appendix: Generating
code_challenge
for S256
code_challenge_method

In JavaScript, you can use crypto API to generate a code challenge for the S256 method:

typescript

export async function sha256CodeChallenge(input: string) {
  return crypto.createHash('sha256').update(input).digest('base64url');
}
// ...

const generatedCodeChallenge = await sha256CodeChallenge(code_verifier);

// ...
Error Codes
400 Invalid code_challenge_method: Make sure you're using the same code challenge method in step 1 as in step 2.
403 Invalid code or code_verifier: Make sure your user is logged in to OpenRouter, and that code_verifier and code_challenge_method are correct.
405 Method Not Allowed: Make sure you're using POST and HTTPS for your request.
External Tools
PKCE Tools
Online PKCE Generator Tool
Model Routing
API Keys
