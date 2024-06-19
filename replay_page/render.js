class FrameOBJ {
    constructor(TICK, MIN, MAX, marketTrades, stratCurrentOVB, stratTrades, spotSpreadData) {
        this.marketTrades = marketTrades;
        this.stratCurrentOVB = stratCurrentOVB;
        this.stratTrades = stratTrades;
        this.Highlights = this.buildHighlight(spotSpreadData);
        this.TICK = TICK;
        this.MAX = MAX;
        this.MIN = MIN;
        this.FrameObj = this.initFrameObj();
    }

    initFrameObj() {
        let price = this.MIN;
        let obj = {}
        const maxPlus1 = this.MAX;
        while (price < (maxPlus1)) {
            const priceText = (price + this.TICK).toFixed(spaces)
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

    populate() {
        this.marketTrades.forEach(obj => {
            const price = roundtext(obj.price, this.TICK)
            if (price >= this.MIN && price <= this.MAX) {
                if (obj.orderSide === "SELL") {
                    this.FrameObj[price].sellmos = this.FrameObj[price].sellmos + obj.amount
                } else {
                    this.FrameObj[price].buymos  = this.FrameObj[price].buymos + obj.amount
                }
            }
        });
        this.stratCurrentOVB.forEach(obj => {
            const price = roundtext(obj.price, this.TICK)
            if (price >= this.MIN && price <= this.MAX) {
                if (obj.orderSide === "ask") {
                    this.FrameObj[price].selllo = this.FrameObj[price].selllo + obj.amount
                } else {
                    this.FrameObj[price].buylo  = this.FrameObj[price].buylo + obj.amount
                }
            }
        });
        this.stratTrades.forEach(obj => {
            const price = roundtext(obj.price, this.TICK)
            if (price >= this.MIN && price <= this.MAX) {
                if (obj.orderSide === "SELL") {
                    this.FrameObj[price].sold = this.FrameObj[price].sold + obj.amount
                } else {
                    this.FrameObj[price].bought  = this.FrameObj[price].bought + obj.amount
                }
            }
        });
    }

    buildHighlight(spotSpreadData) {
        Highlights.spot = roundtext(spotSpreadData.spot)
        Highlights.bid = spotSpreadData.spot - ((spotSpreadData.spot * (spotSpreadData.pct_spread/100)) / 2)
        Highlights.ask = spotSpreadData.spot + ((spotSpreadData.spot * (spotSpreadData.pct_spread/100)) / 2)
    }
}

const TICK = 0.000005;
const MULTIPLIER = 1;
const minmax = minmaxPrices();
const ticksPAD = 10;
const MIN = roundnum(minmax.min - (ticksPAD * TICK), TICK);
const MAX = roundnum(minmax.max + (ticksPAD * TICK), TICK);
const spaces = String(TICK).split(".")[1].length
var time = 1717974902;
var PageObj = initPageObj()
var Highlights = {bid: null, spot: null, ask: null, timestamp: null}



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

/// - make overall render function
js data has been set from sh Scripts
select time objs only
create PageObj
render it
/// - work on time variable updating render function
/// - work on interface on how to interact with time variable from page.
/// refactor.