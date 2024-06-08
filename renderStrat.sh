#!/bin/bash

TICK=${3:-0.01}
ASSET=$2
STRAT=$1

. ./fetch_data.sh
fetch_data $ASSET $STRAT ./renderStrat_database/

echo "STRAT: ${STRAT}"
echo "ASSET: ${ASSET}"
echo "TICK:  ${TICK}"

# Execute the Node.js script
node formatJSONs4renderStrat.js $STRAT $ASSET $TICK

brave ./renderStrat_page/index.html
