(function(angular) {
    'use strict';
    angular.module('dctmNgFileManager').service('apiMiddleware', ['$http', '$q', '$window', 'fileManagerConfig', 'dctmRestClient',
        function ($http, $q, $window, fileManagerConfig, dctmRestClient) {

        var ApiMiddleware = function() {
            this.restClient = new dctmRestClient();
        };

        ApiMiddleware.prototype.parseEntries = function(data) {
            var objects = [];
            var entries = data.entries;
            if (entries != null) {
                for (var k=0; k < entries.length; k++) {
                    objects[k] = {
                        'name': entries[k].title,
                        'rights': "drwxr-xr-x",
                        'size': this.getContentSize(entries[k].content),
                        'date': entries[k].published,
                        'type': this.getObjectType(entries[k].content),
                        'id': entries[k].id,
                        'object': entries[k].content.src == null ? entries[k].content : {} 
                    };
                }
            }
            return objects;
        }

        ApiMiddleware.prototype.getObjectType = function (content) { 
            var objectsHref = this.restClient.findUrlGivenLinkRelation(content, 'http://identifiers.emc.com/linkrel/objects');
            if (objectsHref == null) {
                return 'file';
            }
            else {
                return 'dir';
            }
        }

        ApiMiddleware.prototype.getContentSize = function (content) { 
            var contentHref = this.restClient.findUrlGivenLinkRelation(content, 'http://identifiers.emc.com/linkrel/primary-content');
            if (contentHref == null) {
                return 0;
            }
            else {
                return content.properties.r_full_content_size;
            }
        }

        ApiMiddleware.prototype.getPath = function(arrayPath) {
            return '/' + arrayPath.join('/');
        };

        ApiMiddleware.prototype.getFileList = function(files) {
            return (files || []).map(function(file) {
                //return file && file.model.fullPath();
                return file && file.model.id;
            });
        };

        ApiMiddleware.prototype.getObjectList = function(files) {
            return (files || []).map(function(file) {
                var obj = file && file.model.object;
                obj.properties.object_name = file.tempModel.name;
                return obj;
            });
        };

        ApiMiddleware.prototype.getFilePath = function(item) {
            return item && item.model.fullPath();
        };

        ApiMiddleware.prototype.listRepositories = function() { 
            var self = this;
            var rootContext = fileManagerConfig.rootContext;
            if (!rootContext.endsWith('/')) {
                rootContext = rootContext + '/';
            }
            self.restClient.getHomeDocument(rootContext + "services").then(function(homedoc) {
                self.restClient.listRepositories(homedoc)
                    .then(function(repos) {
                        fileManagerConfig.repositories = repos.entries;
                    });
            });         
        }

        ApiMiddleware.prototype.login = function() {
            return this.restClient.login(
                    fileManagerConfig.username, 
                    fileManagerConfig.password, 
                    fileManagerConfig.repositoryId);
        }

        ApiMiddleware.prototype.logout = function() {
            return this.restClient.logout();
        }

        ApiMiddleware.prototype.listRootCabinets = function(pageNumber, itemsPerPage) {
            return this.restClient.listRootCabinets(fileManagerConfig.repository, pageNumber, itemsPerPage);
        }

        ApiMiddleware.prototype.listFolderChildren = function(parent, pageNumber, itemsPerPage) {
            return this.restClient.listFolderChildren(parent, pageNumber, itemsPerPage);
        }

        ApiMiddleware.prototype.createFolder = function(parent) {
            return this.restClient.createFolder(parent.object, parent.name);
        };

        ApiMiddleware.prototype.ftSearch = function(terms, path, pageNumber, pageSize) {
            return this.restClient.ftSearch(fileManagerConfig.repository, terms, path, pageNumber, pageSize);
        };

        ApiMiddleware.prototype.upload = function(fileList, path, parent) {
            if (! $window.FormData) {
                throw new Error('Unsupported browser version');
            }
            return this.restClient.upload(parent, fileList.item(0));
        };

        ApiMiddleware.prototype.remove = function(files) {
            var objects = this.getObjectList(files);
            return this.restClient.remove(objects);
        };

        ApiMiddleware.prototype.getContentMeta = function(item, distributed) {
            return this.restClient.getContentMeta(item.model.object, distributed);
        };

        ApiMiddleware.prototype.download = function(item, forceNewWindow) {
            if (item.isFolder()) {
                return;
            }
            return this.restClient.getContent(item.model.object).then(function(content) {
                // if you have to overcome cors issue, open url in a new window
                //window.open(contentUrl, '_blank', item.model.name);
                var bin = new Blob([content]);
                saveAs(bin, item.model.name);
            });
        };

        ApiMiddleware.prototype.rename = function(item) {
            return this.restClient.rename(item.model.object, item.tempModel.name);
        };

        ApiMiddleware.prototype.getContent = function(item) {
            return this.restClient.getContent(item.model.object);
        };

        ApiMiddleware.prototype.edit = function(item) {
            return this.restClient.edit(item.model.object, item.tempModel.content);
        };

        ApiMiddleware.prototype.copy = function(files, targetFolder) {
            var items = this.getObjectList(files);
            return this.restClient.copy(items, targetFolder);
        };

        ApiMiddleware.prototype.move = function(files, sourceFolder, targetFolder) {
            var items = this.getObjectList(files);
            return this.restClient.move(items, sourceFolder, targetFolder);
        };


        /************** line separator for implemented APIs ************/


        ApiMiddleware.prototype.downloadMultiple = function(files, forceNewWindow) {
            var items = this.getFileList(files);
            var timestamp = new Date().getTime().toString().substr(8, 13);
            var toFilename = timestamp + '-' + fileManagerConfig.multipleDownloadFileName;

            return this.restClient.downloadMultiple(
                fileManagerConfig.downloadMultipleUrl,
                items,
                toFilename,
                fileManagerConfig.downloadFilesByAjax,
                forceNewWindow
            );
        };

        ApiMiddleware.prototype.compress = function(files, compressedFilename, path) {
            var items = this.getFileList(files);
            return this.restClient.compress(fileManagerConfig.compressUrl, items, compressedFilename, this.getPath(path));
        };

        ApiMiddleware.prototype.extract = function(item, folderName, path) {
            var itemPath = this.getFilePath(item);
            return this.restClient.extract(fileManagerConfig.extractUrl, itemPath, folderName, this.getPath(path));
        };

        ApiMiddleware.prototype.changePermissions = function(files, dataItem) {
            var items = this.getFileList(files);
            var code = dataItem.tempModel.perms.toCode();
            var octal = dataItem.tempModel.perms.toOctal();
            var recursive = !!dataItem.tempModel.recursive;

            return this.restClient.changePermissions(fileManagerConfig.permissionsUrl, items, code, octal, recursive);
        };
            
        return ApiMiddleware;

    }]);
})(angular);
