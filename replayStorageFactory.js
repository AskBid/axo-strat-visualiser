const h = require("./helpers.js")
const fs = require("fs");

console.log(typeof h.translateOVB)
console.log(typeof h.translateTrade)

// > ob1 = {123: "ciao", 124: "miao"}
// { '123': 'ciao', '124': 'miao' }
// > ob2 = {124: "miao2", 125: "update!", 126: "indeed"}
// { '124': 'miao2', '125': 'update!', '126': 'indeed' }
// > Object.assign(ob1, ob2)
// { '123': 'ciao', '124': 'miao2', '125': 'update!', '126': 'indeed' }

// MarketTrade:
    // {"price":3.1619,"amount":4.8034,"timestamp":1717773067.5645857,"decimals":4,"direction":1,"orderSide":"BUY"}
// StratTrade:
    // {"timestamp":"1717722496.076430517","amount":6.387096,"price":3.1000004,"orderSide":"BUY"}
// StratCurrentOVB:
    // {"timestamp":"1717722503.079021162","amount":12.967096328735352,"price":3.1800000530719768,"orderSide":"ask"}

fs.readFile("./stratTrades.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
    
    const translatedStratTrades = JSON.parse(jsonString).result.map(h.translateTrade);

    // const content = `const stratTrades = ${JSON.stringify(content_json)}\nconst stratID = "${stratID}"\nconst TICK = ${TICK}`

    fs.readFile("./replay_database/stratTradesReplayDatabase.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        } 

        var existing = JSON.parse(jsonString)
        const updated = Object.assign(existing, keyTheTimestamps(translatedStratTrades))
        console.log(updated)

        fs.writeFile('./replay_database/stratTradesReplayDatabase.json', JSON.stringify(updated, null, 2), err => {
            if (err) {
                console.error(err);
            } else {
                console.log("stratTrades written successfully")
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