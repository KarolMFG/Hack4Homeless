document.addEventListener("DOMContentLoaded", function () {
    let addressInput = document.getElementById("shelter-address");
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

    document.getElementById("shelter-request-form").addEventListener("submit", function (e) {
        e.preventDefault();
        let shelterName = document.getElementById("shelter-name").value;
        let shelterAddress = document.getElementById("shelter-address").value;
        let lat = parseFloat(document.getElementById("shelter-lat").value);
        let lng = parseFloat(document.getElementById("shelter-lng").value);

        if (!shelterName || !shelterAddress || isNaN(lat) || isNaN(lng)) {
            alert("Please complete all fields.");
            return;
        }

        let newShelter = { name: shelterName, address: shelterAddress, lat: lat, lng: lng };
        
        // Send data to `maps.js`
        if (window.addShelter) {
            addShelter(newShelter);
        } else {
            alert("Error: Unable to add shelter to map.");
        }

        // Reset form
        document.getElementById("shelter-request-form").reset();
    });
});
