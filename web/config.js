var autoupdate_version = 14;
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
          alert(data);
          for(var i = 0 ; i < data.length ; i++) 
          {
            var label = data[i].label;
            var id = data[i].id;

            var options = { metric_id: id };
            display_message(label)
          }
          var options = { color: 'white', border: true };
          var url = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(options));
        }
      });
}

function display_message(msg) { 
  $("#progress").append("<span class='info'>" + msg + "</span>").append("<br/>");
}

function display_error(msg) { 
  $("#progress").append("<span class='error'>" + msg + "</span>").append("<br/>");
}
