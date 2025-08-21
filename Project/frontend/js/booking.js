$(document).ready(function() {
    // Create table row for each booking
    function createBookingRow(data) {
        // Row with booking info and buttons
        const row = $(`
            <tr>
                <td>${data.ticket_id}</td>
                <td>${data.flight_number}</td>
                <td>${data.departure_airport}</td>
                <td>${data.arrival_airport}</td>
                <td>${data.seat_number}</td>
                <td>${data.class_type}</td>
                <td class="text-center">
                    <a href="view.html?user_id=${user_id}&from=booking_pricing&flight_id=${data.flight_number}&ticket_id=${data.ticket_id}" class="btn btn-outline-dark rounded-4 btn-sm text-white">View Pricing</a>
                    <a href="view.html?user_id=${user_id}&from=booking_boarding&flight_id=${data.flight_number}&ticket_id=${data.ticket_id}" class="btn btn-outline-dark rounded-4 btn-sm text-white">View Boarding Info</a>
                    <button class="btn btn-outline-danger cancel-reserve-btn rounded-4 btn-sm" data-ticket="${data.ticket_id}">Cancel Flight</button>
                </td>
            </tr>
        `);
        // Add row to the table
        $('#bookingTableBody').append(row);
    }
    
    // Show bookings on the page
    function render(data) {
        // Remove old rows
        $('#bookingTableBody').empty();
        
        // Show message if no bookings
        if(data.length <= 0) {
            $('#bookingTableBody').append(`
                <tr>
                    <td colspan="8" class="text-center">No Bookings Found</td>
                </tr>
            `);
            return;
        }
        
        // Make a row for each booking
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

    // Remove a ticket
    function delete_ticket(ticket)
    {
        $.ajax
        ({
            url: `http://localhost:3000/customer/flight/ticket`,
            method: `DELETE`,
            contentType: `application/json`,
            data: JSON.stringify(ticket),
            // If it works, show success and update table
            success: function()
            {
                alert(`Success: Ticket ${ticket.ticket_id} successfully canceled`);
                fetchUserBookings(user_id);
            },
            // If it fails, show error
            error: function(xhr, status, error)
            {
                alert(`Deletion failed\n ${xhr.status}\n${status}\n${error}`);
            }
                
        })
    }

    // Initialize page
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    
    if(user_id) {
        // Update navbar link
        validate_page_selections(user_id);
        // Get bookings for user
        fetchUserBookings(user_id);
    } else {
        // Go to login if no user
        alert(`No User Selected`);
        window.location.href = "authentication.html";
    }

    // When cancel button clicked
    $(document).on(`click`, `.cancel-reserve-btn`, function()
    {
        const ticket_id = this.dataset.ticket;
        const message = `Click Ok to confirm deletion of ticket ${ticket_id}`;
        // Ask before deleting 
        if(!confirm(message)) return;
        const ticket = 
        {
            ticket_id: ticket_id
        };
        // Delete ticket
        delete_ticket(ticket);
    });
});