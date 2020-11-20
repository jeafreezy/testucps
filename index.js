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

// NDGS DATA 3
var newData = L.tileLayer.wms("https://omooyegis.ngrok.io/geoserver/wms?", {
    layers: 'WEBGIS:New_data',
    format: 'image/png',
    transparent: true,
    attribution: ""
});


//Updating all layers in the layers panel 

var baseMaps = {
    "Uranium CPS Raster": UCPSRaster,
    "Uranium CPS Contour": UCPSContour,
    "Sample Points":SamplePoints,
    "New Data": newData,
    "Satellite Imagery": googleSat,
    "Terrain":googleTerrain
};

L.control.layers(null,baseMaps).addTo(map);

 

 // Grs data point

var SamplePoints= $.ajax('https://omooyegis.ngrok.io/geoserver/wfs?',{
        type: 'GET',
        data: {
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typename: 'WEBGIS:grsamplepointfile1geojson',
            srsname: 'EPSG:4326',
            outputFormat: 'text/javascript'
            },
        dataType: 'jsonp',
        jsonpCallback:'callback:loadFeatures',
        jsonp:'format_options'
        });
 function loadFeatures(points){
   	L.geoJson(points).addTo(map);
 }