/// - render price highlight, last trade highlight and current bid-ask spread.
async function render(timestamp) {
    await clearRender()

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

    console.log(`current timestap: ${timestamp}`)
    var date = new Date(timestamp*1000);
    date = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    const currentDate = document.getElementById('currentTimeLabel');
    currentDate.innerHTML = `${date}`
    console.log(`current date:     ${date}`)

    const minmax = selectDates.minmaxPrices()
    const ticksPAD = 5;
    const MIN = roundnum(minmax.min - (ticksPAD * TICK), TICK);
    const MAX = roundnum(minmax.max + (ticksPAD * TICK), TICK);

    const frameObj = new FrameOBJ(
        TICK, MIN, MAX, 
        selectDates.marketTrades, 
        selectDates.stratCurrentOVB, 
        selectDates.stratTrades, 
        selectDates.spotSpreadData,
        true // blocks accumulation for current OBV with same price
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
    /// render heeaders
    const headtitle = document.getElementById('head');
    headtitle.textContent = `This is a visualisation of the strategy ID: `;
    var link = `https://app.axo.trade/strategies/view/${stratID}`;
    var stratLink = document.createElement("a");
    stratLink.setAttribute("href", link);
    stratLink.innerHTML = `${stratID}`;
    headtitle.appendChild(stratLink);

    const scaleFactorDiv = document.getElementById('scaleFactor');
    scaleFactorDiv.textContent = `The asset's values SCALE FACTOR is: ${SCALE_FACTOR} `;
    ///
    // console.log(`frame with timestamp ${timestamp} was rendered.`)  
    
    
    return Promise.resolve(frameObj);
}

async function main() {
    const start = SelectDates.findstart(spotSpreadData)
    console.log(`start timestamp: ${start}`)
    const end   = SelectDates.findend(spotSpreadData)
    console.log(`end timestamp:   ${end}`)

    var date = new Date(start*1000);
    const startDate = document.getElementById('startTimeLabel');
    startDate.innerHTML = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

    date = new Date(end*1000);
    const endDate = document.getElementById('endTimeLabel');
    endDate.innerHTML = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

    for (let index = 0; index < ((end-start)/500); index++) {
        await render(start + (500*index))
        // problem! the OVB limit orders get accumulated over time.
        await sleep(100)
    }
}

window.onload = main