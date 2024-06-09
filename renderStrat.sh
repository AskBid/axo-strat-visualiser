#!/bin/bash

echo "start renderStrat.sh script ..."

TICK=${3:-0.01}
ASSET=$2
STRAT=$1
echo "STRAT: ${STRAT}"
echo "ASSET: ${ASSET}"
echo "TICK:  ${TICK}"

. ./fetch_data.sh
fetch_data $STRAT $ASSET "./renderStrat_database/"

echo ""
echo "::::"
echo "curl requests ended. fetch_data() exited. back into renderStrat.sh"

node renderStrat1TimeStorageFactory.js $STRAT $ASSET $TICK

brave ./renderStrat_page/index.html

# remove fetch files
# echo "deleting fetch_data jsons ..."
# rm ./renderStrat_database/*.json
# echo "deleted."