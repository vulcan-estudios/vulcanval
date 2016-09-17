const jquery = require('jquery');
const medium = require('../jquery');

// Replace local jQuery module with the node module jQuery.
medium.jQuery = jquery;

// Require the library.
require('./index');
