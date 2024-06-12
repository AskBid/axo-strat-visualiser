const TICK = 0.000005
const MULTIPLIER = 1
const minmax = minmaxPrices()
const MIN = round(minmax.min, TICK)
const MAX = round(minmax.max, TICK)
const spaces = String(TICK).split(".")[1].length
var PageObj = initPageObj()

function round(number, precision, multiplier) {
    if (multiplier) {
        number = number / multiplier
    }
    const spaces = String(precision).split(".")[1].length
    const half_precision = precision / 2 
    const change = number % precision
    const fixed = (change >= half_precision) ? (number + (precision - change)) : (number - change)
    return parseFloat(fixed.toFixed(spaces))
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
        const beforeKeys = Object.keys(objTimeKeys).filter(key => parseFloat(key) < currentTime)
        var arrayObjs = []
        beforeKeys.forEach(key => {
            arrayObjs.push(objTimeKeys[key])
        });
        return arrayObjs
}

console.log(PageObj)

var time = 1718970308;

var marketTradesNow = makeArrayOfObjBeforeTime(marketTrades, time)
var stratCurrentOVBnow = makeArrayOfObjBeforeTime(marketTrades, time)
var stratTradesNow = makeArrayOfObjBeforeTime(marketTrades, time)
var orderBookNow = makeArrayOfObjBeforeTime(marketTrades, time)