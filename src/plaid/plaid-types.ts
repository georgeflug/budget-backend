export interface PlaidTransaction {
  account_id: string,               // "DoQmRxwVbDTw4X5wbBNyTEZ7kDN9ZRfZE880w"
  account_owner: string,            // null
  amount: number,                   // 5.36
  category: string[],               // [ "Travel", "Airports" ]
  category_id: string,              // "22002000"
  date: string,                     // "2019-05-20"
  iso_currency_code: string,        // "USD"
  location: PlaidLocation,
  name: string,                     // "RICHMOND AIRPORT RICHMOND / VAUS : POS Transaction"
  payment_meta: PlaidPaymentMeta,
  pending: boolean,                 // false
  pending_transaction_id: string,   // "LB9B98bpEQUvY7pQQgYmT3nXwL4xPXh0XJnqX"
  transaction_id: string,           // "0eEgOn4mPNfLBDQL6d8LTYvaoJjwj6tr3Av6P",
  transaction_type: string,         // "place"
  unofficial_currency_code: string  // null
}

export interface PlaidLocation {
  address: string,        // "3100  Kensington Ave"
  city: string,           // "Richmond"
  lat: number,            // 37.559933
  lon: number,            // -77.476295
  state: string,          // "VA"
  store_number: string,   // "26407"
  zip: string             // "23188"
}

export interface PlaidPaymentMeta {
  by_order_of: string,
  payee: string,
  payer: string,
  payment_method: string,     // "ACH"
  payment_processor: string,  // "PayPal"
  ppd_id: string,
  reason: string,
  reference_number: string
}

export interface PlaidAccount {
  account_id: string,         // "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D"
  balances: PlaidBalance[],
  mask: string,               // "0000"
  name: string,               // "Plaid Checking"
  official_name: string,      // "Plaid Gold Checking"
  subtype: string,            // "checking"
  type: string,               // "depository"
  verification_status: string // null
}

export interface PlaidBalance {
  available: number,                // 100
  current: number,                  // 110
  limit: number,                    // null
  iso_currency_code: string         // "USD"
  unofficial_currency_code: string  // null
}

export interface PlaidTransactionResponse {
  accounts: PlaidAccount[],
  transactions: PlaidTransaction[],
  item: Record<string, unknown>,
  total_transactions: number,
  request_id: string  // "45QSn"
}
