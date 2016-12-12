;(function (angular) {
  'use strict'
  angular.module('dctmNgFileManager')
    .service('apiMiddleware', ['$http', '$q', '$window', 'fileManagerConfig', 'dctmClient', 'CONSTANTS',
      function ($http, $q, $window, fileManagerConfig, dctmClient, CONSTANTS) {
        var ApiMiddleware = function () {
          this.inprocess = false
          this.error = ''
          this.asyncSuccess = false
        }

        ApiMiddleware.prototype.findLinkFromObject = function (data, rel) {
          return dctmClient.findLinkFromObject(data, rel)
        }

        ApiMiddleware.prototype.parseEntries = function (data) {
          var objects = []
          var entries = data.entries
          if (entries != null) {
            for (var k = 0; k < entries.length; k++) {
              objects[k] = {
                'name': entries[k].title,
                'rights': 'drwxr-xr-x',
                'size': this.getContentSize(entries[k].content),
                'date': entries[k].published,
                'type': this.getObjectType(entries[k].content),
                'id': entries[k].id,
                'object': entries[k].content.src == null ? entries[k].content : {}
              }
            }
          }
          return objects
        }

        ApiMiddleware.prototype.parseError = function (error, defaultMsg) {
          if (error && error.status && error.status >= 400) {
            if (error.code) {
              this.error = error.code
              if (error.message) {
                this.error = this.error + '\r\nReason: ' + error.message
              }
              if (error.details) {
                this.error = this.error + '\r\nMore:     ' + error.details
              }
            }
          }
          if (!this.error && defaultMsg) {
            this.error = defaultMsg
          }
          this.inprocess = false
        }

        ApiMiddleware.prototype.getObjectType = function (content) {
          if (content == null) {
            return 'unknown'
          }
          var objectsHref = dctmClient.findLinkFromObject(content, 'http://identifiers.emc.com/linkrel/objects')
          if (objectsHref == null) {
            return 'file'
          }else {
            return 'dir'
          }
        }

        ApiMiddleware.prototype.getContentSize = function (content) {
          if (content == null) {
            return 0
          }
          var contentHref = dctmClient.findLinkFromObject(content, 'http://identifiers.emc.com/linkrel/primary-content')
          if (contentHref == null) {
            return 0
          }else {
            return content.properties.r_full_content_size
          }
        }

        ApiMiddleware.prototype.getPath = function (arrayPath) {
          return '/' + arrayPath.join('/')
        }

        ApiMiddleware.prototype.getFileList = function (files) {
          return (files || []).map(function (file) {
            // return file && file.model.fullPath()
            return file && file.model.id
          })
        }

        ApiMiddleware.prototype.getObjectList = function (files) {
          return (files || []).map(function (file) {
            var obj = file && file.model.object
            obj.properties.object_name = file.tempModel.name
            return obj
          })
        }

        ApiMiddleware.prototype.getFilePath = function (item) {
          return item && item.model.fullPath()
        }

        ApiMiddleware.prototype.listRepositories = function () {
          dctmClient.getServices(fileManagerConfig.rootContext).then(function (homedoc) {
            dctmClient.getRepositories(homedoc.data)
              .then(function (repos) {
                fileManagerConfig.repositories = repos.data.entries
              })
          })
        }

        ApiMiddleware.prototype.login = function () {
          var loginInfo = {
            baseUri: fileManagerConfig.rootContext,
            repoName: fileManagerConfig.repositoryName,
            username: fileManagerConfig.username,
            password: fileManagerConfig.password
          }
          return dctmClient.login(loginInfo).then(function () {
            fileManagerConfig.signedin = true
          })
        }

        ApiMiddleware.prototype.logout = function () {
          return dctmClient.logout().then(function () {
            fileManagerConfig.signedin = false
          })
        }

        ApiMiddleware.prototype.listRootCabinets = function (pageNumber, itemsPerPage) {
          var repository = dctmClient.getCachedRepository()
          return dctmClient.getCabinets(repository,
            CONSTANTS.QUERY_PARAMS.INLINE, true,
            CONSTANTS.QUERY_PARAMS.PAGE, pageNumber,
            CONSTANTS.QUERY_PARAMS.ITEMS_PER_PAGE, itemsPerPage)
        }

        ApiMiddleware.prototype.listFolderChildren = function (parent, pageNumber, itemsPerPage) {
          var viewAttrs = 'r_object_id,r_object_type,object_name,r_modify_date,r_creation_date,i_folder_id,r_full_content_size,a_content_type'
          return dctmClient.getChildObjects(parent,
            CONSTANTS.QUERY_PARAMS.INLINE, true,
            CONSTANTS.QUERY_PARAMS.VIEW, viewAttrs,
            CONSTANTS.QUERY_PARAMS.PAGE, pageNumber,
            CONSTANTS.QUERY_PARAMS.ITEMS_PER_PAGE, itemsPerPage)
        }

        ApiMiddleware.prototype.createFolder = function (parent) {
          var newFolder = { properties: { object_name: parent.name }}
          return dctmClient.createFolder(parent.object, newFolder)
        }

        ApiMiddleware.prototype.ftSearch = function (terms, path, pageNumber, pageSize) {
          var repository = dctmClient.getCachedRepository()
          if (path && path != '/') {
            return dctmClient.simpleSearch(repository, terms,
              CONSTANTS.QUERY_PARAMS.LOCATIONS, path,
              CONSTANTS.QUERY_PARAMS.INLINE, true,
              CONSTANTS.QUERY_PARAMS.PAGE, pageNumber,
              CONSTANTS.QUERY_PARAMS.ITEMS_PER_PAGE, pageSize)
          }else {
            return dctmClient.simpleSearch(repository, terms,
              CONSTANTS.QUERY_PARAMS.INLINE, true,
              CONSTANTS.QUERY_PARAMS.PAGE, pageNumber,
              CONSTANTS.QUERY_PARAMS.ITEMS_PER_PAGE, pageSize)
          }
        }

        ApiMiddleware.prototype.upload = function (fileList, path, parent) {
          if (! $window.FormData) {
            throw new Error('Unsupported browser version')
          }
          var fileObj = fileList.item(0)
          var docObj = buildPersistentObject(['r_object_type', 'dm_document', 'object_name', fileObj.name])
          return dctmClient.createDocument(parent, docObj, fileObj)
        }

        ApiMiddleware.prototype.remove = function (files) {
          var objects = this.getObjectList(files)
          var delayed = null
          for (var k = 0; k < objects.length; k++) {
            delayed = dctmClient.deleteItem(objects[k],
              CONSTANTS.QUERY_PARAMS.DEL_NON_EMPTY, true,
              CONSTANTS.QUERY_PARAMS.DEL_VERSION, 'all',
              CONSTANTS.QUERY_PARAMS.DEL_ALL_LINKS, true)
          }
          return delayed
        }

        ApiMiddleware.prototype.rename = function (item) {
          var data = buildPersistentObject(['object_name', item.tempModel.name])
          return dctmClient.updateItem(item.model.object, data)
        }

        ApiMiddleware.prototype.copy = function (files, targetFolder) {
          var items = this.getObjectList(files)
          var delayed = null
          for (var k = 0; k < items.length; k++) {
            delayed = dctmClient.copy(targetFolder, items[k], {object_name: items[k].properties.object_name})
          }
          return delayed
        }

        ApiMiddleware.prototype.move = function (files, sourceFolder, targetFolder) {
          var items = this.getObjectList(files)
          var delayed = null
          for (var k = 0; k < items.length; k++) {
            delayed = dctmClient.move(items[k], sourceFolder, targetFolder)
          }
          return delayed
        }

        ApiMiddleware.prototype.getContent = function (item, distributed) {
          return dctmClient.getPrimaryContentMedia(item.model.object)
        }

        ApiMiddleware.prototype.getContentMeta = function (item, distributed) {
          return dctmClient.getPrimaryContentMeta(item.model.object,
            CONSTANTS.QUERY_PARAMS.MEDIA_URL_POLICY, distributed ? 'dc-pref' : 'local')
        }

        ApiMiddleware.prototype.edit = function (item) {
          var document = item.model.object
          var binary = item.tempModel.content
          return dctmClient.setContent(document, binary,
            CONSTANTS.QUERY_PARAMS.PRIMARY, true,
            CONSTANTS.QUERY_PARAMS.OVERWRITE, true,
            CONSTANTS.QUERY_PARAMS.PAGE, 0,
            CONSTANTS.QUERY_PARAMS.FORMAT, document.properties.a_content_type)
        }

        ApiMiddleware.prototype.download = function (item, forceNewWindow) {
          if (item.isFolder()) {
            return
          }
          return dctmClient.getPrimaryContentMedia(item.model.object).then(function (content) {
            // if you have to overcome cors issue, open url in a new window
            // window.open(contentUrl, '_blank', item.model.name)
            var bin = new Blob([content.data])
            saveAs(bin, item.model.name)
          })
        }

        function buildPersistentObject (properties) {
          var prop = {}
          for (var k = 0; k < properties.length - 1; k = k + 2) {
            prop[properties[k]] = properties[k + 1]
          }
          var persistentObject = {}
          persistentObject['properties'] = prop
          return persistentObject
        }

        function buildHrefObjectWithProperties (uri, properties) {
          var persistentObject = {}
          persistentObject['href'] = uri
          if (properties != null && properties.length > 0) {
            var prop = {}
            for (var k = 0; k < properties.length - 1; k = k + 2) {
              prop[properties[k]] = properties[k + 1]
            }
            persistentObject['properties'] = prop
          }
          return persistentObject
        }

        /************** line separator for implemented APIs ************/

        ApiMiddleware.prototype.downloadMultiple = function (files, forceNewWindow) {
          var items = this.getFileList(files)
          var timestamp = new Date().getTime().toString().substr(8, 13)
          var toFilename = timestamp + '-' + fileManagerConfig.multipleDownloadFileName

          return this.restClient.downloadMultiple(
            fileManagerConfig.downloadMultipleUrl,
            items,
            toFilename,
            fileManagerConfig.downloadFilesByAjax,
            forceNewWindow
          )
        }

        ApiMiddleware.prototype.compress = function (files, compressedFilename, path) {
          var items = this.getFileList(files)
          return this.restClient.compress(fileManagerConfig.compressUrl, items, compressedFilename, this.getPath(path))
        }

        ApiMiddleware.prototype.extract = function (item, folderName, path) {
          var itemPath = this.getFilePath(item)
          return this.restClient.extract(fileManagerConfig.extractUrl, itemPath, folderName, this.getPath(path))
        }

        ApiMiddleware.prototype.changePermissions = function (files, dataItem) {
          var items = this.getFileList(files)
          var code = dataItem.tempModel.perms.toCode()
          var octal = dataItem.tempModel.perms.toOctal()
          var recursive = !!dataItem.tempModel.recursive

          return this.restClient.changePermissions(fileManagerConfig.permissionsUrl, items, code, octal, recursive)
        }

        return ApiMiddleware
      }])
})(angular)
