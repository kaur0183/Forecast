//MyWidget Script
/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
**************************/
var scriptsLoaded = 0;

document.addEventListener("DOMContentLoaded", init)
function init() {
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", "css/weather-icons.css");
    //loads the CSS file and applies it to the page
    css.addEventListener("load", loadCount);
    document.querySelector("head").appendChild(css);
    
    var jq = document.createElement("script");
    jq.addEventListener("load", loadCount);
    jq.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
    document.querySelector("head").appendChild(jq);


}



function buildWidget(cls) {
    var forecastKey = "6c8c796af547447557ffd082de3dcd7e";
    var lat = "45.3470";
    var long = "-75.7594";
    $.ajax({
        url: "https://api.forecast.io/forecast/" + forecastKey + "/" + lat + "," + long + "?units=ca",
        type: "GET",
        dataType: "jsonp",
        success: function(show) {
            currentDay(show.currently);
            hourDay(show.hourly);
            console.log(show)
        },
        error: function() {
            alert("An error occurred")
        }
    })
}

function currentDay(current) {
    var today = new Date();
    var box = $(".weather-forecast");
    $("<p>").text("Current Conditions for today, " + today.getDate() + "/" + (parseInt(today.getMonth()) + 1)).appendTo(box);
    $("<i>").addClass("wi").addClass("wi-forecast-io-" + current.icon).addClass("current").appendTo(box);
    $("<p>").text("Temperature " + current.temperature + " C").appendTo(box);
    $("<p>").text(current.summary).appendTo(box)
}

function hourDay(hourly) {
    var boxTable = $("<table>");
    var today = new Date();
    for (var i = 0; i < hourly.data.length; i++) {
        var currentHours = hourly.data[i];
        var time = new Date(currentHours.time * 1000);
        if (time.getDate() === today.getDate()) {
            time = time.getHours() + ":00";
            var heading = $("<tr>");
            $("<td>").text(time).appendTo(heading);
            $("<td>").text(currentHours.humidity.toString().split(".")[1] + "%").appendTo(heading);
            $("<td>").text(currentHours.cloudCover == 1 ? "100%" : currentHours.cloudCover.toString().split(".")[1] + "%").appendTo(heading);
            $("<td>").text(currentHours.temperature + " C").appendTo(heading);
            $("<td>").text(currentHours.windSpeed + " km/h").appendTo(heading);
            $("<i>").addClass("wi").addClass("wi-forecast-io-" + currentHours.icon).appendTo($("<td>")).appendTo(heading);
            $("<td>").text(currentHours.summary).appendTo(heading);
            heading.appendTo(boxTable)
        }
    }
    boxTable.appendTo($(".weather-forecast"))
}

function loadCount() {
    scriptsLoaded++;
    if (scriptsLoaded === 2) {
        buildWidget(".weather-forecast");
        console.log("both scripts loaded")
    }
}
