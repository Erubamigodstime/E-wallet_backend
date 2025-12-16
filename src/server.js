import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { initDB } from './config/db.js';
import router from './routes/index.js';
import rateLimiter from './middleware/rateLimiter.js';
import job from './config/cron.js';

// Start the cron job
if(process.env.NODE_ENV === 'production') job.start();

const PORT = process.env.PORT || 5000;
const app = express();

app.set('trust proxy', 1); // Trust first proxy for rate limiting behind proxies/load balancers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is healthy' });
});

app.use(rateLimiter); // Apply rate limiting middleware after health check
app.use('/api', router);

initDB().then(()=>{  
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

export default app;