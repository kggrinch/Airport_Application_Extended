// $(document).ready(function() {
//     // Creates bootstrap card elements with flight information
//     function createCard(data) {
//         var column = $(`<div class="col-md-3 full_card"></div>`);
//         var card = $(`<div class="card text-white border-light"></div>`);
//         var cardHeader = $(`<div class="card-header"
//             data-flight_number="${data.flight_number}"
//             data-airline="${data.airline}"
//             data-origin="${data.departure_code}"
//             data-destination="${data.arrival_code}"
//             data-gate="${data.gate_number}"
//             >Flight #${data.flight_number}</div>`);
//         var cardBody = $(`<div class="card-body text-center">
//             <h4 class="card-title">${data.departure_code} - ${data.arrival_code}</h4>
//             <p class="card-text">Gate: ${data.gate_number}</p>
//             <p class="card-text">${data.airline}</p>
//             <p class="card-text">${new Date(data.departure_time).toLocaleString()}</p>
//             </div>`);
//         $('#data-container .row').append(column.append(card.append(cardHeader).append(cardBody)));
//     }

//     // Processes each response flight object received
//     function render(data) {
//         $('#data-container .row').empty();
//         if(data.length <= 0) $('#data-container .row').append('<h3 class="text-danger-emphasis">No Flights Found</h3>');
//         data.forEach(function(flight) {
//             createCard(flight);
//         });
//     }
    
//     // Get flights by airport ID
//     function fetchFlightsByAirport(airportId) {
//         $.ajax({
//             url: `http://localhost:3000/customer/airports/${airportId}/flights`,
//             method: "GET",
//             dataType: "json",
//             success: render,
//             error: (xhr, status, error) => {
//                 console.log(xhr.responseText);
//                 $('#data-container .row').html('<h3 class="text-danger-emphasis">Error loading flights</h3>');
//             }
//         });
//     }

//     // Load airports into dropdown
//     function loadAirports() {
//         $.ajax({
//             url: "http://localhost:3000/customer/airports",
//             method: "GET",
//             success: function(airports) {
//                 const select = $('#airportSelect');
//                 select.empty();
//                 select.append('<option value="" selected disabled>Select an Airport</option>');
                
//                 if (airports && airports.length > 0) {
//                     airports.forEach(airport => {
//                         select.append(`<option value="${airport.code}">${airport.airport_name} (${airport.code})</option>`);
//                     });
//                 } else {
//                     console.error('No airports received from server');
//                     select.append('<option value="" disabled>No airports available</option>');
//                 }
//             },
//             error: function(xhr, status, error) {
//                 console.error('Error loading airports:', error);
//                 $('#airportSelect').html('<option value="" disabled>Error loading airports</option>');
//             }
//         });
//     }

//     // Initialize airport dropdown when page loads
//     loadAirports();

//      // Handle airport selection
//     $('#airportSelect').change(function() {
//         const airportCode = $(this).val();
//         if (airportCode) {
//             fetchFlightsByAirport(airportCode);
//         } else {
//             $('#data-container .row').empty();
//         }
//     });

$(document).ready(function() {
    // Creates bootstrap card elements with flight information
    function createCard(data) {
        var column = $(`<div class="col-md-3 full_card"></div>`);
        var card = $(`<div class="card text-white border-light"></div>`);
        var cardHeader = $(`<div class="card-header" data-flight_number="${data.flight_number}" data-airline="${data.airline}">Flight #${data.flight_number}</div>`);
        var cardBody = $(`<div class="card-body text-center">
            <h4 class="card-title">${data.airport_name} (${data.code})</h4>
            <p class="card-text">${data.airline}</p>
            </div>`);
        $('#data-container .row').append(column.append(card.append(cardHeader).append(cardBody)));
    }

    // Processes each response flight object received
    function render(data) {
        $('#data-container .row').empty();
        if(data.length <= 0) {
            $('#data-container .row').append('<h3 class="text-danger-emphasis">No Flights Found</h3>');
        }
        data.forEach(function(flight) {
            createCard(flight);
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
                $('#data-container .row').html('<h3 class="text-danger-emphasis">Error loading flights</h3>');
            }
        });
    }

    // Load airports into dropdown
    function loadAirports() {
        $.ajax({
            url: "http://localhost:3000/customer/airports",
            method: "GET",
            success: function(airports) {
                const select = $('#airportSelect');
                select.empty();
                select.append('<option value="" selected disabled>Select an Airport</option>');
                
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

    // Your existing functions (unchanged)
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

    // Function that is part of the search functionality
    // Responsible for filtering through each card based on:
    // Search Type - the select search type
    // value - current inputted value by user
    // card - full card element
    function search_filter(search_type, value, card)
    {
        card.filter(function()
        {
            const category = $(this).find(`.card-header`).data(search_type).toLowerCase()
            $(this).toggle(category.indexOf(value) > -1);
        });
    }

    function validate_page_selections(user_id)
    {
        if (!user_id) return;

        $(`.navbar-nav .nav-link`).each(function ()
        {
            const href = $(this).attr(`href`);
            if(!href) return;

            const url = new URL(href, window.location.href);
            url.searchParams.set(`user_id`, user_id);

            $(this).attr('href', url.toString());
        });
    }

    // Initialize airport dropdown when page loads
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    if(user_id)
    {
        validate_page_selections(user_id);
        loadAirports();
    }
    else
    {
        alert(`No User Selected`);
    }

    // Handle airport selection change
    $('#airportSelect').change(function() {
        const airportId = $(this).val();
        if (airportId) {
            fetchFlightsByAirport(airportId);
        } else {
            $('#data-container .row').empty();
        }
    });

    // update schedule button on card handler
    // calls update schedule_flight function
    $(document).on(`click`,`.schedule-btn`, function(event)
    {
        flight_to_schedule = event.target.dataset.flightId;
        schedule_flight(flight_to_schedule);
    });
});
