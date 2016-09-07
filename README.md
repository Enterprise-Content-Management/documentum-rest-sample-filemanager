# Documentum REST Services Angular File Manager Sample

The project customizes [Angular File Manager](https://github.com/joni2back/angular-filemanager) to demonstrate the AngularJS application development for Documentum REST Services. 

Different with [Angular File Manager](https://github.com/joni2back/angular-filemanager),  we customized the API javascript in the project to make direct access to Documentum REST Services. This is more efficient with respect to the data transfer.

## 1. Project dependencies

* [NodeJS](https://nodejs.org/) is used to run the app on a server.
* [AngularJS](https://angularjs.org/) is used as the frontend framework.
* [Gulp](http://gulpjs.com/) jobs for development, building, emulating, running your app, compiles and concatenates Sass files, local development server with live reload.

##### Tip
>  You don't need to setup anything at this moment, please keep patience to follow next sections to install software.

## 2. Getting started

#### Preparation

* Assumed that you have Documentum Content Server 7.1+ up and running
* Enable [CORS](https://www.w3.org/TR/cors/) support in Documentum REST Services 7.3 by customizing `dctm-rest.war\WEB-INF\classes\rest-api-runtime.properties`, and deploy the WAR.
```
#
# Copyright (c) 2016. EMC Corporation. All Rights Reserved.
#

# Sets user defined runtime properties below. Settings in this file override the default ones defined in specific
# libraries. Please refer to file 'rest-api-runtime.properties.template' for available runtime configurations.

rest.cors.enabled=true
```

> CORS support is built-in in Documentum REST Services 7.3. For previous versions, you need to seek an outside solution, for instance, [node-http-proxy](https://github.com/nodejitsu/node-http-proxy).

#### Build and Run
* If you don't have [NodeJS](https://nodejs.org/) installed yet, download and install it.
>   NodeJS 4.x is recommended. You might run into build errors using NodeJS 5.x.
* If you don't have [Git](https://git-scm.com/) installed yet, download and install it.
* If you don't have [bower](http://bower.io/) installed yet, run below CLI command to install it:
```bash 
> npm install -g bower
```
* If you don't have [gulp](http://gulpjs.com/) installed yet, run below CLI command to install it:
```bash
> npm install -g gulp
```
* Clone the project to you local workspace and navigate to the project home directory 
* Run below CLI commands in sequence to build the project:
```bash
> npm install --save-dev
> bower install
> gulp
```
* Run below CLI to start the SPA in a local web server (default port to 3000):
```bash
> gulp serve
```
Your web browser will be promoted to access the URL `http://localhost:3000`. If it did not get promoted, try to manually access this URL in your web browser.
> Goole Chrome and Mozilla Firefox are recommended. Microsoft Internet Explorer does not has the full support for HTML5 features demonstrated in this app.


## 3. Demo


## 4. Feature Overview

### 4.1 Sign in and sign out
This sample application implements a very simple sign-in and sign-out process based on HTTP basic authentication. 
> Code sample at src/app/filemanager/services/dctm.auth.js 

