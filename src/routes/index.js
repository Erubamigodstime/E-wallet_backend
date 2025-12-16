import express from 'express';
const router = express.Router();

    getTransactionSummary 
import { 
    createTransaction,
    deleteTransaction, 
    getTransactions, 
    homePage, 
    getAllTransactions,
    getTransactionSummary
 } from '../controllers/userController.js';

router.get('/',homePage );
router.post('/transactions', createTransaction);
router.get('/transactions/summary/:user_id', getTransactionSummary);
router.get('/transactions', getAllTransactions);
router.get('/transactions/:user_id', getTransactions);
router.delete('/transactions/:transaction_id', deleteTransaction);


export default router;