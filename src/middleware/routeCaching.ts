import NodeCache from "node-cache";

// Create a NodeCache instance
const cache = new NodeCache({ stdTTL: 0 }); // Disable default TTL

// In-memory lock object to track ongoing requests
const locks: Record<string, { promise: Promise<any>; resolve: (value: any) => void }> = {};

export default function handleCache(duration: number) {
    return async (req: any, res: any, next: () => void) => {
        if (req.method !== "GET") {
            console.log("Cannot cache non-GET methods!");
            return next();
        }

        const key = req.originalUrl;

        try {
            // Check if response is cached
            const cachedResponse = cache.get(key);

            if (cachedResponse) {
                console.log(`Cache hit for ${key}`);
                return res.json(cachedResponse);
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

                cache.set(key, body, duration);

                // Resolve lock promise and clear lock
                locks[key].resolve(body);
                delete locks[key];

                return originalJson(body);
            };

            next();

        } catch (error) {
            console.error("Cache error:", error);

            // Ensure lock is cleared if an error occurs
            delete locks[key];

            next();
        }
    };
}
