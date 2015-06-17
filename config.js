System.config({
  "baseURL": "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.4.1",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@0.13.0",
    "angular-mocks": "github:angular/bower-angular-mocks@1.4.1",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "babel": "npm:babel-core@5.5.8",
    "babel-runtime": "npm:babel-runtime@5.5.8",
    "bluebird": "npm:bluebird@2.9.30",
    "core-js": "npm:core-js@0.9.17",
    "fortawesome/font-awesome": "github:fortawesome/font-awesome@4.3.0",
    "text": "github:systemjs/plugin-text@0.0.2",
    "twbs/bootstrap-sass": "github:twbs/bootstrap-sass@3.3.5",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.1"
    },
    "github:angular/bower-angular-mocks@1.4.1": {
      "angular": "github:angular/bower-angular@1.4.1"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.5.8": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:bluebird@2.9.30": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.17": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});

