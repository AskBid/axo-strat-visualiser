const h = require("./helpers.js")

console.log(typeof h.translateOVB)
console.log(typeof h.translateTrade)

// > ob1 = {123: "ciao", 124: "miao"}
// { '123': 'ciao', '124': 'miao' }
// > ob2 = {124: "miao2", 125: "update!", 126: "indeed"}
// { '124': 'miao2', '125': 'update!', '126': 'indeed' }
// > Object.assign(ob1, ob2)
// { '123': 'ciao', '124': 'miao2', '125': 'update!', '126': 'indeed' }

// MarketTrade:
    // {"price":3.1619,"amount":4.8034,"timestamp":1717773067.5645857,"decimals":4,"direction":1,"orderSide":"BUY"}
// StratTrade:
    // {"date":"1717722496.076430517","amount":6.387096,"price":3.1000004,"orderSide":"BUY"}
// StratCurrentOVB:
    // {"date":"1717722503.079021162","amount":12.967096328735352,"price":3.1800000530719768,"orderSide":"ask"}