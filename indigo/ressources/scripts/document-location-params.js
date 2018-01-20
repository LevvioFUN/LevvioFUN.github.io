angular.module('documentLocationParams', [])
.factory('documentLocationParams', ['$document', function($document) {

    function getLocation() {
        return ($document[0] || {}).location;
    }
    function getSearch() {
        return getLocation().search || "";
    }
    function getParams() {
        var search = getSearch();
        if (search.indexOf('?') !== -1) {
            search = search.split(/\?(.+)?/)[1];
        }
        return parseKeyValue(search);
    }
    function getOnly(list) {
        var allParams = getParams();
        var onlyParams = {};
        angular.forEach(list, function (value) {
            if (allParams.hasOwnProperty(value)) {
                onlyParams[value] = allParams[value];
            }
        });
        return onlyParams;
    }
    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {
        // Ignore any invalid uri component
        }
    }
    function parseKeyValue(keyValue) {
        var obj = {};
        angular.forEach((keyValue || '').split('&'), function(keyValue) {
            var splitPoint, key, val;
            if (keyValue) {
                key = keyValue = keyValue.replace(/\+/g, '%20');
                splitPoint = keyValue.indexOf('=');
                if (splitPoint !== -1) {
                    key = keyValue.substring(0, splitPoint);
                    val = keyValue.substring(splitPoint + 1);
                }
                key = tryDecodeURIComponent(key);
                if (angular.isDefined(key)) {
                    val = angular.isDefined(val) ? tryDecodeURIComponent(val) : true;
                    if (!hasOwnProperty.call(obj, key)) {
                        obj[key] = val;
                    } else if (angular.isArray(obj[key])) {
                        obj[key].push(val);
                    } else {
                        obj[key] = [obj[key], val];
                    }
                }
            }
        });
        return obj;
    }

    return {
        get: getParams,
        getOnly: getOnly
    };
}]);