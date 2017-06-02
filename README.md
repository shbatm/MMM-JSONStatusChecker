# Module: Check Status via JSON API Calls (MMM-JSONStatusChecker)

This is a module for <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a>.

`MMM-JSONStatusChecker` will check and display a "true / false" status based on the results of a value in an API call which returns a JSON element.  It can  be used to call any URL and evaluate a JSON response to show a True/False status. For example, this module was originally constructed to periodically check that a NAS device was connected to the VPN by calling the VPN service's API. 

## Screenshot

![](screenshot.png)

## Installation

1. Navigate to your MagicMirror `modules` directory.
2. Execute `git clone https://github.com/shbatm/MMM-JSONStatusChecker`.
3. Add the module to your MagicMirror's `config.js` file (see next section).

## Using the Module

To use this module, add it to the modules array in the `config/config.js` file:

```javascript
modules: [
    ...,
    {
        module: 'MMM-JSONStatusChecker',
        header: 'JSON Status',
        position: 'top_left',
        config: {
                // See Configuration Options below
                }
    },
    ...
]
```

**Note:** Multiple instances of this module can be added to the config and the `node_helper.js` will manage the multiple calls to various locations.

## Configuration options

| Option           | Description
|----------------- |-----------
| `name` | *Required* - The name for this instance of the module.<br />This is used to allow multiple instances of the module with only one `node_helper`.
| `apiKey` | *Optional* Your API Key from the service to be used. Will be injected into the url provided.
| `urlApi` | *Optional* - The URL to call to get the connected status.<br />To inject your API into the URL, add `{{APIKEY}}` into the URL where the API key goes.<br />*Example:* `https://airvpn.org/api/?service=userinfo&format=json&key={{APIKEY}}`
| `updateInterval` | *Optional* - The interval in `ms` for updating the information<br />*Default:* 60000ms (10 minutes)
| `keyToCheck` | *Optional* - The dot-separated path to the key in the JSON response that will be checked. The JSON Response will be recursively checked for the key.<br />*Default:* `user.connected`
| `keyValue` | *Optional* - The value for which to check the `keyToCheck`. The module will evaluate if `JSONResponse[keyToCheck] === keyValue` to determine what status it should show.<br />*Default:* `true`.
| `trueString`,<br />`falseString` | *Optional* - The values to display if the keyValue is true or false, respectively<br />*Default:* `"VPN Connected"` and `"VPN Disconnected"`
| `icon` | *Optional* - The Font Awesome icon to use (omit the `fa-`).<br />*Default:* `plug`.  Set `''` to not show an icon.
| `trueClass`,<br />`falseClass` | *Optional* - The CSS classes to add if the keyValue is true or false, respectively.<br />*Default:* None.
| `showTrueAlert` | *Optional* - Show an alert when the query returns a `true` value.<br />*Default:* `false` (e.g. no alert is shown).
| `showFalseAlert` | *Optional* - Show an alert when the query returns a `false` value.<br />*Default:* `true` (e.g. alert is shown).


## License

`MMM-JSONStatusChecker` is licensed under the MIT License.
