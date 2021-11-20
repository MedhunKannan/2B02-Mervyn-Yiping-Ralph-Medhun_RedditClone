/*
    Services Script
    Author: Wonna Tun
 */

// insert html code for services
document.getElementById("services").innerHTML = create_html();

// function to created html code for services
function create_html() {
    // declaring variables that condatin div element
    services_html = "<div class=\"row justify-content-around\">";

    // looping through the img array to get each services and images for each services
    for (var i = 0; i < img_arr.length; i++) {
        services_html += "<span class=\"col-xl-3 col-lg-3 col-md-5 col-sm-10\"><div class = \"row\"><img class = \"col-xl-4 col-lg-4 col-md-4 col-sm-3\" src = \"img/" + img_arr[i] + "\" alt= \"" + services_id[i] +"\" /><p class = \"col-xl-7 col-lg-7 col-md-7 col-sm-7 border border-top-0 border-right-0\"><b>" + services_arr[i] + "</b><br /><br />" + services_description[i] + "<br /><button type=\"button\" class=\"btn btn-primary mt-4\" data-toggle=\"modal\" data-target=\"#" + services_id[i] + "\">More Info</button><div class=\"modal fade\" id=\""+ services_id[i] +"\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">" + services_arr[i] + "</h5><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div><div class=\"modal-body\"><p id=\"modal\">" + services_description[i] + "</p></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Back</button></div></div></div></div></p></div></span>";
    }
    
    // add closing div tag to the services_html
    services_html += "</div>";

    // return the html code
    return services_html;
}