(function(angular) {
    'use strict';
    angular.module('dctmNgFileManager')
        .service('fileNavigator', [
            'fileManagerConfig', 'item', 'apiMiddleware', function (fileManagerConfig, Item, apiMiddleware) {

                var FileNavigator = function() {
                    this.requesting = false;
                    this.fileList = [];
                    this.currentPath = [];
                    this.history = [];
                    this.error = '';
                    this.folderId = '' ;
                    this.folderObject = {};
                    this.pageNumber = 1;
                    this.pageSize = 20;
                    this.apiMiddleware = new apiMiddleware();
                };

                FileNavigator.prototype.list = function(path, id, object) {
                    if (path == "/" || path == "") {
                        return this.apiMiddleware.listRootCabinets(this.pageNumber, this.pageSize);
                    }
                    else {
                        return this.apiMiddleware.listFolderChildren(object, this.pageNumber, this.pageSize);
                    }
                };

                FileNavigator.prototype.refresh = function() {
                    var self = this;
                    var path = self.currentPath.join('/');
                    self.list(path, self.folderId, self.folderObject).then(function(data) {
                        var objects = self.apiMiddleware.parseEntries(data);
                        self.fileList = (objects || []).map(function(file) {
                            return new Item(file, self.currentPath);
                        });
                        self.buildTree(path);
                    });
                };

                FileNavigator.prototype.buildTree = function(path) {
                    var flatNodes = [], selectedNode = {};

                    function recursive(parent, item, path) {
                        var absName = path ? (path + '/' + item.model.name) : item.model.name;
                        if (parent.name.trim() && path.trim().indexOf(parent.name) !== 0) {
                            parent.nodes = [];
                        }
                        if (parent.name !== path) {
                            for (var i in parent.nodes) {
                                recursive(parent.nodes[i], item, path);
                            }
                        } else {
                            for (var e in parent.nodes) {
                                if (parent.nodes[e].name === absName) {
                                    return;
                                }
                            }
                            parent.nodes.push({item: item, name: absName, nodes: []});
                        }
                        parent.nodes = parent.nodes.sort(function(a, b) {
                            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() === b.name.toLowerCase() ? 0 : 1;
                        });
                    }

                    function flatten(node, array) {
                        array.push(node);
                        for (var n in node.nodes) {
                            flatten(node.nodes[n], array);
                        }
                    }

                    function findNode(data, path) {
                        return data.filter(function (n) {
                            return n.name === path;
                        })[0];
                    }

                    !this.history.length && this.history.push({name: '', nodes: []});
                    flatten(this.history[0], flatNodes);
                    selectedNode = findNode(flatNodes, path);
                    if (selectedNode != null) {
                        selectedNode.nodes = [];
                    }

                    for (var o in this.fileList) {
                        var item = this.fileList[o];
                        item.isFolder() && recursive(this.history[0], item, path);
                    }
                };

                FileNavigator.prototype.folderClick = function(item) {
                    this.currentPath = [];
                    if (item && item.isFolder()) {
                        this.currentPath = item.model.fullPath().split('/').splice(1);
                        //added
                        this.folderId = item.model.id;
                        this.folderObject = item.model.object;
                        this.pageNumber = 1;
                    }
                    this.refresh();
                };

                FileNavigator.prototype.upDir = function() {
                    if (this.currentPath[0]) {
                        this.currentPath = this.currentPath.slice(0, -1);
                        this.refresh();
                    }
                };

                FileNavigator.prototype.goTo = function(index) {
                    this.currentPath = this.currentPath.slice(0, index + 1);
                    this.refresh();
                };

                FileNavigator.prototype.hasPrevious = function(){
                    return this.pageNumber > 1;
                }

                FileNavigator.prototype.hasNext = function(){
                    return !(this.fileList.length == 0 || this.fileList.length < this.pageSize);
                }

                FileNavigator.prototype.nextPage = function (){
                    if(!this.hasNext()){
                        return;
                    }
                    this.pageNumber++;
                    this.getPage(this.pageNumber);
                }

                FileNavigator.prototype.previousPage = function(){
                    if(!this.hasPrevious()){
                        return;
                    }
                    this.pageNumber--;
                    this.getPage(this.pageNumber);

                }

                FileNavigator.prototype.getPage = function(pageNumber){
                    this.refresh();
                }

                FileNavigator.prototype.fileNameExists = function(fileName) {
                    for (var item in this.fileList) {
                        item = this.fileList[item];
                        if (fileName.trim && item.model.name.trim() === fileName.trim()) {
                            return true;
                        }
                    }
                };

                FileNavigator.prototype.listHasFolders = function() {
                    for (var item in this.fileList) {
                        if (this.fileList[item].model.type === 'dir') {
                            return true;
                        }
                    }
                };

                FileNavigator.prototype.currentFullPath = function () {
                    var path = this.currentPath.join('/');
                    return '/' + path;
                };

                return FileNavigator;
            }]);
})(angular);