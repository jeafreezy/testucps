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

async function getJson(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

async function main() {

    const jsondata = await getJson(URL)
    console.log(jsondata)
    //Updating all layers in the layers panel 
    var WFSLayer = L.geoJson(jsondata, {
        style:{
                "stroke": false,
                "fillColor": 'FFFFFF',
                "fillOpacity": 1
            },
        onEachFeature: function (feature,layer){

            const properties = feature.properties;
            const table = document.getElementById('table');
            let content =table.innerHTML;
            content += `
                        <tr>
                            <td>${properties.Galtm_sec}</td>
                        </tr>
                        <tr>
                            <td>${properties.Gst_nut}</td>
                        </tr>
                        <tr>
                            <td>${properties.TC_cps}</td>
                        </tr>
                        <tr>
                            <td>${properties.K_PPT}</td>
                        </tr>
                        <tr>
                            <td>${properties.UR_PPM}</td>
                        </tr>
                        <tr>
                            <td>${properties.Dose_nGy}</td>
                        </tr>
                        <tr>
                            <td>${properties.K_cps}</td>
                        </tr>
                        <tr>
                            <td>${properties.Th_cps}</td>
                        </tr>
                        <tr>
                            <td>${properties.CS_cps}</td>
                        </tr>
                        <tr>
                            <td>${properties.ThPeak}</td>
                        </tr>

                        `;
            table.innerHTML = content;

            table.style.display='block';
            layer.bindPopup(table);       
        }
    });
    var baseMaps = {
        "Uranium CPS Raster": UCPSRaster,
        "Uranium CPS Contour": UCPSContour,
        "Satellite Imagery": googleSat,
        "Points":WFSLayer,
        "Terrain":googleTerrain
    };
    
    L.control.layers(null,baseMaps).addTo(map);
   
}


main()




