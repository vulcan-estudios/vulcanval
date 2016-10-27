'use strict';

var jquery = require('jquery');
var external = require('../external');

// Replace local jQuery module with the node module jQuery.
external.jQuery = jquery;

// Require the library.
require('./index');