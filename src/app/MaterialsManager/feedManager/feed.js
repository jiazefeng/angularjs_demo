angular.module('robot.feed', [
    'robot.feed.mock',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.feed', {
            url: '/feed',
            bookname: '饲料列表',
            parentsname: '物资管理',
            views: {
                'content': {
                    controller: 'feedController',
                    templateUrl: 'MaterialsManager/feedManager/feed.tpl.html',
                    resolve: {
                        feedListData: ['$http', function ($http) {
                            return $http.get('/feed/getFeedInfoList')
                        }]
                    },
                },
            }
        });
    }])
    .controller('feedController', ['$scope', '$http', 'feedListData', '$modal', '$uibModal',
        function ($scope, $http, feedListData, $modal, $uibModal) {
            $scope.data = feedListData.data;
            $scope.maxSize = 6; //当最大页数大于10的时候，隐藏部分分页

            $scope.commitCont = function (form) {
                var params = {
                    "index": $scope.data.page
                }
                $http.post('/user/searchUserByItem', params).success(function (result) {
                    $scope.data = result;
                }).error(function (msg) {
                    errorHint('网络异常，请稍后重试!!!');
                });

            };

            //删除数据
            $scope.delete = function (data, index) {
                var confirmModal = $modal({
                    title: '系统提示',
                    content: '确定要删除吗？',
                    template: 'home/confirmModal.tpl.html',
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false,
                    scope: $scope
                });
                $scope.confirm = function () {
                    $http.delete('/ranchingType/deleteRanchingType/' + data.rtId).success(function (result) {
                        if (result.error) {
                            errorHint(result.error);
                            return false;
                        } else {
                            $scope.data.ranchingTypeList.splice(index, 1);
                        }
                    }).error(function (msg) {
                        errorHint('网络异常，请稍后重试!!!');
                    });
                    confirmModal.$promise.then(confirmModal.hide);
                };
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

            //添加/修改畜牧种类
            $scope.openModal = function (size, id, index) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'farm/ranchingType/addRanchingType.tpl.html',
                    size: size,
                    controller: 'addRanchingTypeModalInstanceCtrl',
                    resolve: {
                        ranchingTypeData: ['$http', '$stateParams', function ($http, $stateParams) {
                            return $http.get('/ranchingType/searchRanchingTypeById/' + id);
                        }],
                        dataList: ['$http', '$stateParams', function ($http, $stateParams) {
                            var oldData = {
                                data: $scope.data,
                                index: index
                            }
                            return oldData;
                        }]
                    }

                });
            }
        }])


    .controller('addRanchingTypeModalInstanceCtrl', ['$modal', '$scope', '$uibModalInstance', '$http', 'ranchingTypeData', '$state', 'dataList', 'ApiBaseUrl', '$timeout',
        function ($modal, $scope, $uibModalInstance, $http, ranchingTypeData, $state, dataList, ApiBaseUrl, $timeout) {
            $scope.data = ranchingTypeData.data;

            $scope.modalTitle = "添加种类";
            if ($scope.data.ranchingType) {
                $scope.modalTitle = "编辑种类";
                //所属种类赋值
                if($scope.data.ranchingTypeList){
                    for (var i = 0; i < $scope.data.ranchingTypeList.length; i++) {
                        if ($scope.data.ranchingTypeList[i].id == $scope.data.ranchingType.rtParentId) {
                            $scope.data.ranchingTypeInfo = $scope.data.ranchingTypeList[i];
                        }
                    }
                    ;
                }
            }
            ;
            var uploader;
            $timeout(function () {
                var $list = $('#fileList');
                // 优化retina, 在retina下这个值是2
                ratio = window.devicePixelRatio || 1;
                // 缩略图大小
                thumbnailWidth = 100 * ratio;
                thumbnailHeight = 100 * ratio;
                // Web Uploader实例
                // 初始化Web Uploader
                uploader = WebUploader.create({
                    // 自动上传。
                    auto: true,
                    // 文件接收服务端。
                    server: ApiBaseUrl + 'file/upload/uploadImg',
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
                uploader.on('fileQueued', function (file) {
                    var $li = $(
                            '<div id="' + file.id + '" class="file-item thumbnail">' +
                            '<img>' +
                            '<div class="info">' + file.name + '</div>' +
                            '</div>'
                        ),
                        $img = $li.find('img');
                    $list.html($li);
                    // 创建缩略图
                    uploader.makeThumb(file, function (error, src) {
                        if (error) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }
                        $img.attr('src', src);
                    }, thumbnailWidth, thumbnailHeight);
                });

                // 文件上传过程中创建进度条实时显示。
                uploader.on('uploadProgress', function (file, percentage) {
                    var $li = $('#' + file.id),
                        $percent = $li.find('.progress span');
                    // 避免重复创建
                    if (!$percent.length) {
                        $percent = $('<p class="progress"><span></span></p>')
                            .appendTo($li)
                            .find('span');
                    }
                    $percent.css('width', percentage * 100 + '%');
                });
                // 文件上传成功，给item添加成功class, 用样式标记上传成功。
                uploader.on('uploadSuccess', function (file, response) {
                    $('#' + file.id).addClass('upload-state-done');
                    $scope.data.ranchingType.rtImge = response._raw;
                });
                // 文件上传失败，现实上传出错。
                uploader.on('uploadError', function (file) {
                    var $li = $('#' + file.id),
                        $error = $li.find('div.error');
                    // 避免重复创建
                    if (!$error.length) {
                        $error = $('<div class="error"></div>').appendTo($li);
                    }
                    $error.text('上传失败');
                });
                // 完成上传完了，成功或者失败，先删除进度条。
                uploader.on('uploadComplete', function (file) {
                    $('#' + file.id).find('.progress').remove();
                });
            }, 0);

            $scope.commitForm = function (myForm) {
                if ($('#fileList div').length > 0) {
                    uploader.upload();
                }
                if (myForm.$valid) {
                    if ($scope.data.ranchingType.rtId) {
                        //编辑
                        var updateparams = {
                            rtId: $scope.data.ranchingType.rtId,
                            rtName: $scope.data.ranchingType.rtName,
                            rtNumber: $scope.data.ranchingType.rtNumber,
                            rtImge: $scope.data.ranchingType.rtImge,
                            rtProfile: $scope.data.ranchingType.rtProfile,
                            rtParentId: $scope.data.ranchingTypeInfo ? $scope.data.ranchingTypeInfo.id : "",
                            rtLevel: $scope.data.ranchingType.rtLevel
                        }
                        $http.post('/ranchingType/editRanchingType', updateparams)
                            .success(function (result) {
                                if (result.error) {
                                    Tips(result.error);
                                    return false;
                                }
                                if (result.success) {
                                    $modal({
                                        title: '系统提示',
                                        content: result.success,
                                        show: true,
                                        animation: 'am-fade-and-scale',
                                        placement: 'center',
                                        backdrop: false,
                                        onHide: function () {
                                            dataList.data.ranchingTypeList = result.ranchingTypeList;
                                            $uibModalInstance.close();
                                        }
                                    });
                                    // return true;
                                }
                            })
                            .error(function (msg) {
                                Tips("网络异常,请稍后重试!!!");
                            });
                    } else {
                        //添加
                        var params = {
                            rtName: $scope.data.ranchingType.rtName,
                            rtNumber: $scope.data.ranchingType.rtNumber,
                            rtImge: $scope.data.ranchingType.rtImge,
                            rtProfile: $scope.data.ranchingType.rtProfile,
                            rtParentId: $scope.data.ranchingTypeInfo ? $scope.data.ranchingTypeInfo.id : "",
                            rtLevel: $scope.data.ranchingType.rtLevel
                        }
                        $http.post('/ranchingType/addRanchingType', params)
                            .success(function (result) {
                                if (result.error) {
                                    Tips(result.error);
                                    return false;
                                }
                                if (result.success) {
                                    $modal({
                                        title: '系统提示',
                                        content: result.success,
                                        show: true,
                                        animation: 'am-fade-and-scale',
                                        placement: 'center',
                                        backdrop: false,
                                        onHide: function () {
                                            dataList.data.ranchingTypeList = result.ranchingTypeList;
                                            dataList.data.count = result.count;
                                            $uibModalInstance.close();
                                        }
                                    });
                                }
                            })
                            .error(function (msg) {
                                Tips("网络异常,请稍后重试!!!");
                                //$uibModalInstance.close();
                            });
                    }
                    //return true;
                } else {
                    Tips("请填写所有信息!!!");
                    return false;
                }

            };

            var Tips = function (message) {
                $modal({
                    title: '系统提示',
                    content: message,
                    show: true,
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: false
                });
            };


            $scope.ok = function (myForm) {
                //$uibModalInstance.close();
                $scope.commitForm(myForm);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }])