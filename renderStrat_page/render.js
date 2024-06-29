//const TICK = 0.01 // now given with command line argument, defaults to 0.01
async function render() {
    const ticksPAD = 5;

    var minmaxs = [find_min_max(stratTrades, "price", TICK), find_min_max(marketTrades, "price", TICK), find_min_max(stratCurrentOVB, "price", TICK)]
    console.log("minmaxs::::::::::::::::::::::::::")
    var filteredMinMaxs = minmaxs.filter(e => e != false)
    const min = Math.min(...(filteredMinMaxs.map(item => item.min))) - (TICK * ticksPAD)
    const max = Math.max(...(filteredMinMaxs.map(item => item.max))) + (TICK * (ticksPAD+1))
    console.log(`min: ${min}, max: ${max}`)

    const MIN = roundnum(min - (ticksPAD * TICK), TICK);
    const MAX = roundnum(max + (ticksPAD * TICK), TICK);

    const frameObj = new FrameOBJ(
        TICK, MIN, MAX, 
        marketTrades, 
        stratCurrentOVB, 
        stratTrades, 
        spotSpreadData
    )

    frameObj.populate()
    var sortedPricesKeys = Object.keys(frameObj.frame).sort().reverse()

    const promises = [];

    for (const priceLevel of sortedPricesKeys) { 
        promises.push(await renderRow(frameObj.frame[priceLevel], 0.1, SCALE_FACTOR))
    }

    await Promise.all(promises)

    renderLast(frameObj.lastTrade, frameObj.TICK)
    renderBidStratLast(frameObj.lastBidStratTrade, frameObj.TICK)
    renderAskStratLast(frameObj.lastAskStratTrade, frameObj.TICK)
    renderSpotPrice(frameObj.Highlights.spot, frameObj.TICK)
    renderAskBid(frameObj.Highlights.ask, frameObj.TICK)
    renderAskBid(frameObj.Highlights.bid, frameObj.TICK)
    calculateProfits(stratUserFunds, stratTrades)
    // headers render function
    const headtitle = document.getElementById('head');
    headtitle.textContent = `This is a visualisation of the strategy ID: `;
    var link = `https://app.axo.trade/strategies/view/${stratID}`;
    var stratLink = document.createElement("a");
    stratLink.setAttribute("href", link);
    stratLink.innerHTML = `${stratID}`;
    headtitle.appendChild(stratLink);

    const scaleFactorDiv = document.getElementById('scaleFactor');
    scaleFactorDiv.textContent = `The asset's values SCALE FACTOR is: ${SCALE_FACTOR} `;

    const dateLast = new Date(parseFloat(frameObj.lastTrade.timestamp) * 1000)
    const timeDiv = document.getElementById('time');
    timeDiv.textContent = `${dateLast}`;

    const currentpriceDiv = document.getElementById('currentprice');
    var currentpriceformatted = roundnum(frameObj.lastTrade.price, TICK)
    var link = `#${currentpriceformatted+(10*TICK)}-row`;
    var priceRowLink = document.createElement("a");
    priceRowLink.setAttribute("href", link);
    priceRowLink.innerHTML = `Go to last traded price ${currentpriceformatted}`;
    currentpriceDiv.appendChild(priceRowLink);
    /// headers.

    // scroll page to spotprice
    document.getElementById(`${roundtext(frameObj.Highlights.spot, frameObj.TICK)}-box`).scrollIntoView(true);


    return Promise.resolve(frameObj);
}

function calculateProfits(stratUserFunds, stratTrades) {
    let buys = stratTrades.filter(e => e.orderSide == 'BUY')
    let sells = stratTrades.filter(e => e.orderSide == 'SELL')

    let objADA = stratUserFunds.filter(obj => obj.asset_name === "ADA"); 
    let objCNT = stratUserFunds.filter(obj => obj.asset_name !== "ADA"); 

    let currentADA = objADA.length > 0 ? objADA[0].allocation : 0;
    let currentCNT = objCNT.length > 0 ? objCNT[0].allocation : 0;
    let initialADA = currentADA;
    let initialCNT = currentCNT;
    let nameCNT    = objCNT.length > 0 ? objCNT[0].asset_name : "CNT";

    buys.forEach(buy => {
        initialADA = initialADA + (buy.amount * buy.price)
        initialCNT = initialCNT - buy.amount
    });

    sells.forEach(sell => {
        initialADA = initialADA - (sell.amount * sell.price)
        initialCNT = initialCNT + sell.amount
    })

    const boughtCell = document.getElementById('Bought');
    boughtCell.innerHTML = `You entered: ${initialADA.toFixed(2)} ADA and ${initialCNT.toFixed(2)} ${nameCNT}`;

    const soldcell = document.getElementById('Sold');
    soldcell.innerHTML =   `You now have: ${currentADA.toFixed(2)} ADA and ${currentCNT.toFixed(2)} ${nameCNT}`;

    const profitcell = document.getElementById('profitloss');
    profitcell.innerHTML = `At the current prices:<br><br>if you had hold your asset you'd have:<br>${(initialADA + (initialCNT * spotSpreadData.spot)).toFixed(2)} ADA<br><br>instead your strat now holds a value of:<br>${(currentADA + (currentCNT * spotSpreadData.spot)).toFixed(2)} ADA<br><br>profit: ${((currentADA + (currentCNT * spotSpreadData.spot))-(initialADA + (initialCNT * spotSpreadData.spot))).toFixed(2)} ADA`;
}

render()