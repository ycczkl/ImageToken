'use strict';
angular.module('mean.img-token', ['angularFileUpload']).controller('ImgTokenController', ['$scope', 'Global', 'ImgToken', '$http', '$timeout', '$upload',
    function ($scope, Global, ImgToken, $http, $timeout, $upload) {

    .directive('crop', [function () {
        return {
            restrict: 'E',
            templateUrl: 'img-token/views/img-crop.html',
            scope: {
                width: '=',
                height: '=',
                ngShow: '='
            },
            controller: ['$scope', 'Global', 'ImgToken', '$http', '$timeout', '$upload', function ($scope, Global, ImgToken, $http, $timeout, $upload) {
                //if show dropzone
                $scope.imgNums = 0;
                var setImgNums = true;
                //set http method
                $scope.httpmethod = 'POST';
                //set send method: 1.Multupart/form-data. 2.base64 data.
                //Here we only use method 1
                $scope.howToSend = 1;

                $scope.global = Global;
                //control if show the upload button
                $scope.if_uploaded_crop_img = true;
                //Image Array
                $scope.imgArray = [];

                $scope.package = {
                    name: 'img-token'
                };
                $scope.fileReaderSupported = window.FileReader != null;
                $scope.uploadRightAway = true;
                $scope.changeAngularVersion = function () {
                    window.location.hash = $scope.angularVersion;
                    window.location.reload(true);
                };
                $scope.hasUploader = function (index) {
                    return $scope.upload[index] != null;
                };
                $scope.abort = function (index) {
                    $scope.upload[index].abort();
                    $scope.upload[index] = null;
                };
                $scope.angularVersion = window.location.hash.length > 1 ? window.location.hash.substring(1) : '1.2.0';

                $scope.onFileSelect = function ($files) {
                    $scope.imgNums++;

                    $scope.selectedFiles = [];
                    $scope.progress = [];
                    if ($scope.upload && $scope.upload.length > 0) {
                        for (var i = 0; i < $scope.upload.length; i++) {
                            if ($scope.upload[i] != null) {
                                $scope.upload[i].abort();
                            }
                        }
                    }
                    $scope.upload = [];
                    $scope.uploadResult = [];
                    $scope.selectedFiles = $files;
                    $scope.dataUrls = [];


                    for (var i = 0; i < $files.length; i++) {
                        console.log('the length of files are :' + $files.length);
                        var $file = $files[i];
                        console.log($file);
                        if (window.FileReader && $file.type.indexOf('image') > -1) {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL($files[i]);
                            var loadFile = function (fileReader, index) {
                                fileReader.onload = function (e) {
                                    $timeout(function () {

                                        $scope.dataUrls[index] = e.target.result;
                                        $scope.base64 = e.target.result;

                                        console.log($scope.imgArray);
                                    });
                                }
                            }(fileReader, i);
                        }
                        $scope.progress[i] = -1;
                        if ($scope.uploadRightAway) {
                            $scope.start(i);
                        }
                    }
                };

                $scope.start = function (index) {
                    $scope.progress[index] = 0;
                    $scope.errorMsg = null;

                    if ($scope.howToSend == 1) {
                        $scope.upload[index] = $upload.upload({
                            url: '/imgToken/upload-image',
                            method: $scope.httpMethod,
                            headers: {'my-header': 'my-header-value'},
                            data: {
                                myModel: $scope.myModel
                            },

                            file: $scope.selectedFiles[index],
                            fileFormDataName: 'myFile'
                        });
                        $scope.upload[index].then(function (response) {

                            $scope.local_url = response.data.local_url;
                            //pass url from here
                            $timeout(function () {
                                $scope.uploadResult.push(response.data);
                            });
                        }, function (response) {

                            if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            // Math.min is to fix IE which reports 200% sometimes
                            $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        });
                        $scope.upload[index].xhr(function (xhr) {
//				xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
                        });
                    } else {
                        var fileReader = new FileReader();
                        fileReader.onload = function (e) {
                            $scope.upload[index] = $upload.http({
                                url: '/imgToken/upload-image',
                                headers: {'Content-Type': $scope.selectedFiles[index].type},
                                data: e.target.result
                            }).then(function (response) {
                                $scope.uploadResult.push(response.data);
                            }, function (response) {
                                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                            }, function (evt) {
                                // Math.min is to fix IE which reports 200% sometimes
                                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                            });
                        }
                        fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
                    }
                };

                $scope.dragOverClass = function ($event) {
                    var items = $event.dataTransfer.items;
                    var hasFile = false;
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].kind == 'file') {
                                hasFile = true;
                                break;
                            }
                        }
                    } else {
                        hasFile = true;
                    }
                    return hasFile ? "dragover" : "dragover-err";
                };

                //show dropzone or not
                $scope.showDropZone = function () {
                    if ($scope.imgNums % 2 === 0) {
                        setImgNums = true;
                        //show drop zone not show crop zone
                        return true;
                    } else {
                        if (setImgNums == true) {
                            setImgNums = false;

                            $timeout(function () {

                                angular.element('#setCropFunction').triggerHandler('click');

                            }, 10);

                        }
                        return false;
                    }
                };

                //uoload cropped image
                $scope.upload_cropedimg = function () {

                    //control if show drop zone
                    $scope.imgNums++;

                    //set base64 data empty
                    $scope.base64 = null;

                    //get crop data
                    var sx = document.getElementById('crop_x').innerHTML,
                        sy = document.getElementById('crop_y').innerHTML,
                        sw = document.getElementById('crop_w').innerHTML,
                        sh = document.getElementById('crop_h').innerHTML;
                    var originUri = $scope.local_url;
                    //creat new image
                    var imageObj = new Image();
                    imageObj.src = originUri;
                    var canvas = document.createElement('canvas');
                    //Define canvas width and height
                    var width = document.getElementsByTagName('crop')[0].getAttribute('width'),
                        height = document.getElementsByTagName('crop')[0].getAttribute('height');
                    canvas.width = width;
                    canvas.height = height;

                    //trigger click
                    $timeout(function () {
                        angular.element('#test_destory').triggerHandler('click');
                    }, 0);

                    imageObj.onload = function () {
                        // Copy the image contents to the canvas
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(imageObj, sx, sy, sw, sh, 0, 0, width, height);
                        //base 64 data

                        canvas.toBlob(
                            function (blob) {

                                // Do something with the blob object,
                                // e.g. creating a multipart form for file uploads:
                                var formData = new FormData(),
                                    fileName = 'testImg';
                                var d = new Date();
                                var n = d.getMilliseconds();
                                formData.append('file', blob, 'cropedImg' + n + '.png');
                                $http.post("/imgToken/upload-image", formData, {
                                    withCredentials: true,
                                    headers: {'Content-Type': undefined },
                                    transformRequest: formData
                                }).success(function(data, status){
                                    console.log(data.local_url);
                                    var imgObj = {};
                                    imgObj.name = data.name;
                                    imgObj.url = data.local_url;
                                    $scope.imgArray.push(imgObj);
                                    console.log($scope.imgArray[0]);
                                    $scope._Index = $scope.imgArray.length - 1;
                                });


                            },
                            'image/jpeg'
                        );
                        $scope.if_uploaded_crop_img = false;
                        document.getElementById('crop_x').innerHTML = '';
                        document.getElementById('crop_y').innerHTML = '';
                        document.getElementById('crop_w').innerHTML = '';
                        document.getElementById('crop_h').innerHTML = '';

                    };

                };

                // initial image index
                $scope._Index = 0;

                // if a current image is the same as requested image
                $scope.isActive = function (index) {
                    return $scope._Index === index;
                };

                // show prev image
                $scope.showPrev = function () {
                    $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.imgArray.length - 1;
                };

                // show next image
                $scope.showNext = function () {
                    $scope._Index = ($scope._Index < $scope.imgArray.length - 1) ? ++$scope._Index : 0;
                };

                // show a certain image
                $scope.showPhoto = function (index) {
                    $scope._Index = index;
                };

            }],
            link: function (scope, elements, attrs) {               
                scope.$watch('base64', function (newValue) {
                    if (newValue) {
                        console.log(newValue);
                        $('.crop_me').jWindowCrop({
                            targetWidth: scope.width,
                            targetHeight: scope.height,
                            loadingText: '',
                            onChange: function (result) {
                                $('#crop_x').text(result.cropX);
                                $('#crop_y').text(result.cropY);
                                $('#crop_w').text(result.cropW);
                                $('#crop_h').text(result.cropH);
                            }
                        });
                    }
                });
            }
        };
    }]);

