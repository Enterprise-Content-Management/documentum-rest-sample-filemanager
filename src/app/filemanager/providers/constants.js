angular.module('dctmRestConstants', [])
  .constant(
    'dctmConstants', {
      LOGIN_INFO: {
        USERNAME: 'username',
        PASSWORD: 'password',
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
        FORMAT: 'format'
      },
      MIME: {
        VND_DCTM_JSON: 'application/vnd.emc.documentum+json',
        HOME_JSON: 'application/home+json',
        APP_JSON: 'application/json',
        ANY_JSON: 'application/*+json',
        ANY: '*/*'
      },
      REPOSITORY_RESOURCE: 'repoResource'
    })

