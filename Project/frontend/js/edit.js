$(document).ready(function()
{
    // custom alert function
    // sends a element alert with message
    // type - type of alert success or error
    // message: - specified message to include in alert
    // details - extra details if needed. ex: "gate occupied"
    function showAlert(type, message, details = "")
    {
        // Remove any existing alerts
        $("#alertContainer").remove();

        // Create alert container
        const alertContainer = $("<div>").attr("id", "alertContainer").addClass("mt-3");
        
        // Create alert
        const alertDiv = $("<div>").addClass("alert").addClass(type === 'success' ? "alert-success" : "alert-warning");
        
        // Add message
        alertDiv.append($("<p>").addClass("mb-0").text(message));

        // Add details if provided
        if (details) {
            alertDiv.append($("<p>").addClass("mb-0 mt-2 small").text(details));
        }

        // Append alert to container and insert after form
        alertContainer.append(alertDiv);
        $("#updateForm").after(alertContainer);
    };
    
    // disables form if flight is not specified
    // makes sure user cannot edit on an empty flight
    function disableForm()
    {
        $('#updateForm input').prop('disabled', true);
        $('#updateForm button[type="submit"]').prop('disabled', true);
    };
    
    // Format date from sql to form and vic versa
    // used in comparing
    function parseDate(date, origin)
    {
        // parse from sql to form
        if(origin === 'sql') return date.replace('/:/', 'T').substring(0, 16);
        // parse from form to sql
        if(origin === 'form') return date.replace('T', ':') + ':00';
    };

    // validate time used to handle for incorrect departure and arrival times
    function validate_time()
    {
        const departure_time = $('#departureTimeInput').val();
        const arrival_time = $('#arrivalTimeInput').val();

        // Get departure time input value
        // pass departure time into new Date() to create selected date object
        // Compare selected date object with current date object
        const departure_time_formatted= new Date(departure_time);
        const arrival_time_formatted= new Date(arrival_time);
        const current_date= new Date();

        // departure time cannot be in in the past.
        if(departure_time_formatted < current_date || arrival_time_formatted < current_date)
        {
            alert(`Time cannot be in the past.`);
            $('#departureTimeInput').val(data_formatted.departure_time);
            $('#arrivalTimeInput').val(data_formatted.arrival_time);
            return;
        }
        
        if(!(departure_time && arrival_time)) return; // If not both specified return
        if(departure_time < arrival_time) return; // if correct dates return
        
        // Arrival time cannot be before departure time error.
        // reset field upon error
        alert(`Arrival time cannot be before or at departure time.`);
        $('#departureTimeInput').val(data_formatted.departure_time);
        $('#arrivalTimeInput').val(data_formatted.arrival_time);
    };
    
    // Retrieve the flight_id and from parameters from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const flight_id = urlParams.get('id'); // used to make sure flight_id specified upon document interaction
    $('#flexSwitchCheckDefault').prop('checked', true); // Toggle admin switch upon document ready

    // Render flight info of provided flight via flight_id
    if (flight_id)
    {
        // Fetch flight data and populate table
        // Get request to backend endpoint to retrieve flight given flight id via [admin web service]
        $.ajax
        ({
            url: `http://localhost:3000/admin/${flight_id}`,
            method: 'GET',
            success: function(data)
            {
                if (data) 
                {
                    // Used in checking for changes
                    data_formatted = 
                    {
                        
                        flight_number: data.flight_number,
                        airline: data.airline,
                        origin: data.origin,
                        destination: data.destination,
                        departure_time: parseDate(data.departure_time, 'sql'), // formate data to js form standard
                        arrival_time: parseDate(data.arrival_time, 'sql'), // formate data to js form standard
                        gate: data.gate,
                    }
                    
                    $('#flightNumberInput').val(data_formatted.flight_number);
                    $('#airlineInput').val(data_formatted.airline);
                    $('#originInput').val(data_formatted.origin);
                    $('#destinationInput').val(data_formatted.destination);
                    $('#departureTimeInput').val(data_formatted.departure_time);
                    $('#arrivalTimeInput').val(data_formatted.arrival_time);
                    $('#gateInput').val(data_formatted.gate);
                }
            },
            error: function(xhr, status, error)
            {
                showAlert(`error`, `Error fetching city data\n ${xhr.status}\n${status}\n${error}`);
            }
        });
    } 
    else 
    {
        // Prevent form submission if no city is specified
        $('#message').text('No flight specified in the URL');
        disableForm();
    }
    
    // admin/customer switch handler
    // upon switch go to customer.html file
    $(`#flexSwitchCheckDefault`).on(`change`, function () 
    {
        location.href = "customer.html";
    }); 
    
    // arrival time input handler
    // upon input validate user input
    $(`#arrivalTimeInput`).on(`input`, () =>
    {
        validate_time();
    });
    
    // departure time input handler
    // upon input validate user input
    $(`#departureTimeInput`).on(`input`, () =>
    {
        validate_time();
    });

    // submit form handler
    // upon submission request a put from backend while validating user data
    $('#updateForm').submit(function(e)
    {
        e.preventDefault();
        
        // Validate form inputs and parse with correct datatypes for comparing
        const updatedData = 
        {
            flight_number: $('#flightNumberInput').val(),
            airline: $('#airlineInput').val(),
            origin: $('#originInput').val(),
            destination: $('#destinationInput').val(),
            departure_time: $('#departureTimeInput').val(), // No need to parse because sequelize does it for you
            arrival_time: $('#arrivalTimeInput').val(),
            gate: $('#gateInput').val(),
        };

        // Check if data has changed
        // data is the original data retrieved from the HTTP GET request
        // Comparison might not work due to different date parsing
        if (JSON.stringify(updatedData) === JSON.stringify(data_formatted))
        {
            showAlert('error', 'No changes detected', 'Please modify at least one field before updating.');
            return;
        }

        // Update city data in the database through an HTTP PUT request
        // Put request to backend endpoint to update existing flight given flight id via [admin web service]
        $.ajax
        ({
            url: `http://localhost:3000/admin/${flight_id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function(response) 
            {
                showAlert('success', `Flight id: ${flight_id} has been successfully updated.`);
            },
            error: function(xhr, status, error)
            {
                let error_message = `Error: updating flight ${data_formatted.flight_number}`;
                let error_details = ``;
                const response = JSON.parse(xhr.responseText); // parse xhr error details from backend endpoint
                const response_error = response.error;

                // If response error check issue and update error_details with issue
                if(response_error)
                {
                    error_details = `Gate ${data_formatted.gate} occupied.`;
                }
                else error_details = "There might be an issue with the data format or connection to the server. Please try again.";
                showAlert(`error`, error_message, error_details);
            }
        });
    });
});