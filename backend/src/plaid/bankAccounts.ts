export interface BankAccount {
  name: string,
  accessKey: string,
}

export const discoverAccount: BankAccount = {
  name: "Discover",
  accessKey: process.env.DISCOVER_ACCESS_KEY!
};

export const firstCommunityAccount: BankAccount = {
  name: "First Community Credit Union",
  accessKey: process.env.FCCU_ACCESS_KEY!
};

export const bankAccounts: BankAccount[] = [
  discoverAccount,
  firstCommunityAccount
];
