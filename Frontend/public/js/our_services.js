/*
    Our Services Script
    Author: Wonna Tun
*/

// call the build_table function to create table
var services_html = build_table()

// insert the table to html code
document.getElementById("table").innerHTML = services_html;

// function to create services table
function build_table() {
    // define table variable that contain "<table>" 
    table = "<table>"

    // use for loop to go through the service descriptions and add them one by one to create html code inside table variable
    for (var i = 0; i < services_description.length; i++) {
        table += "<tr><td class=\"img\"><img src=\"img/" + img_arr[i] + "\" alt=\"" + services_arr[i] + "\" /</td><th><h3>" + services_arr[i] + "</h3></th></tr><tr><td>&nbsp;</td><td><p>" + services_arr1[i] + "</p></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr>";
    }

    // add table closing tag
    table += "</table>"

    // return the html code inside table
    return table;
}