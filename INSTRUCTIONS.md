# Instructions and Usage

## Development
- Install [Node](https://nodejs.org/)
- `npm install`
  - Install all npm and jspm dependencies
- `npm run develop` (or `gulp serve`)
  - Starts BrowserSync and continuously monitors for changes and inject the styles or reload the browser
  - `gulp serve` requires  gulp to be installed globally (`npm install -g gulp`)
- `npm start`
  - Starts BrowserSync and serves the production (concatenated/minified) assets
- Open browser to `http://localhost:8000`

## Testing
### Local tests
- `npm test`
  - Run all linters and run unit tests with Chrome
- `gulp test:unit`
  - Run unit tests with Chrome
- `gulp test:unit --watch`
  - Continuously run unit tests with Chrome
- `gulp test:unit --browsers=PhantomJS`
  - Run unit tests with PhantomJS

  ## Docker

  ### Setup
  - Install Docker Engine ([Mac](https://docs.docker.com/machine/install-machine/) / [Windows](https://docs.docker.com/installation/windows/))
    - Follow instructions to install Boot2Docker, which includes VirtualBox, Docker Client, Git, and the boot2docker Linux ISO
  - Install [Docker Machine](https://docs.docker.com/machine/install-machine/) (optional)
    - Create `dev` machine: `docker-machie create -d virtualbox dev`

  ### Run from Docker Registry
  An automated build repository is [available](https://registry.hub.docker.com/u/strictlybusiness/fda-food-recalls/)
  - `docker run -p 8000:8000 strictlybusiness/fda-food-recalls`
  - Open browser to `http://$(docker-machine ip dev):8000` or replace `$(docker-machine ip dev)` with your docker virtual machine's IP if not using docker-machine

  ### Build and run manually
  - `docker build -t fda-food-recalls .`
  - `docker run -p 8000:8000 fda-food-recalls`
  - Open browser to `http://$(docker-machine ip dev):8000` or replace `$(docker-machine ip dev)` with your docker virtual machine's IP if not using docker-machine

  ### Build and run using `docker-compose`
  - Install [Docker Compose](https://docs.docker.com/compose/install/)
  - Run `docker-compose up` from project root to build and run
  - Open browser to `http://$(docker-machine ip dev):8000` or replace `$(docker-machine ip dev)` with your docker virtual machine's IP if not using docker-machine

### Sauce Labs
`SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables must be set
- `CI=true gulp test:unit`
  - Run all Sauce Lab configured browsers (same as Travis CI)
  - Under Windows, you'll need to set the environment variable manually `set CI=true`
- `gulp test:unit --browsers=sl_ie_9 --reporters=saucelabs`
  - Run units tests with IE9 on Sauce Labs
  - See `sauceLabsLaunchers` variable in [`karma.conf.js`]('karma'conf.js') for all available Sauce Labs configured browsers
