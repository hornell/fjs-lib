# fjs
## The Lightweight useful Javascript Library

Targeted to support common functionality that modern web sites want, without needing to download large or many external files.


## Usage:
- Automatic Includes
	Bring in fjs.Auto and decorate your html with appropriate classes.
- Be picky
	Bring in only the modules you need.


## Auto
 fjs.Auto will bring in any modules that you've used classes or attributes from

## Modal
The modal module makes it easy to make modals without having to manually write them each time.

Simply add the 'fjs-modal' class to any div that you want to turn into a Modal.

If you want to add buttons to show the Modal then give it the 'fjs-show-modal=MODALID' attribute, using the id of your modal element that it should control.
To hide the Modal, use the 'fjs-hide-modal=MODALID' attribute

There are also "hide_modal(MODALID)" and "show_modal(MODALID)" functions if you want to control it through scripts.

Clicking outside of the Modal will cause it to hide as well.

### Styles
The Modal uses these styles:
 - modal-hidden - used when a modal should be hidden
 - modal-shown - used when a modal should be visible
 - fjs-modal-content - used for the content of the Modal.


## HelloWorld
This is a test module it will populate any element with "Hello World"

Simply add the 'fjs-hello' class to your element

## Login
This provides a login backend using Local Storage for persistence between sessions.
The object stored in 'fjs-auth-info' is used, and can be accessed through fjs.AuthInfo

### AuthInfo
This is a helper object for the auth logic.
It has a "data" property that you can use to fill in anything important.
It has an "expiresAt" property that is used for TTL of the object.
The validity of the object is based on both 'data' being filled in and the expiresAt being a time in the future.

AuthInfo.load() will load the stored object.
To save it use fjs.Login.set_auth(authInfo)

### Polling
Every second the auth is checked to see if the AuthInfo is valid. The elements controlled will then have thier states changes accordingly.

### Classes

#### fjs-auth-needed
These elements are only shown when AuthInfo is valid

#### fjs-auth-login
These elements are only shown when AuthInfo is invalid. ex: A login page

### Styles
This module uses 'login-hidden' style for elements that need to be hidden

## Loading
Have containers show placeholder content while waiting for content to load. 
Handles both the static loading of page content, and the dynamic scenario where calls/fetch are used while page is live

You can specify a "signal" that the container must listen for to determine that it's done loading.

Similarly when declaring action that will cause a load to happen, you can specify a signal to send when its done.

Any non-signaled parts will respond to any non-signaled loads.

### Classes

#### fjs-loader
Used for anything that should respond to a loading state


### Attributes

#### fjs-load-wait
This attribute specifies a specific "signal" to wait for.

### Styles

#### loading
style to use when waiting for content to be loaded.

### Functions

#### start_loading(f, signal)
Call this with your loading function and it will handle all the elements for you.

This will effect the change on any elements that should be waiting for the load to finish. Then it will execute the supplied function `f` and finally update any elements that are waiting for that signal(if provided)

#### signal_loading(signal)
Used by start_loading. Tells loaders to enter loading state

#### stop_loading(signal)
Used by start_loading, but if you have your own callback function, you can call it directly instead. This will tell the loaders to exit the loading state



## Settings (and UI)
Settings object, and a slider/pop out menu that allows the options to be set
If you add the `fjs-settings` class to a dive it will be turned into a sliding panel on thee side of the screen.
Otherwise no UI will be loaded. The UI hooks to all the elements that you add for editing the settings and will handle saving/loading them automatically.

To have an element's value/checked used for a setting just use `fjs-setting="SETTING NAME"` attribute and it will be persisted.

You can avoid the UI and call the save/load functions yourself, either through UserSettings object or the libraries helper `Settings.saveSettings(CALLBACK)`. The callback should be used to tie into any logic you have that displays or used the settings to let them know that the value has been updated.

### Classes
`fjs-settings` - main settings container ( use this to designate a div as settings ui)
`fjs-settings-tab` - handle for users to click to expand the settings
`fjs-settings-content` - this holds the settings

### Functions
`Settings.saveSettings(CALLBACK)` - will find all the UI elements that apply to settings and get the values of them, save them, then call the optional callback

### Attributes
`fjs-setting=SETTING` - tells the library what the property name of this setting is.

### UserSettings
This class helps load and persist the settings.
Call `UserSettings.load()` to get the stored  data
`UserSettings.save()` will save the object directly. If using the UI, call `Settings.saveSettings()` instead.


## Routing
-- In Progress --
Capture query parameters and use them to invoke other functions. ex: if oAuth2 code callback sends data back, then call a function with those parameters

The "routeIdentifier" will be based on the query parameters found.
ex: `?callback=1234&token=54321`
Will check first for a fjs-route of 'callback,token' and if not found, will try 'callback' then 'token'.
When a match is found two things happen:
	- The `fjs-route-active` class is removed from any other elements
	- The `fjs-route-inactive` class is added.
	- If there is a <script> found with `fjsWhenActive=OTHERID`, the `OTHER_ID_deactivate()` function is called if it has one
	- The `fjs-route-inactive` class is removed.
	- The `fjs-route-active` class is added to this element
	- If a <script> is found with a `fjsWhenActive=ID`, the `ID_activate()` function is called if it has one

When this module loads, all `fjs-route` elements will have the `fjs-route-inactive` class added to them


 Tentatively something like this
```
<div id="div1" fjs-route="main">
  <!-- content -->
</div>

<script fjsWhenActive="div1">
  function activate() {
    console.log("Timer started");
    window._div1_timer = setInterval(() => console.log("tick"), 1000);
  }

  function deactivate() {
    console.log("Timer stopped");
    clearInterval(window._div1_timer);
  }
</script>```

### Classes
`fjs-route-active` - a route that is active and the element should be shown
`fjs-route-inactive` - a route that is not active and the element should be hidden

### Attributes
`fjs-route` - The route identifier that this element should become active for
`fjsActiveWhen` - for <SCRIPT> to indicate that it has functions that should be called when the element is shown/hidden

### Functions
`ID_activate()` - Will be looked for a called. The function name is the ID of the element with the `fjs-route` attribute
`ID_deactive()` - Will be looked for a called. The function name is the ID of the element with the `fjs-route` attribute


## API
-- In Progress --
Some simple wrappers for fetch?