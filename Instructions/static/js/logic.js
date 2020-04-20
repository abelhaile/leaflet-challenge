var base = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 22,
  id: "mapbox.light",
  accessToken: API_KEY
})
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url, function(response) {

  var Markers = L.layerGroup();
  var Mag3 = L.layerGroup();
  var Mag = L.layerGroup();

  var features = response.features;
  for (var i = 0; i < features.length; i++) {
    var data = features[i].geometry;
    var properties = features[i].properties;
    var location = [data.coordinates[1], data.coordinates[0]];
    var t1 = L.circle(location, {
      // stroke: false,
      fillOpacity: 0.75,
      color: "purple",
      opacity:1,
      weight:1,
      fillColor: "pink",
      radius: properties.mag*10000
    })
        .bindPopup("<h3>Place: "+properties.place
        +"</h3><hr>Mag: "
        + properties.mag+"<br>"
        +"Time: "+moment.unix(properties.time).format("h:mm:ss A")
        )

        t1.addTo(Markers);

        if (properties.mag >=3){
          t1.addTo(Mag3);
        }
        else{
          t1.addTo(Mag);
        }
  }
  
  
  var baseMaps = {
    // "Street Map": streetmap,
    "Street Map": base,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    "All Earthquake Past 30 Days": Markers,
    "Earthquake Past 30 Days And Mag >=3": Mag3,
    "Earthquake Past 30 Days And Mag <3": Mag

  };

  var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5,
    layers: [base, Mag3]

  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
})