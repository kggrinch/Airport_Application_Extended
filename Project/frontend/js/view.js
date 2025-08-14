$(document).ready(function() {
    function createDetailItem(label, value) {
        return `
            <div class="row mb-2">
                <div class="col-4 text-white-50 fw-bold">${label}</div>
                <div class="col-8 text-white">${value ?? 'N/A'}</div>
            </div>
        `;
    }

    function render(data) {
        const container = $('#flight-details-container');
        container.empty();

        if (data.length <= 0) {
            container.html(`<h2 class="text-center text-danger-emphasis">No Flight Details Found</h2>`);
            return;
        }

        const f = data[0];
        container.append(`<h2 class="text-white mb-4">Flight Details</h2>`);

        container.append(createDetailItem('Airport Name', f.departure_airport_name));
        container.append(createDetailItem('City', f.departure_city));
        container.append(createDetailItem('State', f.departure_state));
        container.append(createDetailItem('ZIP', f.departure_zip));
        container.append(createDetailItem('From', f.from_code));
        container.append(createDetailItem('To', f.to_code));
        container.append(createDetailItem('Boarding Time', new Date(f.boarding_time).toLocaleString()));
        container.append(createDetailItem('Departure Time', new Date(f.departure_time).toLocaleString()));
        container.append(createDetailItem('Arrival Time', new Date(f.arrival_time).toLocaleString()));
        container.append(createDetailItem('Gate #', f.gate_number));

        if (f.flight_price) {
            container.append(createDetailItem('Flight Price', `$${parseFloat(f.flight_price).toFixed(2)}`));
        } else {
            container.append(createDetailItem('Pricing', 'Not Available'));
        }
    }

    function fetchFlightDetails(flight_id) {
        $.ajax({
            url: `http://localhost:3000/customer/flights/${flight_id}`,
            method: "GET",
            dataType: "json",
            success: render,
            error: () => {
                $('#flight-details-container').html(`<h2 class="text-center text-danger-emphasis">Error loading flight details</h2>`);
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    const flight_id = urlParams.get('flight_id');

    
    if (flight_id) {
        fetchFlightDetails(flight_id);
    } else {
        $('#flight-details-container').html(`<h2 class="text-center text-danger-emphasis">No Flight Selected</h2>`);
    }

    
    // Set return button link
    $('#returnButton').click(function() {
        if (user_id) {
            window.location.href = `customer.html?user_id=${user_id}`;
        } else {
            window.location.href = "customer.html";
        }
    });
});