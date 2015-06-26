'use strict';

var uploads = require('../controllers/uploads'),
    products = require('../controllers/prods');

// The Package is past automatically as first parameter
module.exports = function(ImgToken, app, auth, database) {

    app.get('/imgToken/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/imgToken/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/imgToken/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/imgToken/example/render', function(req, res, next) {
        ImgToken.render('index', {
            package: 'img-token'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });

    app.post('/imgToken/upload-image', uploads.upload);
    app.post('/imgToken/addProduct', products.addProduct);

};
