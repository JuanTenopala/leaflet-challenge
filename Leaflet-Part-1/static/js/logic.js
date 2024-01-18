// Create the map centered at the US L48 and zoom 5
let myMap = L.map("map", {
    center: [37.5, -95.5],
    zoom: 5,
});

// Insert the base layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the 'All Earthquakes from the Past 7 Days' data set 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data){

//create a function to set the marker size based on the magnitude of the earthquakes
    function markerSize(magnitude){
        return magnitude * 20000;
    }

// Create a function to set the marker color based on the depth of the earthquakes
    function markerColor(depth){
        if  (depth < 10) {
            return "#00ff00";    //Green
        } else if (depth < 30){
            return "#ffff00";    //Yellow
        } else if (depth < 50){
            return "#ffa500";    //Orange
        } else {
            return "#ff0000";    //Red
        }
    }

// Loop through the data to create the markers
    data.features.forEach(function(earthquake){
        let coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];

// Create the markers
        L.circle(coordinates, {
            fillOpacity: 0.75,
            color: "black",
            weight: 1,
            fillColor: markerColor(depth),
            radius: markerSize(magnitude),
        }).bindPopup("<h3>" + earthquake.properties.place + 
        "</h3><hr><p>Magnitude: " + magnitude + "<br>Depth: " + depth + "</p>").addTo(myMap);
    });

    let legend = L.control({position: "bottomright"});
    legend.onAdd = function (){
        let div = L.DomUtil.create("div", "info legend");
        let depthLevels = [-10, 10, 30, 50];
        div.innerHTML = "<table>" +
        "<tr> <th style='text-align:center; font-size:200%; color:black;'> Depth </th> </tr>" +
        "<tr> <th style='text-align:center; font-size:200%; color:black; background-color:#00ff00;'> 0 - 10 </th> </tr>"+
        "<tr> <th style='text-align:center; font-size:200%; color:black; background-color:#ffff00;'> 10 - 30 </th> </tr>"+
        "<tr> <th style='text-align:center; font-size:200%; color:black; background-color:#ffa500;'> 30 - 50 </th> </tr>"+
        "<tr> <th style='text-align:center; font-size:200%; color:black; background-color:#ff0000;'> 50 + </th> </tr>"+
        "</table>";

        return div;
    };

    legend.addTo(myMap);
});