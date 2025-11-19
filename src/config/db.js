import {neon} from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;


export const sql = neon(connectionString);


export async function initDB (){
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255),
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        console.log("Table created successfully");
    } catch (error) {
        console.error("Error creating table:", error);
        // Don't exit immediately on DB connection errors during development
        console.error("Failed to initialize database. Please check your DATABASE_URL and network connection.");
    }

}

   