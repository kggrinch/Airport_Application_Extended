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
        $("#loginForm").after(alertContainer);
    };

    // Processes each response flight object received
    function render(data)
    {
        var user_select =  $('#select_user_form');
        user_select.empty(); // clear pervious users
        user_select.append($(`<option selected value="">Select User</option>`)) // default
        // if(data.length <= 0) $('#data-container .row').append('<h3 class=" text-danger-emphasis">No Flights</h3>'); // If no flights return message
        data.forEach(function(user)
        {
            var option = $(`<option value="${user.user_id}">User: ${user.user_id}</option>`);
            user_select.append(option);
        });
    };
    
    // Get request to backend endpoint to retrieve all customers via [customer web service]
    function fetchData()
    {
        $.ajax
        ({
            url: "http://localhost:3000/authentication",
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

    function validate_user(usern, pass)
    {
        const user_cred = 
        {
            username: usern, 
            password: pass
        }
        $.ajax
        ({
            url: "http://localhost:3000/authentication/login",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(user_cred),
            success: function(response)
            {
                window.location.href = `customer.html?user_id=${response.user_id}`;
            },
            error: function(xhr, status, error)
            {
                let error_message = `Error: login failed.`;
                let error_details = "";
                if(xhr.status === 401) error_details = `Invalid username or password`;
                else error_details = "There might be an issue with the data format or connection to the server. Please try again.";
                showAlert(`error`, error_message, error_details);
            }
        });
    };

    fetchData();

    // submit form handler
    // upon submission request a post from backend while validating user data
    $("#fastLoginForm").submit(function(event) 
    {
        event.preventDefault();

        const user_id = $(`#select_user_form`).val();
        console.log(user_id);

        if(!user_id) return alert(`Error: no user specified`);

        window.location.href = `customer.html?user_id=${user_id}`;
    });

    $(`#loginForm`).on(`submit`, function(e)
    {
        e.preventDefault();
        const username = $(`#usernameInput`).val();
        const password = $(`#passwordInput`).val();
        validate_user(username, password);
    });
});