> Note: project has been changing and not all of the below is relevant, but it can help understanding current workings until I write up to date readme.

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

With the above installed is enough to run the file from terminal with `./renderStrat.sh <Strategy ID> [<Asset ID if other than AXO>]` 

> Note: it is possible to run on Windows, but you'll need to do some reasearch on how to, installing WSL on Windows should solve all problem btw, it is like a virtual Linux inside Windows.

If the file doesn't run, just run this command first to give the file excutable permission `chmod +x ./updateJSON.sh`.

the `renderStrat.sh` script will try to open Brave browser on the page that the script just created. But if that does not work just open manully the file in the same directory as the script named `renderStrat_page/index.html`.

# Settings

> Note: if you don't have Brave installed you can try changing the last line in the `renderStrat.sh` script with your own browser command:

```sh
#now it is:
brave ./renderStrat_page/index.html
#you can try with:
chrome ./renderStrat_page/index.html
```

When you run the script you will need to give as argument the Strategy ID:

```sh
$ ./renderStrat.sh 1a5458a13a2c63d527d514068fc3012da1d8e3858f3bcc95d41a5643
```

But if you are not using the `ADA / AXO` pair you will need to specify also the other Asset as AXO is set as default.

Here an example for Liqwid `ADA / LQ` pair:

```sh
$ ./renderStrat.sh 3e6655bfe870a02109e44e48bb37633e1923635f0c1a73d31a708835 da8c30857834c6ae7203935b89278c532b3995245295456f993e1d244c51
```

For few assets (currently LQ and SNEK) also text is supported, so you coul write:

```sh
$ ./renderStrat.sh 46bc2d991b77499e46c5ea918ecf246caea13618e7729d596eb59267 LQ
```

> Note: Non ADA pair are not supported yet.

## Tick size

At the moment the tick size, that decides the steps in teh price ladder, works with the AXO price and similar magnitude prices, but for things like SNEK where prices are much smaller it needs to be lower.

By default the TICK size is "0.01" (which works for AXO and LQ pairs) but for SNEK you'll need something more like "0.00001".

To achieve this, you can give a third argument to `./renderStrat` like this:

```sh
$ ./renderStrat.sh 474efaf7981c277373bbc003805a1dc5ace60f6071338dc9d0fb7273 SNEK 0.00001
```

# UPDATE

need to refactor the render_page js logic to the new logic present in replay_page.

### brief use of replay functions:

run `./initiateReplayStorage.sh` to clean up the folder and prepare empty files. (will delete all existing, move somewhere else if required)

`fetchReplayData.sh` can be used with a cron job to gather data from AXO api every x time.

when data is enough and ready run `node renderReplayStorageFactory.js` to tranfer the JSON to js files that can be read from the js inside `replay_page/`.