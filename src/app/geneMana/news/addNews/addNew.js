angular.module('robot.addNew', [
    'robot.addNew.mock',
    'ui.router',
    'mgcrea.ngStrap.datepicker',
    'mgcrea.ngStrap.timepicker'
])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('home.addNew', {
            url: '/newInfo/addNew',
            bookname:'添加新闻',
            parentsname:'新闻管理',
            views:{
                'content':{
                    controller: 'addNewController',
                    templateUrl: 'geneMana/news/addNews/addNew.tpl.html',
                    resolve:{
                        roleInfoData:['$http','$stateParams',function($http){
                            //return $http.get('/new/addNew')
                        }]
                    }
                }
            }
        });
    }])
    .controller('addNewController', ['$modal','$scope', '$http','roleInfoData','$state','$filter','ApiBaseUrl',
        function($modal,$scope, $http,roleInfoData,$state,$filter,ApiBaseUrl) {
            var $list = $('#fileList'),
            // 优化retina, 在retina下这个值是2
                ratio = window.devicePixelRatio || 1,
            // 缩略图大小
                thumbnailWidth = 100 * ratio,
                thumbnailHeight = 100 * ratio,
            // Web Uploader实例
                uploader;
            // 初始化Web Uploader
            uploader = WebUploader.create({
                // 自动上传。
                auto: true,
                // 文件接收服务端。
                server: ApiBaseUrl+'file/upload/uploadImg',
                //server: 'http://localhost:8080/file/upload/uploadImg',
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#filePicker',
                // 只允许选择文件，可选。
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                }
            });

            // 当有文件添加进来的时候
            uploader.on( 'fileQueued', function( file ) {
                var $li = $(
                        '<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<img>' +
                        '<div class="info">' + file.name + '</div>' +
                        '</div>'
                    ),
                    $img = $li.find('img');
                $list.html( $li );
                // 创建缩略图
                uploader.makeThumb( file, function( error, src ) {
                    if ( error ) {
                        $img.replaceWith('<span>不能预览</span>');
                        return;
                    }
                    $img.attr( 'src', src );
                }, thumbnailWidth, thumbnailHeight );
            });

            // 文件上传过程中创建进度条实时显示。
            uploader.on( 'uploadProgress', function( file, percentage ) {
                var $li = $( '#'+file.id ),
                    $percent = $li.find('.progress span');
                // 避免重复创建
                if ( !$percent.length ) {
                    $percent = $('<p class="progress"><span></span></p>')
                        .appendTo( $li )
                        .find('span');
                }
                $percent.css( 'width', percentage * 100 + '%' );
            });
            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on( 'uploadSuccess', function( file,response) {
                $( '#'+file.id ).addClass('upload-state-done');
                $scope.data.img = response._raw;
            });
            // 文件上传失败，现实上传出错。
            uploader.on( 'uploadError', function( file ) {
                var $li = $( '#'+file.id ),
                    $error = $li.find('div.error');
                // 避免重复创建
                if ( !$error.length ) {
                    $error = $('<div class="error"></div>').appendTo( $li );
                }
                $error.text('上传失败');
            });
            // 完成上传完了，成功或者失败，先删除进度条。
            uploader.on( 'uploadComplete', function( file ) {
                $( '#'+file.id ).find('.progress').remove();
            });

            var back = function () {
                $state.go("home.newInfo");
            };

            var errorHint = function (message) {
                $modal({
                    title: '系统提示',
                    content: message,
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false
                });
            };

            var successHint = function (message, method) {
                $modal({
                    title: '系统提示',
                    content: message,
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false,
                    onHide: method
                });
            };

            var httpFunction = function (url, params) {
                $http.post(url, params)
                    .success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            successHint(result.success, back);
                        }
                    })
                    .error(function (msg) {
                        errorHint('网络异常，请稍后重试!!!');
                        return false;
                    });
            };

            $scope.commitForm = function(myForm){
                if($('#fileList div').length > 0){
                    uploader.upload();

                }
                if(myForm.$valid){
                    var params = {
                        newTitle: $scope.data.newTitle,
                        newTime:$scope.data.newTime,
                        newOther: $scope.data.newOther,
                        newContent:$scope.data.newContent,
                        newIntro: $scope.data.img,
                        newLink: $scope.data.newLink
                    }
                    httpFunction('/newsInfo/addNew', params);
                    return true;
                }else{
                    errorHint('请正确填写所有信息!!!');
                    return false;
                }
            };

        }])

