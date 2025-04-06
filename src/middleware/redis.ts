import Redis from "ioredis";
import { Request, Response, NextFunction } from "express";

// Connect to Redis using hardcoded URL and password

const REDIS_URL = process.env.REDIS_URL || "";

const redisClient = new Redis(REDIS_URL, {
    retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
    maxRetriesPerRequest: null, // Prevents retry limit errors
    enableReadyCheck: false, // Helps if Redis is slow to respond
});

// In-memory lock object to track ongoing requests
const locks: Record<string, { promise: Promise<any>; resolve: (value: any) => void }> = {};

redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

export default function handleCache(duration: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== "GET") {
            console.log("Cannot cache non-GET methods!");
            return next();
        }

        const key = req.originalUrl;

        try {
            // Check if response is cached
            const cachedResponse = await redisClient.get(key);

            if (cachedResponse) {
                console.log(`Cache hit for ${key}`);
                return res.json(JSON.parse(cachedResponse));
            }

            console.log(`Cache miss for ${key}`);

            // Wait if another request is already fetching this key
            if (locks[key]) {
                console.log(`Waiting for ongoing request to finish for key: ${key}`);
                return res.json(await locks[key].promise);
            }

            // Create a lock object with a Promise and its resolver
            let resolveFn: (value: any) => void;
            locks[key] = {
                promise: new Promise((resolve) => {
                    resolveFn = resolve;
                }),
                resolve: resolveFn!, // Non-null assertion (TypeScript)
            };

            const originalJson = res.json.bind(res);

            res.json = (body: any) => {
                console.log(`Storing response in cache for key: ${key}`);

                redisClient.set(key, JSON.stringify(body), "EX", duration)
                    .catch((err) => console.error("❌ Redis set error:", err));

                // Resolve lock promise and clear lock
                locks[key].resolve(body);
                delete locks[key];

                return originalJson(body);
            };

            next();

        } catch (error) {
            console.error("Redis error:", error);

            // Ensure lock is cleared if an error occurs
            delete locks[key];

            next();
        }
    };
}
