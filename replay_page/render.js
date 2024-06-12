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

// console.log(PageObj)

var time = 1718970308;

var marketTradesNow = makeArrayOfObjBeforeTime(marketTrades, time)
var stratCurrentOVBnow = makeArrayOfObjBeforeTime(stratCurrentOVB, time)
var stratTradesNow = makeArrayOfObjBeforeTime(stratTrades, time)
var orderBookNow = makeArrayOfObjBeforeTime(spotSpreadData, time)

// TODO:
/// - iterate through each object to populate PageObj
/// - render price highlight, last trade highlight and current bid-ask spread.
/// - make overall render function
/// - work on time variable updating render function
/// - work on interface on how to interact with time variable from page.
/// refactor.