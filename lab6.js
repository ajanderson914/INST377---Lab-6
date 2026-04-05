function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

const markers = [
  {
    lat: getRandomInRange(30, 35, 3),
    lon: getRandomInRange(-90, -100, 3)
  },
  {
    lat: getRandomInRange(30, 35, 3),
    lon: getRandomInRange(-90, -100, 3)
  },
  {
    lat: getRandomInRange(30, 35, 3),
    lon: getRandomInRange(-90, -100, 3)
  }
];

const map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

markers.forEach((marker, index) => {
  L.marker([marker.lat, marker.lon])
    .addTo(map)
    .bindPopup(`Marker ${index + 1}<br>Lat: ${marker.lat}, Lon: ${marker.lon}`);
});

const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lon]));
map.fitBounds(bounds);

async function getLocality(lat, lon) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return data.locality || data.city || data.principalSubdivision || "Unknown";
  } catch {
    return "Error";
  }
}

async function displayInfo() {
  const div = document.getElementById("markers");

  for (let i = 0; i < markers.length; i++) {
    const loc = await getLocality(markers[i].lat, markers[i].lon);

    div.innerHTML += `
      <h3>Marker ${i + 1}: Latitude: ${markers[i].lat}, Longitude: ${markers[i].lon}</h3>
      <p>Locality: ${loc}</p>
    `;
  }
}

displayInfo();