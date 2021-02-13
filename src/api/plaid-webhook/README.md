# PLAID Webhooks

## How to update the webhook url of an item

See: https://support.plaid.com/hc/en-us/articles/360008414293-How-to-add-or-update-webhooks-for-existing-Items
``` 
curl -X POST https://sandbox.plaid.com/item/webhook/update \
      -H 'content-type: application/json' \
      -d '{
        "client_id": String,
        "secret": String,
        "access_token": String,
        "webhook": "https://plaid.com/updated/hook"
      }'
```
e.g.
``` 
curl -X POST https://development.plaid.com/item/webhook/update \
      -H 'content-type: application/json' \
      -d '{
        "client_id": process.env.PLAID_CLIENT_ID,
        "secret": process.env.PLAID_SECRET,
        "access_token": process.env.DISCOVER_ACCESS_KEY,
        "webhook": "https://georgeflug.duckdns.org:3000/plaid-webhook"
      }'
```

## Webhook documentation

https://plaid.com/docs/#transactions-webhooks

Here is an example payload that will be received by the webhook:
```
{
  "webhook_type": "TRANSACTIONS",
  "webhook_code": "DEFAULT_UPDATE",
  "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "error": null,
  "new_transactions": 3
}
```
