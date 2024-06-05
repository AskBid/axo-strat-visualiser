const fs = require("fs");
const { spotprice } = require("./formatJSONs");

fs.readFile("./orderBook.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }

    const content_json = JSON.parse(jsonString).result.spotSpreadData.spot;
    spotprice = JSON.stringify(content_json);
    console.log("spotprice////////////////");
    console.log(spotprice);
    const content = `const spotPrice = ${JSON.stringify(content_json)}`;

    fs.writeFile('data4.js', content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("spotPrice written successfully");
        }
    });
});
