// HELPERS -:

module.exports = {
    translateOVB: function (position) {
        const test =    position.quoteTicker == "ADA" 
        const price =   test ? (position.price) : 1/position.price
        const side =    test ? "bid" : "ask"
        const amount =  test ? position.amount/price : position.amount
        // {"timestamp":"1717661246.046221099","quoteTicker":"ADA","baseTicker":"LQ","price":2.950000047683716,"amount":40.68440246582031,"orderId":"5107d1c4-6957-45d7-8690-f16047e3051e"}
        //     {"timestamp":"1717661233.181503636","amount":6.598858,"price":3.1648511129024874,"orderSide":"ASK"}
        return {"timestamp": position.timestamp, "amount": amount, "price": price, "orderSide": side}
    },
    translateTrade: function (trade) {
        const divisor = trade.pair.split(" / ")[1]
        if (divisor == 'ADA') {
            // return {"timestamp": new Date(parseFloat(trade.timestamp) * 1000), "buy": trade.received.amount,  "price": trade.price.value}
            return {"timestamp": trade.timestamp, "amount": trade.received.amount,  "price": trade.price.value, "orderSide": "BUY"}
        } else {
            return {"timestamp": trade.timestamp, "amount": trade.sold.amount,  "price": 1/trade.price.value, "orderSide": "SELL"}
        }
    },
    translateMarketTrade: function (trade) {
        //{"price":5.609,"amount":33.809,"timestamp":1717875214.5967648,"decimals":3,"direction":-1,"orderSide":"SELL"}
        return {"price": trade.price, "amount": trade.amount, "timestamp": `${trade.timestamp}`, "orderSide":`${trade.orderSide}`}
    },
    hexToAscii: function (hex) {
        var str = '';
        for (var i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    }
}