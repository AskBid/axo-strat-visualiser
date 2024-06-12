const TICK = 0.000005
const MULTIPLIER = 1
const minmax = minmaxPrices()
const MIN = roundnum(minmax.min - (5 * TICK), TICK)
const MAX = roundnum(minmax.max + (5 * TICK), TICK)
const spaces = String(TICK).split(".")[1].length
var time = 1717974902;
var PageObj = initPageObj()
var Highlights = {bid: null, spot: null, ask: null, timestamp: null}

function roundtext(number, precision, multiplier) { //multiplier is only for asset values not price and only for visualisation formatting
    if (multiplier) {
        number = number / multiplier
    }
    const spaces = String(precision).split(".")[1].length
    const half_precision = precision / 2 
    const change = number % precision
    const fixed = (change >= half_precision) ? (number + (precision - change)) : (number - change)
    return fixed.toFixed(spaces)
}

function roundnum(number, precision, multiplier) {
    return parseFloat(roundtext(number, precision, multiplier))
}

function initPageObj() {
    let price = MIN;
    let obj = {}
    const maxPlus1 = MAX;
    while (price < (maxPlus1)) {
        const priceText = (price + TICK).toFixed(spaces)
        price = parseFloat(priceText);
        obj[priceText] = {
            'buylo': null, 
            'bought': null, 
            'sellmos': null, 
            'price': priceText, 
            'buymos': null, 
            'sold': null, 
            'selllo': null
        }
    }
    return obj
}

function minmaxPrices() {
    /// here we use a function to select object before a date, only to transform object to array 
    /// while selecting all elements so using random high timestamp
    const allPrices = makeArrayOfObjBeforeTime(marketTrades, 997199254740991).map(e => e.price)
        .concat(makeArrayOfObjBeforeTime(stratCurrentOVB, 997199254740991).map(e => e.price))
        .concat(makeArrayOfObjBeforeTime(stratTrades, 997199254740991).map(e => e.price))
    return {min: Math.min(...allPrices), max: Math.max(...allPrices)}
}


function makeArrayOfObjBeforeTime(objTimeKeys, currentTime) {
    const beforeKeys = Object.keys(objTimeKeys).filter(key => {
        return parseFloat(key) < currentTime
    })
    // console.log(beforeKeys)
    var arrayObjs = []
    beforeKeys.forEach(key => {
        arrayObjs.push(objTimeKeys[key])
    });
    return arrayObjs
}

var marketTradesNow = makeArrayOfObjBeforeTime(marketTrades, time)
var stratCurrentOVBnow = makeArrayOfObjBeforeTime(stratCurrentOVB, time)
var stratTradesNow = makeArrayOfObjBeforeTime(stratTrades, time)
// var orderBookNow = makeArrayOfObjBeforeTime(spotSpreadData, time)

// TODO:
/// - iterate through each object to populate PageObj

marketTradesNow.forEach(obj => {
    const price = roundtext(obj.price, TICK)

    if (obj.orderSide === "SELL") {
        PageObj[price].sellmos = PageObj[price].sellmos + obj.amount
    } else {
        PageObj[price].buymos  = PageObj[price].buymos + obj.amount
    }
});

stratCurrentOVBnow.forEach(obj => {
    const price = roundtext(obj.price, TICK)

    if (obj.orderSide === "ask") {
        PageObj[price].selllo = PageObj[price].selllo + obj.amount
    } else {
        PageObj[price].buylo  = PageObj[price].buylo + obj.amount
    }
});

stratTradesNow.forEach(obj => {
    const price = roundtext(obj.price, TICK)

    if (obj.orderSide === "SELL") {
        PageObj[price].sold = PageObj[price].sold + obj.amount
    } else {
        PageObj[price].bought  = PageObj[price].bought + obj.amount
    }
});


/// - render price highlight, last trade highlight and current bid-ask spread.

let orderBookDataCompare = {timestamp: null, delta: null}
Object.keys(spotSpreadData).forEach(key => {
    if (!orderBookDataCompare.timestamp) {
        orderBookDataCompare.timestamp = parseFloat(key);
        orderBookDataCompare.delta     = parseFloat(key) - time;
    }
    const prevDelta = orderBookDataCompare.delta;
    const newDelta = parseFloat(key) - time;
    if (newDelta <= 0 && newDelta > prevDelta) {
        orderBookDataCompare.timestamp = key;
        orderBookDataCompare.delta     = newDelta;
    } 
})
let orderBookData = spotSpreadData[`${orderBookDataCompare.timestamp}`]
Highlights.spot = roundtext(orderBookData.spot)
Highlights.bid = orderBookData.spot - ((orderBookData.spot * orderBookData.pct_spread) / 2)
Highlights.ask = orderBookData.spot + ((orderBookData.spot * orderBookData.pct_spread) / 2)
/// - make overall render function
/// - work on time variable updating render function
/// - work on interface on how to interact with time variable from page.
/// refactor.