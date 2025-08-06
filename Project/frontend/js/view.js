$(document).ready(function()
{
    // custom alert function
    // sends a element alert with message
    // message: - specified message to include in alert
    function showError(message)
    {
        $('table').before(`<div class="alert alert-danger">${message}</div>`);
    }

    // Format date from sql for cleaner viewing
    function parseDate(date)
    {
        // parse from sql 
        return date.replace('T', ' ').substring(0, 16);
    };

    // Retrieve the flight_id and from parameters from the URL parameters
    // from - used to manage which file view was called from to correctly backtrack to previous file after viewing
    const urlParams = new URLSearchParams(window.location.search);
    const flight_id = urlParams.get('id');
    const from = urlParams.get('from');
    if(from === `admin`) $(`.btn-return`).attr("href", "admin.html");
    if(from === 'customer') $(`.btn-return`).attr("href", "customer.html");
    if(from === 'scheduled') $(`.btn-return`).attr("href", "scheduled.html");

    // Render flight info of provided flight via flight_id
    if (flight_id) 
    {
    // Get request to backend endpoint to fetch flight info of specified flight give flight id [admin web service]
    $.ajax({
        url: `http://localhost:3000/admin/${encodeURIComponent(flight_id)}`, // admin web service used because it contains function that works with all flights
        method: 'GET',
        success: function(data)
        {
            if (data)
            {
                // Fill table rows with city data and append to table body.
                const entries = Object.entries(data);
                for(let i = 0; i < entries.length - 1; i++ )
                {
                    let [key, value] = entries[i];
                    var label = `<td>${key}</td>`;
                    if(typeof(value) === `string` && value.includes(`:`)) value = parseDate(value); // used to parse date once encountered within the loop 
                    var input = `<td>${value}</td>`;
                    $(".table tbody").append(`<tr>${label}${input}</tr>`);
                }
            } 
            else 
            {
                showError("Flight not found");
            }
        },
        error: function(xhr, status, error)
        {
            showError(`Failed to fetch flights.\n ${xhr.status}\n${status}\n${error}`);
        }
    });
    } 
    else 
    {
        showError("No flight specified");
    }
});