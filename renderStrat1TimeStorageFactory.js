const fs = require("fs");
const helpers = require("./helpers.js");

console.log("")
console.log("start renderStrat1TimeStorageFactory.js ...")

console.log(`STRAT arg: ${process.argv[2]}`)
console.log(`ASSET arg: ${process.argv[3]}`)
console.log(`TICK size: ${process.argv[4]}`)
console.log(`SCALE_FACTOR: ${process.argv[5]}`)

const stratID = `${process.argv[2]}`
const TICK = `${process.argv[4]}`
const SCALE_FACTOR = `${process.argv[5]}`

// parameters values
const content = `const stratID = "${stratID}"\nconst TICK = ${TICK}\nconst SCALE_FACTOR= ${SCALE_FACTOR}`

fs.writeFile('./renderStrat_page/session_temp_data/parameters.js', content, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("parameters written successfully")
    }
});

// strategy trades 
fs.readFile("./renderStrat_database/stratTrades.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
    
    const content_json = JSON.parse(jsonString).result.map(helpers.translateTrade);
    const content = `const stratTrades= ${JSON.stringify(content_json, null, 2)}`
    
    fs.writeFile('./renderStrat_page/session_temp_data/stratTrades.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratTrades written successfully")
        }
    });
});

// current OVB
fs.readFile("./renderStrat_database/stratCurrentOVB.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const content_json = JSON.parse(jsonString).result.map(helpers.translateOVB);
    const content = `const stratCurrentOVB = ${JSON.stringify(content_json, null, 2)}`
    
    fs.writeFile('./renderStrat_page/session_temp_data/stratCurrentOVB.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratCurrentOVB written successfully")
        }
    });
});

// market trades
fs.readFile("./renderStrat_database/marketTrades.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    // {"price":3.1619,"amount":4.8034,"timestamp":1717773067.5645857,"decimals":4,"direction":1,"orderSide":"BUY"}
    // Markete Trades already come with ADA price and amount in CNT
    const content_json = JSON.parse(jsonString).result;
    const content = `const marketTrades = ${JSON.stringify(content_json, null, 2)}`
    
    fs.writeFile('./renderStrat_page/session_temp_data/marketTrades.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("marketTrades written successfully")
        }
    });
});

// spot price
fs.readFile("./renderStrat_database/orderBook.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
    
    const content_json = JSON.parse(jsonString).result.spotSpreadData;
    const content = `const spotSpreadData = ${JSON.stringify(content_json, null, 2)}`
    
    fs.writeFile('./renderStrat_page/session_temp_data/orderBook.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("spotPrice written successfully")
        }
    });
});

// strategy trades 
fs.readFile("./renderStrat_database/stratUserFunds.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
      
    const content_json = JSON.parse(jsonString).result.totalLiquidity.map(assetObj => {
        let asset_name = assetObj.asset_name === "" ? "ADA" : helpers.hexToAscii(assetObj.asset_name);
        let allocation = assetObj.allocation
        return {asset_name, allocation}
    });
    const content = `const stratUserFunds = ${JSON.stringify(content_json, null, 2)}`
    
    fs.writeFile('./renderStrat_page/session_temp_data/stratUserFunds.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratUserFunds written successfully")
        }
    });
});


console.log("ending renderStrat1TimeStoragefactory.js.")
console.log("")