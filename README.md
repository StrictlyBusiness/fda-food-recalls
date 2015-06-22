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

# Deploying
Travis CI is configured to automatically deploy to Github Pages ([gh-pages](tree/gh-pages) branch) on all success commits to the `master` branch.  Travis CI will use the environment variable `GH_TOKEN` to push to Github Pages (configured as a secure environment variable).

If you would like to push a deployment from your local build, you can run `gulp deploy` locally.  You must be using SSH keys for with Github for authentication.
