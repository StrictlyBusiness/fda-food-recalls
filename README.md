# FDA Food Recalls [![Build Status](https://travis-ci.org/StrictlyBusiness/fda-food-recalls.svg?branch=develop)](https://travis-ci.org/StrictlyBusiness/fda-food-recalls)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/techniq.svg)](https://saucelabs.com/u/techniq)

The working prototype is available at http://strictlybusiness.github.io/fda-food-recalls.

# Description
The following sections describe the process and disclose the required evidence laid out in
Attachment E. This section and the lettered sections below are considered the description
which is limited to 750 words maximum.

## A. SBCS Process
SBCS uses an iterative development process.  The overall guiding principles of our process are:
-	Frequent releases
-	Customer priorities
-	Transparency
-	Continuous integration
-	Self forming teams
-	Desired functionality

SBCS employees acted as “customers” to define the functionality and perform user testing.  
The release schedule was reduced from 1-3 week cycles to 1-3 day(s). Customers were notified with each build and performed continuous user testing. On-going feedback gathered in daily stand up meetings.

Our backlog, active tasks, and completed tasks were maintained in Trello.  Our Trello board was exported to JSON and stored in the project repository. The Trello board is publicly viewable at https://trello.com/b/4s6rYtpy .

Lists in the Trello board organize the following:
-	Backlog
-	Issues
-	Feedback
-	Features in each release
-	Project Management

## B. Project Manager (PM) and Team
Mark Miller was the PM of this effort. He was responsibility identifying the resources necessary to complete the work.  The remainder of the team was self formed based on recommendations of the Technical Architect (TA).  In additional to the TA, front and backend web developers, and a Dev Ops Engineer were used.  Attachment C shows the breakdown of hours allocated to each role.  The hours for PM and the "Customers" are not included in Attachment C for Pool 2.  Mr. Miller spent 42 hours on this effort as the PM and the "customers" spent a total of 54 labor hours, reviewing, testing and meeting.

## C. Open-Source Technologies Used
There were many open-source technologies used in our develop, including:

Build
- [Node.js 0.12.5](https://nodejs.org/)
- [Docker 1.7.0](https://www.docker.com/)
- [Gulp 3.9.0](http://gulpjs.com/)
- [JSPM 0.15.7](http://jspm.io/)
- [Babel 5.1.13](https://babeljs.io/)

Client Frameworks
- [AngularJS 1.4.1](https://angularjs.org/)
- [AngularUI Router 0.2.15](https://github.com/angular-ui/ui-router)
- [Bootstrap 3.3.5](http://getbootstrap.com/)
- [Font Awesome 4.3.0](http://fortawesome.github.io/Font-Awesome/)
- [d3 Data-Driven Documents 3.5.5](http://d3js.org/)
- [Moment.js 2.10.3](http://momentjs.com/)
- [Bluebird 2.9.30](https://github.com/petkaantonov/bluebird)
- [Angular Loading Bar 0.8.0](https://chieffancypants.github.io/angular-loading-bar/)

Test
- [Karma 0.12.37](http://karma-runner.github.io/0.12/index.html)
- [Mocha 2.2.5](http://mochajs.org/)

## D. Deployment of Prototype
Travis CI (https://travis-ci.org/StrictlyBusiness/fda-food-recalls) is configured to automatically deploy to Github Pages ([gh-pages](tree/gh-pages) branch) on all successful commits to the `master` branch. This results in the prototype being deployed to http://strictlybusiness.github.io/fda-food-recalls on a successful build of the `master` branch.

## E. Unit Tests
Unit tests were developed for key classes. They are executed as part of the build process. Test classes end with the extension \*.test.js and are in the same folder as the class being tested (\*.js extension).

If you have the prototype installed locally, you can run the tests using `npm test`.

## F. Continuous Integration
- Sean
-
## G. Configuration Management
GitHub was used for CM - the branch structure used across the team was kept simple, a master and development branch for developers and a deployment branch (gh-pages)  

## H. Continuous Monitoring
Security risks were minimized by making it a data search/filtering application.  No FDA data is updated by this site.  Google Analytics was added to monitor activity on the site. GitHub also monitors the hosting facility for denial of service type attacks.
SEAN

## I. Deployment in Docker Containers
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

## J. Iterative Approach
The compressed schedule of this effort had the team releasing updated every 1-3 days, customers were notified when new build completed and performed continuous user testing.  Daily stand up meetings were held to gather customer feedback and adjust the priorities of the backlog.

## K. Installation
Use the following instructions to install the prototype locally:

- Install [Node](https://nodejs.org/)
- `npm install`
  - Install all npm and jspm dependencies
- `npm start`
  - Starts BrowserSync and serves the production (concatenated/minified) assets
- Open browser to `http://localhost:8000`

To run locally in a docker container, follow these instructions:

- Install Docker Engine ([Mac](https://docs.docker.com/machine/install-machine/) / [Windows](https://docs.docker.com/installation/windows/))
  - Follow instructions to install Boot2Docker, which includes VirtualBox, Docker Client, Git, and the boot2docker Linux ISO
- Install [Docker Machine](https://docs.docker.com/machine/install-machine/) (optional)
  - Create `dev` machine: `docker-machine create -d virtualbox dev`
- An automated build repository is [available](https://registry.hub.docker.com/u/strictlybusiness/fda-food-recalls/)
- `docker run -p 8000:8000 strictlybusiness/fda-food-recalls`
- Open browser to `http://$(docker-machine ip dev):8000` or replace `$(docker-machine ip dev)` with your docker virtual machine's IP if not using docker-machine

## L. License
This prototype is licensed under the MIT license available [here](LICENSE).

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

### Sauce Labs
`SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables must be set
- `CI=true gulp test:unit`
  - Run all Sauce Lab configured browsers (same as Travis CI)
  - Under Windows, you'll need to set the environment variable manually `set CI=true`
- `gulp test:unit --browsers=sl_ie_9 --reporters=saucelabs`
  - Run units tests with IE9 on Sauce Labs
  - See `sauceLabsLaunchers` variable in [`karma.conf.js`]('karma'conf.js') for all available Sauce Labs configured browsers
