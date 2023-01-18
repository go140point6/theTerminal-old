const xrpl = require("xrpl")
async function main() {
  const client = new xrpl.Client("wss://xrplcluster.com")
  await client.connect()

  const response = await client.request({
    "command": "account_nfts",
    "account": "rM7kvwoahaMN4zrF5fd5TuPoxkJJZCB3a8",
  })
  console.log(response)

  client.disconnect()
}
main()
