$(document).ready(function() {
    
    // Display seats in the table
    function render(allSeats, availableSeats)
    {
        // clear old rows
        $('table tbody').empty();

        // first class seats
        for(let i = 0; i < 5; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var first_price = `$700.00`
            var row = $(`<tr>
                <td>${seat}</td>
                <td>${first_price}</td>
                <td>
                    <button class="btn btn-primary reserve-btn rounded-4" data-seat="${seat}">Reserve</button>
                </td>
                </tr>`)
            // disable button if seat is taken
            if(!isAvailable) row.find(`button.reserve-btn`).prop(`disabled`, true).text(`Unavailable`).removeClass(`btn-primary`).addClass(`btn-outline-primary btn-sm`);
            $(`#firstClassBody`).append(row);
        }
        // business class seats
        for(let i = 5; i < 10; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var business_price = `$350.00`
            var row = $(`<tr>
                <td>${seat}</td>
                <td>${business_price}</td>
                <td>
                    <button class="btn btn-primary reserve-btn rounded-4" data-seat="${seat}">Reserve</button>
                </td>
                </tr>`)
            // disable button if seat is taken
            if(!isAvailable) row.find(`button.reserve-btn`).prop(`disabled`, true).text(`Unavailable`).removeClass(`btn-primary`).addClass(`btn-outline-primary btn-sm`);
            $(`#businessClassBody`).append(row);
        }
        // economy class seats
        for(let i = 10; i < 16; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var economy_price = `$100.00`
            var row = $(`<tr>
                <td>${seat}</td>
                <td>${economy_price}</td>
                <td>
                    <button class="btn btn-primary reserve-btn rounded-4" data-seat="${seat}">Reserve</button>
                </td>
                </tr>`)
            // disable button if seat is taken
            if(!isAvailable) row.find(`button.reserve-btn`).prop(`disabled`, true).text(`Unavailable`).removeClass(`btn-primary`).addClass(`btn-outline-primary btn-sm`);
            $(`#economyClassBody`).append(row);
        }
    };

    // get seat info from server
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
    
    // update return button to holds userid parameter
    function validate_page_selections(user_id)
    {
        const href = `customer.html?user_id=${user_id}`;
        $('.btn-return').attr('href', href);
    }

    // send booking to server
    function create_booking(new_ticket_id)
    {
        $.ajax
        ({
            url: `http://localhost:3000/customer/flight/ticket/booking`,
            method: `POST`,
            contentType: `application/json`,
            data: JSON.stringify(new_ticket_id),
            success: function(res)
            {
                alert(`Success: Seat reserved successfully`);
                loadSeats(); // refresh seats
            },
            error: function(xhr, status, error)
            {
                alert(`Reservation failed\n ${xhr.status}\n${status}\n${error}`);
            }
        });
    }

    // reserve a seat
    function reserve_ticket(reservation)
    {
        $.ajax
        ({
            url: `http://localhost:3000/customer/flight/ticket`,
            method: `POST`,
            contentType: `application/json`,
            data: JSON.stringify(reservation),
            success: function(res)
            {
                const new_ticket_id = {ticket_id: `${res.ticket_id}`}
                create_booking(new_ticket_id); // confirm reservation
            },
            error: function(xhr, status, error)
            {
                alert(`Reservation failed\n ${xhr.status}\n${status}\n${error}`);
            }
        });
    };

    // change page title to show flight
    function update_title(flight_id)
    {
        $(`h1`).text(`${flight_id} Seat Selection`);
    }

    // Initialize airport dropdown when page loads
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    const flight_id = urlParams.get('flight_id');
    const allSeats = ["A1", "A2", "A3", "A4", "A5", "B1","B2", "B3", "B4", "B5", "C1", "C2", "C3", "C4", "C5", "C6"];
    if(flight_id && user_id)
    {
        validate_page_selections(user_id); // set return button
        update_title(flight_id); // show flight number
        loadSeats(); // get and show seats
    }
    else
    {
        alert(`No flight or user selected`);
    }

    // handle reserve button click event
    $(document).on(`click`, `.reserve-btn`, function()
    {
        const seat_number = this.dataset.seat;
        const message = `Click Ok to confirm reservation of seat ${seat_number} for flight ${flight_id}`;
        if(!confirm(message)) return;
        const reservation = 
        {
            flight_id: flight_id,
            user_id: user_id,
            seat_number: seat_number
        };
        reserve_ticket(reservation); // send reservation to server
    });
});
