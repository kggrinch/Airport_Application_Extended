$(document).ready(function() {
    function createDetailItem(label, value) {
        return `
            <div class="row mb-2">
                <div class="col-4 text-white-50 fw-bold">${label}</div>
                <div class="col-8 text-white">${value ?? 'N/A'}</div>
            </div>
        `;
    }

    function render_flight_details(data) {
        const container = $('#flight-details-container');
        container.empty();

        if (data.length <= 0) {
            container.html(`<h2 class="text-center text-danger-emphasis">No Flight Details Found</h2>`);
            return;
        }

        const f = data[0];
        container.append(`<h2 class="text-white mb-4">Flight Details</h2>`);

        container.append(createDetailItem('Flight #', f.flight_number));
        container.append(createDetailItem('Airline', f.airline));
        container.append(createDetailItem('From', f.departure_airport));
        container.append(createDetailItem('To', f.arrival_airport));
        container.append(createDetailItem('Boarding Time', new Date(f.boarding_time).toLocaleString()));
        container.append(createDetailItem('Departure Time', new Date(f.departure_time).toLocaleString()));
        container.append(createDetailItem('Arrival Time', new Date(f.arrival_time).toLocaleString()));
        container.append(createDetailItem('Gate #', f.gate_number));
        container.append(createDetailItem('Airport Name', f.airport_name));
        container.append(createDetailItem('City', f.city));
        container.append(createDetailItem('State', f.state));
        container.append(createDetailItem('ZIP', f.location_zip));
        container.append(createDetailItem('', '')); // breakline
        container.append(createDetailItem('Flight Price', `$${parseFloat(150.00).toFixed(2)}`));
    };

    function render_boarding_details(data) {
        const container = $('#flight-details-container');
        container.empty();

        if (data.length <= 0) {
            container.html(`<h2 class="text-center text-danger-emphasis">No Flight Details Found</h2>`);
            return;
        }

        const b = data[0];
        container.append(`<h2 class="text-white mb-4">${flight_id} Boarding Details</h2>`);

        container.append(createDetailItem('Gate #', b.gate_number));
        container.append(createDetailItem('Boarding Time', new Date(b.boarding_time).toLocaleString()));
        container.append(createDetailItem('Departure Time', new Date(b.departure_time).toLocaleString()));
        container.append(createDetailItem('Arrival Time', new Date(b.arrival_time).toLocaleString()));
    };

    function render_pricing_details(data)
    {
        const container = $('#flight-details-container');
        container.empty();

        if (data.length <= 0) {
            container.html(`<h2 class="text-center text-danger-emphasis">No Flight Details Found</h2>`);
            return;
        }

        const p = data[0];
        container.append(`<h2 class="text-white mb-4">Ticket ${ticket_id} Pricing Details</h2>`);

        container.append(createDetailItem('Booking Date:', new Date(p.booking_date).toLocaleString()));
        container.append(createDetailItem('Flight Price:', `$${parseFloat(p.flight_price).toFixed(2)}`));
        container.append(createDetailItem(`Seat Price`, `$${parseFloat(p.seat_price).toFixed(2)}`));
        container.append(createDetailItem('Tax:', `$${parseFloat(p.tax).toFixed(2)}`));
        container.append(createDetailItem('Total Price:', `$${parseFloat(p.total_price).toFixed(2)}`));
    };


    function fetchFlightDetails(flight_id) {
        $.ajax({
            url: `http://localhost:3000/customer/flights/${flight_id}`,
            method: "GET",
            dataType: "json",
            success: render_flight_details,
            error: () => {
                $('#flight-details-container').html(`<h2 class="text-center text-danger-emphasis">Error loading flight details</h2>`);
            }
        });
    };

    function fetchTicketPricing(ticket_id)
    {
       $.ajax
       ({
        url: `http://localhost:3000/customer/flight/ticket/${ticket_id}/pricing`,
        method: `GET`,
        dataType: "json",
        success: render_pricing_details,
        error: () => {
                $('#flight-details-container').html(`<h2 class="text-center text-danger-emphasis">Error loading flight details</h2>`);
            }
       });
    }

    function fetchBoardingInfo(flight_id)
    {
        $.ajax({
            url: `http://localhost:3000/customer/flight/${flight_id}/boarding`,
            method: "GET",
            dataType: "json",
            success: render_boarding_details,
            error: () => {
                $('#flight-details-container').html(`<h2 class="text-center text-danger-emphasis">Error loading flight details</h2>`);
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get(`user_id`);
    const flight_id = urlParams.get(`flight_id`);
    const ticket_id = urlParams.get(`ticket_id`);
    const from = urlParams.get(`from`);

    // maybe try refactoring to retrieve all details given the ticket_id
    switch(from)
    {
        case `view`:
            fetchFlightDetails(flight_id);
        break;
        case `booking_pricing`:
            fetchTicketPricing(ticket_id);
        break;
        case `booking_boarding`:
            fetchBoardingInfo(flight_id);
        break;
        default:
            $('#flight-details-container').html(`<h2 class="text-center text-danger-emphasis">No Flight Selected</h2>`);
    };

    // Set return button link
    $('#returnButton').click(function() 
    {
        // add logic to return to the correct front-end based from the from parameter
        if (user_id && from === `view`) 
        {
            window.location.href = `customer.html?user_id=${user_id}`;
        } 
        else 
        {
            window.location.href = `booking.html?user_id=${user_id}`;
        }
    });
});