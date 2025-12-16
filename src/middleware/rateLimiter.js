import ratelimit from "../config/upstash.js";


const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { success } = await ratelimit.limit(ip);

        if (!success) {
            return res.status(429).json({ error: 'Too many requests, please try again later.' });
        }
        next();
    } catch (error) {
        console.error("Rate limiting error:", error);
        // Fail open: allow request to continue if rate limiting service is unavailable
        console.warn("Rate limiting unavailable, allowing request to proceed");
        next();
    }   
};

export default rateLimiter;