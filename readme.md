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

With the above installed is enough to run the file from terminal with `./updateJSONs.sh <Strategy ID> [<Asset ID if other than AXO>]` 

> Note: it is possible to run on Windows, but you'll need to do some reasearch on how to, installing WSL on Windows should solve all problem btw, it is like a virtual Linux inside Windows.

If the file doesn't run, just run this command first to give the file excutable permission `chmod +x ./updateJSON.sh`.

the `updateJSONs.sh` script will try to open Brave browser on the page that the script just created. But if that does not work just open manully the file in the same directory as the script named `index.html`.

# Settings

> Note: if you don't have Brave installed you can try changing the last line in the `updateJSONs.sh` script with your own browser command:

```sh
#now it is:
brave ./index.html
#you can try with:
chrome ./index.html
```

When you run the script you will need to give as argument the Strategy ID:

```sh
$ ./updateJSONs.sh 1a5458a13a2c63d527d514068fc3012da1d8e3858f3bcc95d41a5643
```

But if you are not using the `ADA / AXO` pair you will need to specify also the other Asset as AXO is set as default.

Here an example for Liqwid `ADA / LQ` pair:

```sh
$ ./updateJSONs.sh 3e6655bfe870a02109e44e48bb37633e1923635f0c1a73d31a708835 da8c30857834c6ae7203935b89278c532b3995245295456f993e1d244c51
```

> Note: Non ADA pair are not supported yet.

## Tick size

in the first rwo of the file `render.js` you will find a variable that decides what is the price step between each row.

At the moment it works with the AXO price and simila magnitude prices, but for things like SNEK where prices are much smaller it needs to be lower.

```js
const TICK = 0.01
// for SNEK would be better like:
const TICK = 0.00001
```