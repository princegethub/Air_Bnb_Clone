mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/satellite-streets-v12", // style URL
  center: coordinates, // starting position [lng, lat]
  // center: [77.216721, 28.644800], // starting position [lng, lat]
  zoom: 7, // starting zoom
});
console.log(listingLocation);

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

for (const input of inputs) {
  input.onclick = (layer) => {
    const layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
  };
}

const marker = new mapboxgl.Marker({ color: "red" })
  .setPopup(
    new mapboxgl.Popup({ offset: 25, className: "my-class" }).setHTML(
      `<h4>${listingLocation}</h4><p>Excat Location Provided After booking!</p>`
    )
  )
  .setLngLat(coordinates) // listing.gemetry.coordinates
  .addTo(map);
