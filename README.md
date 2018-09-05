# Mobile Web Specialist Certification Course
---
#### _Stage Three Restaurant Reviews_

##  Overview
This project is for the Mobile Web Specialist course from Udacity and has the following features.

* Fully responsive Layout
  * Using Grid System
* A restaurant listings page
* A restaurant info page
* Accessibility updates
* Performance Updates
  * Showmap button
  * Critical rending inline css
  * Lazy Observer for offscreen images
  * Compression of files
  * Uses Babel.js to convert ES6 to ES5 for better browser compatibility   
* Service worker for offline browsing
* Caching using IndexedDB
  * restaurant DB
    * restaurants objectStore
    * OfflineReviews objectStore
    * Reviews objectStore filtered by restaurant_id index
* Gulp build
* Light House Audit Scores
  * PWA > 90
  * Performance > 90
  * Accessibility > 90

* Responsive Design
  * Form to add a review
  * control to mark restaurant as favorite
* Offline Use
  * user is able to make post offline stored in DB to be sent when onLine
  * Pages that were visit are cached for offline revisits
* Other rubric requirements


### Setup
1. clone project
```
$ git clone https://github.com/nolansingroy/google-mws-restaurant-reviews-.git

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
[Server](https://github.com/udacity/mws-restaurant-stage-3)

* To perform an Audit open chrome dev tools Light House Application


### Requirements
* nodejs
* gulp.js
* sails.js to run external server
