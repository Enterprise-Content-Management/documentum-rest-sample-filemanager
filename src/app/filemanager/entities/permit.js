;(function (angular) {
  'use strict'
  angular.module('dctmNgFileManager').factory('permit', function () {
    var Permit = function (permissionSet) {
      var grantedArray = (permissionSet.permitted || []).map(function (entry) {
        var editEntry = {
          accessor: entry.accessor,
          basic: entry['basic-permission'],
          extended: entry['extend-permissions'] ? entry['extend-permissions'].split(',') : [],
          remove: false
        }
        return editEntry
      })
      this.granted = grantedArray
      this.edit = false
    }

    Permit.prototype.increase = function () {
      this.granted.push({
        accessor: '',
        basic: '',
        extended: '',
        remove: false
      })
    }

    Permit.prototype.toPermissionSet = function () {
      var permissionSet = {
        permitted: []
      }
      this.granted.forEach(function (entry) {
        if (!entry.remove) {
          permissionSet.permitted.push({
            accessor: entry.accessor,
            'basic-permission': entry.basic,
            'extend-permissions': arrayToString(entry.extended)
          })
        }
      })
      return permissionSet
    }

    function arrayToString (items) {
      return items ? (items.map(function (item) {
        return item
      })).join(',') : ''
    }

    return Permit
  })
})(angular);
