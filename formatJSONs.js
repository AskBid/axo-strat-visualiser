const fs = require("fs");

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
    
    const content_json = JSON.parse(jsonString).result.map(translateTrade);
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
    
    const content_json = JSON.parse(jsonString).result;
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

function translateTrade(trade) {
    const divisor = trade.pair.split(" / ")[1]
    if (divisor == 'ADA') {
        // return {"date": new Date(parseFloat(trade.timestamp) * 1000), "buy": trade.received.amount,  "price": trade.price.value}
        return {"date": trade.timestamp, "amount": trade.received.amount,  "price": trade.price.value, "orderSide": "BUY"}
    } else {
        return {"date": trade.timestamp, "amount": trade.sold.amount,  "price": 1/trade.price.value, "orderSide": "SELL"}
    }
}

function marketTrade(trade) {
    return {}
}
