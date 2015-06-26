'use strict';

var Busboy = require('busboy'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Product = mongoose.model('Product');

exports.upload = function (req, res, next) {
    console.log('got req');
    console.log(req.headers);
    var busboy = new Busboy({headers: req.headers });

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var fstream;
        console.log(filename);
        var tar_file = __dirname + '/../images/' + filename;
        //this is for local test. We store img in local disk
        var local_url = 'http://localhost:3000/packages/img-token/server/images/' + filename;
        console.log(local_url);
        fstream = fs.createWriteStream(tar_file);
        file.pipe(fstream);
        // fininsh complete current transfer, close is all
        fstream.on('close', function () {
            res.send({ status: '200: Image transfered',
                name: filename,
                url: tar_file,
                local_url: local_url});
        });

        // Add to database
        Product.update({name: "DizzyGun"}, {$push: {images: tar_file}}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log('push success!');
        });
    });
    return req.pipe(busboy);
};



