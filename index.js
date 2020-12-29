//Set map view  on load to Nigeria

var map = L.map('map').setView([7.297087564172005, 4.480361938476563], 10);

//Add open street maps as the default basemaps

var osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Add some other available basemaps

var satellite=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//NGSA WMS data1

var UCPSContour = L.tileLayer.wms("https://omooyegis.ngrok.io/geoserver/WEBGIS/wms?", {
    layers: 'WEBGIS:ucpscontour',
    format: 'image/png',
    transparent: true,
    attribution: "NGSA Uranium Count Per Seconds"
});

//NGSA WMS data2

var UCPSRaster = L.tileLayer.wms("https://omooyegis.ngrok.io/geoserver/wms?", {
    layers: 'WEBGIS:topo_ur_cps2',
    format: 'image/png',
    transparent: true,
    attribution: "NGSA Uranium Count Per Seconds"
});



 

 // Grs data point


var owsrootUrl = 'https://omooyegis.ngrok.io/geoserver/ows';

var defaultParameters = {
    service : 'WFS',
    version : '2.0',
    request : 'GetFeature',
    typeName : 'WEBGIS:grsamplepointfile1geojson',
    outputFormat : 'application/json',
    srsName : 'EPSG:4326'
};
// http://omooyegis.ngrok.io/geoserver/WEBGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WEBGIS%3Agrsamplepointfile1geojson&maxFeatures=50&outputFormat=application%2Fjson
var parameters = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parameters);

let WFSLayer;


var ajax = $.ajax({
    url : URL,
    dataType : 'json',
    jsonpCallback : 'getJson',
    success : handlegeoJSON
});

function handlegeoJSON (response){

   var WFSLayer = L.geoJson(response, {
        style: function (feature) {
            return {
                stroke: false,
                fillColor: 'FFFFFF',
                fillOpacity: 1
            }
        },
        onEachFeature: function (feature,layer){
            
            layer.bindPopup(JSON.stringify(feature.properties))
                
        }
        
    }).addTo(map)
}
//Updating all layers in the layers panel 

var baseMaps = {
    "Uranium CPS Raster": UCPSRaster,
    "Uranium CPS Contour": UCPSContour,
    "Satellite Imagery": googleSat,
    "Terrain":googleTerrain
};

L.control.layers(null,baseMaps).addTo(map);
