$(document).ready(function()
{

    // Creates bootstrap card elements with flight information
    // Card header holds data-information used in search functionality
    function createCard(data)
    {
        var column = $(`<div class="col-md-3 full_card"></div>`);
        var card = $(`<div class="card text-white border-light"></div>`);
        var cardHeader = $(`<div class="card-header"
            data-flight_number="${data.flight_number}"
            data-airline="${data.airline}"
            data-origin="${data.origin}"
            data-destination="${data.destination}"
            data-gate="${data.gate}"
            >Flight #${data.flight_number}</div>`);
        var cardBody = $(`<div class="card-body text-center">
            <h4 class="card-title">${data.origin} - ${data.destination}</h4>
            <p class="card-text">Gate: ${data.gate}</p>
                <a href="view.html?from=scheduled&id=${data.id}" class="btn btn-outline-dark rounded-4 text-white" data-flight-id="${data.id}">View</a>
                <button class="btn btn-outline-info rounded-4 text-white schedule-btn" data-flight-id="${data.id}">Cancel Flight</button>
            </div>`);
        $('#data-container .row').append(column.append(card.append(cardHeader).append(cardBody)));
    }

    // Processes each response flight object received
    function render(data)
    {
        $('#data-container .row').empty();
        if(data.length <= 0) $('#data-container .row').append('<h3 class=" text-danger-emphasis">No Scheduled Flights</h3>');
        data.forEach(function(flight)
        {
            createCard(flight);
        });
    }
    
    // Get request to backend endpoint to retrieve all scheduled flights via [customer web service]
    function fetchData()
    {
        $.ajax
        ({
            url: "http://localhost:3000/customer/scheduled", // get all scheduled flights
            method: "GET",
            dataType: "json",
            success: render,
            error: (xhr, status, error) => 
            {
                console.log(xhr.responseText)
                alert(`Failed to fetch flights.\n ${xhr.status}\n${status}\n${error}`);
            }
        })
    }
    
    // Patch request to backend endpoint to update schedule attribute of flight given id via [customer web service]
    // flight_to_schedule - flight id of flight to update
    function schedule_flight(flight_to_schedule)
    {
        $.ajax
        ({
            url: `http://localhost:3000/customer/${flight_to_schedule}`,
            method: "PATCH",
            contentType: 'application/json',
            data: JSON.stringify({scheduled: false}),
            success: function(response)
            {
                alert(`Flight: ${flight_to_schedule} cancelled`);
                fetchData();
            },
            error: function(xhr, status, error)
            {
                alert(`Cancel Failed\n ${xhr.status}\n${status}\n${error}`);
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

    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    if(user_id)
    {
        fetchData(); // load cards
        validate_page_selections(user_id);
    }
    else
    {
        alert(`No User Selected`);
    }

    let selected_search_option; // var used to hold current selected search option.
    // admin/customer switch handler
    // upon switch go to admin.html file
    $(`#flexSwitchCheckDefault`).on(`change`, function()
    {
        location.href = "admin.html";
    });

    // update schedule button on card handler
    // calls update schedule_flight function
    $(document).on(`click`,`.schedule-btn`, function(event)
    {
        flight_to_schedule = event.target.dataset.flightId;
        schedule_flight(flight_to_schedule);
    });

    // Search form key press handler
    // Calls search filter function based on provided search input selected 
    // and value entered by user upon handler call.
     $('#searchInput').on('keyup', function() 
    {
        var search_value = $(this).val().toLowerCase();
        var card = $("#data-container .full_card");

        // Search by selected option
        switch(selected_search_option)
        {
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
            default:  // extra precaution default
                flight_number = `flight_number`; // used to allow for refreshing of toggle
                empty_search = ``;
                $(`#searchInput`).val(``);
                search_filter(flight_number, empty_search, card);
                alert(`No search option selected.`)
        }
    });

    // Form select handler.
    // Updates selected search option and clears previous search attempts including toggling off toggled cards
    $(`.form-select`).on(`change`, function()
    {
        $(`#searchInput`).val(``);
        selected_search_option = $(`.form-select`).val();
        
        // Update placeholder based on selected search option
        const default_option = `Select Search Type`;
        if(selected_search_option === default_option) $(`#searchInput`).attr(`placeholder`, `Search for...`);     
        else $(`#searchInput`).attr(`placeholder`, `${selected_search_option}:`
            .replace(`${selected_search_option}`.charAt(0), `${selected_search_option}`.charAt(0).toUpperCase())
            .replace(`_`, ` `));
        
        // Clear toggle and search input on each selection
        // Pass card, empty string, and dummy type: "flight_number"
        // to search_filter to reset the toggle.
        var card = $("#data-container .full_card");
        var clear_search = ``;
        var dummy_type = `flight_number`;
        search_filter(dummy_type, clear_search, card);
    })
});