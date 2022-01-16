import { config } from '../util/config'

export interface BankAccount {
  name: string
  accessKey: string
  accounts: string[]
}

export const discoverAccount: BankAccount = {
  name: 'Discover',
  accessKey: config.discoverAccessKey,
  accounts: ['o3d3dPnELRtY7gEPPaBVsbZkDqJeQLCB680A5'],
}

export const firstCommunityAccount: BankAccount = {
  name: 'First Community Credit Union',
  accessKey: config.fccuAccessKey,
  accounts: ['DoQmRxwVbDTw4X5wbBNyTEZ7kDN9ZRfZE880w', '1EzgJnaKqxFD8R9D5pdXug0qLPKx0XHmJXXEY'],
}

export const bankAccounts: BankAccount[] = [discoverAccount, firstCommunityAccount]
