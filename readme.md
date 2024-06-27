> Note: project has been changing and not all of the below may be relevant, but it can help understanding current workings until I write up to date readme.

# Prerequisits

Need to have `curl` and `nodejs` installed. Is possible to run them on Windows but not sure what's the best route.

On MacOS and Linux should come wiht them already but `curl` is easy to install with:

```sh
#MacOS
brew install curl
echo 'export PATH="$(brew --prefix)/opt/curl/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

```sh
#Linux Debian
sudo apt-get update
sudo apt-get install curl
```

Quick google search for NodeJS will tell you for its installation, on Windows too.


# How To

Clone this repository locally and get into its folder `cd axo-strat-visualiser`

With the above installed is enough to run the file from terminal with `./renderStrat.sh <Strategy ID> [<Asset ID if other than AXO>] [SCALE_FACTOR to divide assets value if like with SNEK are too big]` 

> Note: it is possible to run on Windows, but you'll need to do some reasearch on how to, installing WSL on Windows should solve all problem btw, it is like a virtual Linux inside Windows.

If the file doesn't run, just run this command first to give the file excutable permission `chmod +x ./updateJSON.sh`.

After `renderStrat.sh` script run, open yout browser on the page that the script just created: `renderStrat_page/index.html`.

# Settings

When you run the script you will need to give as argument the Strategy ID:

```sh
$ ./renderStrat.sh 1a5458a13a2c63d527d514068fc3012da1d8e3858f3bcc95d41a5643
```

But if you are not using the `ADA / AXO` pair you will need to specify also the other Asset as AXO is set as default.

Here an example for Liqwid `ADA / LQ` pair:

```sh
$ ./renderStrat.sh 3e6655bfe870a02109e44e48bb37633e1923635f0c1a73d31a708835 da8c30857834c6ae7203935b89278c532b3995245295456f993e1d244c51
```

For few assets (currently LQ, SNEK, iUSD, LENFI, WMT ..) also ticker text is supported, so you coul write:

```sh
$ ./renderStrat.sh 46bc2d991b77499e46c5ea918ecf246caea13618e7729d596eb59267 LQ
```

> Note: Non ADA pair are not supported yet.

## Tick size

At the moment the tick size, that decides the steps in the price ladder, works with the AXO price and similar magnitude prices, but for things like SNEK where prices are much smaller it needs to be lower.

By default the TICK size is "0.01" (which works for AXO and LQ pairs) but for SNEK you'll need something more like "0.00001".

To achieve this, you can give a third argument to `./renderStrat` like this:

```sh
$ ./renderStrat.sh 474efaf7981c277373bbc003805a1dc5ace60f6071338dc9d0fb7273 SNEK 0.00001
```

## Scale Factor

For some assets with extremely low prices, the CNT may trade in the millions, so you may want to specify a SCALE_FACTOR that will divide all CNT values by that SCALE_FACTOR. i.e.:

```sh
$ ./renderStrat.sh 3c5c3afcce7bd1a330f43e7b45385d5511afc5f5c8b76e47c5e6e3a5 SNEK 0.00001 1000
```

If you need to skip a value but need to input an argument after that, just insert a dash "-":
```sh
$ ./renderStrat.sh 3c5c3afcce7bd1a330f43e7b45385d5511afc5f5c8b76e47c5e6e3a5 SNEK - 1000
```
In this case the TICK wil default to 0.01 which for SNEK will be far too big, and all the trades will be probably condensed in one price level (TICK).


### brief use of replay functions:

# Intro

This Replay Mode it is simply a set of scripts to fetch data at certain interval (using Linux crontab to launch the script every x time), after which the data fetched can be reorganised from a script that prepares the data to be rendered by a local webpage that replays all of the data recorded at a higher speed.

In the future will be possible to set the speed, but for now it is set as such that 33 hours will be compressed in 30 seconds.

You can still modify such parameters within the code of the file `replay_page/render.js`.

# How To

run `./initiateReplayStorage.sh` to clean up the folder and prepare empty files. (will delete all existing, move somewhere else if required)

`fetchReplayData.sh` can be used with a cron job to gather data from AXO api every x time.

i.e. here is an example to also log messages into a loggi.log file of a cronjob that fetches data every 5 minutes:
```sh
*/5 * * * * cd <axo-strat-visualiser_FOLDER> && ./fetchReplayData <axo_strategy_ID> <CNT_ASSET_ID_or_TICKER_if_supported> > ./loggi.log 2>&1
```
add the line to the crontab text file after running `crontab -e`.

when data is enough and ready stop the cronjob and run `node renderReplayStorageFactory.js` to tranfer the JSON to js files that can be read from the js inside `replay_page/`.

`renderReplayStorageFactory.js` has parameters to change from where it fishes the recorded data (default is `./replay_database`) so that you can fish from archives that you copied in other locations.

here a few example on posible config of `renderReplayStorageFactory.js`. Notice that if you skip an argument you need to leave a dash "-" if there are other arguments after it.

```sh
node renderReplayStorageFactory.js <LOCATION_TO_READ_DATA_FROM> <TICK_SIZE> <SCALE_FACTOR>
node renderReplayStorageFactory.js - 0.001
node renderReplayStorageFactory.js - 0.00001 1000
node renderReplayStorageFactory.js ./replay_archive/cnt00 - 10
node renderReplayStorageFactory.js ./replay_archive/cnt03
node renderReplayStorageFactory.js ./replay_archive/cnt03 0.1
```

When `renderReplayStorageFactory.js` run successfully you can launch the web page `/replay_page/index.html` from you browser.