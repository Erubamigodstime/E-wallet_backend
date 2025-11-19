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
        res.status(500).json({ error: 'Internal server error' });
    }   
};

export default rateLimiter;