#!/bin/bash

TICK=${3:-0.01}
ASSET=$2
STRAT=$1

. ./fetch_data.sh
fetch_data $ASSET $STRAT ./renderStrat_database/

echo "STRAT: ${STRAT}"
echo "ASSET: ${ASSET}"
echo "TICK:  ${TICK}"

node formatJSONs4renderStrat.js $STRAT $ASSET $TICK

brave ./renderStrat_page/index.html

# remove fetch files
echo "deleting fetch_data jsons ..."
rm ./renderStrat_database/*.json
echo "deleted."