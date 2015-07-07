# FDA Food Recalls [![Build Status](https://travis-ci.org/StrictlyBusiness/fda-food-recalls.svg?branch=master)](https://travis-ci.org/StrictlyBusiness/fda-food-recalls)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/techniq.svg)](https://saucelabs.com/u/techniq)

The working prototype is available at https://strictlybusiness.github.io/fda-food-recalls.

# Overview
This project was created as a response to 18f's RFQ 4QTFHS150004. The prototype allows users on a month by month basis to review food recalls and graphically view the origin and distribution of these recalled products. It also provides basic filtering and allows users to view the details for each recall at the bottom of the page.

# Development Process
Mark Miller was assigned responsibility for this project as the Project Manager (PM). The remainder of the team was self formed based on recommendations of the Technical Architect. A Frontend Web Developer, Backend Web Developer, and a DevOps Engineer were also utilized. Attachment C shows the breakdown of hours allocated to each role. The hours for PM and the "customers" (other SBCS employees not directly involved with development) are not included in Attachment C.  Mr. Miller spent 42 hours on this effort as the PM and the "customers" spent a total of 54 labor hours, reviewing, testing and meeting.

At [SBCS](http://www.sbcs.com), we approach each project in an iterative fashion. This iterative process involves working with the customers (in this case other SBCS employees) to identify and prioritize tasks, execute the tasks, and then review the finished results with the customers.

Our team used a Trello board (available at https://trello.com/b/4s6rYtpy) to define, assign, and organize tasks. It was also used to identify issues and track other project related information. The board served as the central discussion point in our daily stand-up meetings. The team had to maintain their normal workload while working on this project so communication was critical. Our Trello board was exported to [JSON](docs/trello.json) and stored in the project repository along with several screen shots in the `docs/screenshots/trello` folder.

## Open-Source Technologies Used
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

## Unit Tests
Unit tests were developed for key classes. They are executed as part of the build process. Test classes end with the extension `\*.test.js` and are in the same folder as the class being tested (`\*.js` extension).

If you have the prototype installed locally, you can run the tests using `npm test`.

## Configuration Management
GitHub was used for configuration management. The team used [GitFlow](http://nvie.com/posts/a-successful-git-branching-model/) as the core branching strategy. A special branch called `gh-pages` was used for the GitHub Pages, where the public demo is [available](https://strictlybusiness.github.io/fda-food-recalls).

## Continuous Integration
Tests are run automatically after all commits to GitHub via a webhook to Travis CI and are run against the following browsers: Chrome (latest), Firefox (latest), IE9-11, and mobile Safari 7.1 and 8.2 on both an iPhone and iPad simulators using SauceLabs hosted browsers (open source license).

## Continuous Deployment
During active development, Travis CI (https://travis-ci.org/StrictlyBusiness/fda-food-recalls) was configured to automatically deploy to GitHub Pages (`gh-pages` branch) on all successful commits to the `develop` branch. This results in the prototype being deployed to https://strictlybusiness.github.io/fda-food-recalls where changes could be immediately reviewed and feedback provided. Now that the prototype is complete, this has been changed to trigger on the `master` branch for official releases.

## Continuous Monitoring
Security risks were minimized by making it a data search/filtering application. No FDA data is updated by this site. Google Analytics was added to monitor activity on the site (see [index.html](index.html#L54)). GitHub also [monitors](https://status.github.com) the hosting facility for denial of service type attacks.

## Installation
Use the following instructions to install the prototype locally:

- Install [Node](https://nodejs.org/)
- Checkout the source from https://github.com/StrictlyBusiness/fda-food-recalls
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

Additional installation options and commands are available. See the [INSTRUCTIONS.md](INSTRUCTIONS.md) file for details.

## License
This prototype is licensed under the MIT license available [here](LICENSE).
