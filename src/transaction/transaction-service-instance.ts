import { TransactionService } from './transaction-service'
import { lazy } from '../util/lazy'

export const getTransactionService = lazy(() => new TransactionService())
