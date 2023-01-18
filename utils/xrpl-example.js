const xrpl = require("xrpl")
async function main() {
  const client = new xrpl.Client("wss://xrplcluster.com")
  await client.connect()

  const response = await client.request({
    "command": "account_info",
    "account": "rM7kvwoahaMN4zrF5fd5TuPoxkJJZCB3a8",
    "ledger_index": "validated"
  })
  console.log(response)

  client.disconnect()
}
main()
