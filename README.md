##SBCS Process
SBCS uses an iterative development process.  The overall guiding principles of our process are:
-	Frequent releases   
-	Customer Priorities
-	Transparent development process
-	Continuous integration and testing
-	Self forming teams 
-	Desired functionality 

SBCS employees acted as “customers” to define the functionality and perform user testing.  
The release schedule was reduced from 1-3 week cycles to  1-3 day(s).   Customers were notified with each build and performed continous user testing. On-going feedback gathered in daily stand up meetings.

Online backlog etc was maintained in Trello, used to manage lists of cards.  Our Trello board was exported to JSON and stored in the project repository. The actual trello board is viewable at https://trello.com/b/4s6rYtpy .

Lists in the Trello board organize the following:
-	Backlog
-	Issues
-	Feedback
-	Features in each release
-	Project Management

# Project Lead & Team
Mark Miller is the Project Manager of this effort. He was responsibility identifying the resources necessary to complete the work.  Staff was made available as needed to ensure the implementation would accurately reflect our capabilities.    The remainder of the team was self formed based on recommendations of the technical architect.  Inadditional to the Technical Architect, SBCS used front and backend web developers, and a Dev Ops Engineer.  Attachment C shows the breakdown of hours allowcated to each role.  The hours for Project Manager and the "Customers" are not included in Attachment C for Pool 2.  Mr. Miller spent 42 hours on this effort as the PM and the "customers" spent a total of 54 labor hours, reviewing, testing and meeting.



# FDA Food Recalls [![Build Status](https://travis-ci.org/StrictlyBusiness/fda-food-recalls.svg?branch=develop)](https://travis-ci.org/StrictlyBusiness/fda-food-recalls)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/techniq.svg)](https://saucelabs.com/u/techniq)

## Development
- Install [Node](https://nodejs.org/)
- `npm install`
  - Install all npm and jspm dependencies
- `npm run develop` (or `gulp serve`)
  - Starts Browsersync and continuously monitors for changes and inject the styles or reload the browser
  - `gulp serve` requires  gulp to be installed globally (`npm install -g gulp`)
- `npm start`
  - Starts Browsersync and serves the production (concatenated/minified) assets
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

### Sauce Labs
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



## Deploying
Travis CI is configured to automatically deploy to Github Pages ([gh-pages](tree/gh-pages) branch) on all success commits to the `master` branch.  Travis CI will use the environment variable `GH_TOKEN` to push to Github Pages (configured as a secure environment variable).

If you would like to deploy directly from your local build, you can run `gulp deploy`.  You must be using SSH keys for git/Github authentication.

## Iterative Approach
The compressed schedule of this effor had the team releasing updated every 1-3 days, customers were notified when new build completed and performed continous user testing.  Daily stand up meetings were held to gather customer feedback and adjust the priorities of the backlog.
