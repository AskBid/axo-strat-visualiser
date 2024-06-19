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
        var highlights = {bid: null, spot: null, ask: null, timestamp: null}
        highlights.spot = roundtext(spotSpreadData.spot)
        highlights.bid = spotSpreadData.spot - ((spotSpreadData.spot * (spotSpreadData.pct_spread/100)) / 2)
        highlights.ask = spotSpreadData.spot + ((spotSpreadData.spot * (spotSpreadData.pct_spread/100)) / 2)
        return highlights
    }
}

const TICK = 0.000005;
const MULTIPLIER = 1;
const minmax = minmaxPrices();
const ticksPAD = 10;
const MIN = roundnum(minmax.min - (ticksPAD * TICK), TICK);
const MAX = roundnum(minmax.max + (ticksPAD * TICK), TICK);
var time = 1717974902;



class SelectDates {
    constructor(timestamp, marketTradesObjByDateKeys, stratCurrentOVBobjbyDateKeys, stratTradesObjByDateKeys, spotSpreadDataObjByDateKeys){
        this.timestamp = timestamp;
        this.marketTradesObjByDateKeys = marketTradesObjByDateKeys;
        this.stratCurrentOVBobjbyDateKeys = stratCurrentOVBobjbyDateKeys;
        this.stratTradesObjByDateKeys = stratTradesObjByDateKeys;
        this.spotSpreadDataObjByDateKeys = spotSpreadDataObjByDateKeys;
        this.marketTrades = this.getArrayOfObjsBeforeThisDate(this.marketTradesObjByDateKeys, this.timestamp);
        this.stratCurrentOVB = this.getArrayOfObjsBeforeThisDate(this.stratCurrentOVBobjbyDateKeys, this.timestamp);
        this.stratTrades = this.getArrayOfObjsBeforeThisDate(this.stratTradesObjByDateKeys, this.timestamp);
        this.spotSpreadData = this.findSpotSpreadData(this.spotSpreadDataObjByDateKeys)
    }

    getArrayOfObjsBeforeThisDate(objTimeKeys, currentTime) {
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

    minmaxPrices() {
        /// here we use a function to select object before a date, only to transform object to array 
        /// while selecting all elements so using random high timestamp
        const allPrices = this.getArrayOfObjsBeforeThisDate(marketTradesObjByDateKeys, 997199254740991).map(e => e.price)
            .concat(this.getArrayOfObjsBeforeThisDate(stratCurrentOVBobjbyDateKeys, 997199254740991).map(e => e.price))
            .concat(this.getArrayOfObjsBeforeThisDate(stratTradesObjByDateKeys, 997199254740991).map(e => e.price))
        return {min: Math.min(...allPrices), max: Math.max(...allPrices)}
    }

    findSpotSpreadData(spotSpreadDataObjByDateKeys) {
        let orderBookDataCompare = {timestamp: null, delta: null}
        Object.keys(spotSpreadDataObjByDateKeys).forEach(key => {
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

        return spotSpreadDataObjByDateKeys[`${orderBookDataCompare.timestamp}`]
    }
} 


/// - render price highlight, last trade highlight and current bid-ask spread.




/// - make overall render function
// js data has been set from sh Scripts
// select time objs only
// create PageObj
// render it
/// - work on time variable updating render function
/// - work on interface on how to interact with time variable from page.
/// refactor.