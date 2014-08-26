/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var METRIC_URL="http://eahdroplet1.ernie.org/Dropbox/list_metrics.cgi"
// var METRIC_URL="http://dropbox.ernie.org/get_metrics.cgi";
var CONFIG_URL = 'http://eahdroplet1.ernie.org/Dropbox/pebbleconfig.html';
// var CONFIG_URL = 'http://dropbox.ernie.org/pebbleconfig.html';

try { 
  var UI = require('ui');
} catch(e) { var UI = { Card: function() { return { on: function() {}, show: function() {} } } } }
try { 
  var Vector2 = require('vector2');
} catch(e) { var Vector2 = {} }
try { 
  var Settings = require('settings');
} catch(e) { var Settings = { config: function() {} } }
try { 
  var ajax = require('ajax');
} catch(e) { var ajax = { ajax: function() {} } }

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
    // Show the parsed response
    console.log('Settings.options: ');
    var options = Settings.option();
    console.log(JSON.stringify(options));
    console.log('e.options: ');
    var options = e.option();
    console.log(JSON.stringify(options));

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);


var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
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


if(Settings.option("metric_id"))
{
  ajax(
  { 
    url: METRICS_URL, 
    type: 'json'
  }, 
  function(data) {
    for(var i = 0 ; i < data.length ; i++) {
      if(data[i].id == metric_id) {
        var label = data[i].label;
        var value = data[i].value;
        main.body(label + ': ' + value);
      }
    }
  },
  function(error) {
        console.log('The ajax request failed: ' + error);
  }
  );
}

