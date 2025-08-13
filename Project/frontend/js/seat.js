$(document).ready(function() {

    // Processes each response flight object received
    function render(allSeats, availableSeats)
    {
        // $(`.container .seat-board`).empty(); // clear all seats

        for(let i = 0; i < 3; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var card = $(`<div class="card btn btn-outline-secondary">${seat}</div>`);
            if(isAvailable) card.addClass("available");
            else card.addClass("unavailable");
            $(`#first_class`).append(card);
        }
        for(let i = 3; i < 6; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var card = $(`<div class="card btn btn-outline-secondary">${seat}</div>`);
            if(isAvailable) card.addClass("available");
            else card.addClass("unavailable");
            $(`#business_class`).append(card);
        }
        for(let i = 6; i < 10; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var card = $(`<div class="card btn btn-outline-secondary">${seat}</div>`);
            if(isAvailable) card.addClass("available");
            else card.addClass("unavailable");
            $(`#economy_class`).append(card);
        }
    };


    function loadSeats() {
        $.ajax({
            url: `http://localhost:3000/customer/flight/${flight_id}/seats`,
            method: "GET",
            success: function(data)
            {
                let availableSeats = []; // create empty available seat array
                data.forEach(function(seat) // fill available seat array
                {
                    availableSeats.push(seat.seat_number);
                });
                render(allSeats, availableSeats); // render seats
            },
            error: function(xhr, status, error) {
                console.error('Error loading seats:', error);
                alert("Error loading seats")
            }
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
    const flight_id = urlParams.get('flight_id');
    const allSeats = ["A1", "A2", "A3", "B1", "B2", "B3","C1", "C2", "C3", "C4"];
    if(flight_id)
    {
        // validate_page_selections(user_id);
        loadSeats();
    }
    else
    {
        alert(`flight Selected`);
    }
});
