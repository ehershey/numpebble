// var console;
// log if we can but if 'console' isn't defined, keep going anyways
//
try { 
  console.log("app.js started loading");
}
catch(e) { 
  // not much can be done here 
  // console = { log: function() { } };
}
/**
 * Numpebble written with Pebble.js!
 *
 */

var autoupdate_version = 32;

var METRICS_URL = "http://numpebble.ernie.org/list_metrics.cgi";
var CONFIG_URL = "http://numpebble.ernie.org/config.html?appjsautoversion=" + autoupdate_version;

console.log('autoupdate_version: ' + autoupdate_version);

var REFRESH_INTERVAL = 30000;

var metric_index = 0;

var UI;
var Vector2;
var Settings;
var ajax;

try { 
  UI = require('ui');
} 
catch(e) { UI = { Card: function() { return { on: function() {}, show: function() {}, body: function() {} }; } }; }
try { 
  Vector2 = require('vector2');
} catch(e) { Vector2 = {}; }
try { 
  Settings = require('settings');
} catch(e) { Settings = { config: function() {}, option: function() {}  }; }
try { 
  ajax = require('ajax');
} catch(e) { ajax = { ajax: function() {} }; }

// Set a configurable with the open callback
Settings.config(
  { url: CONFIG_URL },
  function(e) {
    console.log('opening configurable');

    // Reset color to red before opening the webview
    // Settings.option('color', 'red');
    console.log('Settings.options: ');
    var options = Settings.option();
    console.log(JSON.stringify(options));
  },
  function(e) {
    console.log('closed configurable');
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log('failed - response:');
      console.log(e.response);
    }
    else {
      // Show the parsed response
      console.log('Settings.option(encoded_apikey): ');
      console.log(Settings.option("encoded_apikey"));
      update_metrics();
    }
  }
);


var main = new UI.Card({
  title: 'Numpebble',
  icon: 'images/menu_icon.png',
  subtitle: 'Metrics',
  body: 'No metric data'
});

main.show();

main.on('click', 'up', function(e) {
  metric_index--;
  update_metrics();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  metric_index++;
  update_metrics();
});



function update_metrics()
{


  var encoded_apikey = Settings.option("encoded_apikey");

  if(encoded_apikey)
  {
    ajax(
    { 
      url: METRICS_URL, 
      type: 'json',
      headers: { 'X-Ernie-Header': encoded_apikey }
    }, 
    function(data) {

      if ( metric_index < 0) { metric_index = data.length + metric_index; }
      if(metric_index >= data.length) { metric_index = metric_index - data.length; }
      var label = data[metric_index].label;
      var value = data[metric_index].value;
      var updated = new Date();
      main.body(label + ': ' + value + '(' + updated + ')');
      setTimeout(update_metrics,REFRESH_INTERVAL);
    },
    function(error) {
          console.log('The ajax request failed: ' + error);
    }
    );
  }
  else { 
    main.body("Must set api key in configuration");
  }
}
update_metrics();
  
// log if we can but if 'console' isn't defined, keep going anyways
//
try { 
  console.log("app.js finished loading");
}
catch(e) { 
  // not much can be done here 
}
