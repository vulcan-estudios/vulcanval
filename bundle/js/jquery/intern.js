'use strict';

var jquery = require('jquery');
var medium = require('../jquery');

// Replace local jQuery module with the node module jQuery.
medium.jQuery = jquery;

// Require the library.
require('./index');