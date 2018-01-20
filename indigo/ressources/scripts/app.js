var landingApp = angular.module('landingApp', ['fastscope', 'documentLocationParams']);
landingApp
    .config(['$compileProvider', '$locationProvider', function config($compileProvider, $locationProvider) {
        $compileProvider.debugInfoEnabled(true);
        //$locationProvider.html5Mode(true);
    }])
    .controller('landingCtrl', ['$scope', '$location', '$http', '$q', '$sce', 'documentLocationParams', '$window', '$document', function controller($scope, $location, $http, $q, $sce, documentLocationParams, $window, $document) {
        $scope.showMessage = false;
        $scope.message = '';
        $scope.description = true;
        $scope.email = false;
        $scope.messageOk = null;
        $scope.messageNok = null;
        $scope.imgRouteUrl = '';
        /*performance detect */
        $scope.demo = false;
        $scope.demoRedirect = [];
        $scope.searchClickStyle = {'background-color': 'white'};
        /*performance detect  end*/

        $scope.showContactForm = function () {
            $scope.description = !$scope.description;
            $scope.email = !$scope.email;
        }
        $scope.showHorairesForm = function () {
            $scope.horaires = !$scope.horaires;
        }


        $scope.searchParams = documentLocationParams.get();
        $scope.isStatic = !!document.location.search.match(/(&|\?)static/);

        var successCallback = function (id, method, data, code, headers) {
            $scope.searchResponseLoaded = true;
        };

        $scope.demoPerformance = function(){
            var param = documentLocationParams.getOnly(['demo']);
            if (param['demo']&&(param['demo'] == 'true')) {
                $(document).ready(function(){
                    $('body').append('<div class="demo" id="demo" ng-show="demo"> <div class="content"> <div class="content-imp content-rowImp"> <div class="row" id="rowImp"> <div> <input type="search" placeholder="imp link" name="searchImp" class="searchImp"> <span class="circle"></span> </div> <output class="outputImp"></output> </div> </div> <button class="add-link" onclick="clone(\'rowImp\');">add link</button> </div> <div class="content"> <p>First click on the creative</p> <div class="content-imp content-rowClick"> <div class="row" id="rowClick"> <div> <input type="search" placeholder="click link" name="searchClick" disabled class="searchClick"> <span class="circle" ng-style="searchClickStyle" ></span> </div> <output class="outputImp"></output> </div> </div> <button class="add-link" onclick="clone(\'rowClick\');">add click</button> </div> </div>');
                    $('body').append('<script  src="../ressources/scripts/performance-detect.js" > </script>');
                    $('body').append('<link rel="stylesheet" href="../ressources/css/performance.css">');
                });
                $scope.demo = true;
            }
        }
        $scope.demoPerformance();

        var errorCallback = function (id, method, data, code, headers) {
            $scope.searchResponse = ($scope.searchResponse || {});
            $scope.searchResponse.error = true;
            $scope.searchResponse.message = 'Couldn\'t load data.';
        };
        $scope.fsSuccess = successCallback;
        $scope.fsError = errorCallback;

        var toFormUrlEncoded = function toFormUrlEncoded(obj) {
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
        };

        $scope.qrCode = function () {
            return $sce.trustAsResourceUrl('https://chart.googleapis.com/chart?cht=qr&chl=' + encodeURIComponent(document.location) + '&chs=180x180&choe=UTF-8&chld=L|2');
        };





        $scope.redirect = function (url, urlAtlas) {
            if (vectrk) {
                urlAtlas = $scope.setParameterForAtlas(urlAtlas);
                if ($scope.demo) $scope.demoRedirect.push({name: urlAtlas}); //performance detect
                var redirect = vectrk('augmentUrl', $scope.toAbsoluteUrl(url));
                urlAtlas = urlAtlas.replace('[redirection]', encodeURIComponent(redirect));
                var data = vectrk('url', 'adv_ban_cli', { v_n: 'click', v_rur: urlAtlas }, true);
                if ($scope.demo) $scope.demoRedirect.push({name: data});
                window.open(data);
            }
        }

        $scope.toAbsoluteUrl = function (url) {
            return (function (a) {
                a.pop();
                a.push('');
                return a;
            })(document.location.toString().replace(document.location.search, '').split('/')).join('/') + url;
        };

        $scope.setParameterForAtlas = function (url) {
            var trakingParameters = documentLocationParams.getOnly(['v_idfa', 'v_os']);
            var os = (trakingParameters['v_os'] + '').toUpperCase();
            if (os.indexOf('android'.toUpperCase())!==-1) {
                url = url.replace('aaid=', 'aaid=' + trakingParameters['v_idfa'])
            }
            if (os.indexOf('ios'.toUpperCase())!==-1) {
                url = url.replace('idfa=', 'idfa=' + trakingParameters['v_idfa'])
            }
            url = url.replace('cache=', 'cache=' + (new Date().getTime()));
            return url;
        };


        $scope.pixelVisit = function(url){
            new Image().src = $scope.setParameterForAtlas(url);
        }

        $scope.getMapUrl = function getMapUrl(destinationLat, destinationLng) {
            if (destinationLat && destinationLng) {
                //var url = 'http://maps.google.com/maps?saddr=' + $scope.searchParams.lat + ',' + $scope.searchParams.lng + '&daddr=' + destinationLat +',' + destinationLng;
                var url = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyAzf_Bh3RtKIKLpv2mg-wDiE2bKPWPZnP0&origin=' + $scope.searchParams.v_geo + '&destination=' + destinationLat + ',' + destinationLng;
                return $sce.trustAsResourceUrl(url);
            }
            return null;
        };


        $scope.locatorSelectStore = function (store) {
            $scope.locatorSelectedStore = store;
            if ($scope.locatorSelectedStore != null) {
                $("#magasin").addClass("magasin-show");
            }else{
                $("#magasin").removeClass("magasin-show");
            }
        };
        $scope.locatorSelectedStoreUrl = function () {
            if ($scope.locatorSelectedStore) {
                var params = documentLocationParams.getOnly(['v_geo', 'id']);
                params.id = $scope.locatorSelectedStore.id;
                params['tab-itineraire'] = '';
                return vectrk('augmentUrl', document.location.pathname + '?' + toFormUrlEncoded(params));
            }
            return '#';
        }
        $scope.offerUrl = function (offer) {
            var params = documentLocationParams.getOnly(['v_geo', 'id']);
            params.t = offer;
            return document.location.pathname + '?' + toFormUrlEncoded(params);
        }

        $scope.downloadCoupon = function (src) {
            $window.location.assign(src);
        };


        $scope.searchGeoloc = function searchGeoloc($event) {
            if (!navigator.geolocation) {
                alert('La géolocalisation n\'est pas disponible sur votre  .');
                return;
            }

           function error() {
                alert('Votre géolocalisation n\'a pas pu être déterminée.');
            };

           navigator.geolocation.getCurrentPosition(function success(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

               $scope.$apply(function geolocApplyToScope() {
                    $scope.searchParams = angular.extend($scope.searchParams, {
                       v_geo: latitude + ',' + longitude
                    });
                });
                var params = documentLocationParams.get();
                params['v_geo'] = latitude + ',' + longitude;
                document.location.replace(vectrk('augmentUrl', document.location.pathname + '?' + toFormUrlEncoded(params)));
            }, error);
        };


    }])
    .filter('distance', function () {
        return function distanceFilter(input) {
            if (!angular.isDefined(input)) {
                return;
            }
            input = Number(input);
            var unit = 'm';
            if (input > 999) {
                var precision = 2;
                if (input > 9999) {
                    precision = 0;
                }
                input = (input / 1000).toFixed(precision);
                unit = 'km';
            }
            return input + unit;
        };
    })
    .filter('unsetspace', function () {
        return function unsetspaceFilter(input) {
            if (!angular.isDefined(input)) {
                return;
            }
            input = input.replace(' ','')

            return input;
        };
    })
    .filter('time', function () {
        return function distanceFilter(input) {
            if (!angular.isDefined(input)) {
                return;
            }
            input = Number(input);
            var unit = 'min';

            var rest = input % 60;
            return input > 60 ? Math.floor(input / 60) + "h" + (rest == 0 ? "" : rest < 10 ? "0" + rest + unit : rest + unit) : input + unit;
        };
    })
    .filter('paragraph', ['$sce', function ($sce) {
        return function paragraph(input) {
            return $sce.trustAsHtml((input || '').split("\n").map(function (v) {
                return '<p>' + v + '</p>';
            }).join("\n"));
        }
    }])
    .directive('tabPanel', ['$document', function ($document) {
        var allTabs = [];
        return {
            restrict: 'A',
            link: function link($scope, $element, $attrs) {
                allTabs.push($element);

                var $panel = angular.element($document[0].getElementById($attrs.tabPanel));
                var $tab = angular.element($document[0].getElementById('tab-' + $attrs.tabPanel));
                $element.data('panel-el', $panel);
                $element.data('tab-el', $tab);

                $element.on('click', function () {
                    var onAction = $scope.onTabPanelAction || angular.noop;
                    var $this = angular.element(this);
                    var $panel = $this.data('panel-el');
                    var $tab = $this.data('tab-el');
                    var isOpened = $tab.hasClass('actif');
                    var forceOpen = $this.hasClass('forceOpen');
                    var mainBlock = $('.description');
                    if ($this.hasClass('forceCloseAll')) {
                        angular.forEach(allTabs, function ($tab) {
                            var $p = $tab.data('panel-el');
                            var $t = $tab.data('tab-el');
                            onAction.apply($scope, [$p, 'close']);
                            $t.removeClass('actif');
                            $p.removeClass('opened');
                            mainBlock.removeClass('hidden');
                            $p.slideUp(200);
                        });
                        return;
                    }
                    if (!isOpened || forceOpen) {
                        angular.forEach(allTabs, function ($tab) {
                            var $p = $tab.data('panel-el');
                            var $t = $tab.data('tab-el');
                            if (!$p.is($panel)) {
                                onAction.apply($scope, [$panel, 'close']);
                                $t.removeClass('actif');
                                $p.removeClass('opened');
                                mainBlock.removeClass('hidden');
                                $p.slideUp(200);
                            }
                        });
                        if (!isOpened) {
                            onAction.apply($scope, [$panel, 'open']);
                            $tab.addClass('actif');
                            $panel.addClass('opened');
                            mainBlock.addClass('hidden');
                            $panel.slideDown(200, function () {
                                $('#contenu').animate({
                                    scrollTop: $tab.offset().top/* - 100*/
                                });
                            });
                        }
                    } else {
                        onAction.apply($scope, [$panel, 'close']);
                        $tab.removeClass('actif');
                        $panel.removeClass('opened');
                        mainBlock.removeClass('hidden');
                        $panel.slideUp(200);
                    }
                })
            }
        };
    }])
    .directive('tagPlan', ['documentLocationParams', '$timeout', function (documentLocationParams, $timeout) {
        return {
            link: function link(scope, element, attrs) {
                if (!window.vectrk) {
                    return;
                }
                $(element).on('click', '*[data-tag-name]:not(.tag-plan-internal)', function (event) {
                    var type = $(this).data('tag-type') || 'adv_cus';
                    vectrk(type, {
                        v_n: $(this).data('tag-name')
                    });
                });
                vectrk('init', attrs.tagPlan, attrs.tagPlanPage);

                var timer = function(){
                    if (attrs.tagPlanDco !== '') {
                        vectrk(attrs.tagPlanType , { v_dco: attrs.tagPlanDco});
                    }else{
                        vectrk(attrs.tagPlanType);
                    }
                }
                $timeout(timer, 1000);
            }
        }
    }]);
