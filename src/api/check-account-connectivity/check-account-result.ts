import Joi from 'joi'

export enum CheckAccountStatus {
  Connected = 'Connected',
  NeedsLogin = 'NeedsLogin',
  UnknownError = 'UnknownError',
}

export interface CheckAccountResult {
  accountName: string
  status: CheckAccountStatus
  linkToken: string
}

export const checkAccountResultSchema = Joi.object({
  accountName: Joi.string(),
  status: Joi.string(),
  linkToken: Joi.string(),
}).label('Check Account Result')
