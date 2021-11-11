import { config } from '../util/config'

export interface BankAccount {
  name: string
  accessKey: string
}

export const discoverAccount: BankAccount = {
  name: 'Discover',
  accessKey: config.discoverAccessKey,
}

export const firstCommunityAccount: BankAccount = {
  name: 'First Community Credit Union',
  accessKey: config.fccuAccessKey,
}

export const bankAccounts: BankAccount[] = [discoverAccount, firstCommunityAccount]
