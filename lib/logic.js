class FrameOBJ {
    constructor(
        TICK, 
        MIN, 
        MAX, 
        marketTrades, 
        stratCurrentOVB, 
        stratTrades, 
        spotSpreadData,
        flagCurrentOVBaccumulation
    ) {
        this.marketTrades = marketTrades;
        this.stratCurrentOVB = stratCurrentOVB;
        this.stratTrades = stratTrades;
        this.spotSpreadData = spotSpreadData
        this.lastTrade = {timestamp: "0"};
        this.lastBidStratTrade = {timestamp: "0"};
        this.lastAskStratTrade = {timestamp: "0"};
        this.TICK = TICK;
        this.precision = TICK;
        this.Highlights = this.buildHighlight(this.spotSpreadData);
        this.MAX = MAX;
        this.MIN = MIN;
        this.frame = this.initFrameObj();
    }

    setPrecision(float) {
        this.precision = float
    }

    initFrameObj() {
        let price = this.MIN;
        let obj = {}
        const maxPlus1 = this.MAX;
        while (price < (maxPlus1)) {
            const priceText = (price + this.TICK).toFixed(String(this.precision).split(".")[1].length)
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

            /// using this iteration to find latestTrade too.
            const currentTimstamp = parseFloat(obj.timestamp)
            const latestTimestamp = parseFloat(this.lastTrade.timestamp)
            if (currentTimstamp > latestTimestamp) {
                this.lastTrade = obj;
            }
            ///

            if (price >= this.MIN && price <= this.MAX) {
                if (obj.orderSide === "SELL") {
                    this.frame[price].sellmos = this.frame[price].sellmos + obj.amount
                } else {
                    this.frame[price].buymos  = this.frame[price].buymos + obj.amount
                }
            }
        });
        this.stratCurrentOVB.forEach(obj => {
            const price = roundtext(obj.price, this.TICK)
            if (price >= this.MIN && price <= this.MAX) {
                if (obj.orderSide === "ask") {
                    this.frame[price].selllo = this.frame[price].selllo + obj.amount
                } else {
                    this.frame[price].buylo  = this.frame[price].buylo + obj.amount
                }
            }
        });
        this.stratTrades.forEach(obj => {
            const price = roundtext(obj.price, this.TICK)

            /// using this iteration to find latestTrade too.
            const currentTimstamp = parseFloat(obj.timestamp)
            const latestBidTimestamp = parseFloat(this.lastBidStratTrade.timestamp)
            const latestAskTimestamp = parseFloat(this.lastAskStratTrade.timestamp)
            if (currentTimstamp > latestBidTimestamp && obj.orderSide === "BUY") {
                this.lastBidStratTrade = obj;
            }
            if (currentTimstamp > latestAskTimestamp && obj.orderSide === "SELL") {
                this.lastAskStratTrade = obj;
            }
            ///

            if (price >= this.MIN && price <= this.MAX) {
                if (obj.orderSide === "SELL") {
                    this.frame[price].sold = this.frame[price].sold + obj.amount
                } else {
                    this.frame[price].bought  = this.frame[price].bought + obj.amount
                }
            }
        });
    }

    buildHighlight(spotSpreadData) {
        var highlights = {bid: null, spot: null, ask: null, timestamp: null}
        highlights.spot = spotSpreadData.spot
        highlights.bid = spotSpreadData.spot - ((spotSpreadData.spot * (spotSpreadData.pct_spread/100)) / 2)
        highlights.ask = spotSpreadData.spot + ((spotSpreadData.spot * (spotSpreadData.pct_spread/100)) / 2)
        return highlights
    }
}

class SelectDates {
    constructor(
        timestamp, 
        marketTradesObjByDateKeys, 
        stratCurrentOVBobjbyDateKeys, 
        stratTradesObjByDateKeys, 
        spotSpreadDataObjByDateKeys
    ){
        this.timestamp = timestamp;
        this.marketTradesObjByDateKeys =    marketTradesObjByDateKeys;
        this.stratCurrentOVBobjbyDateKeys = stratCurrentOVBobjbyDateKeys;
        this.stratTradesObjByDateKeys =     stratTradesObjByDateKeys;
        this.spotSpreadDataObjByDateKeys =  spotSpreadDataObjByDateKeys;
        this.marketTrades =    this.getArrayOfObjsBeforeThisDate(this.marketTradesObjByDateKeys, this.timestamp);
        this.stratTrades =     this.getArrayOfObjsBeforeThisDate(this.stratTradesObjByDateKeys, this.timestamp);
        this.stratCurrentOVB = this.findClosest(this.stratCurrentOVBobjbyDateKeys, this.timestamp);
        this.spotSpreadData =  this.findClosest(this.spotSpreadDataObjByDateKeys, this.timestamp)
        // this.end = this.findend(this.spotSpreadDataObjByDateKeys);
        // this.start = this.findstart(this.spotSpreadDataObjByDateKeys);
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
        const allPrices = this.getArrayOfObjsBeforeThisDate(this.marketTradesObjByDateKeys, 997199254740991).map(e => e.price)
        // .concat(this.getArrayOfObjsBeforeThisDate(this.stratCurrentOVBobjbyDateKeys, 997199254740991).map(e => e.price)) //if you want to include VOB in this search you have to rethink how it looks for prices since the change in recording mode to findClosest()
        .concat(this.getArrayOfObjsBeforeThisDate(this.stratTradesObjByDateKeys, 997199254740991).map(e => e.price))
        return {min: Math.min(...allPrices), max: Math.max(...allPrices)}
    }

    findClosest(dataObjByDateKeys, currentTime) {
        let dataCompare = {timestamp: null, delta: null}
        Object.keys(dataObjByDateKeys).forEach(key => {
            if (!dataCompare.timestamp) { //first iteration when obj is empty.
                dataCompare.timestamp = parseFloat(key);
                dataCompare.delta     = Math.abs(parseFloat(key) - currentTime);
            }
            const prevDelta = dataCompare.delta;
            const newDelta = Math.abs(parseFloat(key) - currentTime);
            if (newDelta < prevDelta) {
                dataCompare.timestamp = key;
                dataCompare.delta     = newDelta;
            } 
        })

        return dataObjByDateKeys[`${dataCompare.timestamp}`]
    }

    static findstart(objWithTimeKeys) {
        return Math.min(...Object.keys(objWithTimeKeys).map(key => parseInt(key)))
    }

    static findend(objWithTimeKeys) {
        return Math.max(...Object.keys(objWithTimeKeys).map(key => parseInt(key)))
    }
} 

function find_min_max(objWithKeyValuePair, keyString, precision) {
    // Extract the 'price' values into an array
    const values = objWithKeyValuePair.map(item => item[keyString]);

    // Find the maximum and minimum prices
    if (values.length == 0) {
        return false
    }
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    return {"max": maxValue, "min": roundnum(minValue, precision)}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}