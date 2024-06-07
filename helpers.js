// HELPERS -:

module.exports = {
    translateOVB: function (position) {
        const test =    position.quoteTicker == "ADA" 
        const price =   test ? (position.price) : 1/position.price
        const side =    test ? "bid" : "ask"
        const amount =  test ? position.amount/price : position.amount
        // {"timestamp":"1717661246.046221099","quoteTicker":"ADA","baseTicker":"LQ","price":2.950000047683716,"amount":40.68440246582031,"orderId":"5107d1c4-6957-45d7-8690-f16047e3051e"}
        //     {"date":"1717661233.181503636","amount":6.598858,"price":3.1648511129024874,"orderSide":"ASK"}
        return {"date": position.timestamp, "amount": amount, "price": price, "orderSide": side}
    },
    translateTrade: function (trade) {
        const divisor = trade.pair.split(" / ")[1]
        if (divisor == 'ADA') {
            // return {"date": new Date(parseFloat(trade.timestamp) * 1000), "buy": trade.received.amount,  "price": trade.price.value}
            return {"date": trade.timestamp, "amount": trade.received.amount,  "price": trade.price.value, "orderSide": "BUY"}
        } else {
            return {"date": trade.timestamp, "amount": trade.sold.amount,  "price": 1/trade.price.value, "orderSide": "SELL"}
        }
    }
}