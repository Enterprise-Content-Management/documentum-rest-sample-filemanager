-function (angular) {
  var module = angular.module('dctmRestClient', [])

  module.constant('dctmConstants', {
    LOGIN_INFO: {
      AUTH_HEADER: 'authHeader',
      BASE_URI: 'baseUri',
      REPOSITORY: 'repository'
    },
    HEADERS: {
      ACCEPT: 'Accept',
      CONTENT_TYPE: 'Content-Type',
      AUTHORIZATION: 'Authorization'
    },
    LINK_RELATIONS: {
      REPOSITORIES: 'http://identifiers.emc.com/linkrel/repositories',
      CABINETS: 'http://identifiers.emc.com/linkrel/cabinets',
      DOCUMENTS: 'http://identifiers.emc.com/linkrel/documents',
      FOLDERS: 'http://identifiers.emc.com/linkrel/folders',
      OBJECTS: 'http://identifiers.emc.com/linkrel/objects',
      PARENT_LINKS: 'http://identifiers.emc.com/linkrel/parent-links',
      CHECKOUT: 'http://identifiers.emc.com/linkrel/checkout',
      CANCEL_CHECKOUT: 'http://identifiers.emc.com/linkrel/cancel-checkout',
      CHECKIN_NEXT_MAJOR: 'http://identifiers.emc.com/linkrel/checkin-next-major',
      CHECKED_OUT_OBJECTS: 'http://identifiers.emc.com/linkrel/checked-out-objects',
      OBJECT_ASPECTS: 'http://identifiers.emc.com/linkrel/object-aspects',
      DELETE: 'http://identifiers.emc.com/linkrel/delete',
      PRIMARY_CONTENT: 'http://identifiers.emc.com/linkrel/primary-content',
      CONTENT_MEDIA: 'http://identifiers.emc.com/linkrel/content-media',
      PERMISSIONS: 'http://identifiers.emc.com/linkrel/permissions',
      PERMISSION_SET: 'http://identifiers.emc.com/linkrel/permission-set',
      USERS: 'http://identifiers.emc.com/linkrel/users',
      GROUPS: 'http://identifiers.emc.com/linkrel/groups',
      CURRENT_USER: 'http://identifiers.emc.com/linkrel/current-user',
      DEFAULT_FOLDER: 'http://identifiers.emc.com/linkrel/default-folder',
      CURRENT_USER_PREFERENCES: 'http://identifiers.emc.com/linkrel/current-user-preferences',
      TYPES: 'http://identifiers.emc.com/linkrel/types',
      ASPECT_TYPES: 'http://identifiers.emc.com/linkrel/aspect-types',
      RELATION_TYPES: 'http://identifiers.emc.com/linkrel/relation-types',
      FORMATS: 'http://identifiers.emc.com/linkrel/formats',
      RELATIONS: 'http://identifiers.emc.com/linkrel/relations',
      NETWORK_LOCATIONS: 'http://identifiers.emc.com/linkrel/network-locations',
      ASSOCIATIONS: 'http://identifiers.emc.com/linkrel/associations',
      BATCH_CAPABILITIES: 'http://identifiers.emc.com/linkrel/batch-capabilities',
      SEARCH: 'http://identifiers.emc.com/linkrel/search',
      SAVED_SEARCHES: 'http://identifiers.emc.com/linkrel/saved-searches',
      SEARCH_TEMPLATES: 'http://identifiers.emc.com/linkrel/search-templates',
      ACLS: 'http://identifiers.emc.com/linkrel/acls',
      SELF: 'self',
      EDIT: 'edit',
      CONTENTS: 'contents',
      ENCLOSURE: 'enclosure'
    },
    QUERY_PARAMS: {
      PAGE: 'page',
      ITEMS_PER_PAGE: 'items-per-page',
      INLINE: 'inline',
      VIEW: 'view',
      Q: 'q',
      LOCATIONS: 'locations',
      DEL_NON_EMPTY: 'delete-non-empty',
      DEL_VERSION: 'delete-version',
      DEL_ALL_LINKS: 'delete-all-links',
      MEDIA_URL_POLICY: 'media-url-policy',
      PRIMARY: 'primary',
      OVERWRITE: 'overwrite',
      FORMAT: 'format',
      ACCESSOR: 'accessor'
    },
    MIME: {
      VND_DCTM_JSON: 'application/vnd.emc.documentum+json',
      HOME_JSON: 'application/home+json',
      APP_JSON: 'application/json',
      ANY_JSON: 'application/*+json',
      ANY: '*/*'
    },
    BASIC_PERMISSIONS: ['None', 'Browse', 'Read', 'Relate', 'Version', 'Write', 'Delete'],
    EXTEND_PERMISSIONS: ['CHANGE_FOLDER_LINKS', 'CHANGE_LOCATION', 'CHANGE_OWNER', 'CHANGE_PERMIT', 'CHANGE_STATE', 'DELETE_OBJECT', 'EXECUTE_PROC'],
    REPOSITORY_RESOURCE: 'repoResource'
  })

  module.provider('clientLocalStore', function (dctmConstants) {
    this.$get = function () {
      return new ClientLocalStore()
    }

    function ClientLocalStore () {
      var baseUri = localStorage.getItem(dctmConstants.LOGIN_INFO.BASE_URI)
      var repo = localStorage.getItem(dctmConstants.LOGIN_INFO.REPOSITORY)
      var authHeader = localStorage.getItem(dctmConstants.LOGIN_INFO.AUTH_HEADER)
      var repoResource = localStorage.getItem(dctmConstants.REPOSITORY_RESOURCE)
      if (baseUri && repo && authHeader) {
        this.authenticated = true
        this.loginInfo = {
          baseUri: baseUri,
          repoName: repo,
          authHeader: authHeader
        }
      }else {
        this.authenticated = false
        this.loginInfo = null
      }
    }

    ClientLocalStore.prototype = {
      'saveLogin': function saveLogin (loginInfo, repo) {
        this.loginInfo = loginInfo
        localStorage.setItem(dctmConstants.LOGIN_INFO.BASE_URI, loginInfo.baseUri)
        localStorage.setItem(dctmConstants.LOGIN_INFO.REPOSITORY, loginInfo.repoName)
        localStorage.setItem(dctmConstants.LOGIN_INFO.AUTH_HEADER, loginInfo.credentialHeader)
        localStorage.setItem(dctmConstants.REPOSITORY_RESOURCE, JSON.stringify(repo))
        this.authenticated = true
      },
      'clearLogin': function clearLogin () {
        localStorage.removeItem(dctmConstants.LOGIN_INFO.BASE_URI)
        localStorage.removeItem(dctmConstants.LOGIN_INFO.REPOSITORY)
        localStorage.removeItem(dctmConstants.LOGIN_INFO.AUTH_HEADER)
        localStorage.removeItem(dctmConstants.REPOSITORY_RESOURCE)
        this.authenticated = false
        this.loginInfo = null
      },
      'getCachedRepository': function getCachedRepository () {
        var str = localStorage.getItem(dctmConstants.REPOSITORY_RESOURCE)
        if (str) {
          return JSON.parse(str)
        }else {
          return null
        }
      },
      'getBaseUri': function getBaseUri () {
        return localStorage.getItem(dctmConstants.LOGIN_INFO.BASE_URI)
      },
      'getCredentialHeader': function getCredentialHeader () {
        return localStorage.getItem(dctmConstants.LOGIN_INFO.AUTH_HEADER)
      }
    }
  })

  module.provider('clientBase', function (dctmConstants) {
    this.$get = ['$http', '$q', 'clientLocalStore', function ($http, $q, clientLocalStore) {
      function DCTMRestClientBase ($http, $q) {
        this.http = function (obj) {
          if (clientLocalStore.authenticated && arguments[0]) {
            var requestObj = arguments[0]
            if (!requestObj.headers) {
              requestObj.headers = {}
            }
            var headers = requestObj.headers
            headers[dctmConstants.HEADERS.AUTHORIZATION] = clientLocalStore.getCredentialHeader()
          }
          return $http.apply(null, arguments)
        }
        this.q = $q
      }

      DCTMRestClientBase.prototype = {
        'get': function get (link, headers) {
          if (!headers) {
            headers = {}
          }
          headers[dctmConstants.HEADERS.ACCEPT] = dctmConstants.MIME.VND_DCTM_JSON
          link = appendURLParams(link, arguments)
          return this.http({method: 'GET',url: link,headers: headers})
        },
        'getBinary': function getBinary (link, headers) {
          if (!headers) {
            headers = {}
          }
          headers[dctmConstants.HEADERS.ACCEPT] = dctmConstants.MIME.VND_DCTM_JSON
          link = appendURLParams(link, arguments)
          var params = {headers: headers,responseType: 'arraybuffer'}
          return this.http({method: 'GET',url: link,headers: headers,responseType: 'arraybuffer'})
        },
        'post': function post (link, data, headers) {
          if (!headers) {
            headers = {}
          }
          headers[dctmConstants.HEADERS.ACCEPT] = dctmConstants.MIME.VND_DCTM_JSON
          headers[dctmConstants.HEADERS.CONTENT_TYPE] = dctmConstants.MIME.VND_DCTM_JSON
          link = appendURLParams(link, arguments)
          var params = {headers: headers,url: link}
          return this.http({method: 'POST',url: link,headers: headers,data: data})
        },
        'postContentfulObj': function postContentfulObj (link, data, file, headers) {
          if (!headers) {
            headers = {}
          }
          if (file) {
            var fd = new FormData()
            fd.append('metadata', new Blob([angular.toJson(data)], {type: dctmConstants.MIME.VND_DCTM_JSON}))
            fd.append('content', file)
            headers[dctmConstants.HEADERS.CONTENT_TYPE] = undefined
            headers['transformRequest'] = angular.identity
            data = fd
          }else {
            headers[dctmConstants.HEADERS.CONTENT_TYPE] = dctmConstants.MIME.VND_DCTM_JSON
          }
          headers[dctmConstants.HEADERS.ACCEPT] = dctmConstants.MIME.VND_DCTM_JSON
          var params = {headers: headers,url: link}
          return this.http({method: 'POST',url: link,headers: headers,data: data})
        },
        'postBinary': function postBinary (link, binary, headers) {
          if (!headers) {
            headers = {}
          }
          if (!headers[dctmConstants.HEADERS.CONTENT_TYPE]) {
            headers[dctmConstants.HEADERS.CONTENT_TYPE] = dctmConstants.MIME.HOME_JSON
          }
          var params = {headers: headers,url: link}
          link = appendURLParams(link, arguments)
          return this.post(link, binary, params)
        },
        'put': function put (link, data, headers) {
          if (!headers) {
            headers = {}
          }
          headers[dctmConstants.HEADERS.ACCEPT] = dctmConstants.MIME.VND_DCTM_JSON
          headers[dctmConstants.HEADERS.CONTENT_TYPE] = dctmConstants.MIME.VND_DCTM_JSON
          var params = {headers: headers,url: link}
          link = appendURLParams(link, arguments)
          return this.http({method: 'PUT',url: link,headers: headers,data: data})
        },
        'delete': function dlt (link, headers) {
          if (!headers) {
            headers = {}
          }
          headers[dctmConstants.HEADERS.CONTENT_TYPE] = dctmConstants.MIME.VND_DCTM_JSON
          var params = {headers: headers,url: link}
          link = appendURLParams(link, arguments)
          return this.http({method: 'DELETE',url: link,headers: headers})
        },
        'getLinkFromResource': function getLinkFromResourceLinks (resource, rel) {
          return findLinkInLinksArray(resource.links, rel)
        },
        'getSelfLinkOfEntry': findSelfLinkFromEntry,
        'getHomeDocument': function getHomeDocument (baseUri) {
          var headers = {}
          headers[dctmConstants.HEADERS.ACCEPT] = dctmConstants.MIME.ANY_JSON
          var link = homeDocUri(baseUri)
          return this.http({method: 'GET',url: link,headers: headers})
        },
        'getRepositories': function getRepositories (services) {
          var headers = {}
          if (!services) {
            throw new Error('"Services" entry must be provided')
          }
          if (!services.resources) {
            throw new Error('Illegal "services" entry"')
          }
          if (!services.resources[dctmConstants.LINK_RELATIONS.REPOSITORIES]) {
            throw new Error('No Repositories link in services entry')
          }
          var link = services.resources[dctmConstants.LINK_RELATIONS.REPOSITORIES].href
          return this.http({method: 'GET',url: link,headers: headers})
        },
        'getRepository': function getRepository (repos, repoName, headers) {
          var link = findRepoLinkFromRepos(repos, repoName)
          return this.get(link, headers)
        },
        'getCachedRepository': function getCachedRepository () {
          return clientLocalStore.getCachedRepository()
        }
      }

      return new DCTMRestClientBase($http, $q)
    }]

    function findRepoLinkFromRepos (repositories, repoName) {
      var entry = findEntryFromFeedByTitle(repositories, repoName)
      if (!entry) {
        throw new Error('The repository is not found:' + repoName)
      }
      return findLinkInLinksArray(entry.links, dctmConstants.LINK_RELATIONS.EDIT)
    }

    function homeDocUri (baseUri) {
      var link
      if (baseUri) {
        link = baseUri
      }else {
        link = clientLocalStore.getBaseUri()
      }
      if (link.endsWith('/')) {
        return link + 'services'
      }else {
        return link + '/services'
      }
    }
  })

  module.provider('dctmAuth', function (dctmConstants) {
    this.$get = ['clientBase', 'clientLocalStore', function (clientBase, clientLocalStore) {
      function DCTMAuthenticationClient () {
      }

      DCTMAuthenticationClient.prototype = {
        'login': function (loginInfo) {
          var defer = clientBase.q.defer()
          var promise = defer.promise
          var client = clientBase
          client.getHomeDocument(loginInfo.baseUri).then(function (resp) {
            client.getRepositories(resp.data).then(function (resp) {
              var headers = {}
              var credentialHeader = basicAuth(loginInfo)
              headers[dctmConstants.HEADERS.AUTHORIZATION] = credentialHeader
              client.getRepository(resp.data, loginInfo.repoName, headers).then(function (resp) {
                loginInfo.credentialHeader = credentialHeader
                clientLocalStore.saveLogin(loginInfo, resp.data)
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
        'authenticated': function () {
          return clientLocalStore.authenticated
        },
        'logout': function () {
          var defer = clientBase.q.defer()
          var promise = defer.promise
          try {
            setTimeout(function () {
              clientLocalStore.clearLogin()
              defer.resolve('success')
            }, 1)
          } catch(error) {
            setTimeout(function () {
              defer.reject(error)
            }, 1)
          }
          return promise
        }
      }
      return new DCTMAuthenticationClient()
    }]

    function basicAuth (loginInfo) {
      return 'Basic ' + btoa(loginInfo.username + ':' + loginInfo.password)
    }
  })

  module.provider('dctmClient', function (dctmConstants) {
    this.$get = ['clientBase', 'dctmAuth', function (clientBase, dctmAuth) {
      function DCTMRestClient (clientBase) {
        this.clientBase = clientBase
      }

      DCTMRestClient.prototype = {
        'login': function (loginInfo) {
          return dctmAuth.login(loginInfo)
        },
        'authenticated': function () {
          return dctmAuth.authenticated()
        },
        'logout': function () {
          return dctmAuth.logout()
        },
        'get': function get (link, headers) {
          return this.clientBase.get.apply(this.clientBase, arguments)
        },
        'getBinary': function getBinary (link, headers) {
          return this.clientBase.getBinary.apply(this.clientBase, arguments)
        },
        'getLinkFromResource': function getLinkFromResourceLinks (resource, rel) {
          return this.clientBase.getLinkFromResource.apply(this.clientBase, arguments)
        },
        'getSelfLinkOfEntry': function (entry) {
          return this.clientBase.getSelfLinkOfEntry.apply(this.clientBase, arguments)
        },
        'post': function post (link, data, headers) {
          return this.clientBase.post.apply(this.clientBase, arguments)
        },
        'postContentfulObj': function post (link, data, file, headers) {
          return this.clientBase.postContentfulObj.apply(this.clientBase, arguments)
        },
        'postBinary': function postBinary (link, binary, headers) {
          return this.clientBase.postBinary.apply(this.clientBase, arguments)
        },
        'put': function put (link, data, headers) {
          return this.clientBase.put.apply(this.clientBase, arguments)
        },
        'delete': function dlt (link, headers) {
          return this.clientBase['delete'].apply(this.clientBase, arguments)
        },
        'getHomeDocument': function getHomeDocument (baseUri) {
          return this.clientBase.getHomeDocument.apply(this.clientBase, arguments)
        },
        'getRepositories': function getRepositories (services) {
          return this.clientBase.getRepositories.apply(this.clientBase, arguments)
        },
        'getRepository': function getRepository (repos, repoName) {
          return this.clientBase.getRepository.apply(this.clientBase, arguments)
        },
        'getCachedRepository': function getRepository (repos, repoName) {
          return this.clientBase.getCachedRepository.apply(this.clientBase, arguments)
        },
        'getCabinets': function getCabinets (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.CABINETS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'createCabinet': function createCabinet (repository, newCabinet) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.CABINETS)
          link = appendURLParams(link, arguments)
          return this.post(link, newCabinet)
        },
        'createDocument': function (cabinetOrFolder, data, file) {
          var link = findLinkInLinksArray(cabinetOrFolder.links, dctmConstants.LINK_RELATIONS.DOCUMENTS)
          link = appendURLParams(link, arguments)
          return this.postContentfulObj(link, data, file)
        },
        'copy': function copy (cabinetOrFolder, objToCopy, newProperties) {
          var link = findLinkInLinksArray(cabinetOrFolder.links, dctmConstants.LINK_RELATIONS.OBJECTS)
          link = appendURLParams(link, arguments)
          var objLink = findLinkInLinksArray(objToCopy.links, dctmConstants.LINK_RELATIONS.SELF)
          return this.post(link, {href: objLink, properties: newProperties, 'deep-copy': true})
        },
        'move': function move (objToMove, sourceFolder, targetFolder) {
          var client = this
          var sourceFolderId = sourceFolder.properties.r_object_id
          var targetFolderUrl = findLinkInLinksArray(targetFolder.links, dctmConstants.LINK_RELATIONS.EDIT)
          if (!targetFolderUrl) {
            throw new Error('No permission to move objects to the target folder!"')
          }
          var parentLinksUrl = findLinkInLinksArray(objToMove.links, dctmConstants.LINK_RELATIONS.PARENT_LINKS)
          var delayed = this.get(parentLinksUrl).then(function (resp) {
            var parents = resp.data.entries
            var parentUrl = null
            for (var j = 0; j < parents.length; j++) {
              if (parents[j].summary == sourceFolderId) {
                parentUrl = findLinkInLinksArray(parents[j].links, dctmConstants.LINK_RELATIONS.EDIT)
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
          var defer = this.clientBase.q.defer()
          var promise = defer.promise
          this.getPrimaryContentMeta(document, dctmConstants.QUERY_PARAMS.MEDIA_URL_POLICY, 'local').then(function (resp) {
            var contentMeta = resp.data
            var contentMediaUrl = findLinkInLinksArray(contentMeta.links, dctmConstants.LINK_RELATIONS.CONTENT_MEDIA)
            defer.resolve(self.getBinary(contentMediaUrl))
          })
          return promise
        },
        'getPrimaryContentMeta': function getPrimaryContentMeta (document) {
          var link = findLinkInLinksArray(document.links, dctmConstants.LINK_RELATIONS.PRIMARY_CONTENT)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'setContent': function setContent (document, binary) {
          var link = findLinkInLinksArray(document.links, dctmConstants.LINK_RELATIONS.CONTENTS)
          link = appendURLParams(link, arguments)
          return this.postBinary(link, binary)
        },
        'createFolder': function (cabinetOrFolder, data) {
          var link = findLinkInLinksArray(cabinetOrFolder.links, dctmConstants.LINK_RELATIONS.FOLDERS)
          link = appendURLParams(link, arguments)
          return this.post(link, data)
        },
        'checkOut': function checkOut (obj) {
          var link = findLinkInLinksArray(obj.links, dctmConstants.LINK_RELATIONS.CHECKOUT)
          link = appendURLParams(link, arguments)
          return this.put(link)
        },
        'cancelCheckOut': function checkOut (obj) {
          var link = findLinkInLinksArray(obj.links, dctmConstants.LINK_RELATIONS.CANCEL_CHECKOUT)
          link = appendURLParams(link, arguments)
          return this['delete'](link)
        },
        'checkIn': function checkOut (obj, data, file) {
          var link = findLinkInLinksArray(obj.links, dctmConstants.LINK_RELATIONS.CHECKIN_NEXT_MAJOR)
          link = appendURLParams(link, arguments)
          return this.postContentfulObj(link, data, file)
        },
        'getChildFolders': function getChildFolders (cabinetOrFolder) {
          var link = findLinkInLinksArray(cabinetOrFolder.links, dctmConstants.LINK_RELATIONS.FOLDERS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getChildObjects': function getChildObjects (cabinetOrFolder) {
          var link = findLinkInLinksArray(cabinetOrFolder.links, dctmConstants.LINK_RELATIONS.OBJECTS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getChildDocuments': function getChildDocuments (cabinetOrFolder) {
          var link = findLinkInLinksArray(cabinetOrFolder.links, dctmConstants.LINK_RELATIONS.DOCUMENTS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getObjectAspects': function getAspectTypsOfObject (obj) {
          var link = findLinkInLinksArray(obj.links, dctmConstants.LINK_RELATIONS.OBJECT_ASPECTS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getObjectByPath': function getObjectByPath (repo, path) {
          var defer = this.clientBase.q.defer()
          var promise = defer.promise
          if (!path) {
            throw new Error('object path must be provided')
          }
          var pathArr = path.split('/')
          var objName = pathArr.pop()
          var folderPath = pathArr.join('/')
          var dql = "SELECT * FROM dm_sysobject WHERE FOLDER ('" + folderPath + "') and object_name = '" + objName + "'"
          var link = this.getLinkFromResource(repo, dctmConstants.LINK_RELATIONS.SELF)
          this.get(link, null, 'dql', encodeURIComponent(dql)).then(angular.bind(this, function (resp) {
            if (!resp.data || !resp.data.entries || resp.data.entries.length == 0) {
              defer.resolve(null)
            }else {
              var obj = resp.data.entries[0]
              this.get(this.getLinkFromResource(obj.content, dctmConstants.LINK_RELATIONS.SELF), null).then(function (resp) {
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
          var link = findLinkInLinksArray(obj.links, dctmConstants.LINK_RELATIONS.OBJECT_ASPECTS)
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
          var link = findLinkInLinksArray(objectAspects.links, dctmConstants.LINK_RELATIONS.DELETE, aspect)
          return this['delete'](link)
        },
        'getPermissions': function getPermissionOfObject (obj) {
          var link = findLinkInLinksArray(obj.links, dctmConstants.LINK_RELATIONS.PERMISSIONS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getPermissionSet': function getPermissionSetOfObject (obj) {
          var link = findLinkInLinksArray(obj.links, dctmConstants.LINK_RELATIONS.PERMISSION_SET)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'setPermissionSet': function setPermissionSetOfObject (obj, newPermissionSet) {
          var link = findLinkInLinksArray(obj.links, dctmConstants.LINK_RELATIONS.PERMISSION_SET)
          link = appendURLParams(link, arguments)
          return this.put(link, newPermissionSet)
        },
        'getUsers': function getUsers (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.USERS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'createUser': function createUser (repository, newUser) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.USERS)
          link = appendURLParams(link, arguments)
          return this.post(link, newUser)
        },
        'getGroups': function getGroups (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.GROUPS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'createGroup': function createUser (repository, newGroup) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.GROUPS)
          link = appendURLParams(link, arguments)
          return this.post(link, newGroup)
        },
        'getUserMembers': function getUserMembers (group) {
          var link = findLinkInLinksArray(group.links, dctmConstants.LINK_RELATIONS.USERS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getSubGroups': function getSubGroups (group) {
          var link = findLinkInLinksArray(group.links, dctmConstants.LINK_RELATIONS.GROUPS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'addUserMember': function addUserMember (group, user) {
          var link = findLinkInLinksArray(group.links, dctmConstants.LINK_RELATIONS.USERS)
          link = appendURLParams(link, arguments)
          var userLink = findLinkInLinksArray(user.links, dctmConstants.LINK_RELATIONS.SELF)
          return this.post(link, {href: userLink})
        },
        'addSubGroup': function addUserMember (group, sub) {
          var link = findLinkInLinksArray(group.links, dctmConstants.LINK_RELATIONS.GROUPS)
          link = appendURLParams(link, arguments)
          var subLink = findLinkInLinksArray(sub.links, dctmConstants.LINK_RELATIONS.SELF)
          return this.post(link, {href: subLink})
        },
        'getCurrentUser': function getCurrentUser (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.CURRENT_USER)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getUserHome': function getUserHome (user) {
          var link = findLinkInLinksArray(user.links, dctmConstants.LINK_RELATIONS.DEFAULT_FOLDER)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getCurrentUserPreferences': function getCurrentUserPreferences (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.CURRENT_USER_PREFERENCES)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'createCurrentUserPreference': function createCurrentUserPreference (repository, newPref) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.CURRENT_USER_PREFERENCES)
          link = appendURLParams(link, arguments)
          return this.post(link, newPref)
        },
        'getCheckedoutObjects': function getCheckedoutObjects (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.CHECKED_OUT_OBJECTS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getTypes': function getTypes (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.TYPES)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getFormats': function getFormats (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.FORMATS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getNetworkLocations': function getNetworkLocations (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.NETWORK_LOCATIONS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getRelations': function getRelations (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.RELATIONS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getRelationTypes': function getRelationTypes (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.RELATION_TYPES)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },

        'getAspectTypes': function getAspectTypes (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.ASPECT_TYPES)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getACLs': function getACLs (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.ACLS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getAssociations': function getAssociations (acl) {
          var link = findLinkInLinksArray(acl.links, dctmConstants.LINK_RELATIONS.ASSOCIATIONS)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getBatchCapabilities': function getBatchCapabilities (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.BATCH_CAPABILITIES)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getSavedSearches': function getSavedSearches (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.SAVED_SEARCHES)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getSearchTemplates': function getSearchTemplates (repository) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.SEARCH_TEMPLATES)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'getItemFromFeedEntry': function getItemFromFeedEntry (entry) {
          var link = findSelfLinkFromEntry(entry)
          link = appendURLParams(link, arguments)
          return this.get(link)
        },
        'createItem': function createItem (resource, newItem) {
          var link = findLinkInLinksArray(resource.links, dctmConstants.LINK_RELATIONS.SELF)
          link = appendURLParams(link, arguments)
          return this.post(link, newItem)
        },
        'updateItem': function updateItem (resource, newItem) {
          var link = findLinkInLinksArray(resource.links, dctmConstants.LINK_RELATIONS.EDIT)
          if (!link) {
            throw Error('No permission to edit resource "' + findLinkInLinksArray(resource, dctmConstants.LINK_RELATIONS.SELF) + '".')
          }
          link = appendURLParams(link, arguments)
          return this.post(link, newItem)
        },
        'deleteItem': function deleteItem (resource) {
          var link = findLinkInLinksArray(resource.links, dctmConstants.LINK_RELATIONS.DELETE)
          if (!link) {
            throw Error('No permission to delete resource "' + findLinkInLinksArray(resource, dctmConstants.LINK_RELATIONS.SELF) + '".')
          }
          link = appendURLParams(link, arguments)
          return this['delete'](link)
        },
        'simpleSearch': function simpleSearch (repository, q) {
          var link = findLinkInLinksArray(repository.links, dctmConstants.LINK_RELATIONS.SEARCH)
          link = appendURLParams(link, [dctmConstants.QUERY_PARAMS.Q, q])
          link = appendURLParams(link, arguments)
          return this.get(link)
        }
      }

      return new DCTMRestClient(clientBase)
    }]
  })

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
      return findLinkInLinksArray(entry.content.links, dctmConstants.LINK_RELATIONS.SELF)
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
}(angular);
