angular.module('fastscope', ['documentLocationParams'])
.directive('fastscope', ['$document', '$http', '$q', '$parse', '$interpolate', 'documentLocationParams', function($document, $http, $q, $parse, $interpolate, documentLocationParams) {
    var instanceCounter = 0;
    function getId($scope, $attrs) {
        var id;
        if (isNotEmpty($attrs.fastscopeId)) {
            id = interpolateParse($scope, $attrs.fastscopeId);
            if (!id) {
                id = $interpolate($attrs.fastscopeId)($scope);
            }
        }
        if (!id) {
            id = 'fastscope-' + instanceCounter;
        }
        return id;
    }
    function isNotEmpty(value) {
        return angular.isDefined(value) && value !== '';
    }
    function getLocationParams($scope, $attrs) {
        var params = {};
        if (isNotEmpty($attrs.fastscopeForwardLocationParams) && interpolateParse($scope, $attrs.fastscopeForwardLocationParams)) {
            params = documentLocationParams.get();
        }
        return params;
    }
    function toFormUrlEncoded(obj) {
        var query = [], name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (angular.isArray(value)) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query = query.concat(toFormUrlEncoded(innerObj));
                }
            }
            else if (angular.isObject(value)) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query = query.concat(toFormUrlEncoded(innerObj));
                }
            }
            else if (value !== undefined && value !== null) {
                query.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
            }
        }
        return query.join('&');
    }
    function isEnabled($scope, $attrs) {
        var enabled = true;
        if (isNotEmpty($attrs.fastscopeEnabled)) {
            enabled = interpolateParse($scope, $attrs.fastscopeEnabled);
        }
        return enabled;
    }
    function getDataName($attrs) {
        var dataName = 'fastscopeData';
        if (isNotEmpty($attrs.fastscopeDataName)) {
            dataName = $interpolate($attrs.fastscopeDataName)();
        }
        return dataName;
    }
    function getParams($scope, $attrs) {
        var params = {};
        if (isNotEmpty($attrs.fastscopeParams)) {
            params = interpolateParse($scope, $attrs.fastscopeParams);
        }
        return params;
    }
    function getMethod($scope, $attrs) {
        var method = 'get';
        if (isNotEmpty($attrs.fastscopeMethod)) {
            method = $interpolate($attrs.fastscopeMethod)($scope);
        }
        return method;
    }
    function getCallback($scope, attr) {
        return $parse(attr);
    }
    function areParamsExposed($scope, $attrs) {
        var exposed = false;
        if (isNotEmpty($attrs.fastscopeExposeParams)) {
            exposed = interpolateParse($scope, $attrs.fastscopeExposeParams);
        }
        return exposed;
    }
    function isFormUrlEncoded($scope, $attrs) {
        var urlEncoded = false;
        if (isNotEmpty($attrs.fastscopeFormUrlEncoded)) {
            urlEncoded = interpolateParse($scope, $attrs.fastscopeFormUrlEncoded);
        }
        return urlEncoded;
    }
    function getExposedParamsName($attrs) {
        var exposedName = 'fastscopeParams';
        if (isNotEmpty($attrs.fastscopeExposedParamsName)) {
            exposedName = $attrs.fastscopeExposedParamsName;
        }
        return exposedName;
    }
    function getWatched($scope, $attrs) {
        return $attrs.fastscopeWatch;
        return interpolateParse($scope, $attrs.fastscopeWatch);
    }
    function interpolateParse($scope, value) {
        return $parse($interpolate(value)($scope))($scope);
    }
    function appendRequestTransform(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    }

    var cancelers = {};
    function update(id, $scope, $element, $attrs) {
        var url = $interpolate($attrs.fastscope)();
        var dataName = getDataName($attrs);

        // scope default data
        if (isNotEmpty($attrs.fastscopeDefaultData)) {
            $scope[dataName] = interpolateParse($scope, $attrs.fastscopeDefaultData);
        }

        var locationParams = getLocationParams($scope, $attrs);
        var params = getParams($scope, $attrs);
        var allParams = angular.extend(locationParams, params);
        if (areParamsExposed($scope, $attrs)) {
            $scope[getExposedParamsName($attrs)] = allParams;
        }
        var method = getMethod($scope, $attrs);
        var headers = {};
        var beforeLoadCallback = getCallback($scope, $attrs.fastscopeBeforeLoadCallback);
        var successCallback = getCallback($scope, $attrs.fastscopeSuccessCallback);
        var errorCallback = getCallback($scope, $attrs.fastscopeErrorCallback);
        var beforeLoadCallbackFn = function beforeLoadCallbackFn() {
            if (beforeLoadCallback) {
                beforeLoadCallback($scope, {
                    id: id
                });
            }
        };
        var successCallbackFn = function successCallbackFn(data, code, headers) {
            delete cancelers[id];
            $scope[dataName] = data;
            if (successCallback) {
                successCallback($scope, {
                    id: id,
                    method: method,
                    data: data,
                    code: code,
                    headers: headers
                });
            }
        };
        var errorCallbackFn = function errorCallbackFn(data, code, headers) {
            delete cancelers[id];
            if (errorCallback) {
                errorCallback($scope, {
                    id: id,
                    method: method,
                    data: data,
                    code: code,
                    headers: headers
                });
            }
        };

        beforeLoadCallbackFn();

        if (cancelers[id]) {
            cancelers[id].resolve();
            delete cancelers[id];
        }
        cancelers[id] = $q.defer();
        var promise;
        switch (method) {
            case 'get':
            case 'delete':
            case 'head':
            case 'jsonp':
            default:
                promise = $http[method](url, {
                    timeout: cancelers[id].promise,
                    headers: headers,
                    params: allParams
                });
                break;
            case 'post':
            case 'put':
            case 'patch':
                var encoded = isFormUrlEncoded($scope, $attrs);
                if (encoded) {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
                }
                promise = $http[method](url, allParams, {
                    timeout: cancelers[id].promise,
                    headers: headers,
                    transformRequest: encoded ? toFormUrlEncoded : $http.defaults.transformRequest
                });
                break;
        }
        promise.success(successCallbackFn).error(errorCallbackFn);
    }
    return {
        restrict: 'A',
        controller: ['$scope', '$attrs', function controller($scope, $attrs) {
            if (!isEnabled($scope, $attrs)) {
                return;
            }
            instanceCounter++;
        }],
        link: function link($scope, $element, $attrs) {
            if (!isEnabled($scope, $attrs)) {
                return;
            }
            var id = getId($scope, $attrs);
            var watched = getWatched($scope, $attrs);
            if (watched) {
                $scope.$watch(watched, function watcher(oldValue, newValue, $scope) {
                    update(id, $scope, $element, $attrs);
                }, true);
            }
            else {
                update(id, $scope, $element, $attrs);
            }
        }
    };
}]);
