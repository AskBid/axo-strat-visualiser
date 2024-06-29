const h = require("./helpers.js")
const fs = require("fs");

const timestampNow = (Date.now() / 1000).toFixed(0);

fs.writeFile('./replay_database/ids.json', JSON.stringify({stratID: `${process.argv[2]}`}, null, 2), err => {
    if (err) {
        console.error(err);
    } else {
        console.log("stratTrades written successfully")
    }
});

// strategy trades
fs.readFile("./replay_database/stratTrades.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const stratTrades = JSON.parse(jsonString).result.map(h.translateTrade);

    fs.readFile("./replay_database/stratTrades_ReplayDatabase.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        } 

        var existing = JSON.parse(jsonString)
        const updated = Object.assign(existing, keyTheTimestamps(stratTrades))

        fs.writeFile('./replay_database/stratTrades_ReplayDatabase.json', JSON.stringify(updated, null, 2), err => {
            if (err) {
                console.error(err);
            } else {
                console.log("stratTrades written successfully")
            }
        });
    });
});

// current OVB
fs.readFile("./replay_database/stratCurrentOVB.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const stratCurrentOVB = JSON.parse(jsonString).result.map(h.translateOVB);

    fs.readFile("./replay_database/stratCurrentOVB_ReplayDatabase.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        };

        var newObj = {};
        newObj[timestampNow] = stratCurrentOVB;
        var existing = JSON.parse(jsonString);
        const updated = Object.assign(existing, newObj);

        fs.writeFile('./replay_database/stratCurrentOVB_ReplayDatabase.json', JSON.stringify(updated, null, 2), err => {
            if (err) {
                console.error(err);
            } else {
                console.log("stratCurrentOVB written successfully");
            };
        });
    });
});

// market trades
fs.readFile("./replay_database/marketTrades.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    // {"price":3.1619,"amount":4.8034,"timestamp":1717773067.5645857,"decimals":4,"direction":1,"orderSide":"BUY"}
    // Markete Trades already come with ADA price and amount in CNT
    const marketTrades = JSON.parse(jsonString).result.map(h.translateMarketTrade);
    
    fs.readFile("./replay_database/marketTrades_ReplayDatabase.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        } 

        var existing = JSON.parse(jsonString)
        const updated = Object.assign(existing, keyTheTimestamps(marketTrades))

        fs.writeFile('./replay_database/marketTrades_ReplayDatabase.json', JSON.stringify(updated, null, 2), err => {
            if (err) {
                console.error(err);
            } else {
                console.log("marketTrades written successfully")
            }
        });
    });
});

// spot price
fs.readFile("./replay_database/orderBook.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
      
    const spotSpreadData = JSON.parse(jsonString).result.spotSpreadData;
    
    fs.readFile("./replay_database/orderBook_ReplayDatabase.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        } 

        var newObj = {}
        newObj[timestampNow] = spotSpreadData
        var existing = JSON.parse(jsonString)
        const updated = Object.assign(existing, newObj)

        fs.writeFile('./replay_database/orderBook_ReplayDatabase.json', JSON.stringify(updated, null, 2), err => {
            if (err) {
                console.error(err);
            } else {
                console.log("orderBook written successfully")
            }
        });
    });
});
  

function keyTheTimestamps(array) {
    var obj = {}
    array.forEach(element => {
        obj[element.timestamp] = element
    });
    return obj
}