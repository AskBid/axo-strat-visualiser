#!/bin/bash

TICK=${3:-0.01}
ASSET=$2
STRAT=$1

# fetch()
. ./fetch_data.sh
fetch_data $ASSET $STRAT ./replay_database/

# storageFactory()

# remove fetch files