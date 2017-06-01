# Module: VPN Status (MMM-AirVPN)

This is a module for <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a>.

`MMM-AirVPN` by default will check VPN connectivity status for an AirVPN Client.  It can also be used to call any URL and evaluate a JSON response to show a True/False status.

## Screenshot

![](screenshot.png)

## Installation

1. Navigate to your MagicMirror `modules` directory.
2. Execute `git clone https://github.com/shbatm/MMM-AirVPN`.
3. Add the module to your MagicMirror's `config.js` file (see next section).

## Using the Module

To use this module, add it to the modules array in the `config/config.js` file:

```javascript
modules: [
    ...,
    {
        module: 'MMM-AirVPN',
        header: 'AirVPN Status',
        position: 'top_left',
        config: {
                // See Configuration Options below
                }
    },
    ...
]
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `apiKey` | *Required* - Your API Key from the service to be used. Will be injected into the url provided.
| `urlApi` | *Optional* - The URL to call to get the connected status.<br />If using a service other than AirVPN, replace wherever your API key goes in the URL with `{{APIKEY}}`.<br />*Default:* `https://airvpn.org/api/?service=userinfo&format=json&key={APIKEY}`
| `updateInterval` | *Optional* - The interval in `ms` for updating the information<br />*Default:* 60000ms (10 minutes)
| `connectedKey` | *Optional* - The path to the key in the JSON response that will be checked.<br />*Default:* `user.connected`
| `connectedKeyValue` | *Optional* - The value for which to check the `connectedKey`. The module will evaluate if `JSONResponse[connectedKey] === connectedKeyValue` to determine what status it should show.<br />*Default:* `true`
| `connectedString`,<br />`disconnectedString` | *Optional* - The values to display if connected or disconnected, respectively<br />*Default:* `"VPN Connected"` and `"VPN Disconnected"`
| `icon` | *Optional* - The Font Awesome icon to use (omit the `fa-`).<br />*Default:* `plug`


## License

`MMM-AirVPN` is licensed under the MIT License.
