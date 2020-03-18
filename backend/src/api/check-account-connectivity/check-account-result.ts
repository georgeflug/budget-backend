export enum CheckAccountStatus {
  Connected,
  NeedsLogin,
  UnknownError
}

export interface CheckAccountResult {
  accountName: string,
  status: CheckAccountStatus,
  linkToken: string
}
