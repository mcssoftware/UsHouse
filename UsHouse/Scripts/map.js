var memberDictionary;
var selectedMemberLocation = null; // for member from url

function convertMemberListToDictionary(memberList) {
    var memberIdMatch = /\?memberId=(.*)#/gi.exec(location.href);
    memberDictionary = {};
    for (var i = 0; i < memberList.Members.length; i++) {
        var memberInfo = memberList.Members[i];
        try {
            var state = memberInfo.congresses[0].stateCode;
            var match = /(.*)\s\(.*\)/gi.exec(state);
            if (match !== null && typeof match[1] !== "undefined") {
                state = match[1];
            }
            if (typeof memberDictionary[state] === "undefined") {
                memberDictionary[state] = [];
            }
            if (memberIdMatch !== null && memberInfo._id === memberIdMatch[1] && memberInfo.congresses.length > 0) {
                var data = memberInfo.congresses[0];
                selectedMemberLocation = {
                    state: seperateStateCode(data.stateCode).name,
                    districtNum: removeOrdinal(data.stateDistrict),
                };
            }
            memberDictionary[state].push(memberInfo);
        } catch (e) { }
    }
}
var dojoConfig = {
    has: {
        "esri-featurelayer-webgl": 1
    }
};

var loadingMap = false;
function initializeMap() {
    if (loadingMap) return;
    //loadingMap = true;
    var currentWindowSize = window.outerWidth;
    window.onresize = function () {
        if ((currentWindowSize > 768 && window.outerWidth <= 768) || (currentWindowSize <= 768 && window.outerWidth > 768)) {
            loadingMap = false;
        }
    };
    var stateDictionary = {};
    require([
        "esri/WebMap",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Search",
        "esri/tasks/Locator",
        "esri/widgets/Home",
        "esri/layers/GraphicsLayer",
        "esri/symbols/PictureMarkerSymbol",
        "dojo/domReady!"
    ], function (WebMap, MapView, FeatureLayer, Search, Locator, Home, GraphicsLayer, PictureMarkerSymbol) {
        var selectedState = null;
        // var selectedDistrict = null;
        var hoverhighlight = null;
        var searchWidgets;
        var usStatelayer = new FeatureLayer({
            url: "https://services1.arcgis.com/o90r8yeUBWgKSezU/arcgis/rest/services/US_Territories/FeatureServer",
            outFields: ["*"],
            renderer: {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [232, 202, 209, 0.1],
                    outline: {
                        color: [128, 128, 128],
                        width: 0.7
                    }
                }
            }
        });

        var popupTemplate = {
            title: "Info:",
            content: function (features) {
                if (isDefined(features) && isDefined(features.graphic) && isDefined(features.graphic.attributes)) {
                    return getDistrictInfoByGeoid(features.graphic.attributes);
                } else {
                    return "";
                }
            }
        };

        var usdistrictlayer = new FeatureLayer({
            url: "https://services1.arcgis.com/o90r8yeUBWgKSezU/arcgis/rest/services/cb_2017_us_cd115_5m/FeatureServer",
            outFields: [propertyNames.DistrictLayer.StateId, propertyNames.DistrictLayer.DistrictNumber],
            popupEnabled: true,
            visible: true,
            definitionExpression: "1=0",
            popupTemplate: popupTemplate,
            renderer: {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [143, 204, 195, 0.5],
                    outline: {
                        color: [20, 29, 52],
                        width: .7
                    }
                }
            }
        });

        /******************************************************************
         * Set up Graphics Layer for adding pin to the searched address. This layer is not visibile by default.
         ******************************************************************/
        var graphicsLayer = new GraphicsLayer({
            graphics: []
        });

        var map = new WebMap({
            portalItem: { // autocasts as new PortalItem()
                id: "70943bda8a37419f863a361ccc00a216"
            },
            layers: [usStatelayer, usdistrictlayer, graphicsLayer]
        });
        var mapview = new MapView({
            container: "mapContainer",
            map: map,
            zoom: 4,
            center: [-96.07963094180764, 38.77845724234052], // longitude, latitude
            popup: {
                title: "Info:",
                highlightEnabled: true,
                dockEnabled: true,
                dockOptions: {
                    buttonEnabled: false,
                    breakpoint: false,
                    position: "bottom-right"
                }
            },
            ui: {
                components: ["attribution", "zoom"]
            },
            constraints: {
                minZoom: 4,
                rotationEnable: false,
                snapToZoom: false,
            },
            highlightOptions: {
                color: [255, 241, 58],
                fillOpacity: 0.4
            }
        });

        function initializeMapUIComponent() {
            /******************************************************************
             * Set up home icon
             ******************************************************************/
            var homeBtn = new Home({
                view: mapview
            });
            // Add the home button to the top left corner of the view
            mapview.ui.add(homeBtn, "top-left");
            /******************************************************************
             * Set up search
             ******************************************************************/
            var sources = [{
                featureLayer: usStatelayer,
                searchFields: ["NAME"],
                displayField: "NAME",
                exactMatch: false,
                outFields: ["*"],
                name: "US States",
                placeholder: "example: colorado",
                maxResults: 3,
                maxSuggestions: 3,
                suggestionsEnabled: true,
                minSuggestCharacters: 0
            },
            {
                locator: new Locator({
                    url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
                    countryCode: "US"
                }),
                singleLineFieldName: "SingleLine",
                outFields: ["Addr_type", "City", "StAddr"],
                name: "Address lookup",
                localSearchOptions: {
                    minScale: 300000,
                    distance: 50000
                },
                placeholder: "Search Geocoder",
                maxResults: 3,
                maxSuggestions: 6,
                suggestionsEnabled: true,
                minSuggestCharacters: 0
            }
            ];
            // intialize search widget
            searchWidgets = new Search({
                view: mapview,
                goToOverride: function (a, b) { }, // remove default goto of search
                sources: sources,
                includeDefaultSources: false
            });
            // add search widget wot mapview
            mapview.ui.add(searchWidgets, {
                position: "top-right",
                index: 2
            });

            searchWidgets.on("search-complete", function (event) {
                onSearchComplete(event);
            });

            searchWidgets.on("search-clear", function (event) {
                clearPoint();
            });

            $("#mapLink").on("click", function () {
                selectedState = "";
                usdistrictlayer.popupEnabled = false;
                usdistrictlayer.definitionExpression = "1=0";
                searchWidgets.clear();
                mapview.popup.close();
                clearPoint();
                homeBtn.go();
            });
        }

        /******************************************************************
         * Event handler
         ******************************************************************/
        /**
         *@summary: function that handles the events for all layers
         * @param {*} view
         */
        function enableEventsOnMapView(view) {
            if (!/\?memberId=(.*)#/gi.exec(location.href)) {
                selectedMemberLocation = null;
            }
            view.whenLayerView(usStatelayer).then(function () {
                view.whenLayerView(usdistrictlayer).then(function (layerView) {
                    if (selectedMemberLocation !== null) {
                        selectDefaultDistrict();
                    }
                    var promise;
                    var tooltip = createTooltip();
                    view.on("pointer-move", function (event) {
                        if (promise) {
                            promise.cancel();
                        }
                        tooltip.hide();
                        promise = view.hitTest(event).then(function (response) {
                            promise = null;
                            if (hoverhighlight) {
                                hoverhighlight.remove();
                                hoverhighlight = null;
                            }
                            if (response.results.length) {
                                var hitlayer = response.results.filter(function (result) {
                                    return result.graphic.layer === usdistrictlayer;
                                });
                                if (hitlayer.length > 0) {
                                    var feature = hitlayer[0].graphic;
                                    var stateName = stateDictionary[feature.attributes[propertyNames.DistrictLayer.StateId]];
                                    var districtNumber = feature.attributes[propertyNames.DistrictLayer.DistrictNumber];
                                    if (districtNumber === "00") {
                                        districtNumber = "At Large";
                                    }
                                    if (districtNumber === "98") {
                                        districtNumber = "Delegation";
                                    }
                                    tooltip.show(response.screenPoint, stateName + " - " + districtNumber);
                                    var propertyId = usdistrictlayer.objectIdField;
                                    // if (selectedDistrict === null || selectedDistrict[propertyId] !== feature.attributes[propertyId]) {
                                    hoverhighlight = layerView.highlight([feature.attributes[propertyId]]);
                                    // }
                                }
                            }
                        });
                    });
                    view.on("immediate-click", function (event) {
                        view.hitTest(event).then(function (response) {
                            if (response.results.length > 0) {
                                var feature = response.results.filter(function (result) {
                                    return result.graphic.layer === usStatelayer;
                                })[0].graphic;
                                var stateFp = feature.attributes.STATEFP;
                                if (selectedState !== stateFp) {
                                    if (usdistrictlayer.popupEnabled) {
                                        usdistrictlayer.popupEnabled = false;
                                    }
                                    stateSelected(stateFp);
                                    goTo(feature.geometry, true);
                                } else {
                                    if (!usdistrictlayer.popupEnabled) {
                                        usdistrictlayer.popupEnabled = true;
                                    }
                                    if (isDefined(mapview.popup)) {
                                        mapview.popup.collapsed = false;
                                    }
                                }
                            }
                        });
                    });
                    usStatelayer.queryFeatures({
                        where: "1=1", // using always true condition 
                        returnGeometry: false,
                        outFields: [propertyNames.StateLayer.Name, propertyNames.StateLayer.Id]
                    }).then(function (stateQueryResponse) {
                        var features = stateQueryResponse.features;
                        $.each(features, function (index, value) {
                            stateDictionary[value.attributes[propertyNames.StateLayer.Id]] = value.attributes[propertyNames.StateLayer.Name];
                        });
                    });
                    $(".esri-icon.esri-icon-home").on("click", function (event) {
                        selectedState = "";
                        usdistrictlayer.popupEnabled = false;
                        usdistrictlayer.definitionExpression = "1=0";
                        searchWidgets.clear();
                        view.popup.close();
                        clearPoint();
                    });

                });
            });
        }

        initializeMapUIComponent();
        enableEventsOnMapView(mapview);
        /** function that handles the district rendering and popup open when member's data from querystring is received */
        function selectDefaultDistrict() {
            usStatelayer.queryFeatures({
                where: propertyNames.StateLayer.Name + "='" + selectedMemberLocation.state + "'",
                returnGeometry: true,
                outFields: [propertyNames.StateLayer.Id]
            }).then(function (response) {
                var features = response.features;
                var stateFp = features[0].attributes[propertyNames.StateLayer.Id];
                stateSelected(stateFp);
                goTo(features[0].geometry, true);
                usdistrictlayer.queryFeatures({
                    where: propertyNames.DistrictLayer.DistrictNumber + "=" + selectedMemberLocation.districtNum + " and " +
                        propertyNames.DistrictLayer.StateId + "=" + stateFp,
                    returnGeometry: true,
                    outFields: ["*"]
                }).then(function (districtResponse) {
                    usdistrictlayer.popupEnabled = true;
                    var features = districtResponse.features;
                    mapview.popup.content = (isDefined(features) && isDefined(features[0]) && isDefined(features[0].attributes)) ? getDistrictInfoByGeoid(features[0].attributes) : "";
                    mapview.popup.open();
                });
            });
        }

        /**
         * @summary: the function handles the search completion
         */
        function onSearchComplete(searchEvent) {
            // close popup if any open.
            mapview.popup.close();
            if (searchEvent.results.length > 0) {
                var firstsearchResult = searchEvent.results[0];
                if (firstsearchResult.sourceIndex === 0) {
                    // US State layer search result
                    var searchedFeature = firstsearchResult.results[0].feature;
                    var stateFp = searchedFeature.attributes[propertyNames.StateLayer.Id];
                    if (selectedState !== stateFp) {
                        clearPoint();
                        stateSelected(stateFp);
                        goTo(searchedFeature.geometry, true);
                    }
                }
                if (firstsearchResult.sourceIndex === 1 && firstsearchResult.results.length > 0) {
                    // Geocode result
                    var searchedFeature = firstsearchResult.results[0].feature;
                    // find state using coordinates of search result.
                    usStatelayer.queryFeatures({
                        geometry: searchedFeature.geometry,
                        returnGeometry: true,
                        outFields: [propertyNames.StateLayer.Id]
                    }).then(function (result) {
                        if (result.features.length > 0) {
                            var statefp = result.features[0].attributes[propertyNames.StateLayer.Id];
                            stateSelected(statefp);
                            handleSearch(searchedFeature);
                            goTo(result.features[0].geometry, true);
                        }
                    });
                }
            }
        }

        /**
         * @summary: function to handle what to do when the search is not state or it is deeper than state.
         * Clears previously existing circular points, adds new point and shows popup
         */
        function handleSearch(feature) {
            clearPoint();
            if (isDefined(feature)) {
                if ((isDefined(feature.attributes.City) && feature.attributes.City !== "") ||
                    (isDefined(feature.attributes.StAddr) && feature.attributes.StAddr !== "")) {
                    // ensure popup is enabled if search is address point.
                    if (!usdistrictlayer.popupEnabled) {
                        usdistrictlayer.popupEnabled = true;
                    }
                    addPoint(feature.geometry);
                    usdistrictlayer.queryFeatures({
                        geometry: feature.geometry,
                        returnGeometry: false,
                        outFields: ["*"]
                    }).then(function (response) {
                        if (isDefined(response) && response.features.length > 0) {
                            mapview.popup.open({
                                title: "Info",
                                content: getDistrictInfoByGeoid(response.features[0].attributes)
                            });
                        }
                    });
                }
            }
        }

        /**
         * for adding a circular blue point in the map 
         * geometry: geomerty for where to show the point
         */
        function addPoint(geometry) {
            var marker = new PictureMarkerSymbol({
                url: "/Content/assets/img/map-pin.png",
                width: 32,
                height: 32
            });
            graphicsLayer.add({
                geometry: geometry,
                symbol: marker
            });
        }

        /**
         * @summary: function to handle what happens when click occurs on a statelayer
         * @param {} stateFp 
         */
        function stateSelected(stateFp) {
            if (selectedState != stateFp) {
                selectedState = stateFp;
                usdistrictlayer.definitionExpression = propertyNames.DistrictLayer.StateId + "=" + stateFp;
                if (hoverhighlight) {
                    hoverhighlight.remove();
                    hoverhighlight = null;
                }
            }
        }

        /**
         *  check and remove the point from map
         */
        function clearPoint() {
            if (graphicsLayer.graphics.items.length > 0) {
                graphicsLayer.removeAll();
            }
        }

        /**
         * @summary: this function kis for moving from anywhere to the passed geometry in zoomlevel 7.
         * @param {*} geometry:
         */
        function goTo(geometry, stateBoundry) {
            if (stateBoundry && selectedState == "02") {
                mapview.goTo({
                    center: [-163, 63.17],
                    zoom: 4.7
                }, {
                        duration: 2000,
                        easing: "ease-in-out"
                    });
            } else {
                mapview.goTo({
                    target: geometry,
                }, {
                        duration: 2000,
                        easing: "ease-in-out"
                    }).then(function () {
                        if (mapview.zoom < 12) {
                            mapview.zoom = mapview.zoom - 0.05;
                        } else {
                            mapview.zoom = 12;
                        }
                    });
            }
        }

        /**
         * @summary: popup content for a district. Shows state, district, image & name of representative
         * @param {*} attributes: features attributes
         * @returns
         */
        function getDistrictInfoByGeoid(attributes) {
            if (isDefined(attributes)) {
                // selectedDistrict = attributes;
                var stateId = attributes[propertyNames.DistrictLayer.StateId];
                var districtId = attributes[propertyNames.DistrictLayer.DistrictNumber];
                var stateName = stateDictionary[stateId];
                var stateMembers = memberDictionary[stateName];
                var member = null;
                if (stateMembers.length === 1) {
                    // if there is only one delegate or representative for state
                    member = stateMembers[0];
                } else {
                    // find representative for district number: districtId
                    for (var i = 0; i < stateMembers.length; i++) {
                        var tempmember = stateMembers[i];
                        var memberDistrict = removeOrdinal(tempmember.congresses[0].stateDistrict);
                        if (districtId === memberDistrict) {
                            member = tempmember;
                            break;
                        }
                    }
                }
                if (member != null) {
                    // found member for district.
                    return '<div class="row popup_body"><div class ="col-sm-8"><a href="../members/' + member._id +
                        '"><h1 class ="library-h1" style="padding:0;">' +
                        (member.familyName + ", " + member.givenName + " " + member.middleName).trim() + "</h1></a>" +
                        "<p>" + member.congresses[0].stateCode + " - " +
                        (member.congresses[0].stateDistrict.length > 0 ? member.congresses[0].stateDistrict : member.congresses[0].position) +
                        ", " + member.congresses[0].partyAffiliations[0].name + "</p>" +
                        '</div><div class="col-sm-4" style="min-width:100px;"><a href="../members/' + member._id +
                        '"><img src="/content/assets/img/members/' + member._id + '.jpg"/></a></div></div>';
                }
                if (member == null) {
                    return '<div class="row popup_body"><div class ="col-sm-9"><a href="../members/#Vacancies"><h1 class ="library-h1" style="padding:0;">Vacancy</h1></a>' +
                        "<p> District:" + districtId + " - " + stateName + "</p></div></div></div>";
                }
            }
            // else {
            //     selectedDistrict = null;
            // }
            return "";
        }

        /**
         * Creates a tooltip to display a the construction year of a building.
         */
        function createTooltip() {
            if ($("#mapContainer .tooltip").length > 0) return;
            var tooltip = document.createElement("div");
            var style = tooltip.style;

            tooltip.setAttribute("role", "tooltip");
            tooltip.classList.add("tooltip");

            var textElement = document.createElement("div");
            textElement.classList.add("esri-widget");
            tooltip.appendChild(textElement);

            mapview.container.appendChild(tooltip);

            var x = 0;
            var y = 0;
            var targetX = 0;
            var targetY = 0;
            var visible = false;

            // move the tooltip progressively
            function move() {
                x += (targetX - x) * 0.1;
                y += (targetY - y) * 0.1;

                if (Math.abs(targetX - x) < 1 && Math.abs(targetY - y) < 1) {
                    x = targetX;
                    y = targetY;
                } else {
                    requestAnimationFrame(move);
                }
                style.transform = "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px, 0)";
            }

            return {
                show: function (point, text) {
                    if (!visible) {
                        x = point.x;
                        y = point.y;
                    }

                    targetX = point.x;
                    targetY = point.y;
                    style.opacity = 1;
                    visible = true;
                    textElement.innerHTML = text;

                    move();
                },

                hide: function () {
                    style.opacity = 0;
                    visible = false;
                }
            };
        }
    });

    var Tooltip = {
        tooltip: document.getElementById('tooltip'),
        target: document.body,

        show: function (tip) {
            console.log('show');
            Tooltip.target = this;
            if (!tip || tip == '') {
                return false;
            }
            Tooltip.tooltip.innerHTML = tip;
            if (window.innerWidth < Tooltip.tooltip.offsetWidth * 1.5) {
                Tooltip.tooltip.style.maxWidth = (window.innerWidth / 2) + 'px';
            } else {
                Tooltip.tooltip.style.maxWidth = 320 + 'px';
            }

            var pos_left = Tooltip.target.offsetLeft + (Tooltip.target.offsetWidth / 2) - (Tooltip.tooltip.offsetWidth /
                2),
                pos_top = Tooltip.target.offsetTop - Tooltip.tooltip.offsetHeight - 20;
            Tooltip.tooltip.className = '';
            console.log('(' + pos_left + ', ' + pos_top + ')')
            if (pos_left < 0) {
                pos_left = Tooltip.target.offsetLeft + Tooltip.target.offsetWidth / 2 - 20;
                Tooltip.tooltip.className += ' left';
            }

            if (pos_left + Tooltip.tooltip.offsetWidth > window.innerWidth) {
                pos_left = Tooltip.target.offsetLeft - Tooltip.tooltip.offsetWidth + Tooltip.target.offsetWidth /
                    2 + 20;
                Tooltip.tooltip.className += ' right';
            }

            if (pos_top < 0) {
                var pos_top = Tooltip.target.offsetTop + Tooltip.target.offsetHeight;
                Tooltip.tooltip.className += ' top';
            }

            Tooltip.tooltip.style.left = pos_left + 'px';
            Tooltip.tooltip.style.top = pos_top + 'px';

            Tooltip.tooltip.className += ' show';
        },
        hide: function () {
            console.log('hide');
            Tooltip.tooltip.className = Tooltip.tooltip.className.replace('show', '');
        }
    };
}

/**
* @summary: for cases where "Alabama (Al)" comes in combinations
* @param {any} value
*/
function seperateStateCode(value) {
    var match = /(.*).\(([a-zA-Z]{2})\)$/gi.exec(value);
    return {
        name: match[1],
        code: match[2]
    };
}

/**
* @summary: just a function for convenient use
* @param {*} value
* @returns
*/
function isDefined(value) {
    return value !== null && typeof (value) !== "undefined";
}

function removeOrdinal(value) {
    if (typeof value === "string" && value.length > 0 && value != "At Large") {
        var match = /(.*)(st|nd|rd|th)/gi.exec(value);
        if (isDefined(match) && isDefined(match[1])) {
            var number = parseInt(match[1], 10);
            return (number < 10) ? '0' + number.toString() : number.toString();
        }
    }
    return "00";
}
