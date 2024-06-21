#!/bin/bash

# TICK=${3:-0.01} // no need forthe replay data fetching

STRAT=$1
ASSET=$2
LOCATION=$3
echo "inside fetchReplayData.sh"
current_datetime="$(date +'%Y-%m-%d %H:%M:%S')"
echo "Current date and time: $current_datetime"
echo "ASSET: ${ASSET}"
echo "STRAT: ${STRAT}"

if [ "$ASSET" = "-" ] || [ -z "$ASSET" ] || [ "$ASSET" = "AXO" ]; then
    ASSET="420000029ad9527271b1b1e3c27ee065c18df70a4a4cfc3093a41a4441584f"  # change to default if second argument is "-" or empty string
fi

if [ "$LOCATION" = "-" ] || [ -z "$LOCATION" ]; then
    LOCATION="."  # change to default if second argument is "-" or empty string
fi

echo "Location inside fetchReplayData.sh: $LOCATION"

# fetch()
. $LOCATION/fetch_data.sh
fetch_data $STRAT $ASSET $LOCATION/replay_database/
echo "data fetched (curls) done."

# storageFactory()
node $LOCATION/replayStorageFactory.js $STRAT $ASSET
echo "storage updated."


# remove fetch files