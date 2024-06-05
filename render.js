const TICK = 0.01
const PAD = 5


var minmaxs = [find_min_max(stratTrades), find_min_max(marketTrades)]
const min = Math.min(...(minmaxs.map(item => item.min))) - (TICK * PAD)
const max = Math.max(...(minmaxs.map(item => item.max))) + (TICK * (PAD+1))

console.log(`min: ${min}, max: ${max}`)

// stratTrades.forEach(trade => {
//     render_1div(trade)
// });
const headtitle = document.getElementById('head');
headtitle.textContent = `This is a visualisation of the strategy ID: `;
var link = `https://app.axo.trade/strategies/view/${stratID}`;
var stratLink = document.createElement("a");
stratLink.setAttribute("href", link);
stratLink.innerHTML = `${stratID}`; // Customize the link text
// Append it to where you'd like it to go (e.g., document.body)
headtitle.appendChild(stratLink);


const myElement = document.getElementById('maintable');

for (let index = 0; index < ((max - min) / TICK); index++) {
        // Create a new <div> element
        const price = round(max - (TICK * (index+1)), TICK)
        
        const absorberL = document.createElement('td');
        const absorberR = document.createElement('td');
        absorberL.setAttribute('class', `absorbing-column cell`);
        absorberR.setAttribute('class', `absorbing-column cell`);
        
        const sellTD = document.createElement('td');
        sellTD.setAttribute('id', `${price}-sell`)
        sellTD.textContent = ``;
        sellTD.setAttribute('class', `cell sellTD`);
        
        const prcTD = document.createElement('td');
        prcTD.textContent = `${price}`;
        prcTD.setAttribute('id', `${price}-box`)
        prcTD.setAttribute('class', `cell priceTD`);

        const buyTD = document.createElement('td');
        buyTD.setAttribute('id', `${price}-buy`)
        buyTD.textContent = ``;
        buyTD.setAttribute('class', `cell buyTD`);

        const bidTD = document.createElement('td');
        bidTD.setAttribute('id', `${price}-bid`)
        bidTD.setAttribute('class', `cell bidTD`);

        const askTD = document.createElement('td');
        askTD.setAttribute('id', `${price}-ask`)
        askTD.setAttribute('class', `cell askTD`);

        const askOVBTD = document.createElement('td');
        askOVBTD.setAttribute('id', `${price}-askOVB`)
        askOVBTD.setAttribute('class', `cell OVB`);

        const bidOVBTD = document.createElement('td');
        bidOVBTD.setAttribute('id', `${price}-bidOVB`)
        bidOVBTD.setAttribute('class', `cell OVB`);

        // Append the new <div> to an existing parent element (e.g., <body>)
        const rowTR = document.createElement('tr');
        rowTR.setAttribute('class', 'rowTR');
        rowTR.setAttribute('id', `${price}-row`)
        rowTR.appendChild(absorberL);
        rowTR.appendChild(bidOVBTD);
        rowTR.appendChild(bidTD);
        rowTR.appendChild(sellTD);
        rowTR.appendChild(prcTD);
        rowTR.appendChild(buyTD);
        rowTR.appendChild(askTD);
        rowTR.appendChild(askOVBTD);
        rowTR.appendChild(absorberR);
        myElement.appendChild(rowTR);
};

var lastObj = {"timestamp": 0}

marketTrades.forEach(element => {
    lastObj = element.timestamp > lastObj.timestamp ? element : lastObj 
    console.log("MarketTrade:")
    console.log(element)
    const sideMO = element.orderSide == "SELL" ? "sell" : "buy"
    const myElement = document.getElementById(`${round(element.price, TICK)}-${sideMO}`);
    const value = parseFloat(myElement.innerHTML) ? parseFloat(myElement.innerHTML) : 0
    myElement.textContent = round(value + element.amount, 0.1)  
});

console.log(new Date(parseFloat(lastObj.timestamp) * 1000))
console.log(lastObj)

const dateLast = new Date(parseFloat(lastObj.timestamp) * 1000)
const timeDiv = document.getElementById('time');
timeDiv.textContent = `${dateLast}`;

renderLast(lastObj)

function renderLast(element) {
    const sideMO = element.orderSide == "SELL" ? "sell" : "buy"
    const myElement = document.getElementById(`${round(element.price, TICK)}-${sideMO}`);
    sideMO == "buy" ? myElement.setAttribute('class', `cell lastBuyTD`) : myElement.setAttribute('class', `cell lastSellTD`) 
}

stratTrades.forEach(element => {
   const sideMO = element.orderSide == "SELL" ? "ask" : "bid"
   console.log("stratTrade")
   console.log(element)
   const myElement = document.getElementById(`${round(element.price, TICK)}-${sideMO}`);
   const value = parseFloat(myElement.innerHTML) ? parseFloat(myElement.innerHTML) : 0
   myElement.textContent = round(value + element.amount, 0.1)  
   console.log(round(element.price, TICK))  
});

stratCurrentOVB.forEach(element => {
    const price = element.quoteTicker == "ADA" ? (element.price) : 1/element.price
    const side = element.quoteTicker == "ADA" ? "bid" : "ask"
    const amount =  element.quoteTicker == "ADA" ? element.amount/price : element.amount
    console.log(element)
    console.log(side)
    const thisRow = document.getElementById(`${round(price, TICK)}-row`);
    thisRow.setAttribute('class', 'rowTR rowHighlight');
    const thisLO =  document.getElementById(`${round(price, TICK)}-${side}OVB`);
    thisLO.setAttribute('class', `cell OVB active${side}OVB`);
    var value = thisLO.innerHTML.split(" ")[0]
    value = value == "" ? 0 : parseFloat(value)
    console.log(value)
    thisLO.textContent = round(value + amount, 0.1) + " L"
});

const roundSpotPrice = round(spotPrice, TICK)
const targetSpotPrice = round(spotPrice+(8*TICK), TICK)

const spotPriceTD = document.getElementById(`${roundSpotPrice}-box`);
spotPriceTD.setAttribute('class', `cell priceTD spotTD`);

const spotpriceDiv = document.getElementById('currentprice');
var link = `#${targetSpotPrice}-row`
var currentpriceLink = document.createElement("a");
currentpriceLink.setAttribute("href", link);
currentpriceLink.innerHTML = `Go to current price: ${roundSpotPrice}`; // Customize the link text
spotpriceDiv.appendChild(currentpriceLink);

function render_1div(trade) {
    // Create a new <div> element
    const newDiv = document.createElement('div');
    newDiv.textContent = `${round(trade.price, TICK)} -> ${trade.price}`; // Set some content (optional)

    // Append the new <div> to an existing parent element (e.g., <body>)
    document.body.appendChild(newDiv);
}

function find_min_max(stratTrades) {
    // Extract the 'price' values into an array
    const prices = stratTrades.map(item => item.price);

    // Find the maximum and minimum prices
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    return {"max": round(maxPrice, TICK), "min": round(minPrice, TICK)}
}

function find_last(marketTrades) {
    var lastObj = {"timestamp": 0}
    marketTrades.forEach(element => {
        lastObj = element.timestamp > lastObj.timestamp ? element : lastObj 
    });
    return lastObj
}

function round(number, precision) {
    const spaces = String(precision).split(".")[1].length
    const half_precision = precision / 2 
    const change = number % precision
    const fixed = (change >= half_precision) ? (number + (precision - change)) : (number - change)
    return fixed.toFixed(spaces)
}