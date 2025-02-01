document.getElementById("shelter-request-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const shelterName = document.getElementById("shelter-name").value.trim();
    const shelterAddress = document.getElementById("shelter-address").value.trim();
    const shelterLat = parseFloat(document.getElementById("shelter-lat").value);
    const shelterLng = parseFloat(document.getElementById("shelter-lng").value);

    if (!shelterName || !shelterAddress || isNaN(shelterLat) || isNaN(shelterLng)) {
        alert("Please provide valid shelter details.");
        return;
    }

    const shelter = { name: shelterName, address: shelterAddress, lat: shelterLat, lng: shelterLng };

    if (typeof map !== "undefined" && map) {
        new google.maps.Marker({
            position: { lat: shelterLat, lng: shelterLng },
            map: map,
            title: shelterName
        });

        let shelters = JSON.parse(localStorage.getItem("shelters")) || [];
        shelters.push(shelter);
        localStorage.setItem("shelters", JSON.stringify(shelters));

        alert("Shelter request submitted successfully!");
        document.getElementById("shelter-request-form").reset();
    } else {
        alert("Error: Map is not initialized.");
    }
});

function loadShelters() {
    if (typeof map === "undefined" || !map) {
        console.error("Map is not initialized.");
        return;
    }

    const shelters = JSON.parse(localStorage.getItem("shelters")) || [];

    shelters.forEach(shelter => {
        new google.maps.Marker({
            position: { lat: shelter.lat, lng: shelter.lng },
            map: map,
            title: shelter.name
        });
    });
}

function initMap() {
    if (!window.google || !google.maps) {
        console.error("Google Maps API failed to load.");
        alert("Google Maps API failed to load. Please check your API key.");
        return;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 38.9072, lng: -77.0369 } // Washington, DC
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-panel"));

    loadShelters();
}
