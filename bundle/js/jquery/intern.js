'use strict';

var mock = require('mock-require');
var jquery = require('jquery');

// Replace local jQuery module with the node module jQuery.
mock('../jquery', jquery);

// Require the library.
require('./index');