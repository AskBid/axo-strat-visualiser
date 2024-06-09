#!/bin/bash

rm ./replay_database/*.json

echo {} > './replay_database/stratCurrentOVB_ReplayDatabase.json'
echo {} > './replay_database/stratTrades_ReplayDatabase.json'
echo {} > './replay_database/marketTrades_ReplayDatabase.json'
echo {} > './replay_database/orderBook_ReplayDatabase.json'