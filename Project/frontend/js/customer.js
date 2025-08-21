$(document).ready(function() {
    // Create table row for each flight
    function createTableRow(data) {
        // Get user_id from URL query parameters
        const user_id = new URLSearchParams(window.location.search).get('user_id');
        // Build a table row with flight data and action buttons
        const row = $(`
            <tr>
                <td>${data.flight_number}</td>
                <td>${data.departure_airport_code}</td>
                <td>${data.arrival_airport_code}</td>
                <td>${data.gate_number}</td>
                <td class="text-center">
                    <div class="btn-group " role="group">
                        <a href="view.html?user_id=${user_id}&from=view&flight_id=${data.flight_number}" class="btn btn-outline-dark btn-sm rounded-4 text-white">View</a>
                        <a href="seat.html?user_id=${user_id}&from=view&flight_id=${data.flight_number}" class="btn btn-outline-info btn-sm rounded-4 text-white">Seat Selection</a>
                    </div>
                </td>
            </tr>
        `);
        // Add the row to the flight table
        $('#flightsTableBody').append(row);
    }

    // Show all flights in the table
    function render(data) {
        // Remove old flights from the table
        $('#flightsTableBody').empty();
        // If there are no flights, show a message
        if(data.length <= 0) {            
            $('#flightsTableBody').append(`
                <tr>
                    <td colspan="5" class="text-center text-danger-emphasis">No Flights Found</td>
                </tr>
            `);
        }
        // Make a row for each flight
        data.forEach(function(flight) {
            createTableRow(flight);
        });
    }
    
    // Get flights by airport ID
    function fetchFlightsByAirport(airportId) {
        $.ajax({
            url: `http://localhost:3000/customer/airports/${airportId}/flights`,
            method: "GET",
            dataType: "json",
            // Show flights if success
            success: render,
            error: (xhr, status, error) => {
                console.log(xhr.responseText);
                // Show error message in table
                $('#flightsTableBody').html(`
                    <tr>
                        <td colspan="5" class="text-center text-danger-emphasis">Error loading flights</td>
                    </tr>
                `);
            }
        });
    }

    // Get all airports for the dropdown
   function loadAirports() {
        $.ajax({
            url: "http://localhost:3000/customer/airports",
            method: "GET",
            success: function(airports) {
                const select = $('#airportSelect');
                select.empty();
                // Add default option
                select.append('<option value="" selected>All Airports</option>');
                
                if (airports && airports.length > 0) {
                    // Add each airport as a choice
                    airports.forEach(airport => {
                        select.append(`<option value="${airport.airport_id}">${airport.airport_name} (${airport.code})</option>`);
                    });
                } else {
                    console.error('No airports received from server');
                    select.append('<option value="" disabled>No airports available</option>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading airports:', error);
                $('#airportSelect').html('<option value="" disabled>Error loading airports</option>');
            }
        });
    }

    // Change navbar links to include user_id
    function validate_page_selections(user_id) {
        if (!user_id) return;

        $(`.navbar-nav .nav-link`).each(function () {
            const href = $(this).attr(`href`);
            if(!href) return;

            // Add user_id to link
            const url = new URL(href, window.location.href);
            url.searchParams.set(`user_id`, user_id);

            // Update the link 
            $(this).attr('href', url.toString());
        });
    }

    // Get all flights without filtering
    function getAllFlights() {
        $.ajax({
            url: "http://localhost:3000/customer/flights",
            method: "GET",
            dataType: "json",
            success: render,
            error: (xhr, status, error) => {
                console.log(xhr.responseText);
                $('#flightsTableBody').html(`
                    <tr>
                        <td colspan="5" class="text-center">Error loading all flights</td>
                    </tr>
                `);
            }
        });
    }

    // Initialize page
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    if(user_id) {
        // Make links include user_id
        validate_page_selections(user_id); 
        // Show airports in dropdown
        loadAirports(); 
        // Show all flights
        getAllFlights(); 
    } else {
        alert(`No User Selected`);
    }

    // Handle airport selection change
    $('#airportSelect').change(function() {
        const airportId = $(this).val();
        if (airportId) {
            // Show flights for this airport
            fetchFlightsByAirport(airportId);
        } else {
            // Show all flights
            getAllFlights();
        }
    });
});