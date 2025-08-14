$(document).ready(function() {
    // Create table row for each booking
    function createBookingRow(data) {
        // Convert string values to numbers
        const flight_price = parseFloat(data.flight_price);
        const seat_price = parseFloat(data.seat_price);
        const total_price = parseFloat(data.total_price);
        
        const row = $(`
            <tr>
                <td>${data.ticket_id}</td>
                <td>${data.flight_number}</td>
                <td>${data.seat_number}</td>
                <td>${data.class_type}</td>
                <td>${new Date(data.booking_date).toLocaleString()}</td>
                <td>$${flight_price.toFixed(2)}</td>
                <td>$${seat_price.toFixed(2)}</td>
                <td>$${total_price.toFixed(2)}</td>
            </tr>
        `);
        $('#bookingTableBody').append(row);
    }

    // Processes each response booking object received
    function render(data) {
        console.log("Received data:", data); // Debug log
        $('#bookingTableBody').empty();
        
        if(data.length <= 0) {
            $('#bookingTableBody').append(`
                <tr>
                    <td colspan="8" class="text-center">No Bookings Found</td>
                </tr>
            `);
            return;
        }
        
        data.forEach(function(booking) {
            createBookingRow(booking);
        });
    }

    // Get bookings for current user
    function fetchUserBookings(user_id) {
        console.log(`Fetching bookings for user: ${user_id}`);
        $.ajax({
            url: `http://localhost:3000/customer/${user_id}/bookings`,
            method: "GET",
            dataType: "json",
            success: render,
            error: (xhr, status, error) => {
                console.error("Error fetching bookings:", error, xhr.responseText);
                $('#bookingTableBody').html(`
                    <tr>
                        <td colspan="8" class="text-center">Error loading bookings</td>
                    </tr>
                `);
            }
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

    // Initialize page
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    console.log("URL Params user_id:", user_id); // Debug log
    
    if(user_id) {
        validate_page_selections(user_id);
        fetchUserBookings(user_id);
    } else {
        alert(`No User Selected`);
        window.location.href = "authentication.html";
    }
});