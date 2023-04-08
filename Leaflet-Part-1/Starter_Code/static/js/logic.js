// Creating the map object
let myMap = L.map("map", {
    center: [40.7, -118.1],
    zoom: 5.45
  });



  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Store the API query variables.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var label = []
var breaks = [10, 30, 50, 70, 90, 100]
var labels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+', ]

  //create function for colors
function getColor(d) {
  return d < breaks[0] ? "violet" :
         d < breaks[1] ? "indigo" :
         d < breaks[2] ? "blue" :
         d < breaks[3] ? "yellow" :
         d < breaks[4] ? "orange" :
            "red" ;
}

// pull json data
d3.json(url).then(function(response) {

  for(i = 0; i < response.features.length; i++) {
    
    // set variables
    var quake = response.features[i]
    coords = [quake.geometry.coordinates[1], quake.geometry.coordinates[0]]
    depth = quake.geometry.coordinates[2]

    // add circle markers and pop up with location, depth, and magnitude
    L.circle(coords, {
      color: "white",
      fillColor: getColor(depth),
      fillOpacity: 0.75,
      radius: (quake.properties.mag * 7500)
    }).bindPopup("<h3>Location: "+ quake.properties.place +
    "</h3><hr><h4> Depth: " + depth + "</h4>" + "<h4> Magnitude: " + quake.properties.mag +"</h4>").addTo(myMap)
  }


     //Set up the legend.
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Magnitude</h4>";
  //add color marker and label to legend
  div.innerHTML += '<i style="background:' + getColor(breaks[0]) + '"></i><span>' + labels[0] + '</span><br>';
  div.innerHTML += '<i style="background:' + getColor(breaks[1]) + '"></i><span>' + labels[1] + '</span><br>';
  div.innerHTML += '<i style="background:' + getColor(breaks[2]) + '"></i><span>' + labels[2] + '</span><br>';
  div.innerHTML += '<i style="background:' + getColor(breaks[3]) + '"></i><span>' + labels[3] + '</span><br>';
  div.innerHTML += '<i style="background:' + getColor(breaks[4]) + '"></i><span>' + labels[4] + '</span><br>';
  div.innerHTML += '<i style="background:' + getColor(breaks[5]) + '"></i><span>' + labels[5] + '</span><br>';  

  return div;
};
     legend.addTo(myMap)
})



