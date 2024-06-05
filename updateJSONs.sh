#!/bin/bash

ASSET=${2:-"420000029ad9527271b1b1e3c27ee065c18df70a4a4cfc3093a41a4441584f"}
# STRAT=c8d6f6546da4f7dd0e89a63066f8dca7cfe708019e6bdc13182fe502
STRAT=$1

# Run the first curl command
curl -X POST -H "Content-Type: application/json" -d "{\"meta\": {}, \"params\": {\"baseSubject\":\"${ASSET}\",\"quoteSubject\":\"\"},\"meta\":{}}" https://app.axo.trade/api/rpc/getMarketTrades > marketTrades.json
curl -X POST -H "Content-Type: application/json" -d "{\"meta\": {}, \"params\": {\"baseSubject\":\"${ASSET}\",\"quoteSubject\":\"\"},\"meta\":{}}" https://app.axo.trade/api/rpc/getOrderBook > orderBook.json

# Run the second curl command
curl -X POST -H "Content-Type: application/json" -d "{\"params\": \"${STRAT}\",\"meta\":{}}" https://app.axo.trade/api/rpc/getStrategyTrades > stratTrades.json
curl -X POST -H "Content-Type: application/json" -d "{\"params\": \"${STRAT}\",\"meta\":{}}" https://app.axo.trade/api/rpc/getStrategyCurrentVOB > stratCurrentOVB.json

echo "STRAT: ${STRAT}"
echo "ASSET: ${ASSET}"

# Execute the Node.js script
node formatJSONs.js $STRAT $ASSET

brave ./index.html
