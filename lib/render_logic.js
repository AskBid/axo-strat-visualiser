async function renderRow(objPriceLevel, precision, multiplier) {
    const table = document.getElementById('maintable');
    
    //objPriceLevel : {buylo: 210092.0019521317, bought: null, sellmos: 210627, price: '0.002810', buymos: null, sold: null, selllo: null}
    // Create a new <tr> element
    const price = objPriceLevel.price //round(max - (TICK * (ind    ex+1)), TICK)
    
    // const absorberL = document.createElement('td');
    const absorberR = document.createElement('td');
    // absorberL.setAttribute('class', `absorbing-columnL cell`);
    absorberR.setAttribute('class', `absorbing-columnR cell`);
    
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
        rowTR.setAttribute('class', 'rowTR rowHighlightAsk');
        askOVBTD.textContent = `${roundtext(objPriceLevel.selllo, precision, multiplier)} L`;
        askOVBTD.setAttribute('class', `cell OVB activeaskOVB`);
    } else {
        askOVBTD.textContent = ""
        askOVBTD.setAttribute('class', `cell OVB`);
    }

    const bidOVBTD = document.createElement('td');
    bidOVBTD.setAttribute('id', `${price}-bidOVB`);
    if (objPriceLevel.buylo) {
        rowTR.setAttribute('class', 'rowTR rowHighlightBid');
        bidOVBTD.textContent = `${roundtext(objPriceLevel.buylo, precision, multiplier)} L`;
        bidOVBTD.setAttribute('class', `cell OVB activebidOVB`);
    } else {
        bidOVBTD.textContent = "";
        bidOVBTD.setAttribute('class', `cell OVB`);
    }
    
    // Append the new <tr> to an existing parent element (e.g., <body>)
    // rowTR.appendChild(absorberL);
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

function renderLast(element, precision) {
    const sideMO = element.orderSide == "SELL" ? "sell" : "buy"
    const myElement = document.getElementById(`${roundtext(element.price, precision)}-${sideMO}`);
    sideMO == "buy" ? myElement.setAttribute('class', `cell lastBuyTD`) : myElement.setAttribute('class', `cell lastSellTD`) 
}

function renderBidStratLast(element, precision, scaleFactor) {
    if (element.price) {
        const myElement = document.getElementById(`${roundtext(element.price, precision)}-bid`);
        myElement.setAttribute('class', `cell bidTDLastTrade tooltip`);
        const span = document.createElement('span');
        span.innerHTML = (`last: ${roundtext(element.amount/scaleFactor, 0.1)}`);
        span.setAttribute('class', `tooltiptextbid`);
        myElement.appendChild(span);
    }
}

function renderAskStratLast(element, precision, scaleFactor) {
    if (element.price) {
        const myElement = document.getElementById(`${roundtext(element.price, precision)}-ask`);
        myElement.setAttribute('class', `cell askTDLastTrade tooltip`);
        const span = document.createElement('span');
        span.innerHTML = (`last: ${roundtext(element.amount/scaleFactor, 0.1)}`);
        span.setAttribute('class', `tooltiptextask`);
        myElement.appendChild(span);
    }
}

function renderSpotPrice(spotPrice, precision) {
    const roundSpotPrice = roundtext(spotPrice, precision);
    const spotPriceTD = document.getElementById(`${roundSpotPrice}-box`);
    spotPriceTD.setAttribute('class', `cell priceTD spotTD`);
}

function renderAskBid(price, precision) {
    const roundPrice = roundtext(price, precision);
    const priceTD = document.getElementById(`${roundPrice}-box`);
    priceTD.classList.add("bidask");
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
