#!/bin/bash

# TICK=${3:-0.01} // no need forthe replay data fetching
ASSET=$2
STRAT=$1

# fetch()
. ./fetch_data.sh
fetch_data $ASSET $STRAT ./replay_database/
echo "data fetched (curls) done."

# storageFactory()
node replayStorageFactory.js $STRAT $ASSET
echo "storage updated."


# remove fetch files