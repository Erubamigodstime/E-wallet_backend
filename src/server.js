import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import router from './routes/index.js';
import rateLimiter from './middleware/rateLimiter.js';

const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();


app.set('trust proxy', 1); // Trust first proxy for rate limiting behind proxies/load balancers
app.use(rateLimiter); // Apply rate limiting middleware globally
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


initDB().then(()=>{  
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// api health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is healthy' });
});

app.use('/api', router);

export default app;