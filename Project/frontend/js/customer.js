// $(document).ready(function()
// {
//     // Creates bootstrap card elements with flight information
//     // Card header holds data-information used in search functionality
//     function createCard(data)
//     {
//         var column = $(`<div class="col-md-3 full_card"></div>`);
//         var card = $(`<div class="card text-white border-light"></div>`);
//         var cardHeader = $(`<div class="card-header"
//             data-flight_number="${data.flight_number}"
//             data-airline="${data.airline}"
//             data-origin="${data.origin}"
//             data-destination="${data.destination}"
//             data-gate="${data.gate}"
//             >Flight #${data.flight_number}</div>`);
//         var cardBody = $(`<div class="card-body text-center">
//             <h4 class="card-title">${data.origin} - ${data.destination}</h4>
//             <p class="card-text">Gate: ${data.gate}</p>
//                 <a href="view.html?from=customer&id=${data.id}" class="btn btn-outline-dark rounded-4 text-white" data-flight-id="${data.id}">View</a>
//                 <button class="btn btn-outline-info rounded-4 text-white schedule-btn" data-flight-id="${data.id}">Schedule Flight</button>
//             </div>`);
//         $('#data-container .row').append(column.append(card.append(cardHeader).append(cardBody)));
//     }

//     // Processes each response flight object received
//     function render(data)
//     {
//         $('#data-container .row').empty();
//         if(data.length <= 0) $('#data-container .row').append('<h3 class=" text-danger-emphasis">No Flights</h3>');
//         data.forEach(function(flight)
//         {
//             createCard(flight);
//         });
//     }
    
//     // Get request to backend endpoint to retrieve all unscheduled flights via [customer web service]
//     function fetchData()
//     {
//         $.ajax
//         ({
//             url: "http://localhost:3000/customer", // get all unscheduled flights
//             method: "GET",
//             dataType: "json",
//             success: render,
//             error: (xhr, status, error) => 
//             {
//                 console.log(xhr.responseText)
//                 alert(`Failed to fetch flights.\n ${xhr.status}\n${status}\n${error}`);
//             }
//         })
//     }

//     // Patch request to backend endpoint to update schedule attribute of flight given id via [customer web service]
//     // flight_to_schedule - flight id of flight to update
//     function schedule_flight(flight_to_schedule)
//     {
//         $.ajax
//         ({
//             url: `http://localhost:3000/customer/${flight_to_schedule}`,
//             method: "PATCH",
//             contentType: 'application/json',
//             data: JSON.stringify({scheduled: true}),
//             success: function(response)
//             {
//                 alert(`Flight: ${flight_to_schedule} scheduled successfully`);
//                 fetchData();
//             },
//             error: function(xhr, status, error)
//             {
//                 alert(`Scheduling Failed\n ${xhr.status}\n${status}\n${error}`);
//             },
//         });
//     }

//     // Function that is part of the search functionality
//     // Responsible for filtering through each card based on:
//     // Search Type - the select search type
//     // value - current inputted value by user
//     // card - full card element
//     function search_filter(search_type, value, card)
//     {
//         card.filter(function()
//         {
//             const category = $(this).find(`.card-header`).data(search_type).toLowerCase()
//             $(this).toggle(category.indexOf(value) > -1);
//         });
//     }

//     let selected_search_option; // var used to hold current selected search option.
//     fetchData(); // load cards

//     // admin/customer switch handler
//     // upon switch go to admin.html file
//     $(`#flexSwitchCheckDefault`).on(`change`, function()
//     {
//         location.href = "admin.html";
//     });

//     // update schedule button on card handler
//     // calls update schedule_flight function
//     $(document).on(`click`,`.schedule-btn`, function(event)
//     {
//         flight_to_schedule = event.target.dataset.flightId;
//         schedule_flight(flight_to_schedule);
//     });

//     // Search form key press handler
//     // Calls search filter function based on provided search input selected 
//     // and value entered by user upon handler call.
//      $('#searchInput').on('keyup', function() 
//     {
//         var search_value = $(this).val().toLowerCase();
//         var card = $("#data-container .full_card");

//         // Search by selected option
//         switch(selected_search_option)
//         {
//             case `flight_number`: 
//                 flight_number = `flight_number`;
//                 search_filter(flight_number, search_value, card)
//             break;
//             case `airline`: 
//                 airline = `airline`;
//                 search_filter(airline, search_value, card)
//             break;
//             case `origin`: 
//                 origin = `origin`;
//                 search_filter(origin, search_value, card)
//             break;
//             case `destination`: 
//                 destination = `destination`;
//                 search_filter(destination, search_value, card)
//             break;
//             case `gate`: 
//                 gate = `gate`;
//                 search_filter(gate, search_value, card)
//             break;
//             // Make sure this is a good default
//             default:
//                 flight_number = `flight_number`; // used to allow for refreshing of toggle
//                 empty_search = ``;
//                 $(`#searchInput`).val(``);
//                 search_filter(flight_number, empty_search, card);
//                 alert(`No search option selected.`)
//         }
//     });

//     // Form select handler.
//     // Updates selected search option and clears previous search attempts including toggling off toggled cards
//     $(`.form-select`).on(`change`, function()
//     {
//         $(`#searchInput`).val(``);
//         selected_search_option = $(`.form-select`).val();
        
//         // Update placeholder based on selected search option
//         const default_option = `Select Search Type`;
//         if(selected_search_option === default_option) $(`#searchInput`).attr(`placeholder`, `Search for...`);     
//         else $(`#searchInput`).attr(`placeholder`, `${selected_search_option}:`
//             .replace(`${selected_search_option}`.charAt(0), `${selected_search_option}`.charAt(0).toUpperCase())
//             .replace(`_`, ` `));

//         // Clear toggle and search input on each selection
//         // Pass card, empty string, and dummy type: "flight_number"
//         // to search_filter to reset the toggle.
//         var card = $("#data-container .full_card");
//         var clear_search = ``;
//         var dummy_type = `flight_number`;
//         search_filter(dummy_type, clear_search, card);
//     })
// }); 



$(document).ready(function() {
    // Creates bootstrap card elements with flight information
    function createCard(data) {
        var column = $(`<div class="col-md-3 full_card"></div>`);
        var card = $(`<div class="card text-white border-light"></div>`);
        var cardHeader = $(`<div class="card-header"
            data-flight_number="${data.flight_number}"
            data-airline="${data.airline}"
            data-origin="${data.departure_code}"
            data-destination="${data.arrival_code}"
            data-gate="${data.gate_number}"
            >Flight #${data.flight_number}</div>`);
        var cardBody = $(`<div class="card-body text-center">
            <h4 class="card-title">${data.departure_code} - ${data.arrival_code}</h4>
            <p class="card-text">Gate: ${data.gate_number}</p>
            <p class="card-text">${data.airline}</p>
            <p class="card-text">${new Date(data.departure_time).toLocaleString()}</p>
            </div>`);
        $('#data-container .row').append(column.append(card.append(cardHeader).append(cardBody)));
    }

    // Processes each response flight object received
    function render(data) {
        $('#data-container .row').empty();
        if(data.length <= 0) $('#data-container .row').append('<h3 class="text-danger-emphasis">No Flights Found</h3>');
        data.forEach(function(flight) {
            createCard(flight);
        });
    }
    
    // Get flights by airport code
    function fetchFlightsByAirport(airportCode) {
        $.ajax({
            url: `http://localhost:3000/customer/flights/${airportCode}`,
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
            url: "http://localhost:3000/airports",
            method: "GET",
            success: function(airports) {
                const select = $('#airportSelect');
                select.empty();
                select.append('<option value="" selected disabled>Select an Airport</option>');
                
                if (airports && airports.length > 0) {
                    airports.forEach(airport => {
                        select.append(`<option value="${airport.code}">${airport.airport_name} (${airport.code})</option>`);
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

    // Initialize airport dropdown when page loads
    loadAirports();

     // Handle airport selection
    $('#airportSelect').change(function() {
        const airportCode = $(this).val();
        if (airportCode) {
            fetchFlightsByAirport(airportCode);
        } else {
            $('#data-container .row').empty();
        }
    });

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

    function search_filter(search_type, value, card) {
        card.filter(function() {
            const category = $(this).find(`.card-header`).data(search_type).toLowerCase()
            $(this).toggle(category.indexOf(value) > -1);
        });
    }

    // Your existing event handlers (unchanged)
    $(`#flexSwitchCheckDefault`).on(`change`, function() {
        location.href = "admin.html";
    });

    $(document).on(`click`,`.schedule-btn`, function(event) {
        flight_to_schedule = event.target.dataset.flightId;
        schedule_flight(flight_to_schedule);
    });

    $('#searchInput').on('keyup', function() {
        var search_value = $(this).val().toLowerCase();
        var card = $("#data-container .full_card");

        switch(selected_search_option) {
            case `flight_number`: 
                flight_number = `flight_number`;
                search_filter(flight_number, search_value, card)
                break;
            case `airline`: 
                airline = `airline`;
                search_filter(airline, search_value, card)
                break;
            case `origin`: 
                origin = `origin`;
                search_filter(origin, search_value, card)
                break;
            case `destination`: 
                destination = `destination`;
                search_filter(destination, search_value, card)
                break;
            case `gate`: 
                gate = `gate`;
                search_filter(gate, search_value, card)
                break;
            default:
                flight_number = `flight_number`;
                empty_search = ``;
                $(`#searchInput`).val(``);
                search_filter(flight_number, empty_search, card);
                alert(`No search option selected.`)
        }
    });

    let selected_search_option;
    $(`.form-select`).on(`change`, function() {
        $(`#searchInput`).val(``);
        selected_search_option = $(`.form-select`).val();
        
        const default_option = `Select Search Type`;
        if(selected_search_option === default_option) {
            $(`#searchInput`).attr(`placeholder`, `Search for...`);
        } else {
            $(`#searchInput`).attr(`placeholder`, 
                `${selected_search_option}:`
                .replace(`${selected_search_option}`.charAt(0), 
                `${selected_search_option}`.charAt(0).toUpperCase())
                .replace(`_`, ` `));
        }

        var card = $("#data-container .full_card");
        var clear_search = ``;
        var dummy_type = `flight_number`;
        search_filter(dummy_type, clear_search, card);
    });
});