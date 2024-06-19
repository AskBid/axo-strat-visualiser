function roundtext(number, precision, multiplier) { //multiplier is only for asset values not price and only for visualisation formatting
    if (multiplier) {
        number = number / multiplier
    }
    const spaces = String(precision).split(".")[1].length
    const half_precision = precision / 2 
    const change = number % precision
    const fixed = (change >= half_precision) ? (number + (precision - change)) : (number - change)
    return fixed.toFixed(spaces)
}

function roundnum(number, precision, multiplier) {
    return parseFloat(roundtext(number, precision, multiplier))
}