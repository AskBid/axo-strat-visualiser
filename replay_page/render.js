class FrameOBJ {
    constructor(
        TICK, 
        MIN, 
        MAX, 
        marketTrades, 
        stratCurrentOVB, 
        stratTrades, 
        spotSpreadData
    ) {
        this.marketTrades = marketTrades;
        this.stratCurrentOVB = stratCurrentOVB;
        this.stratTrades = stratTrades;
        this.spotSpreadData = spotSpreadData
        this.lastTrade = {timestamp: "0"};
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
        highlights.spot = roundtext(spotSpreadData.spot, this.precision)
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
        const allPrices = this.getArrayOfObjsBeforeThisDate(this.marketTradesObjByDateKeys, 997199254740991).map(e => e.price)
        .concat(this.getArrayOfObjsBeforeThisDate(this.stratCurrentOVBobjbyDateKeys, 997199254740991).map(e => e.price))
        .concat(this.getArrayOfObjsBeforeThisDate(this.stratTradesObjByDateKeys, 997199254740991).map(e => e.price))
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
async function render(timestamp) {
    if (!timestamp) {
        timestamp = 1717974902  // 10 digits = seconds  
    }

    const selectDates = new SelectDates(
        timestamp, 
        marketTrades, 
        stratCurrentOVB, 
        stratTrades, 
        spotSpreadData
    ) 

    const minmax = selectDates.minmaxPrices()
    const ticksPAD = 10;
    const TICK = 0.000005;
    const MIN = roundnum(minmax.min - (ticksPAD * TICK), TICK);
    const MAX = roundnum(minmax.max + (ticksPAD * TICK), TICK);
    const MULTIPLIER = 1000;

    const frameObj = new FrameOBJ(
        TICK, MIN, MAX, 
        selectDates.marketTrades, 
        selectDates.stratCurrentOVB, 
        selectDates.stratTrades, 
        selectDates.spotSpreadData
    )
    
    frameObj.populate()
    var sortedPricesKeys = Object.keys(frameObj.frame).sort().reverse()
    // sortedPricesKeys.forEach(priceLevel => {
    //     renderRow(frameObj.frame[priceLevel], 0.1, MULTIPLIER)
    // })
    const promises = [];

    for (let index = 0; index < sortedPricesKeys.length; index++) {
        const element = sortedPricesKeys[index];
        promises.push(await renderRow(frameObj.frame[element], 0.1, MULTIPLIER))
    }

    console.log(`date now: ${Date.now()}`)
    
    await Promise.all(promises)
    
    return Promise.resolve(timestamp);
}

async function main() {
    var timestamp = 1718893753
    for (let index = 0; index < 1000; index++) {
        const promises = [];
        promises.push(await render(timestamp))
        promises.push(await sleep(100));
        promises.push(await clearRender())
        timestamp = timestamp + 10
        await Promise.all(promises)
    }
}

window.onload = main

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clearRender() {
    const table = document.getElementById('maintable');
    const trs = table.getElementsByClassName('rowTR');
    const promises = [];
    while (trs.length > 0) {
        trs[0].parentNode.removeChild(trs[0]);
        promises.push(Promise.resolve(trs[0]))
    }
    await Promise.all(promises)
    return Promise.resolve("Table Rows DELETED.");
}

async function renderRow(objPriceLevel, precision, multiplier) {
    const table = document.getElementById('maintable');
    
    //objPriceLevel : {buylo: 210092.0019521317, bought: null, sellmos: 210627, price: '0.002810', buymos: null, sold: null, selllo: null}

    // Create a new <tr> element
    const price = objPriceLevel.price //round(max - (TICK * (ind    ex+1)), TICK)
    
    const absorberL = document.createElement('td');
    const absorberR = document.createElement('td');
    absorberL.setAttribute('class', `absorbing-column cell`);
    absorberR.setAttribute('class', `absorbing-column cell`);
    
    const sellTD = document.createElement('td');
    sellTD.setAttribute('id', `${price}-sell`)
    sellTD.textContent = objPriceLevel.sellmos ? `${roundtext(objPriceLevel.sellmos, precision, multiplier)}` : "";
    sellTD.setAttribute('class', `cell sellTD`);
    
    const prcTD = document.createElement('td');
    prcTD.textContent = `${price}`;
    prcTD.setAttribute('id', `${price}-box`)
    prcTD.setAttribute('class', `cell priceTD`);

    const buyTD = document.createElement('td');
    buyTD.setAttribute('id', `${price}-buy`)
    buyTD.textContent = objPriceLevel.buymos ? `${roundtext(objPriceLevel.buymos, precision, multiplier)}` : "";
    buyTD.setAttribute('class', `cell buyTD`);
    
    const bidTD = document.createElement('td');
    bidTD.setAttribute('id', `${price}-bid`)
    bidTD.textContent = objPriceLevel.bought ? `${roundtext(objPriceLevel.bought, precision, multiplier)}` : "";
    bidTD.setAttribute('class', `cell bidTD`);

    const askTD = document.createElement('td');
    askTD.setAttribute('id', `${price}-ask`)
    askTD.textContent = objPriceLevel.sold ? `${roundtext(objPriceLevel.sold, precision, multiplier)}` : "";
    askTD.setAttribute('class', `cell askTD`);

    const rowTR = document.createElement('tr');
    rowTR.setAttribute('class', 'rowTR');
    rowTR.setAttribute('id', `${price}-row`)

    const askOVBTD = document.createElement('td');
    askOVBTD.setAttribute('id', `${price}-askOVB`)
    if (objPriceLevel.selllo) {
        rowTR.setAttribute('class', 'rowTR rowHighlight');
        askOVBTD.textContent = `${roundtext(objPriceLevel.selllo, precision, multiplier)} L`;
        askOVBTD.setAttribute('class', `cell OVB activeaskOVB`);
    } else {
        askOVBTD.textContent = ""
        askOVBTD.setAttribute('class', `cell OVB`);
    }

    const bidOVBTD = document.createElement('td');
    bidOVBTD.setAttribute('id', `${price}-bidOVB`);
    if (objPriceLevel.buylo) {
        rowTR.setAttribute('class', 'rowTR rowHighlight');
        bidOVBTD.textContent = `${roundtext(objPriceLevel.buylo, precision, multiplier)} L`;
        bidOVBTD.setAttribute('class', `cell OVB activebidOVB`);
    } else {
        bidOVBTD.textContent = "";
        bidOVBTD.setAttribute('class', `cell OVB`);
    }
    
    // Append the new <tr> to an existing parent element (e.g., <body>)
    rowTR.appendChild(absorberL);
    rowTR.appendChild(bidOVBTD);
    rowTR.appendChild(bidTD);
    rowTR.appendChild(sellTD);
    rowTR.appendChild(prcTD);
    rowTR.appendChild(buyTD);
    rowTR.appendChild(askTD);
    rowTR.appendChild(askOVBTD);
    rowTR.appendChild(absorberR);
    table.appendChild(rowTR);

    return Promise.resolve(objPriceLevel);
}


/// - make overall render function
// js data has been set from sh Scripts
// select time objs only
// create PageObj
// render it
/// - work on time variable updating render function
/// - work on interface on how to interact with time variable from page.
/// refactor.