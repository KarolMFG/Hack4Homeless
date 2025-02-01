let map, directionsService, directionsRenderer;

document.addEventListener("DOMContentLoaded", () => {
    // Check if elements exist before adding event listeners
    const form = document.getElementById("shelter-request-form");
    const directionsButton = document.getElementById("get-directions");
    const addressInput = document.getElementById("shelter-address");

    if (form) form.addEventListener("submit", addShelter);
    if (directionsButton) directionsButton.addEventListener("click", getDirections);
    if (addressInput) initAutocomplete();

    // Delay map initialization until the full page is loaded
    window.onload = function () {
        initMap();
    };

    // Load API Key from config.json
    loadApiKey();
});

function loadApiKey() {
    fetch("https://karolmfg.github.io/Hack4Homeless/config.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load API key. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(config => {
            if (config.apiKey) {
                console.log("API Key loaded successfully.");
            } else {
                throw new Error("API key is missing in config.json.");
            }
        })
        .catch(error => {
            console.error("Error loading API key:", error);
        });
}

function loadGoogleMaps(apiKey) {
        if (!apiKey) {
            console.error("Error: API key is missing.");
            alert("Error: Google Maps API key not found.");
            return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap&v=weekly`;
        script.defer = true;
        document.head.appendChild(script);
    }

function initAutocomplete() {
    if (!window.google || !google.maps || !google.maps.places) {
        console.error("Google Maps API not loaded.");
        return;
    }

    let addressInput = document.getElementById("shelter-address");
    if (!addressInput) {
        console.error("Autocomplete input field not found!");
        return;
    }

    let autocomplete = new google.maps.places.Autocomplete(addressInput);
    autocomplete.addListener("place_changed", function () {
        let place = autocomplete.getPlace();
        if (!place.geometry) {
            alert("Invalid address. Please select from suggestions.");
            return;
        }
        document.getElementById("shelter-lat").value = place.geometry.location.lat();
        document.getElementById("shelter-lng").value = place.geometry.location.lng();
    });
}

function addShelter(e) {
    e.preventDefault();

    const shelterName = document.getElementById("shelter-name")?.value.trim();
    const shelterAddress = document.getElementById("shelter-address")?.value.trim();
    const shelterLat = parseFloat(document.getElementById("shelter-lat")?.value);
    const shelterLng = parseFloat(document.getElementById("shelter-lng")?.value);

    if (!shelterName || !shelterAddress || isNaN(shelterLat) || isNaN(shelterLng)) {
        alert("Please enter valid shelter details.");
        return;
    }

    const shelter = { name: shelterName, address: shelterAddress, lat: shelterLat, lng: shelterLng };

    let shelters = JSON.parse(localStorage.getItem("shelters")) || [];
    shelters.push(shelter);
    localStorage.setItem("shelters", JSON.stringify(shelters));

    alert("Shelter request submitted successfully!");
    document.getElementById("shelter-request-form").reset();
    loadShelters();
}

function loadShelters() {
    if (!map) {
        console.error("Map is not initialized.");
        return;
    }

    let shelters = JSON.parse(localStorage.getItem("shelters")) || [];
    
    if (shelters.length === 0) {
        console.warn("No shelters found in localStorage, loading sample shelters.");
        shelters = [
            { name: "DC Central Kitchen", lat: 38.9006, lng: -77.0437 },
            { name: "Miriam’s Kitchen", lat: 38.9027, lng: -77.0176 },
            { name: "SOME (So Others Might Eat)", lat: 38.8971, lng: -77.0276 },
            { name: "Friendship Place", lat: 38.9106, lng: -77.0324 },
            { name: "The Father McKenna Center", lat: 38.8993, lng: -77.0260 }
        ];
    }

    shelters.forEach(shelter => {
        new google.maps.Marker({
            position: { lat: shelter.lat, lng: shelter.lng },
            map: map,
            title: shelter.name
        });
    });

    updateShelterDropdown(shelters);
}

function updateShelterDropdown(shelters) {
    const shelterDropdown = document.getElementById("end");
    if (!shelterDropdown) {
        console.error("Shelter dropdown not found!");
        return;
    }

    shelterDropdown.innerHTML = "";

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

    let mapDiv = document.getElementById("map");
    if (!mapDiv) {
        console.error("Map container not found!");
        return;
    }

    map = new google.maps.Map(mapDiv, {
        zoom: 12,
        center: { lat: 38.9072, lng: -77.0369 } // Default to Washington, DC
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-panel"));

    loadShelters();
}
