import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins - add your development URLs here
        const allowedOrigins = [
            'http://localhost:8081',
            'http://192.168.106.90:8081',
            // Allow any IP on port 5173
            /^http:\/\/\d+\.\d+\.\d+\.\d+:8081$/,
            // Allow Ngrok URLs
            /^https?:\/\/.*\.ngrok\.io$/,
            /^https?:\/\/.*\.ngrok-free\.app$/
        ];

        // Check if the origin matches any allowed patterns
        const isAllowed = allowedOrigins.some(allowed => {
            return (typeof allowed === 'string') ? allowed === origin : allowed.test(origin);
        });

        callback(null, true);
        // if (isAllowed) {
        //     callback(null, true);
        // } else {
        //     console.warn('Blocked by CORS:', origin);
        //     callback(new Error('CORS policy: No access from the requested origin.'));
        // }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};