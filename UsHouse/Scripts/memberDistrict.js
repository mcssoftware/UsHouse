
var dojoConfig = {
    has: {
        "esri-featurelayer-webgl": 1
    }
};
require([
    "esri/Map",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "dojo/domReady!"
], function (Map, WebMap, MapView, FeatureLayer, GraphicsLayer, Graphic) {
    var map;
    var mapview;
    function isDefined(value) {
        if (value !== null && typeof value !== "undefined") return true;
        return false;
    }

    // for getting value after removing ordinal and in 2 digit format.
    function removeOrdinal(value) {
        if (isDefined(value)) {
            if (value.toLowerCase() === "at large") {
                return "00";
            }
            var match = /(.*)(st|nd|rd|th)/gi.exec(value);
            if (isDefined(match) && isDefined(match[1])) {
                var number = parseInt(match[1], 10);
                return (number < 10) ? '0' + number.toString() : number.toString();
            }
        }
    }

    // state code is in format "{StateName} ({stateCode})" so to get name.
    function getStateName(value) {
        if (isDefined(value)) {
            var match = /(.*)\s\(.*\)/gi.exec(value);
            if (isDefined(match) && isDefined(match[1])) {
                return match[1];
            }
        }
    }

    var mapContainer = document.getElementById("membersMap");
    var state = document.getElementById("stateCode");
    var district = document.getElementById("stateDistrict");
    if (!isDefined(mapContainer) || !isDefined(state) || !isDefined(district)) return;
    var stateName = getStateName($(state).val());
    var districtNumber = removeOrdinal($(district).val());
    if (!isDefined(districtNumber) && $(district).val() === "") {
        districtNumber = 98; // Resident Commissioner District or Delegate District (at Large)
    }
    if (!isDefined(stateName) || !isDefined(districtNumber)) return;
    var usStatelayer = new FeatureLayer({
        url: "https://services1.arcgis.com/o90r8yeUBWgKSezU/arcgis/rest/services/US_Territories/FeatureServer",
        outFields: [propertyNames.StateLayer.Id, propertyNames.StateLayer.Name],
        definitionExpression: propertyNames.StateLayer.Id + "='" + stateName + "'",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-line",
                width: 1,
                color: [128, 128, 128],
            }
        }
    });

    var usdistrictlayer = new FeatureLayer({
        url: "https://services1.arcgis.com/o90r8yeUBWgKSezU/arcgis/rest/services/cb_2017_us_cd115_5m/FeatureServer",
        outFields: ["*"],
        visible: false,
    });

    var graphicsLayer = new GraphicsLayer({
        graphics: []
    });

    map = new WebMap({
        portalItem: { // autocasts as new PortalItem()
            id: "70943bda8a37419f863a361ccc00a216"
        },
        layers: [usStatelayer, usdistrictlayer, graphicsLayer]
    });

    mapview = new MapView({
        container: "membersMap",
        map: map,
        popup: {
            title: "NAMELSAD",
            highlightEnabled: false,
            dockEnabled: true,
            dockOptions: {
                breakpoint: false,
                position: "bottom-right"
            }
        },
        constraints: {
            minZoom: 5,
            rotationEnable: false,
            snapToZoom: false,
        }
    });
    mapview.ui.add("expand", "top-right");

    mapview.when(function () {
        mapview.whenLayerView(usStatelayer).then(function (layerView) {
            addDistrict();
        });
    });

    function addDistrict() {
        usStatelayer.queryFeatures({
            where: propertyNames.StateLayer.Name + "='" + stateName + "'",
            returnGeometry: false,
            outFields: [propertyNames.StateLayer.Id]
        }).then(function (response) {
            var query = propertyNames.DistrictLayer.DistrictNumber + "='" + districtNumber + "' and " + propertyNames.DistrictLayer.StateId + "=" + response.features[0].attributes[propertyNames.StateLayer.Id];
            return usdistrictlayer.queryFeatures({
                where: query,
                returnGeometry: true,
                outFields: [propertyNames.DistrictLayer.StateId, propertyNames.DistrictLayer.DistrictNumber]
            });
        }).then(function (response) {
            if (isDefined(response) && response.features.length > 0) {
                var feature = response.features[0];
                var districtColor = "#B9DEEB";
                var statefp = feature.attributes[propertyNames.DistrictLayer.StateId];
                var districtId = feature.attributes[propertyNames.DistrictLayer.DistrictNumber];
                //if (typeof districtColorDefinition[statefp][districtId] != "undefined") {
                //    districtColor = districtColorDefinition[statefp][districtId].Color;
                //}
                var polylineGraphic = new Graphic({
                    geometry: feature.geometry,
                    //symbol: {
                    //    type: "simple-fill",
                    //    color: districtColor,
                    //},
                    symbol: {
                        type: "simple-fill", // autocasts as new SimpleFillSymbol()
                        color: [143, 204, 195, 0.5],
                        outline: {
                            color: [20, 29, 52],
                            width: 2
                        }
                    },
                    attributes: feature.attributes
                });
                graphicsLayer.add(polylineGraphic);
                mapview.goTo({
                    target: feature.geometry,
                }, {
                        duration: 1000,
                        easing: "ease-in-out"
                    }).then(function () {
                        if (mapview.zoom < 11) {
                            mapview.zoom = mapview.zoom - 0.05;
                        } else {
                            mapview.zoom = 11;
                        }
                    });
            }
            }, function (err) {
                debugger;
        });
    }
});
