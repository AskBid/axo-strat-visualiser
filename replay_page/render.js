// function makePageObj() {

// }


function makeArrayOfObjBeforeTime(objTimeKeys, currentTime) {
    const beforeKeys = Object.keys(objTimeKeys).filter(key => parseFloat(key) < currentTime)
    var arrayObjs = []
    beforeKeys.forEach(key => {
        arrayObjs.push(objTimeKeys[key])
    });
    return arrayObjs
}

const time = 1718970308;
console.log(time)
console.log(makeArrayOfObjBeforeTime(marketTrades, time))
