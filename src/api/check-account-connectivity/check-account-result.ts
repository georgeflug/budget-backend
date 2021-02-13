export enum CheckAccountStatus {
  Connected = "Connected",
  NeedsLogin = "NeedsLogin",
  UnknownError = "UnknownError"
}

export interface CheckAccountResult {
  accountName: string,
  status: CheckAccountStatus,
  linkToken: string
}
