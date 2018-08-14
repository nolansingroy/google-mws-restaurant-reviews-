# Mobile Web Specialist Certification Course
---
#### _Stage Two Restaurant Reviews_

##  Overview
This project is for the Mobile Web Specialist course from Udacity and has the following features.

* Fully responsive Layout
  * Using Grid System
* A restaurant listings page
* A restaurant info page
* Accessibility updates
* Performance Updates
  * Critical rending inline css
  * Lazy Observer for offscreen images
  * Compression of files
  * Uses Babel.js to convert ES6 to ES5 for better browser compatibility   
* Service worker for offline browsing
* Caching using IndexedDB
* Gulp build
* Other rubric requirements


### Setup
1. clone project
```
https://github.com/nolansingroy/mws-restaurant-phase-1
```
2. Install project dependencies
```
$ npm install || npm install --save-dev
```

* note: the package _gulp-responsive_ may require you to have libvips and sharps installed depending on your OS! Please check out these links to install them correctly
[sharps](http://sharp.dimens.io/en/stable/install/)
[libvips](https://github.com/jcupitt/libvips/wiki/Build-for-macOS)
[node-gyp](https://github.com/nodejs/node-gyp)

3. Gulp Commands
If not installed already ```npm i gulp ```
else
```
$ gulp clean -- destroys the /dist folder
$ gulp build -- compiles img and js
$ gulp serve -- runs the project at localhost:3000
```
* note you should have the server running
[Server](https://github.com/udacity/mws-restaurant-stage-2)

* To perform an Audit open chrome dev tools Light House Application


### Requirements
* nodejs
* gulp.js
* sails.js to run external server
