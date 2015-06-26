'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Product Schema
 */

var ProductSchema = new Schema({
    name: {
        type: String
    },
    images: []
});

module.exports = mongoose.model('Product', ProductSchema);