# OkTab v1.4.6

Library for creating tabs.

## Bower Installation

Add to your project's `bower.json` file, like:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "jquery": "1.11.0",
    "fillselect": "git@github.com:mpetty/tabs"
  }
}
```

## Usage

```javascript
$.tabs(options);
$('.tab').tabs(options);
```

## Options available

```javascript
tabDataLink             : 'data-tabs-link',     // Tab link
tabDataAttr             : 'data-tabs',          // Used to init tabs when initialized on document
tabClass                : 'tab',                // Tab Class
tabNavClass             : 'tabs',               // Tab Nav ID/Class
tabContentClass         : 'tabs-content',       // Tab Content ID / Class
activeClass             : 'active',             // Tab Active Class
connectedTabNav         : '.tab-nav',           // Used to place tab nav outside of container
saveTab                 : true,                 // Save tab on page refresh by using hashes
animSpeed               : 200,                  // Animation Speed
scrollTop               : true,                 // Scroll to tab
scrollOffset            : 0,                    // Scroll Offset
beforeTabSwitch         : function() {},
afterTabSwitch          : function() {}
```
