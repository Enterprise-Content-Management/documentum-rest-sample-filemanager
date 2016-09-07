(function(angular) {
    'use strict';
    angular.module('dctmNgFileManager')
    .controller('ModalFileManagerCtrl', 
        ['$scope', '$rootScope', 'fileManagerConfig', 'fileNavigator', function($scope, $rootScope, fileManagerConfig, FileNavigator) {

        $scope.reverse = false;
        $scope.predicate = ['model.type', 'model.name'];
        $scope.fileNavigator = new FileNavigator();
        $rootScope.selectedModalPath = [];
        $rootScope.selectedModalObject = {};

        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate[1] === predicate) ? !$scope.reverse : false;
            $scope.predicate[1] = predicate;
        };

        $scope.select = function(item) {
            $rootScope.selectedModalPath = item.model.fullPath().split('/');
            $rootScope.selectedModalObject = item.model.object;
            $scope.modal('selector', true);
        };

        $scope.selectCurrent = function() {
            $rootScope.selectedModalPath = $scope.fileNavigator.currentPath;
            $rootScope.selectedModalObject = $scope.fileNavigator.folderObject;
            $scope.modal('selector', true);
        };

        $scope.selectedFilesAreChildOfPath = function(item) {
            var path = item.model.fullPath();
            return $scope.temps.find(function(item) {
                var itemPath = item.model.fullPath();
                if (path == itemPath) {
                    return true;
                }
                /*
                if (path.startsWith(itemPath)) {
                    fixme names in same folder like folder-one and folder-one-two
                    at the moment fixed hidding affected folders
                }
                */
            });
        };

        $rootScope.openNavigator = function(parentFileNavigator) {
            $scope.fileNavigator.currentPath = parentFileNavigator.currentPath;
            $scope.fileNavigator.folderObject = parentFileNavigator.folderObject;
            $scope.fileNavigator.folderId = parentFileNavigator.folderId;
            if (fileManagerConfig.signedin) {
                $scope.fileNavigator.refresh();
                $scope.modal('selector');
            }        
        };

        $rootScope.getSelectedPath = function() {
            var path = $rootScope.selectedModalPath.filter(Boolean);
            var result = '/' + path.join('/');
            if ($scope.singleSelection() && !$scope.singleSelection().isFolder()) {
                result += '/' + $scope.singleSelection().tempModel.name;
            }
            return result.replace(/\/\//, '/');
        };

    }]);
})(angular);