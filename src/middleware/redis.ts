import Redis from "ioredis";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const REDIS_URL = process.env.REDIS_URL || "";

const redisClient = new Redis(REDIS_URL, {
    retryStrategy: (times) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

// More efficient than plain objects for concurrency
const locks = new Map<string, { promise: Promise<any>; resolve: (value: any) => void }>();

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

// Utility to hash long URLs into consistent-length keys
const hashKey = (url: string) => crypto.createHash("sha1").update(url).digest("hex");

export default function handleCache(durationSeconds: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== "GET") return next();

        const cacheKey = hashKey(req.originalUrl);

        try {
            // Try cache first
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                console.log(`✅ [Cache hit] ${req.originalUrl}`);
                return res.send(cached);
            }

            console.log(`🚧 [Cache miss] ${req.originalUrl}`);

            // If someone else is already fetching this data
            if (locks.has(cacheKey)) {
                console.log(`⏳ Waiting on lock for ${req.originalUrl}`);
                return res.send(await locks.get(cacheKey)!.promise);
            }

            // Create a lock
            let resolveFn!: (value: any) => void;
            const lockPromise = new Promise((resolve) => { resolveFn = resolve; });
            locks.set(cacheKey, { promise: lockPromise, resolve: resolveFn });

            // Hook into response
            const chunks: any[] = [];
            const originalWrite = res.write.bind(res);
            const originalEnd = res.end.bind(res);

            res.write = (chunk: any, ...args: any[]) => {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
                return originalWrite(chunk, ...args);
            };

            res.end = (chunk: any, ...args: any[]) => {
                if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));

                const body = Buffer.concat(chunks).toString("utf8");

                // Fire and forget Redis write
                redisClient.set(cacheKey, body, "EX", durationSeconds).catch(console.error);

                // Resolve lock waiters
                const lock = locks.get(cacheKey);
                if (lock) {
                    lock.resolve(body);
                    locks.delete(cacheKey);
                }

                return originalEnd(chunk, ...args);
            };

            // Just in case, clean up on abnormal termination
            res.once("close", () => {
                if (locks.has(cacheKey)) {
                    console.warn(`⚠️ Request for ${req.originalUrl} closed prematurely.`);
                    locks.delete(cacheKey);
                }
            });

            next();
        } catch (err) {
            console.error("❌ Middleware error:", err);
            locks.delete(cacheKey);
            return next();
        }
    };
}
