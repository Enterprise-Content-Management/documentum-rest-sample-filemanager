angular
  .module('dctmRestClient', ['dctmRestConstants'])
  .provider('dctmClient', function (CONSTANTS) {
    this.$get = ['$http', '$q', function ($http, $q) {
      return new DCTMRestClient($http, $q)
    }]

    function DCTMRestClient ($http, $q) {
      this.http = $http
      this.q = $q
    }

    DCTMRestClient.prototype = {
      'login': function (loginInfo) {
        var defer = this.q.defer()
        var promise = defer.promise
        var client = this
        localStorage.setItem(CONSTANTS.LOGIN_INFO.USERNAME, loginInfo.username)
        localStorage.setItem(CONSTANTS.LOGIN_INFO.PASSWORD, loginInfo.password)
        client.getServices(loginInfo.baseUri).then(function (resp) {
          client.getRepositories(resp.data).then(function (resp) {
            client.getRepository(resp.data, loginInfo.repoName).then(function (resp) {
              localStorage.setItem(CONSTANTS.LOGIN_INFO.BASE_URI, loginInfo.baseUri)
              localStorage.setItem(CONSTANTS.LOGIN_INFO.REPOSITORY, loginInfo.repoName)
              localStorage.setItem(CONSTANTS.LOGIN_INFO.PASSWORD, loginInfo.password)
              localStorage.setItem(CONSTANTS.REPOSITORY_RESOURCE, JSON.stringify(resp.data))
              defer.resolve(resp)
            }, function (error) {
              defer.reject(error)
            })
          })
        }, function (error) {
          defer.reject(error)
        })
        return promise
      },
      'hasLogin': function () {
        var baseUri = localStorage.getItem(CONSTANTS.LOGIN_INFO.BASE_URI)
        var repositoryName = localStorage.getItem(CONSTANTS.LOGIN_INFO.REPOSITORY)
        var username = localStorage.getItem(CONSTANTS.LOGIN_INFO.USERNAME)
        var password = localStorage.getItem(CONSTANTS.LOGIN_INFO.PASSWORD)
        var repository = localStorage.getItem(CONSTANTS.REPOSITORY_RESOURCE)
        return (baseUri && repositoryName && username && password && repository == null)
      },
      'logout': function () {
        var defer = this.q.defer()
        var promise = defer.promise
        try {
          localStorage.removeItem(CONSTANTS.LOGIN_INFO.BASE_URI)
          localStorage.removeItem(CONSTANTS.LOGIN_INFO.REPOSITORY)
          localStorage.removeItem(CONSTANTS.LOGIN_INFO.USERNAME)
          localStorage.removeItem(CONSTANTS.LOGIN_INFO.PASSWORD)
          localStorage.removeItem(CONSTANTS.REPOSITORY_RESOURCE)
          setTimeout(function () {
            defer.resolve('success')
          }, 1)
        } catch(error) {
          setTimeout(function () {
            defer.reject(error)
          }, 1)
        }
        return promise
      },
      'findLinkFromObject': function findLinkFromObject (data, rel, title) {
        return findLinkInLinksArray(data.links, rel, title)
      },
      'getLinkFromResource': function getLinkFromResourceLinks (resource, rel) {
        return findLinkInLinksArray(resource.links, rel)
      },
      'getSelfLinkOfEntry': findSelfLinkFromEntry,
      'get': function get (link, headers) {
        if (!headers) {
          headers = {}
        }
        headers[CONSTANTS.HEADERS.ACCEPT] = CONSTANTS.MIME.VND_DCTM_JSON
        headers[CONSTANTS.HEADERS.AUTHORIZATION] = credential()
        link = appendURLParams(link, arguments)
        var params = {headers: headers}
        return this.http.get(link, params)
      },
      'getBinary': function getBinary (link, headers) {
        if (!headers) {
          headers = {}
        }
        headers[CONSTANTS.HEADERS.ACCEPT] = CONSTANTS.MIME.ANY
        headers[CONSTANTS.HEADERS.AUTHORIZATION] = credential()
        link = appendURLParams(link, arguments)
        var params = {headers: headers,responseType: 'arraybuffer'}
        return this.http.get(link, params)
      },
      'post': function post (link, data, headers) {
        if (!headers) {
          headers = {}
        }
        headers[CONSTANTS.HEADERS.ACCEPT] = CONSTANTS.MIME.VND_DCTM_JSON
        headers[CONSTANTS.HEADERS.CONTENT_TYPE] = CONSTANTS.MIME.VND_DCTM_JSON
        headers[CONSTANTS.HEADERS.AUTHORIZATION] = credential()
        link = appendURLParams(link, arguments)
        var params = {headers: headers,url: link}
        return this.http.post(link, data, params)
      },
      'postContentfulObj': function postContentfulObj (link, data, file, headers) {
        if (!headers) {
          headers = {}
        }
        if (file) {
          var fd = new FormData()
          fd.append('metadata', new Blob([angular.toJson(data)], {type: CONSTANTS.MIME.VND_DCTM_JSON}))
          fd.append('content', file)

          headers[CONSTANTS.HEADERS.CONTENT_TYPE] = undefined
          headers['transformRequest'] = angular.identity
          data = fd
        }else {
          headers[CONSTANTS.HEADERS.CONTENT_TYPE] = CONSTANTS.MIME.VND_DCTM_JSON
        }
        headers[CONSTANTS.HEADERS.ACCEPT] = CONSTANTS.MIME.VND_DCTM_JSON
        headers[CONSTANTS.HEADERS.AUTHORIZATION] = credential()
        var params = {headers: headers,url: link}
        return this.http.post(link, data, params)
      },
      'postBinary': function postBinary (link, binary, headers) {
        if (!headers) {
          headers = {}
        }
        headers[CONSTANTS.HEADERS.AUTHORIZATION] = credential()
        if (!headers[CONSTANTS.HEADERS.CONTENT_TYPE]) {
          headers[CONSTANTS.HEADERS.CONTENT_TYPE] = 'application/octet-stream'
        }
        var params = {headers: headers,url: link}
        link = appendURLParams(link, arguments)
        return this.http.post(link, binary, params)
      },
      'put': function put (link, data, headers) {
        if (!headers) {
          headers = {}
        }
        headers[CONSTANTS.HEADERS.ACCEPT] = CONSTANTS.MIME.VND_DCTM_JSON
        headers[CONSTANTS.HEADERS.CONTENT_TYPE] = CONSTANTS.MIME.VND_DCTM_JSON
        headers[CONSTANTS.HEADERS.AUTHORIZATION] = credential()
        var params = {headers: headers,url: link}
        link = appendURLParams(link, arguments)
        return this.http.put(link, data, params)
      },
      'delete': function dlt (link, headers) {
        if (!headers) {
          headers = {}
        }
        headers[CONSTANTS.HEADERS.CONTENT_TYPE] = CONSTANTS.MIME.VND_DCTM_JSON
        headers[CONSTANTS.HEADERS.AUTHORIZATION] = credential()
        var params = {headers: headers,url: link}
        link = appendURLParams(link, arguments)
        return this.http['delete'](link, params)
      },
      'getServices': function getServices (baseUri) {
        var headers = {}
        headers[CONSTANTS.HEADERS.CONTENT_TYPE] = 'application/home+json'
        var link = servicesResourceLink(baseUri)
        var params = {headers: headers,url: link}
        return this.http.get(link, params)
      },
      'getRepositories': function getRepositories (services) {
        var headers = {}
        headers[CONSTANTS.HEADERS.CONTENT_TYPE] = CONSTANTS.MIME.VND_DCTM_JSON
        if (!services) {
          throw new Error('"Services" entry must be provided')
        }
        if (!services.resources) {
          throw new Error('Illegal "services" entry"')
        }
        if (!services.resources[CONSTANTS.LINK_RELATIONS.REPOSITORIES]) {
          throw new Error('No Repositories link in services entry')
        }
        var link = services.resources[CONSTANTS.LINK_RELATIONS.REPOSITORIES].href
        var params = {headers: headers,url: link}
        return this.http.get(link, params)
      },
      'getRepository': function getRepository (repos, repoName) {
        var link = findRepoLinkFromRepos(repos.entries, repoName)
        return this.get(link)
      },
      'getCachedRepository': function getRepository () {
        var str = localStorage.getItem(CONSTANTS.REPOSITORY_RESOURCE)
        if (str) {
          return JSON.parse(str)
        }else {
          return null
        }
      },
      'simpleSearch': function simpleSearch (repository, q) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.SEARCH)
        link = appendURLParams(link, [CONSTANTS.QUERY_PARAMS.Q, q])
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getCabinets': function getCabinets (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.CABINETS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'createCabinet': function createCabinet (repository, newCabinet) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.CABINETS)
        link = appendURLParams(link, arguments)
        return this.post(link, newCabinet)
      },
      'createFolder': function createFolder (cabinetOrFolder, data) {
        var link = findLinkInLinksArray(cabinetOrFolder.links, CONSTANTS.LINK_RELATIONS.FOLDERS)
        link = appendURLParams(link, arguments)
        return this.post(link, data)
      },
      'createDocument': function createDocument (cabinetOrFolder, data, file) {
        var link = findLinkInLinksArray(cabinetOrFolder.links, CONSTANTS.LINK_RELATIONS.DOCUMENTS)
        link = appendURLParams(link, arguments)
        return this.postContentfulObj(link, data, file)
      },
      'copy': function copy (cabinetOrFolder, objToCopy, newProperties) {
        var link = findLinkInLinksArray(cabinetOrFolder.links, CONSTANTS.LINK_RELATIONS.OBJECTS)
        link = appendURLParams(link, arguments)
        var objLink = findLinkInLinksArray(objToCopy.links, CONSTANTS.LINK_RELATIONS.SELF)
        return this.post(link, {href: objLink, properties: newProperties, 'deep-copy': true})
      },
      'move': function move (objToMove, sourceFolder, targetFolder) {
        var client = this
        var sourceFolderId = sourceFolder.properties.r_object_id
        var targetFolderUrl = findLinkInLinksArray(targetFolder.links, CONSTANTS.LINK_RELATIONS.EDIT)
        if (!targetFolderUrl) {
          throw new Error('No permission to move objects to the target folder!"')
        }
        var parentLinksUrl = findLinkInLinksArray(objToMove.links, CONSTANTS.LINK_RELATIONS.PARENT_LINKS)
        var delayed = this.get(parentLinksUrl).then(function (resp) {
          var parents = resp.data.entries
          var parentUrl = null
          for (var j = 0; j < parents.length; j++) {
            if (parents[j].summary == sourceFolderId) {
              parentUrl = findLinkInLinksArray(parents[j].links, CONSTANTS.LINK_RELATIONS.EDIT)
              break
            }
          }
          if (!parentUrl) {
            throw new Error('The source folder is not a parent of the object to move!"')
          }
          client.put(parentUrl, { href: targetFolderUrl })
        })
        return delayed
      },
      'getPrimaryContentMedia': function getPrimaryContentMedia (document) {
        var self = this
        var defer = this.q.defer()
        var promise = defer.promise
        this.getPrimaryContentMeta(document, CONSTANTS.QUERY_PARAMS.MEDIA_URL_POLICY, 'local').then(function (resp) {
          var contentMeta = resp.data
          var contentMediaUrl = findLinkInLinksArray(contentMeta.links, CONSTANTS.LINK_RELATIONS.CONTENT_MEDIA)
          defer.resolve(self.getBinary(contentMediaUrl))
        })
        return promise
      },
      'getPrimaryContentMeta': function getPrimaryContentMeta (document) {
        var link = findLinkInLinksArray(document.links, CONSTANTS.LINK_RELATIONS.PRIMARY_CONTENT)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'setContent': function setContent (document, binary) {
        var link = findLinkInLinksArray(document.links, CONSTANTS.LINK_RELATIONS.CONTENTS)
        link = appendURLParams(link, arguments)
        return this.postBinary(link, binary)
      },
      'checkOut': function checkOut (obj) {
        var link = findLinkInLinksArray(obj.links, CONSTANTS.LINK_RELATIONS.CHECKOUT)
        link = appendURLParams(link, arguments)
        return this.put(link)
      },
      'cancelCheckOut': function checkOut (obj) {
        var link = findLinkInLinksArray(obj.links, CONSTANTS.LINK_RELATIONS.CANCEL_CHECKOUT)
        link = appendURLParams(link, arguments)
        return this['delete'](link)
      },
      'checkIn': function checkOut (obj, data, file) {
        var link = findLinkInLinksArray(obj.links, CONSTANTS.LINK_RELATIONS.CHECKIN_NEXT_MAJOR)
        link = appendURLParams(link, arguments)
        return this.postContentfulObj(link, data, file)
      },
      'getChildFolders': function getChildFolders (cabinetOrFolder) {
        var link = findLinkInLinksArray(cabinetOrFolder.links, CONSTANTS.LINK_RELATIONS.FOLDERS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getChildObjects': function getChildObjects (cabinetOrFolder) {
        var link = findLinkInLinksArray(cabinetOrFolder.links, CONSTANTS.LINK_RELATIONS.OBJECTS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getChildDocuments': function getChildDocuments (cabinetOrFolder) {
        var link = findLinkInLinksArray(cabinetOrFolder.links, CONSTANTS.LINK_RELATIONS.DOCUMENTS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getObjectAspects': function getAspectTypsOfObject (obj) {
        var link = findLinkInLinksArray(obj.links, CONSTANTS.LINK_RELATIONS.OBJECT_ASPECTS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getObjectByPath': function getObjectByPath (repo, path) {
        var defer = this.q.defer()
        var promise = defer.promise
        if (!path) {
          throw new Error('object path must be provided')
        }
        var pathArr = path.split('/')
        var objName = pathArr.pop()
        var folderPath = pathArr.join('/')
        var dql = "SELECT * FROM dm_sysobject WHERE FOLDER ('" + folderPath + "') and object_name = '" + objName + "'"
        var link = this.getLinkFromResource(repo, CONSTANTS.LINK_RELATIONS.SELF)
        this.get(link, null, 'dql', encodeURIComponent(dql)).then(angular.bind(this, function (resp) {
          if (!resp.data || !resp.data.entries || resp.data.entries.length == 0) {
            defer.resolve(null)
          }else {
            var obj = resp.data.entries[0]
            this.get(this.getLinkFromResource(obj.content, CONSTANTS.LINK_RELATIONS.SELF), null).then(function (resp) {
              defer.resolve(resp)
            }, function (error) {
              defer.reject(error)
            })
          }
        }), function (error) {
          defer.reject(error)
        })
        return promise
      },
      'attachAspect': function attachAspect (obj, aspects) {
        var link = findLinkInLinksArray(obj.links, CONSTANTS.LINK_RELATIONS.OBJECT_ASPECTS)
        link = appendURLParams(link, arguments)
        if (!aspects) {
          aspects = []
        }
        if (typeof (aspects) == 'string') {
          aspects = [aspects]
        }
        var data = {
          aspects: aspects
        }
        return this.post(link, data)
      },
      'detachAspect': function detachAspect (objectAspects, aspect) {
        var link = findLinkInLinksArray(objectAspects.links, CONSTANTS.LINK_RELATIONS.DELETE, aspect)
        return this['delete'](link)
      },
      'getPermissions': function getPermissionOfObject (obj) {
        var link = findLinkInLinksArray(obj.links, CONSTANTS.LINK_RELATIONS.PERMISSIONS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getPermissionSet': function getPermissionSetOfObject (obj) {
        var link = findLinkInLinksArray(obj.links, CONSTANTS.LINK_RELATIONS.PERMISSION_SET)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getUsers': function getUsers (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.USERS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'createUser': function createUser (repository, newUser) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.USERS)
        link = appendURLParams(link, arguments)
        return this.post(link, newUser)
      },
      'getGroups': function getGroups (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.GROUPS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'createGroup': function createUser (repository, newGroup) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.GROUPS)
        link = appendURLParams(link, arguments)
        return this.post(link, newGroup)
      },
      'getUserMembers': function getUserMembers (group) {
        var link = findLinkInLinksArray(group.links, CONSTANTS.LINK_RELATIONS.USERS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getSubGroups': function getSubGroups (group) {
        var link = findLinkInLinksArray(group.links, CONSTANTS.LINK_RELATIONS.GROUPS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'addUserMember': function addUserMember (group, user) {
        var link = findLinkInLinksArray(group.links, CONSTANTS.LINK_RELATIONS.USERS)
        link = appendURLParams(link, arguments)
        var userLink = findLinkInLinksArray(user.links, CONSTANTS.LINK_RELATIONS.SELF)
        return this.post(link, {href: userLink})
      },
      'addSubGroup': function addUserMember (group, sub) {
        var link = findLinkInLinksArray(group.links, CONSTANTS.LINK_RELATIONS.GROUPS)
        link = appendURLParams(link, arguments)
        var subLink = findLinkInLinksArray(sub.links, CONSTANTS.LINK_RELATIONS.SELF)
        return this.post(link, {href: subLink})
      },
      'getCurrentUser': function getCurrentUser (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.CURRENT_USER)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getUserHome': function getUserHome (user) {
        var link = findLinkInLinksArray(user.links, CONSTANTS.LINK_RELATIONS.DEFAULT_FOLDER)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getCurrentUserPreferences': function getCurrentUserPreferences (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.CURRENT_USER_PREFERENCES)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'createCurrentUserPreference': function createCurrentUserPreference (repository, newPref) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.CURRENT_USER_PREFERENCES)
        link = appendURLParams(link, arguments)
        return this.post(link, newPref)
      },
      'getCheckedoutObjects': function getCheckedoutObjects (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.CHECKED_OUT_OBJECTS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getTypes': function getTypes (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.TYPES)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getFormats': function getFormats (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.FORMATS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getNetworkLocations': function getNetworkLocations (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.NETWORK_LOCATIONS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getRelations': function getRelations (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.RELATIONS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getRelationTypes': function getRelationTypes (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.RELATION_TYPES)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },

      'getAspectTypes': function getAspectTypes (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.ASPECT_TYPES)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getACLs': function getACLs (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.ACLS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getAssociations': function getAssociations (acl) {
        var link = findLinkInLinksArray(acl.links, CONSTANTS.LINK_RELATIONS.ASSOCIATIONS)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getBatchCapabilities': function getBatchCapabilities (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.BATCH_CAPABILITIES)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getSavedSearches': function getSavedSearches (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.SAVED_SEARCHES)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getSearchTemplates': function getSearchTemplates (repository) {
        var link = findLinkInLinksArray(repository.links, CONSTANTS.LINK_RELATIONS.SEARCH_TEMPLATES)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'getItemFromFeedEntry': function getItemFromFeedEntry (entry) {
        var link = findSelfLinkFromEntry(entry)
        link = appendURLParams(link, arguments)
        return this.get(link)
      },
      'createItem': function createItem (resource, newItem) {
        var link = findLinkInLinksArray(resource.links, CONSTANTS.LINK_RELATIONS.SELF)
        link = appendURLParams(link, arguments)
        return this.post(link, newItem)
      },
      'updateItem': function updateItem (resource, newItem) {
        var link = findLinkInLinksArray(resource.links, CONSTANTS.LINK_RELATIONS.EDIT)
        if (!link) {
          throw Error('No permission to edit resource "' + findLinkInLinksArray(resource, CONSTANTS.LINK_RELATIONS.SELF) + '".')
        }
        link = appendURLParams(link, arguments)
        return this.post(link, newItem)
      },
      'deleteItem': function deleteItem (resource) {
        var link = findLinkInLinksArray(resource.links, CONSTANTS.LINK_RELATIONS.DELETE)
        if (!link) {
          throw Error('No permission to delete resource "' + findLinkInLinksArray(resource, CONSTANTS.LINK_RELATIONS.SELF) + '".')
        }
        link = appendURLParams(link, arguments)
        return this['delete'](link)
      }
    }

    function findEntryFromFeedByTitle (feed, title) {
      var entries = feed.entries
      if (!entries) {
        return null
      }
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i]
        if (entry.title == title) {
          return entry
        }
      }
      return null
    }

    function findSelfLinkFromEntry (entry) {
      if (isLineEntry(entry)) {
        return findLinkInLinksArray(entry.content.links, CONSTANTS.LINK_RELATIONS.SELF)
      }else {
        return entry.content.src
      }
    }

    function isLineEntry (entry) {
      if (!entry) {
        return false
      }
      if (!entry.content) {
        return false
      }
      if (entry.content.src) {
        return false
      }
      return true
    }
    function appendURLParams (link, args) {
      var from = args.callee ? args.callee.length : 0
      if (args.length < from) {
        return link
      }
      if (link.indexOf('?') > 0) {
        link = link + '&'
      }else {
        link = link + '?'
      }
      for (var i = from; i < args.length - 1; i = i + 2) {
        var paramName = args[i]
        var paramValue = args[i + 1]
        link = link + paramName + '=' + paramValue + '&'
      }

      return link.substring(0, link.length - 1)
    }

    function findLinkInLinksArray (array, rel, title) {
      if (!(array instanceof Array)) {
        throw new Error('Illegal links')
      }
      if (!rel) {
        throw new Error('rel must be provided')
      }

      var found = null
      for (var i = 0; i < array.length; i++) {
        var link = array[i]
        if (link.rel == rel) {
          if (title) {
            if (link.title == title) {
              found = link
              break
            }
          }else {
            found = link
            break
          }
        }
      }
      if (found == null) {
        return null
      }
      var uri = found.href
      if (uri == null) {
        uri = found.hreftemplate
        if (uri && uri.indexOf('{') > 0) {
          uri = uri.substring(0, uri.indexOf('{'))
        }
      }
      return uri
    }

    function findRepoLinkFromRepos (repoEntries, repoName) {
      if (!(repoEntries instanceof Array)) {
        throw new Error('Illegal repository list')
      }
      if (!repoName) {
        throw new Error('The name of repository must be provided')
      }

      for (var i = 0; i < repoEntries.length; i++) {
        var entry = repoEntries[i]
        if (repoName == entry.title) {
          return findLinkInLinksArray(entry.links, CONSTANTS.LINK_RELATIONS.EDIT)
        }
      }
    }

    function servicesResourceLink (baseUri) {
      var link
      if (baseUri) {
        link = baseUri
      }else {
        link = localStorage.getItem(CONSTANTS.LOGIN_INFO.BASE_URI)
      }
      if (link.endsWith('/')) {
        return link + 'services'
      }else {
        return link + '/services'
      }
    }

    function credential () {
      return 'Basic ' + btoa(localStorage.getItem(CONSTANTS.LOGIN_INFO.USERNAME) + ':' + localStorage.getItem(CONSTANTS.LOGIN_INFO.PASSWORD))
    }
  })
