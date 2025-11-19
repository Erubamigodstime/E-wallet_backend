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
router.get('/transactions/:user_id', getTransactions);
router.get('/transactions', getAllTransactions);
router.delete('/transactions/:transaction_id', deleteTransaction);
router.get('/transactions/summary/:user_id', getTransactionSummary);


export default router;