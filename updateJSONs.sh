#!/bin/bash

TICK=${3:-0.01}
ASSET=$2
STRAT=$1

if [ "$ASSET" = "-" ] || [ -z "$ASSET" ] || [ "$ASSET" = "AXO" ]; then
    ASSET="420000029ad9527271b1b1e3c27ee065c18df70a4a4cfc3093a41a4441584f"  # change to default if second argument is "-" or empty string ""
fi

if [ "$ASSET" = "SNEK" ]; then
    ASSET="279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f534e454b"
fi

if [ "$ASSET" = "LQ" ]; then
    ASSET="da8c30857834c6ae7203935b89278c532b3995245295456f993e1d244c51"
fi

# Run the first curl command
curl -X POST -H "Content-Type: application/json" -d "{\"meta\": {}, \"params\": {\"baseSubject\":\"${ASSET}\",\"quoteSubject\":\"\"},\"meta\":{}}" https://app.axo.trade/api/rpc/getMarketTrades > marketTrades.json
curl -X POST -H "Content-Type: application/json" -d "{\"meta\": {}, \"params\": {\"baseSubject\":\"${ASSET}\",\"quoteSubject\":\"\"},\"meta\":{}}" https://app.axo.trade/api/rpc/getOrderBook > orderBook.json

# Run the second curl command
curl -X POST -H "Content-Type: application/json" -d "{\"params\": \"${STRAT}\",\"meta\":{}}" https://app.axo.trade/api/rpc/getStrategyTrades > stratTrades.json
curl -X POST -H "Content-Type: application/json" -d "{\"params\": \"${STRAT}\",\"meta\":{}}" https://app.axo.trade/api/rpc/getStrategyCurrentVOB > stratCurrentOVB.json

echo "STRAT: ${STRAT}"
echo "ASSET: ${ASSET}"
echo "TICK:  ${TICK}"

# Execute the Node.js script
node formatJSONs.js $STRAT $ASSET $TICK

brave ./index.html
