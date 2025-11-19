
import { sql } from '../config/db.js';

const homePage = (req, res) => {
    res.status(200).json({ message: 'Welcome to the Finance Tracker API' });
}

const createTransaction = async (req, res) => {
    try {
        const { user_id, title, amount, category } = req.body;

        if (!user_id || !title || amount === undefined || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *;
        `;


        res.status(201).json({
            message: 'Transaction created successfully',
            transaction: transaction[0]
        });

    } catch (error) {
        console.log("Error creating transaction:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getTransactions = async (req, res) => {
    // Logic to get all transactions for a user
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ error: 'Missing user_id parameter' });
        }
        const transactions = await sql `SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;
        res.status(200).json(transactions);
    } catch (error) {
        console.log("Error fetching transactions:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await sql `SELECT * FROM transactions ORDER BY created_at DESC`;
        res.status(200).json(transactions);
    } catch (error) {
        console.log("Error fetching all transactions:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// delete transactions;

const deleteTransaction = async (req, res) => {
    try {
        const { transaction_id } = req.params;
        if (!transaction_id) {
            return res.status(400).json({ error: 'Missing transaction_id parameter' });
        }
        if (!Number.isInteger(Number(transaction_id))) {
            return res.status(400).json({ error: 'Invalid transaction_id parameter id must be a number' });
        };
        const transaction = await sql `SELECT * FROM transactions WHERE id = ${transaction_id}`;
        if (transaction.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await sql `DELETE FROM transactions WHERE id = ${transaction_id}`;
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.log("Error deleting transaction:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// get transaction summary

const getTransactionSummary = async (req, res) => {
    // Logic to get transaction summary for a user
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ error: 'Missing user_id parameter' });
        }
        const balanceResult = await sql `
            SELECT                 
                COALESCE(SUM(amount), 0) AS balance,
            FROM transactions
            WHERE user_id = ${user_id};
        `;
        const incomeResult = await sql `
            SELECT COALESCE(SUM(amount), 0) AS income
            FROM transactions
            WHERE user_id = ${user_id} AND amount > 0;
        `;
        const expenseResult = await sql `
            SELECT COALESCE(SUM(amount), 0) AS expenses
            FROM transactions
            WHERE user_id = ${user_id} AND amount < 0;
        `;
        const summary = {
            balance: Number(balanceResult[0].balance),
            income: Number(incomeResult[0].income),
            expenses: Number(expenseResult[0].expenses),
        };
        res.status(200).json(summary);
    } catch (error) {
        console.log("Error fetching transaction summary:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export { 
    createTransaction, 
    getTransactions, 
    homePage, 
    getAllTransactions, 
    deleteTransaction, 
    getTransactionSummary 
};