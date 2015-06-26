'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var ImgToken = new Module('img-token');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
ImgToken.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    ImgToken.routes(app, auth, database);
    ImgToken.aggregateAsset('css','imgToken.css');
    ImgToken.angularDependencies(['angularFileUpload']);
    //We are adding a link to the main menu for all authenticated users
    ImgToken.menus.add({
        title: 'imgToken example page',
        link: 'imgToken example page',
        roles: ['authenticated'],
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    ImgToken.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    ImgToken.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    ImgToken.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return ImgToken;
});
