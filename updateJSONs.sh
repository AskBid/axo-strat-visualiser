#!/bin/bash

TICK=${3:-0.01}
ASSET=$2
STRAT=$1

. ./fetch_data.sh
fetch_data $ASSET $STRAT

echo "STRAT: ${STRAT}"
echo "ASSET: ${ASSET}"
echo "TICK:  ${TICK}"

# Execute the Node.js script
node formatJSONs.js $STRAT $ASSET $TICK

brave ./index.html
