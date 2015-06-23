# FDA Food Recalls [![Build Status](https://travis-ci.org/StrictlyBusiness/fda-food-recalls.svg?branch=develop)](https://travis-ci.org/StrictlyBusiness/fda-food-recalls)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/techniq.svg)](https://saucelabs.com/u/techniq)

## Development
- Install [Node](https://nodejs.org/)
- `npm install`
- `npm start`
- Open browser to `http://localhost:8000`

## Testing
###Local tests
- `npm test`
  - Run all linters and run unit tests with Chrome
- `gulp test:unit`
  - Run unit tests with Chrome
- `gulp test:unit --watch`
  - Continuously run unit tests with Chrome
- `gulp test:unit --browsers=PhantomJS`
  - Run unit tests with PhantomJS

###Sauce Labs
`SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables must be set
- `CI=true gulp test:unit`
  - Run all Sauce Lab configured browsers (same as Travis CI)
  - Under Windows, you'll need to set the environment variable manually `set CI=true`
- `gulp test:unit --browsers=sl_ie_9 --reporters=saucelabs`
  - Run units tests with IE9 on Sauce Labs
  - See `sauceLabsLaunchers` variable in [`karma.conf.js`]('karma'conf.js') for all available Sauce Labs configured browsers

## Docker
### Setup
- Install Docker Engine ([Mac](https://docs.docker.com/machine/install-machine/) / [Windows](https://docs.docker.com/installation/windows/))
  - Follow instructions to install Boot2Docker, which includes VirtualBox, Docker Client, Git, and the boot2docker Linux ISO
- (optional) Install [Docker Machine](https://docs.docker.com/machine/install-machine/)
  - Create `dev` machine: `docker-machie create -d virtualbox dev`

### Build and run manually
- `docker build -t fda-food-recalls .`
- `docker run -p 8000:8000 fda-food-recalls`
- Open browser to `http://$(docker-machine ip dev):8000` or replace `$(docker-machine ip dev)` with your docker virtual machine's IP if not using docker-machine

### Build and run using `docker-compose`
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Run `docker-compose up` from project root to build and run
- Open browser to `http://$(docker-machine ip dev):8000` or replace `$(docker-machine ip dev)` with your docker virtual machine's IP if not using docker-machine

## Deploying
Travis CI is configured to automatically deploy to Github Pages ([gh-pages](tree/gh-pages) branch) on all success commits to the `master` branch.  Travis CI will use the environment variable `GH_TOKEN` to push to Github Pages (configured as a secure environment variable).

If you would like to push a deployment from your local build, you can run `gulp deploy` locally.  You must be using SSH keys for with Github for authentication.
