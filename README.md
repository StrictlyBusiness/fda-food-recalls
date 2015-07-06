##SBCS Process
SBCS uses an iterative development process. Depending on the customer and complexity of the project, particular details of our methods are used. The overall guiding principles of our process are:
-	Frequent releases of working software to the customer for evaluation.  
-	Engage end users to gather feedback 
-	Customer feedback and priorities determine the way forward
-	Transparent development process – Customer has access to the online development folder
-	Continuous integration and automation of testing
-	Self forming teams – To the extent possible let the technical lead pick his/her team
-	Focus on desired functionality 

Without any real customers, other SBCS employees acted as “customers” to define the functionality and evaluate the releases.  Requirements were created based on information in the RFQ.  
The release schedule was reduced from every 1-3 weeks to every 1-3 days.   Customers were notified every time a new build was created, allowing for on-going feedback and usability testing. 
Initially we had hoped to submit our work for all three pools but based on the Q&A, that is not permitted.  Our work is being submitted against pool 2.

Our backlog and development cards were documented and maintained with Trello, an online system for managing lists of cards, on a board.  Our Trello board was exported to JSON and stored in the project repository. Alternatively the actual trello board is viewable at https://trello.com/b/4s6rYtpy .

Lists in the Trello board organize the following:
-	The backlog
-	Any Issues
-	User Feedback
-	Currently sprint/iteration activity
-	Features included in each release
-	Project Management (RFQ Submission details)

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
