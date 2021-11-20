/*
    Our Services Script
    Author: Wonna Tun
*/

// get the date and time
var thisTime = new Date();

// change the date and time into string using system format
var timeStr = thisTime.toLocaleDateString();

// insert the time string into html code
document.getElementById("time").innerHTML = timeStr;