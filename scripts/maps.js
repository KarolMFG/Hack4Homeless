let map, directionsService, directionsRenderer;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("shelter-request-form").addEventListener("submit", addShelter);
    document.getElementById("get-directions").addEventListener("click", getDirections);
});

function addShelter(e) {
    e.preventDefault();

    const shelterName = document.getElementById("shelter-name").value.trim();
    const shelterAddress = document.getElementById("shelter-address").value.trim();
    const shelterLat = parseFloat(document.getElementById("shelter-lat").value);
    const shelterLng = parseFloat(document.getElementById("shelter-lng").value);

    if (!shelterName || !shelterAddress || isNaN(shelterLat) || isNaN(shelterLng)) {
        alert("Please enter valid shelter details.");
        return;
    }

    const shelter = { name: shelterName, address: shelterAddress, lat: shelterLat, lng: shelterLng };

    if (map) {
        new google.maps.Marker({
            position: { lat: shelterLat, lng: shelterLng },
            map: map,
            title: shelterName
        });

        let shelters = JSON.parse(localStorage.getItem("shelters")) || [];
        shelters.push(shelter);
        localStorage.setItem("shelters", JSON.stringify(shelters));

        updateShelterDropdown();
    } else {
        alert("Error: Map is not initialized.");
    }

    alert("Shelter request submitted successfully!");
    document.getElementById("shelter-request-form").reset();
}

function loadShelters() {
    if (!map) {
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

    updateShelterDropdown();
}

function updateShelterDropdown() {
    const shelterDropdown = document.getElementById("end");
    shelterDropdown.innerHTML = "";
    const shelters = JSON.parse(localStorage.getItem("shelters")) || [];

    if (shelters.length === 0) {
        let defaultOption = document.createElement("option");
        defaultOption.textContent = "No shelters available";
        defaultOption.disabled = true;
        shelterDropdown.appendChild(defaultOption);
    } else {
        shelters.forEach(shelter => {
            let option = document.createElement("option");
            option.value = `${shelter.lat},${shelter.lng}`;
            option.textContent = shelter.name;
            shelterDropdown.appendChild(option);
        });
    }
}

function initMap() {
    if (!window.google || !google.maps) {
        console.error("Google Maps API failed to load.");
        alert("Google Maps API failed to load. Please check your API key.");
        return;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 38.9072, lng: -77.0369 }
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-panel"));

    loadShelters();
}

function getDirections() {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value.split(",");
    let travelMode = document.getElementById("travel-mode").value;  // Get selected mode

    if (!end || end.length !== 2) {
        alert("Please select a valid shelter.");
        return;
    }

    if (start === "current") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    calculateAndDisplayRoute(userLocation, { lat: parseFloat(end[0]), lng: parseFloat(end[1]) }, travelMode);
                },
                () => {
                    alert("Geolocation failed. Please enter your location manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    } else {
        calculateAndDisplayRoute(start, { lat: parseFloat(end[0]), lng: parseFloat(end[1]) }, travelMode);
    }
}


function calculateAndDisplayRoute(start, end, travelMode) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode[travelMode]  // Use the selected mode
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                alert("Directions request failed due to " + status);
            }
        }
    );
}
