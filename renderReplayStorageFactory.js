const fs = require("fs");

const timestampNow = Date.now()
// strategy trades
fs.readFile("./replay_database/stratTrades_ReplayDatabase.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const stratTrades = JSON.parse(jsonString);
    const content = `const stratTrades = ${JSON.stringify(stratTrades, null, 2)}`

    fs.writeFile('./replay_page/stratTrades.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratTrades written successfully")
        }
    });
});

// current OVB
fs.readFile("./replay_database/stratCurrentOVB_ReplayDatabase.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const stratCurrentOVB = JSON.parse(jsonString);
    const content = `const stratCurrentOVB = ${JSON.stringify(stratCurrentOVB, null, 2)}`

    fs.writeFile('./replay_page/stratCurrentOVB.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratCurrentOVB written successfully")
        }
    });
});

// market trades
fs.readFile("./replay_database/marketTrades_ReplayDatabase.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    // {"price":3.1619,"amount":4.8034,"timestamp":1717773067.5645857,"decimals":4,"direction":1,"orderSide":"BUY"}
    // Markete Trades already come with ADA price and amount in CNT
    const marketTrades = JSON.parse(jsonString);
    const content = `const marketTrades = ${JSON.stringify(marketTrades, null, 2)}`;

    fs.writeFile('./replay_page/marketTrades.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("marketTrades written successfully")
        }
    });
});

// spot price
fs.readFile("./replay_database/orderBook_ReplayDatabase.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
      
    const spotSpreadData = JSON.parse(jsonString);
    const content = `const spotSpreadData = ${JSON.stringify(spotSpreadData, null, 2)}`

    fs.writeFile('./replay_page/orderBook.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("orderBook written successfully")
        }
    });
});