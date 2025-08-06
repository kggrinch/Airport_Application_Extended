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
        const alertDiv = $("<div>").addClass("alert").addClass(type === 'success' ? "alert-success" : "alert-danger");
        
        // Add message
        alertDiv.append($("<p>").addClass("mb-0").text(message));

        // Add details if provided
        if (details) {
            alertDiv.append($("<p>").addClass("mb-0 mt-2 small").text(details));
        }

        // Append alert to container and insert after form
        alertContainer.append(alertDiv);
        $("#createForm").after(alertContainer);
    }

    // validate time used to handle for incorrect departure and arrival times
    function validate_time()
    {
        const departure_time = $('#departureTimeInput').val();
        const arrival_time = $('#arrivalTimeInput').val();

        // Get departure time input value
        // pass departure time into new Date() to create selected date object
        // Compare selected date object with current date object.
        const departure_time_formatted= new Date(departure_time);
        const arrival_time_formatted= new Date(arrival_time);
        const current_date= new Date();

        // Date cannot be in in the past.
        if(departure_time_formatted < current_date || arrival_time_formatted < current_date)
        {
            alert(`Time cannot be in the past.`);
            $(`#arrivalTimeInput`).val(``);
            $(`#departureTimeInput`).val(``);
            return;
        }

        if(!(departure_time && arrival_time)) return; // If not both specified return
        if(departure_time < arrival_time) return; // if correct dates return
        
        // Arrival time cannot be before departure time 
        // reset field upon error
        alert(`Arrival time cannot be before or at departure time.`);
        $(`#arrivalTimeInput`).val(``);
        $(`#departureTimeInput`).val(``);
    }

    $('#flexSwitchCheckDefault').prop('checked', true); // Toggle admin switch upon document ready

    // admin/customer switch handler
    // upon switch go to customer.html file
    $(`#flexSwitchCheckDefault`).on(`change`, function()
    {
        location.href = "customer.html";
    }); 

    // arrival time input handler
    // upon input validate user input
    $(`#arrivalTimeInput`).on(`input`, function()
    {
        validate_time();
    });

    // departure time input handler
    // upon input validate user input
    $(`#departureTimeInput`).on(`input`, function()
    {
        validate_time();
    });

    // submit form handler
    // upon submission request a post from backend while validating user data
    $("#createForm").submit(function(event) 
    {
        event.preventDefault(); // stop default submit behavior

        const flight_number = $(`#flightNumberInput`).val(); // Save flight number
        const gate = $(`#gateInput`).val(); // save gate number
        
        // Create flight object from form inputs
        const new_flight = 
        {
            flight_number: flight_number,
            airline: $(`#airlineInput`).val(),
            origin: $(`#originInput`).val(),
            destination: $(`#destinationInput`).val(),
            departure_time: $(`#departureTimeInput`).val(),
            arrival_time: $(`#arrivalTimeInput`).val(),
            gate: gate
        }

        // Post request to backend endpoint to create new flight via [admin web service]
        $.ajax
        ({
            url: `http://localhost:3000/admin`,
            method: `POST`,
            contentType: `application/json`,
            data: JSON.stringify(new_flight),
            success: function(response)
            {
                showAlert(`success`, `flight ${flight_number} has been successfully created.`);
                $(`#createForm`).trigger(`reset`); // Clear form inputs

            },
            error: function(xhr, status, error)
            {
                let error_message = `Error: creating flight ${flight_number} failed.`;
                let error_details = "";
                const response = JSON.parse(xhr.responseText); // parse xhr error details from backend endpoint
                const response_error = response.error;
                
                // If response error check issue and update error_details with issue
                if(response_error)
                {
                    if(response_error.flight_number_exists) error_details = `Flight ${flight_number} already exists.`;
                    if(response_error.flight_gate_exists) error_details = `Gate ${gate} occupied.`;
                }
                else error_details = "There might be an issue with the data format or connection to the server. Please try again.";
                showAlert(`error`, error_message, error_details);
            }
        });
    });
});