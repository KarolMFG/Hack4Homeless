let map, directionsService, directionsRenderer;

function initMap() {
    if (!window.google || !google.maps) {
        console.error("Google Maps API failed to load.");
        alert("Google Maps API failed to load. Please check your API key.");
        return;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 38.9072, lng: -77.0369 },
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-panel"));

    loadShelters();
    setupDirectionListener();
}

function loadShelters() {
    const shelters = [
        { name: "DC Central Kitchen", lat: 38.9006, lng: -77.0437 },
        { name: "Miriam’s Kitchen", lat: 38.9027, lng: -77.0176 },
        { name: "SOME (So Others Might Eat)", lat: 38.8971, lng: -77.0276 },
        { name: "Friendship Place", lat: 38.9106, lng: -77.0324 },
        { name: "The Father McKenna Center", lat: 38.8993, lng: -77.0260 }
    ];

    const shelterDropdown = document.getElementById("end");
    shelterDropdown.innerHTML = '<option value="">Select a Shelter</option>'; // Reset options

    shelters.forEach(shelter => {
        new google.maps.Marker({
            position: { lat: shelter.lat, lng: shelter.lng },
            map: map,
            title: shelter.name
        });

        let option = document.createElement("option");
        option.value = `${shelter.lat},${shelter.lng}`;
        option.textContent = shelter.name;
        shelterDropdown.appendChild(option);
    });
}

function setupDirectionListener() {
    document.getElementById("get-directions").addEventListener("click", () => {
        let start = document.getElementById("start").value;
        let endSelect = document.getElementById("end");

        if (!endSelect.value) {
            alert("Please select a shelter.");
            return;
        }

        let end = endSelect.value.split(",");
        let destination = { lat: parseFloat(end[0]), lng: parseFloat(end[1]) };

        if (start === "current") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    let userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    calculateAndDisplayRoute(userLocation, destination);
                }, () => {
                    alert("Geolocation failed. Please enter your location manually.");
                });
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        } else {
            calculateAndDisplayRoute(start, destination);
        }
    });
}

function calculateAndDisplayRoute(start, end) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                alert("Directions request failed: " + status);
            }
        }
    );
}
