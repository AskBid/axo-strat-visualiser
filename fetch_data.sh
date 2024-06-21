#!/bin/bash

fetch_data() {
    local STRAT="$1"
    local ASSET="$2"
    local DIFFERLOCATION="$3"

    echo ""
    echo "::::"
    current_datetime="$(date +'%Y-%m-%d %H:%M:%S')"
    echo "Current date and time: $current_datetime"
    echo "running fetch_data() ..."
    echo "STRAT: ${STRAT}"
    echo "ASSET: ${ASSET}"
    echo "Location: ${DIFFERLOCATION}"

    if [ "$ASSET" = "-" ] || [ -z "$ASSET" ] || [ "$ASSET" = "AXO" ]; then
        ASSET="420000029ad9527271b1b1e3c27ee065c18df70a4a4cfc3093a41a4441584f"  # change to default if second argument is "-" or empty string
    fi

    if [ "$ASSET" = "SNEK" ]; then
        ASSET="279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f534e454b"
    fi

    if [ "$ASSET" = "LQ" ]; then
        ASSET="da8c30857834c6ae7203935b89278c532b3995245295456f993e1d244c51"
    fi

    if [ "$ASSET" = "LENFI" ]; then
        ASSET="8fef2d34078659493ce161a6c7fba4b56afefa8535296a5743f6958741414441"
    fi

    if [ "$ASSET" = "iUSD" ]; then
        ASSET="f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b6988069555344"
    fi

    if [ "$ASSET" = "WMT" ]; then
        ASSET="1d7f33bd23d85e1a25d87d86fac4f199c3197a2f7afeb662a0f34e1e776f726c646d6f62696c65746f6b656e"
    fi
    

    echo "ASSET after ticker translation: ${ASSET}"

    # Run the first curl command                                                                                                                       https://app.axo.trade/api/rpc/getMarketTrades
    curl -X POST -H "Content-Type: application/json" -d "{\"meta\": {}, \"params\": {\"baseSubject\":\"${ASSET}\",\"quoteSubject\":\"\"},\"meta\":{}}" https://app.axo.trade/api/rpc/getMarketTrades > "${DIFFERLOCATION}marketTrades.json"
    curl -X POST -H "Content-Type: application/json" -d "{\"meta\": {}, \"params\": {\"baseSubject\":\"${ASSET}\",\"quoteSubject\":\"\"},\"meta\":{}}" https://app.axo.trade/api/rpc/getOrderBook > ${DIFFERLOCATION}orderBook.json

    # Run the second curl command
    curl -X POST -H "Content-Type: application/json" -d "{\"params\": \"${STRAT}\",\"meta\":{}}" https://app.axo.trade/api/rpc/getStrategyTrades > ${DIFFERLOCATION}stratTrades.json
    curl -X POST -H "Content-Type: application/json" -d "{\"params\": \"${STRAT}\",\"meta\":{}}" https://app.axo.trade/api/rpc/getStrategyCurrentVOB > ${DIFFERLOCATION}stratCurrentOVB.json

    # Run user Funds query
    curl -X POST -H "Content-Type: application/json" -d "{\"params\": {\"id\":\"${STRAT}\"},\"meta\":{}}" https://app.axo.trade/api/rpc/getStrategyUserFunds > ${DIFFERLOCATION}stratUserFunds.json

}


echo "end of fetch_data() but asyncronous curl requets still running ..."
# Example usage:
# fetch_data "AXO" "my_strategy"
