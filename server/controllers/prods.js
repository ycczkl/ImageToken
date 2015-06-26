'use strict';

var mongoose = require('mongoose'),
    Product = mongoose.model('Product');

exports.addProduct = function(req, res, next) {
    var product = new Product(req.body);
    console.log(req.body);
    product.save(function(err) {
        if(err) {
            return res.jsonp(500, {
                err: "Cannot save the product"
            });

        }
        console.log('Product here? ', product);
        res.jsonp(product);
    });

};