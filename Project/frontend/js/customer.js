$(document).ready(function() {
    // Create table row for each flight
    function createTableRow(data) {
        const user_id = new URLSearchParams(window.location.search).get('user_id');
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
        $('#flightsTableBody').append(row);
    }

    function render(data) {
        $('#flightsTableBody').empty();
        if(data.length <= 0) {
            $('#flightsTableBody').append(`
                <tr>
                    <td colspan="5" class="text-center text-danger-emphasis">No Flights Found</td>
                </tr>
            `);
        }
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
            success: render,
            error: (xhr, status, error) => {
                console.log(xhr.responseText);
                $('#flightsTableBody').html(`
                    <tr>
                        <td colspan="5" class="text-center text-danger-emphasis">Error loading flights</td>
                    </tr>
                `);
            }
        });
    }

   function loadAirports() {
        $.ajax({
            url: "http://localhost:3000/customer/airports",
            method: "GET",
            success: function(airports) {
                const select = $('#airportSelect');
                select.empty();
                select.append('<option value="" selected>All Airports</option>'); // Changed this line
                
                if (airports && airports.length > 0) {
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

    // Function to let customer schedule a flight
    function schedule_flight(flight_to_schedule) {
        $.ajax({
            url: `http://localhost:3000/customer/${flight_to_schedule}`,
            method: "PATCH",
            contentType: 'application/json',
            data: JSON.stringify({scheduled: true}),
            success: function(response) {
                alert(`Flight: ${flight_to_schedule} scheduled successfully`);
                fetchData();
            },
            error: function(xhr, status, error) {
                alert(`Scheduling Failed\n ${xhr.status}\n${status}\n${error}`);
            },
        });
    }

    function validate_page_selections(user_id) {
        if (!user_id) return;

        $(`.navbar-nav .nav-link`).each(function () {
            const href = $(this).attr(`href`);
            if(!href) return;

            const url = new URL(href, window.location.href);
            url.searchParams.set(`user_id`, user_id);

            $(this).attr('href', url.toString());
        });
    }

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
        validate_page_selections(user_id);
        loadAirports();
        getAllFlights();
    } else {
        alert(`No User Selected`);
    }

    // Handle airport selection change
    $('#airportSelect').change(function() {
        const airportId = $(this).val();
        if (airportId) {
            fetchFlightsByAirport(airportId);
        } else {
            getAllFlights();
        }
    });

    // update schedule button on card handler
    $(document).on(`click`,`.schedule-btn`, function(event) {
        flight_to_schedule = event.target.dataset.flightId;
        schedule_flight(flight_to_schedule);
    });
});