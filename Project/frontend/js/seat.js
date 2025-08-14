$(document).ready(function() {

    // Processes each response flight object received
    function render(allSeats, availableSeats)
    {
        // clears all tables. See if there is a more one line way to clear the table.
        $('table tbody').empty();

        for(let i = 0; i < 3; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var first_price = `$700.00`
            var row = $(`<tr>
                <td>${flight_id}</td>
                <td>${seat}</td>
                <td>
                    ${first_price}
                    <button class="btn btn-primary reserve-btn rounded-4" data-seat="${seat}">Reserve</button>
                </td>
                </tr>`)
            if(!isAvailable) row.find(`button.reserve-btn`).prop(`disabled`, true).text(`Unavailable`).removeClass(`btn-primary`).addClass(`btn-outline-primary btn-sm`);
            $(`#firstClassBody`).append(row);
        }
        for(let i = 3; i < 6; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var business_price = `$350.00`
            var row = $(`<tr>
                <td>${flight_id}</td>
                <td>${seat}</td>
                <td>
                    ${business_price}
                    <button class="btn btn-primary reserve-btn rounded-4" data-seat="${seat}">Reserve</button>
                </td>
                </tr>`)
            if(!isAvailable) row.find(`button.reserve-btn`).prop(`disabled`, true).text(`Unavailable`).removeClass(`btn-primary`).addClass(`btn-outline-primary btn-sm`);
            $(`#businessClassBody`).append(row);
        }
        for(let i = 6; i < 10; i++)
        {
            const seat = allSeats[i];
            const isAvailable = availableSeats.includes(seat);
            var economy_price = `$100.00`
            var row = $(`<tr>
                <td>${flight_id}</td>
                <td>${seat}</td>
                <td>
                    ${economy_price}
                    <button class="btn btn-primary reserve-btn rounded-4" data-seat="${seat}">Reserve</button>
                </td>
                </tr>`)
            if(!isAvailable) row.find(`button.reserve-btn`).prop(`disabled`, true).text(`Unavailable`).removeClass(`btn-primary`).addClass(`btn-outline-primary btn-sm`);
            $(`#economyClassBody`).append(row);
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
    
    // update return button to holds userid parameter
    function validate_page_selections(user_id)
    {
        const href = `customer.html?user_id=${user_id}`;
        $('.btn-return').attr('href', href);
    }

    // Initialize airport dropdown when page loads
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');
    const flight_id = urlParams.get('flight_id');
    const allSeats = ["A1", "A2", "A3", "B1", "B2", "B3","C1", "C2", "C3", "C4"];
    if(flight_id && user_id)
    {
        validate_page_selections(user_id);
        loadSeats();
    }
    else
    {
        alert(`No flight or user selected`);
    }
});
