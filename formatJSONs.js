const fs = require("fs");
const helpers = require("./helpers.js");

console.log(`arg1: ${process.argv[2]}`)
console.log(`arg2: ${process.argv[3]}`) // not used so far
console.log(`TICK size: ${process.argv[4]}`)

const stratID = `${process.argv[2]}`
const TICK = `${process.argv[4]}`

fs.readFile("./stratTrades.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
    
    const content_json = JSON.parse(jsonString).result.map(helpers.translateTrade);
    const content = `const stratTrades = ${JSON.stringify(content_json)}\nconst stratID = "${stratID}"\nconst TICK = ${TICK}`
    
    fs.writeFile('data.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratTrades written successfully")
        }
    });
});

fs.readFile("./marketTrades.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
    // {"price":3.1619,"amount":4.8034,"timestamp":1717773067.5645857,"decimals":4,"direction":1,"orderSide":"BUY"}
    // Markete Trades already come with ADA price and amount in CNT
    const content_json = JSON.parse(jsonString).result;
    const content = `const marketTrades = ${JSON.stringify(content_json)}`
    
    fs.writeFile('data2.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("marketTrades written successfully")
        }
    });
});

fs.readFile("./stratCurrentOVB.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    
    const content_json = JSON.parse(jsonString).result.map(helpers.translateOVB);
    const content = `const stratCurrentOVB = ${JSON.stringify(content_json)}`
    
    fs.writeFile('data3.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("stratCurrentOVB written successfully")
        }
    });
});

fs.readFile("./orderBook.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
    
    const content_json = JSON.parse(jsonString).result.spotSpreadData.spot;
    const content = `const spotPrice = ${JSON.stringify(content_json)}`
    
    fs.writeFile('data4.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("spotPrice written successfully")
        }
    });
});

