(function(angular, $) {
    'use strict';
    angular.module('dctmNgFileManager').service('dctmRestClient', ['$http', '$q', '$window', '$translate', 'dctmAuth', 'Base64',
        function ($http, $q, $window, $translate, dctmAuth, Base64) {

            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            var dctmRestClient = function() {
                this.inprocess = false;
                this.asyncSuccess = false;
                this.error = '';
            };

            dctmRestClient.prototype.findUrlGivenLinkRelation = function(data, relName) {
                var uri;
                if(data && data.links)
                    for (var i = 0; i < data.links.length; i++) {
                        var name = data.links[i].rel;
                        // Check for relation name we're looking
                        if(name == relName) {
                            uri = data.links[i].href;
                            if (uri == null) {
                                uri = data.links[i].hreftemplate;
                                if (uri.indexOf('{') > 0) {
                                    uri = uri.substring(0, uri.indexOf('{'));
                                }
                            }
                            break;
                        }
                    }
                return uri;
            }

            dctmRestClient.prototype.getHomeDocument = function(homedocUrl) {
                return get(this, homedocUrl, 'error_getting_home_document');
            }

            dctmRestClient.prototype.listRepositories = function(homeDocument) {
                var repositoriesUrl = homeDocument.resources['http://identifiers.emc.com/linkrel/repositories'].href;
                return get(this, repositoriesUrl, 'error_getting_repository_list');
            }

            dctmRestClient.prototype.login = function(username, password, repositoryUrl) {
                var self = this;
                dctmAuth.try_login(username, password);
                return $http.get(repositoryUrl).success(function(data) {
                    dctmAuth.post_login(username, password, data);
                })
                .error(function(data) {
                    parseError(self, data, 'error_authenticating');
                    dctmAuth.logout();
                }); 
            }

            dctmRestClient.prototype.logout = function() {
                return dctmAuth.logout();
            }

            dctmRestClient.prototype.listRootCabinets = function(repository, pageNumber, itemsPerPage) {
                var requestUrl = this.findUrlGivenLinkRelation(repository, 'http://identifiers.emc.com/linkrel/cabinets');
                requestUrl = buildUriWithQuery(requestUrl, ['page', pageNumber, 'items-per-page', itemsPerPage, 'inline', true]);
                return get(this, requestUrl, 'error_getting_root_cabinets');
            }

            dctmRestClient.prototype.listFolderChildren = function(folder, pageNumber, itemsPerPage) {
                var requestUrl = this.findUrlGivenLinkRelation(folder, 'http://identifiers.emc.com/linkrel/objects');
                var viewAttrs = 'r_object_id,r_object_type,object_name,r_modify_date,r_creation_date,i_folder_id,r_full_content_size,a_content_type';
                requestUrl = buildUriWithQuery(requestUrl, ['page', pageNumber, 'items-per-page', itemsPerPage, 'inline', true, 'view', viewAttrs]);
                return get(this, requestUrl, 'error_getting_folder_children');
            }

            dctmRestClient.prototype.createFolder = function(folder, name) {
                var requestUrl = this.findUrlGivenLinkRelation(folder, 'http://identifiers.emc.com/linkrel/folders');
                return post(this, requestUrl, buildPersistentObject(['object_name', name]), 'error_creating_folder');
            };

            // TODO for MMTM R5: implement search rest api call START 
            dctmRestClient.prototype.ftSearch = function(repository, terms, path, pageNumber, itemsPerPage) {
                return 'mmtm-r5-search-rest-api-call';
            };
            // TODO for MMTM R5: implement search rest api call START 

            dctmRestClient.prototype.upload = function(parent, fileObj) {
                var requestUrl = this.findUrlGivenLinkRelation(parent, 'http://identifiers.emc.com/linkrel/documents');
                var docObj = buildPersistentObject(['r_object_type', 'dm_document', 'object_name', fileObj.name]);
                return postMultipart(this, requestUrl, docObj, fileObj, 'error_uploading_content');
            };

            dctmRestClient.prototype.remove = function(objects) {
                var deferred = null;
                for(var k=0; k<objects.length; k++) {
                    var requestUrl = this.findUrlGivenLinkRelation(objects[k], 'http://identifiers.emc.com/linkrel/delete');
                    deferred = del(this, requestUrl, 'error_deleting_object');
                }
                return deferred;
            };

            dctmRestClient.prototype.getContentMeta = function(docment, distributed) {
                var requestUrl = this.findUrlGivenLinkRelation(docment, 'http://identifiers.emc.com/linkrel/primary-content');
                requestUrl = buildUriWithQuery(requestUrl, ['media-url-policy', (distributed ? 'DC-PREF':'LOCAL')]);
                return get(this, requestUrl, 'error_downloading_content');
            };

            dctmRestClient.prototype.rename = function(object, newName) {
                var requestUrl = this.findUrlGivenLinkRelation(object, 'edit');
                return post(this, requestUrl, buildPersistentObject(['object_name', newName]), 'error_renaming_object');
            };

            dctmRestClient.prototype.getContent = function(document) {
                var self = this;
                var deferred = $q.defer();
                self.getContentMeta(document, false).then(function(meta) {
                    var contentUrl = self.findUrlGivenLinkRelation(meta, 'enclosure');
                    getRaw(self, deferred, contentUrl, 'error_downloading_content');
                });   
                return deferred.promise;
            };

            dctmRestClient.prototype.edit = function(document, content) {
                var requestUrl = this.findUrlGivenLinkRelation(document, 'contents');
                requestUrl = buildUriWithQuery(requestUrl, ['primary', true, 'overwrite', true, 'page', 0, 'format', document.properties.a_content_type]);
                return postRaw(this, requestUrl, content, 'error_editing_content');
            };

            dctmRestClient.prototype.copy = function(objects, folder) {
                var requestUrl = this.findUrlGivenLinkRelation(folder, 'http://identifiers.emc.com/linkrel/objects');
                var deferred;
                for(var k=0; k<objects.length; k++) {
                    deferred = post(this, requestUrl, buildHrefObjectWithProperties(
                        this.findUrlGivenLinkRelation(objects[k], 'self'), ['object_name', objects[k].properties.object_name]),
                        'error_copying_object');
                }
                return deferred; 
            };

            dctmRestClient.prototype.move = function(objects, sourceFolder, targetFolder) {
                var self = this;
                var targetFolderUrl = this.findUrlGivenLinkRelation(targetFolder, 'self');
                var sourceFolderId = sourceFolder.properties.r_object_id;

                var deferred;
                for(var k=0; k<objects.length; k++) {
                    var parentLinksUrl = this.findUrlGivenLinkRelation(objects[k], 'http://identifiers.emc.com/linkrel/parent-links');
                    deferred = get(this, parentLinksUrl, 'error_moving_object').then(function(data) {
                        var links = data.entries;
                        var parentUrl = null;
                        for(var j=0; j<links.length; j++) {
                            if (links[j].summary == sourceFolderId) {
                                parentUrl = self.findUrlGivenLinkRelation(links[j], 'edit');
                                break;
                            }
                        }
                        put(self, parentUrl, buildHrefObjectWithProperties(targetFolderUrl, []), 'error_getting_content');
                    });
                }
                return deferred; 
            };

            /** private functions start */

            function initOperation(client) {
                var self = client;
                self.inprocess = true;
                self.error = '';
                return self;
            }

            function buildUriWithQuery(url, params) {
                var requestUrl = url;
                var hasParams = url.indexOf('?') > 0;
                for(var k=0; k<params.length-1; k=k+2) {
                    requestUrl = requestUrl + (hasParams ? '&' : '?') + params[k] + '=' + params[k+1];
                    hasParams = true; 
                }
                return requestUrl;
            }

            function get(client, url, errorCode) {
                var self = initOperation(client);
                var deferred = $q.defer();
                
                $http.get(url).success(function(data) {
                    deferredHandler(self, data, deferred);
                }).error(function(data) {
                    deferredHandler(self, data, deferred, $translate.instant(errorCode));
                })['finally'](function() {
                    self.inprocess = false;
                });

                return deferred.promise;
            }

            function getRaw(client, deferred, url, errorCode) {
                var self = initOperation(client);   
                $http.get(url, { responseType: 'arraybuffer' }).success(function(data) {
                    deferredHandler(self, data, deferred);
                }).error(function(data) {
                    deferredHandler(self, data, deferred, $translate.instant(errorCode));
                })['finally'](function() {
                    self.inprocess = false;
                });

                return deferred.promise;
            }

            function put(client, url, input, errorCode) {
                var self = initOperation(client);
                var deferred = $q.defer();

                var config = { headers: {'Content-type': 'application/vnd.emc.documentum+json'} };
                $http
                .put(url, input, config).success(function(data) {
                    deferredHandler(self, data, deferred);
                }).error(function(data) {
                    deferredHandler(self, data, deferred, $translate.instant(errorCode));
                })['finally'](function() {
                    self.inprocess = false;
                });

                return deferred.promise;
            }

            function post(client, url, input, errorCode) {
                var self = initOperation(client);
                var deferred = $q.defer();
                var config = { headers: {'Content-type': 'application/vnd.emc.documentum+json'} };
                $http
                .post(url, input, config).success(function(data) {
                    deferredHandler(self, data, deferred);
                }).error(function(data) {
                    deferredHandler(self, data, deferred, $translate.instant(errorCode));
                })['finally'](function() {
                    self.inprocess = false;
                });

                return deferred.promise;
            }

            function postRaw(client, url, input, errorCode) {
                var self = initOperation(client);
                var deferred = $q.defer();
                var config = { headers: {'Content-type': 'application/octet-stream'} };
                $http
                .post(url, input, config).success(function(data) {
                    deferredHandler(self, data, deferred);
                }).error(function(data) {
                    deferredHandler(self, data, deferred, $translate.instant(errorCode));
                })['finally'](function() {
                    self.inprocess = false;
                });

                return deferred.promise;
            }

            function postMultipart(client, url, docObj, fileObj, errorCode) {
                var self = initOperation(client);
                var deferred = $q.defer();

                var form = new $window.FormData();
                var blob = new Blob(
                    [JSON.stringify(docObj)], 
                    { type: "application/vnd.emc.documentum+json"});
                form.append('object', blob);
                fileObj instanceof $window.File && form.append('content', fileObj);

                $http.post(url, form, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function(data) {
                    deferredHandler(self, data, deferred);
                }).error(function(data) {
                    deferredHandler(self, data, deferred, errorCode);
                })['finally'](function() {
                    self.inprocess = false;
                });

                return deferred.promise;
            }

            function del(client, url, errorCode) {
                var self = initOperation(client);
                var deferred = $q.defer();
                
                $http.delete(url).success(function(data) {
                    deferredHandler(self, data, deferred);
                }).error(function(data) {
                    deferredHandler(self, data, deferred, $translate.instant(errorCode));
                })['finally'](function() {
                    self.inprocess = false;
                });

                return deferred.promise;
            }

            function deferredHandler(client, data, deferred, defaultMsg) {
                parseError(client, data, defaultMsg);
                if (client.error) {
                    return deferred.reject(data);
                }
                return deferred.resolve(data);
            };

            function parseError(client, data, defaultMsg) {
                if (data && data.status && data.status >= 400) {
                    if (data.code) {
                        client.error = data.code;
                        if (data.message) {
                            client.error = client.error + '\r\nReason: ' + data.message;
                        } 
                        if (data.details) {
                            client.error = client.error + '\r\nMore:     ' + data.details;
                        }
                    }
                }
                if (!client.error && defaultMsg) {
                    client.error = defaultMsg;
                }
            }

            function buildPersistentObject(properties) {
                var prop = {};
                for(var k=0; k<properties.length-1; k=k+2) {
                    prop[properties[k]] = properties[k+1];
                }
                var persistentObject = {};
                persistentObject["properties"] = prop;
                return persistentObject;
            }

            function buildHrefObjectWithProperties(uri, properties) {
                var persistentObject = {};
                persistentObject["href"] = uri;
                if (properties != null && properties.length > 0) {
                    var prop = {};
                    for(var k=0; k<properties.length-1; k=k+2) {
                        prop[properties[k]] = properties[k+1];
                    }
                    persistentObject["properties"] = prop;
                }
                return persistentObject;
            }

            /** private functions end */

            /************** line separator for implemented APIs ************/

            dctmRestClient.prototype.downloadMultiple = function(apiUrl, ids, toFilename, downloadByAjax, forceNewWindow) {
                this.error = $translate.instant('error_downloading');
                return $q.defer();
            };

            dctmRestClient.prototype.compress = function(apiUrl, ids, compressedFilename, path) {
                this.error = $translate.instant('error_compressing');
                return $q.defer();
            };

            dctmRestClient.prototype.extract = function(apiUrl, id, folderName, path) {
                this.error = $translate.instant('error_extracting');
                return $q.defer();
            };

            dctmRestClient.prototype.changePermissions = function(apiUrl, ids, permsOctal, permsCode, recursive) {
                this.error = $translate.instant('error_changing_perms');
                return $q.defer();
            };

            return dctmRestClient;

        }]);
})(angular, jQuery);