// log if we can but if 'console' isn't defined, keep going anyways
//
try { 
  console.log("app.js started loading");
}
catch(e) { 
  // not much can be done here 
}
/**
 * Numpebble written with Pebble.js!
 *
 */

var METRICS_URL = "http://numpebble.ernie.org/list_metrics.cgi";
var CONFIG_URL = "http://numpebble.ernie.org/config.html";

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
      console.log(e.response);
    }
    else {
      // Show the parsed response
      console.log('Settings.options: ');
      var options = Settings.option();
      console.log(JSON.stringify(options));
      console.log('e.options: ');
      if(e.option) {
        var options = e.option();
        console.log(JSON.stringify(options));
      }
      else {
        console.log("no such member: e.option");
      }
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
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
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
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});


var apikey = Settings.option("apikey");

if(apikey)
{
  ajax(
  { 
    url: METRICS_URL, 
    type: 'json',
    headers: { 'X-Ernie-Header': btoa(apikey + ':') }
  }, 
  function(data) {
    for(var i = 0 ; i < data.length ; i++) {
      // if(data[i].id == metric_id) {
        var label = data[0].label;
        var value = data[0].value;
        main.body(label + ': ' + value);
      // }
    }
  },
  function(error) {
        console.log('The ajax request failed: ' + error);
  }
  );
}
else { 
  main.body("Must set api key in configuration");
}

// log if we can but if 'console' isn't defined, keep going anyways
//
try { 
  console.log("app.js finished loading");
}
catch(e) { 
  // not much can be done here 
}
