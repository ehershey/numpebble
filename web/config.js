var autoupdate_version = 15;
var window;
var $;
// try {
if(!window) window = {};
if(!$) { $ = function() {}; $.ajax = function() {}; };
// }
// catch(e) {
  // console.log(e);
// }
try {
  if(!window.Settings) { window.Settings = { option: "not really defined" }; }
}
catch(e) {
  console.log(e);
}
console.log("window.Settings: ");
console.log(window.Settings);
console.log("window.Settings.option:");
console.log(window.Settings.option);
// Copy page title text into page
//
$('#titleh1').text(document.title + '/' + autoupdate_version);
// $.ajax("https://nmrs_1Ka3mVLFDQzE:@api.numerousapp.com/v1/users/self/metrics", { error: function() { console.log("error"); }, success: function() { console.log("success"); } })

function save_settings() 
{
  var apikey = $("#apikey").val();
  if(!apikey) {
    display_error("Please enter your API key");
    return;
  }
  display_message("Validating...");
  $.ajax(
      "list_metrics.cgi", 
      {
        beforeSend: function (xhr) {
              xhr.setRequestHeader ("X-Ernie-Header", btoa(apikey + ':'));
        },
        error: function(jqXHR, textStatus, errorThrown ) { display_error('ajax error: ' + textStatus + ' / ' + errorThrown); },
        success: function( data, textStatus, jqXHR ) { 
          if(data.error)
          {
            display_error(data.error);
          }
          else if(!data.length) { 
            display_error("No metrics found!")
          }
          else if(data[0].label && data[0].id) {
         
            display_message("OK!")
          
            // var options = { "newoptionname": "newoptionvalue" };
            // var url = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(options));
            console.log('before set option');
            Settings.option("apikey", apikey);
            console.log('after set option');
            console.log('setting document.location');
            document.location = "pebblejs://close";
          }
          else { 
            display_error("Unknown Error");
          }
        }
      });
      
}

function display_message(msg) { 
  $("#progress").append("<span class='info'>" + msg + "</span>").append("<br/>");
}

function display_error(msg) { 
  $("#progress").append("<span class='error'>" + msg + "</span>").append("<br/>");
}
