/*
 * all icons taken from www.flaticon.com
 */

"use strict";


var directionsService;


function init()
{
    directionsService = new google.maps.DirectionsService;
}

document.getElementById('submit').addEventListener('click', function() {
    validateInput();
});

// check to make sure input is not empty
function validateInput()
{

    var location = document.getElementById("start").value;
    var destination = document.getElementById("finish").value;

    if(location.length === 0)
    {
        document.getElementById("error").innerHTML = "<p>Must enter a start location</p>";
    }
    else if(destination.length === 0)
    {
        document.getElementById("error").innerHTML = "<p>Must enter a destination</p>";
    }
    else
    {
        calculateAndDisplayRoute(directionsService, location, destination);
    }
}

//calculate the route between locations
function calculateAndDisplayRoute(directionsService, location, destination){
console.log(location);
    directionsService.route({
        origin: location,
        destination: destination,
        travelMode: document.getElementById('mode').value

    }, function(response, status) {
        console.log(response);
        if (status === 'OK') {
            //hide button and show loader
            document.getElementById("submit").style.display = "none";
            document.getElementById("loader").style.display = "block";

            //pause for a second to show the loader
            setTimeout(function(){
                parseDirections(response.routes[0].legs);
            }, 1000);
        } else {
            document.getElementById("error").innerHTML =
                "<p>Directions request failed due to " + status + "</p>";
        }
    });
}

function parseDirections(response)
{
    var steps = response[0].steps;

    //get total distance, time and start location
    var directionsString = "<p class='important-text'>Total Travel Distance: "
                        + response[0].distance.text + "</p>"
                        +"<p class='important-text'>Total Travel Time: "
                        + response[0].duration.text + "</p>"
                        +"<p><img src='img/start.png'>" + response[0].start_address + "</p>";


    //parse steps information
    var i;
    for (i = 0; i < steps.length; i++)
    {
        //check the mode of transport
        directionsString = directionsString + checkTransport(steps[i]);
    }

    //display destination
    directionsString = directionsString +"<p><img src='img/finish.png'>"
                                        + response[0].end_address + "</p>";

    document.getElementById("directions-panel").innerHTML = directionsString;

    //hide loader and show button
    document.getElementById("loader").style.display = "none";
    document.getElementById("submit").style.display = "block";
    document.getElementById("error").innerText = "";

}

//check the mode of transport so a proper icon can be displayed
function checkTransport(step)
{
    var returnString;
    switch(step.travel_mode) {
        case "TRANSIT":
            returnString ="<p><img src='img/bus.png'>";
            break;
        case "WALKING":
            returnString ="<p><img src='img/walk.png'>";
            break;
        case "DRIVING":
            returnString ="<p><img src='img/car.png'>";
            break;
        case "BICYCLING":
            returnString ="<p><img src='img/bike.png'>";
            break;
    }

    if(step.travel_mode === "TRANSIT")
    {
        var directions = parseBus(step.instructions);

        returnString = returnString
            + "<span class='bus-num'>"
            + directions[0] + "</span>"
            + " " + step.distance.text
            + " " + directions[1] + " (aprox "
            + step.duration.text + ")" + "</p>";
    }
    else
    {
        returnString = returnString
            + step.distance.text
            + " " + step.instructions + " (aprox "
            + step.duration.text + ")" + "</p>";
    }

    return returnString;
}

//get the bus route from the instructions
function parseBus(instruction)
{
    var i;
    var route;
    var directions = "";
    var sub = instruction.split(" ");
    for(i = 0; i < sub.length; i++)
    {
        if(!isNaN(sub[i]))
        {
            route = sub[i];
        }
        else
        {
            directions = directions + sub[i] + " ";
        }
    }
    return [route, directions];
}
