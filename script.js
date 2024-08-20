// Haritayı başlat
const map = new maplibregl.Map({
  container: "map",
  style: "https://api.maptiler.com/maps/e568c080-e7a8-463d-960a-dcc152b80c3e/style.json?key=KsteuNepg64HvoBAnEGO",
  center: [28.97953, 41.015137],
  zoom: 10,
});

let geojsonData; // Veriyi global olarak saklayalım
let currentPopup; // Şu anki açık popup'ı takip edelim


// GeoJSON verisini fetch ile çağırma
fetch("/data.geojson")
  .then((response) => response.json())
  .then((data) => {
    geojsonData = data; // Veriyi global değişkene atayalım
    // Veri kaynağını haritaya ekleme
    map.addSource("geojson-data", {
      type: "geojson",
      data: geojsonData,
    });
 
map.addLayer({
  id: "geojson-layer",
  type: "circle",
  source: "geojson-data",
  paint: {
    "circle-radius": {
      stops: [[12, 10], [22, 50]] 
    },
    "circle-color": [
      "match",
      ["get", "category"],
      "YEŞİL ALAN", "#002b0c",
      "TİYATRO MERKEZİ", "#414700",
      "KONSER MERKEZİ", "#ff474f",
      "MÜZE", "#ffbf51",
      "KORU", "#f287e3",
      "PARK", "#1a66af",
      "TARİHİ ÇARŞI", "#7b1e3a",
      "SU SPORLARI", "#750500",
      "ADA", "#559e9c",
      "EĞLENCE MERKEZİ", "#7900af",
      "TARİHİ HAMAM", "#88c76c",
      "PLAJ", "#ff825b",
      "SOSYAL TESİS", "#8c686e",
      /* default */ "#000000"
    ],
    "circle-stroke-width": 3, // Kenar kalınlığı
    "circle-stroke-color": "#ffffff", // Kenar rengi
    "circle-opacity": 0.8 // Opaklık
  }
});

    

    // Filtreleme elemanlarını seç
    const categoryFilterSelect = document.getElementById("categoryFilter");
    const feeFilterSelect = document.getElementById("feeFilter");
    const locationFilterSelect = document.getElementById("locationFilter");
    const suitabilityFilterSelect = document.getElementById("suitabilityFilter");

    // Filtreleme işlevini ekle
    categoryFilterSelect.addEventListener("change", applyFilters);
    locationFilterSelect.addEventListener("change", applyFilters);
    feeFilterSelect.addEventListener("change", applyFilters);
    suitabilityFilterSelect.addEventListener("change", applyFilters);

    function applyFilters() {
      const category = categoryFilterSelect.value;
      const location = locationFilterSelect.value;
      const feeType = feeFilterSelect.value;
      const suitability = suitabilityFilterSelect.value;
      let filters = ["all"];

      if (category !== "all") {
        filters.push(["==", ["get", "category"], category]);
      }
      if (location !== "all") {
        filters.push(["==", ["get", "location"], location]);
      }
      if (feeType !== "all") {
        filters.push(["==", ["get", "entry_fee"], feeType]);
      }
      if (suitability !== "all") {
        filters.push(["==", ["get", "suitability"], suitability]);
      }

      map.setFilter("geojson-layer", filters.length > 1 ? filters : null);
    }
    // Üzerine gelindiğinde işaretçiyi değiştirme
    map.on("mouseenter", "geojson-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "geojson-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    // Tıklama olayını ekle
    map.on("click", "geojson-layer", (e) => {
       const feature = e.features[0];
      if (!feature) return; // Özellik yoksa geri dön

      const coordinates = e.features[0].geometry.coordinates.slice();
      const { name, category, link, description, entry_fee_adult, entry_fee_student } = e.features[0].properties;

      // Daha önce açık bir popup varsa kapat
      if (currentPopup) {
        currentPopup.remove();
      }

      // Yeni popup'ı oluştur ve göster
      currentPopup = new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `
          <div style="max-width: 400px;">
            <strong>${name}</strong><br>
            Kategori: ${category}<br>
            <p>${description}</p>
            <p>Giriş Ücreti (Yetişkin): ${entry_fee_adult}</p>
            <p>Giriş Ücreti (Öğrenci): ${entry_fee_student}</p>
            <a href="${link}" target="_blank">Daha fazla bilgi</a>
          </div>
          `
        )
        .addTo(map);
    });
  })
  .catch((error) => console.error("Error:", error));

// Rastgele buton işlevi
document.getElementById("random-Button").addEventListener("click", () => {
  if (geojsonData && geojsonData.features.length > 0) {
    // Daha önce açık bir popup varsa kapat
    if (currentPopup) {
      currentPopup.remove();
    }

    // Rastgele bir özellik seç ve popup'ı oluştur
    const randomFeature = geojsonData.features[Math.floor(Math.random() * geojsonData.features.length)];
    const coordinates = randomFeature.geometry.coordinates.slice();
    const { name, category, link, description, entry_fee_adult, entry_fee_student } = randomFeature.properties;

    // Yeni popup'ı oluştur ve göster
    currentPopup = new maplibregl.Popup()
      .setLngLat(coordinates)
      .setHTML(
        `
        <div style="max-width: 400px;">
          <strong>${name}</strong><br>
          Kategori: ${category}<br>
          <p>${description}</p>
          <p>Giriş Ücreti (Yetişkin): ${entry_fee_adult}</p>
          <p>Giriş Ücreti (Öğrenci): ${entry_fee_student}</p>
          <a href="${link}" target="_blank">Daha fazla bilgi</a>
        </div>
        `
      )
      .addTo(map);

    map.flyTo({ center: coordinates, zoom: 14, essential: true, curve: 1, speed: 0.8 });
  }
});

// Direkt buton işlevi
document.getElementById("directButton").addEventListener("click", () => {
  window.open(
    "https://play.google.com/store/search?q=istanbul+senin&c=apps&hl=tr",
    "_blank"
  );
});


document.getElementById("zoomInButton").addEventListener("click", () => {
  map.zoomIn(); // Yakınlaştır
});

document.getElementById("zoomOutButton").addEventListener("click", () => {
  map.zoomOut(); // Uzaklaştır
});

// Takip butonu işlevi
document.getElementById("followButton").addEventListener("click", () => {
  const followButtonContainer = document.getElementById("followButtonContainer");
  followButtonContainer.classList.toggle("hidden");
});
document.getElementById("legendButton").addEventListener("click", () => {
  const legendContainer = document.getElementById("legendContainer");
  if (legendContainer.style.display === "none" || legendContainer.style.display === "") {
    legendContainer.style.display = "block";
  } else {
    legendContainer.style.display = "none";
  }
});


// Bilgi butonu işlevi
document.getElementById("infoButton").addEventListener("click", () => {
  window.location.href="aktivite-durakları-galeri - Kopya/index.html", "_blank";
});

document.addEventListener("DOMContentLoaded", () => {
  const filterButton = document.getElementById("filterButton");
  const filterContainer = document.getElementById("filterContainer");

  // FilterButton'a tıklama olayını ekle
  filterButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Menünün kapanmasını engelle
    filterContainer.classList.toggle("hidden"); // Menü görünürlüğünü değiştir
  });

  // FilterContainer içinde tıklama olayını engelleme
  filterContainer.addEventListener("click", (event) => {
    event.stopPropagation(); // Menünün kapanmasını engelle
  });

  // Document'e tıklama olayını dinleyici ekle
  document.addEventListener("click", (event) => {
    const filterButton = document.getElementById("filterButton");
    const filterContainer = document.getElementById("filterContainer");

    // Eğer tıklanan eleman filterButton veya filterContainer değilse menüyü kapat
    if (!filterButton.contains(event.target) && !filterContainer.contains(event.target)) {
      filterContainer.classList.add("hidden");
    }
  });

   // Reset buton işlevi
   document.getElementById("resetFiltersButton").addEventListener("click", () => {
    // Sayfayı yenile
    window.location.reload();
  });
  
  
// Konum butonunu seç
document.getElementById("locationButton").addEventListener("click", () => {
  // Kullanıcının konumunu al
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      var userLocation = [position.coords.longitude, position.coords.latitude];
      new maplibregl.Marker({ color: 'red' })
        .setLngLat(userLocation)
        .addTo(map);

      // Haritayı kullanıcının konumuna odakla
      map.flyTo({center:userLocation,zoom:12});

      var userMarker = document.createElement('div');
      userMarker.className = 'user-location';
      new maplibregl.Marker(userMarker)
        .setLngLat(userLocation)
        .addTo(map);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});
});