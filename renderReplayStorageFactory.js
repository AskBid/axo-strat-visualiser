const fs = require("fs");

if (`${process.argv[2]}` === "-h") {
    console.log("node renderReplayStorageFactory.js <location_to_read_from> <TICK> <SCALE_FACTOR> <CRONJOB_INTERVAL> <SPEED_OF_REFRESH>")
    console.log("node renderReplayStorageFactory.js <default: ./replay_database> <d: 0.01> <d: 1> <d: 300> <d: 200>")
    console.log("i.e.: node renderReplayStorageFactory.js ./replay_archive/snek03 0.00001 1000")
    console.log("i.e.: node renderReplayStorageFactory.js - 0.00001 1000")
    console.log("i.e.: node renderReplayStorageFactory.js - 0.001 - 500 100")
    console.log("i.e.: node renderReplayStorageFactory.js ./replay_archive/snek03 0.001 - 500")
    process.exit()
}

var location_to_read_from = `${process.argv[2]}`
if (location_to_read_from == "undefined" || location_to_read_from == "-") {
    location_to_read_from = "./replay_database"
}
console.log(`base location to read from: ${location_to_read_from}`)

var TICK = `${process.argv[3]}`
if (TICK == "undefined" || TICK == "-") {
    TICK = "0.01"
}
console.log(`TICK set to: ${TICK}`)

var SCALE_FACTOR = `${process.argv[4]}`
if (SCALE_FACTOR == "undefined" || SCALE_FACTOR == "-") {
    SCALE_FACTOR = "1"
}
console.log(`SCALE_FACTOR set to: ${SCALE_FACTOR}`)

var CRONJOB_INTERVAL = `${process.argv[5]}`
if (CRONJOB_INTERVAL == "undefined" || CRONJOB_INTERVAL == "-") {
    CRONJOB_INTERVAL = 300
}
console.log(`CRONJOB_INTERVAL set to: ${CRONJOB_INTERVAL}`)

var SPEED_OF_REFRESH = `${process.argv[6]}`
if (SPEED_OF_REFRESH == "undefined" || SPEED_OF_REFRESH == "-") {
    SPEED_OF_REFRESH = 200
}
console.log(`SPEED_OF_REFRESH set to: ${SPEED_OF_REFRESH}`)

const timestampNow = Date.now()

// parameters
fs.readFile(`${location_to_read_from}/ids.json`, "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const content = `const stratID = ${JSON.stringify(JSON.parse(jsonString).stratID, null, 2)}\nconst TICK = ${TICK}\nconst SCALE_FACTOR = ${SCALE_FACTOR}\nconst CRONJOB_INTERVAL = ${CRONJOB_INTERVAL}\nconst SPEED_OF_REFRESH = ${SPEED_OF_REFRESH}`

    fs.writeFile('./replay_page/session_temp_data/parameters.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("parameters written successfully")
        }
    });
});

// strategy trades
fs.readFile(`${location_to_read_from}/stratTrades_ReplayDatabase.json`, "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const stratTrades = JSON.parse(jsonString);
    const content = `const stratTrades = ${JSON.stringify(stratTrades, null, 2)}`

    fs.writeFile('./replay_page/session_temp_data/stratTrades.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratTrades written successfully")
        }
    });
});

// current OVB
fs.readFile(`${location_to_read_from}/stratCurrentOVB_ReplayDatabase.json`, "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const stratCurrentOVB = JSON.parse(jsonString);
    const content = `const stratCurrentOVB = ${JSON.stringify(stratCurrentOVB, null, 2)}`

    fs.writeFile('./replay_page/session_temp_data/stratCurrentOVB.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratCurrentOVB written successfully")
        }
    });
});

// market trades
fs.readFile(`${location_to_read_from}/marketTrades_ReplayDatabase.json`, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    // {"price":3.1619,"amount":4.8034,"timestamp":1717773067.5645857,"decimals":4,"direction":1,"orderSide":"BUY"}
    // Markete Trades already come with ADA price and amount in CNT
    const marketTrades = JSON.parse(jsonString);
    const content = `const marketTrades = ${JSON.stringify(marketTrades, null, 2)}`;

    fs.writeFile('./replay_page/session_temp_data/marketTrades.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("marketTrades written successfully")
        }
    });
});

// spot price
fs.readFile(`${location_to_read_from}/orderBook_ReplayDatabase.json`, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    
    const spotSpreadData = JSON.parse(jsonString);
    const content = `const spotSpreadData = ${JSON.stringify(spotSpreadData, null, 2)}`

    fs.writeFile('./replay_page/session_temp_data/orderBook.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("orderBook written successfully")
            console.log("you can now launch `chrome ./replay_page/index.html`")
        }
    });
});

