import Redis from 'ioredis';

const redisClient = new Redis();

// In-memory lock object to track ongoing requests
const locks: Record<string, Promise<any>> = {};

export default function handleCache(duration: number) {
    return async (req: any, res: any, next: () => void) => {
        if (req.method !== "GET") {
            console.log("Cannot cache non-GET methods!");
            return next();
        }

        const key = req.originalUrl;

        try {
            const cachedResponse = await redisClient.get(key);

            if (cachedResponse) {
                console.log(`Cache hit for ${key}`);
                return res.json(JSON.parse(cachedResponse));
            }

            console.log(`Cache miss for ${key}`);

            // If there's already a lock/promise for this key, wait for it
            if (await locks[key]) {
                console.log(`Waiting for ongoing request to finish for key: ${key}`);
                const result = await locks[key];
                return res.json(result);
            }

            // Create a promise and store it in locks
            let resolver: (value: any) => void;
            locks[key] = new Promise((resolve) => {
                resolver = resolve;
            });

            const originalJson = res.json.bind(res);

            res.json = (body: any) => {
                console.log(`Storing response in cache for key: ${key}`);
                redisClient.set(key, JSON.stringify(body), 'EX', duration);
                
                // Resolve the lock promise so other waiting requests can proceed
                resolver(body);
                delete locks[key]; // Clear lock after resolving
                
                return originalJson(body);
            };

            next();

        } catch (error) {
            console.error("Redis error:", error);
            
            // Clear lock if an error occurs
            if (await locks[key]) {
                delete locks[key];
            }
            
            next();
        }
    };
}
