let map, directionsService, directionsRenderer;

// Load API Key from config.json, dont care bt loading this is ridiculous
loadApiKey();

document.addEventListener("DOMContentLoaded", () => {

    // Check if elements exist before adding event listeners
    const form = document.getElementById("shelter-request-form");
    const directionsButton = document.getElementById("get-directions");
    const addressInput = document.getElementById("shelter-address");

    if (form) form.addEventListener("submit", addShelter);
    if (directionsButton) directionsButton.addEventListener("click", getDirections);
    if (addressInput) {// six feet from the edge and im thinking
        setTimeout(()=>{initAutocomplete()}, 500)
    }

    // Delay map initialization until the full page is loaded
    window.onload = function () {
        initMap();
    };

});

var apiKey;

function loadApiKey() {

    // apiKey = "AIzaSyAx8ch0JQiBIlaNss84MrdSKYFkc34wTuw"
    
                loadGoogleMaps("six foot seven foot eight foot bunch!")// we out here creating inflexible chains
    return // who up hard coding
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
                apiKey = config.apiKey
            } else {
                throw new Error("API key is missing in config.json.");
            }
        })
        .catch(error => {
            console.error("Error loading API key:", error);
        });
}

function loadGoogleMaps(apiKey) {
        // if (!apiKey) {
        //     console.error("Error: API key is missing.");
        //     alert("Error: Google Maps API key not found.");
        //     return;
        // }
        const script = document.createElement("script");
        // script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap&v=weekly`;
        script.src = "https://maps.googleapis.com/maps/api/js?key="+"AIzaSyAx8ch0JQiBIlaNss84MrdSKYFkc34wTuw"+
            
            "&libraries=places&callback=initMap&v=weekly";
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

    // alert("Shelter request submitted successfully!");
    document.getElementById("shelter-request-form").reset();
    loadShelters();
}

function loadShelters() {
    if (!map) {
        console.error("Map is not initialized.");
        return;
    }

    let shelters = JSON.parse(localStorage.getItem("shelters")) || [];
    
        const sampleshelters = [
            { name: "DC Central Kitchen", lat: 38.9006, lng: -77.0437 },
            { name: "Miriam’s Kitchen", lat: 38.9027, lng: -77.0176 },
            { name: "SOME (So Others Might Eat)", lat: 38.8971, lng: -77.0276 },
            { name: "Friendship Place", lat: 38.9106, lng: -77.0324 },
            { name: "The Father McKenna Center", lat: 38.8993, lng: -77.0260 }
        ];

    shelters = shelters.concat(sampleshelters)
  


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
function getDirections() {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value ? document.getElementById("end").value.split(",") : null;
    let travelMode = document.getElementById("travel-mode").value;

    if (!end || end.length !== 2) {
        alert("Please select a valid shelter.");
        return;
    }

    let destination = { lat: parseFloat(end[0]), lng: parseFloat(end[1]) };

    if (start === "current") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    calculateAndDisplayRoute(userLocation, destination, travelMode);
                },
                () => {
                    alert("Geolocation failed. Please enter your location manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    } else {
        calculateAndDisplayRoute(start, destination, travelMode);
    }
}

function calculateAndDisplayRoute(start, end, travelMode) {
    if (!directionsService || !directionsRenderer) {
        console.error("Directions service not initialized.");
        alert("Error loading directions. Please try again.");
        return;
    }

    let request = {
        origin: typeof start === "string" ? start : new google.maps.LatLng(start.lat, start.lng),
        destination: new google.maps.LatLng(end.lat, end.lng),
        travelMode: google.maps.TravelMode[travelMode]
    };

    directionsService.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
        } else {
            alert("Directions request failed due to " + status);
        }
    });
}
