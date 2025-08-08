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
    };

    // Processes each response flight object received
    function render(data)
    {
        $('#select_user_form .option').empty(); // clear pervious users
        // if(data.length <= 0) $('#data-container .row').append('<h3 class=" text-danger-emphasis">No Flights</h3>'); // If no flights return message
        data.forEach(function(user)
        {
            var option = $(`<option value="${user.first_name}">${user.first_name}</option>`);
            $('#select_user_form .option').append(option);
        });
    };
    
    // Get request to backend endpoint to retrieve all customers via [customer web service]
    function fetchData()
    {
        $.ajax
        ({
            url: "http://localhost:3000/customer",
            method: "GET",
            dataType: "json",
            success: render, // render function call upon success
            error: (xhr, status, error) => 
            {
                console.log(xhr.responseText)
                alert(`Failed to fetch flights.\n ${xhr.status}\n${status}\n${error}`);
            }
        });
    };

    fetchData();

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