/* Magic Mirror
 * Node Helper: MMM-JSONStatusChecker
 *
 * NOTE: Requires isy-js, but do not attempt to pass this.deviceList or this.variableList via socket.
 * The prototypes self-reference the isy variable and this creates circular references which will 
 * cause a stack limit exception when passed to the main Module code via WebSocket.
 *
 * By shbatm
 * MIT Licensed.
 */
/* jshint node: true, esversion: 6*/

var NodeHelper = require("node_helper");
var request = require('request');
require('log-timestamp')(function() { return '['+new Date().toLocaleTimeString()+'] %s'; });

module.exports = NodeHelper.create({
	start: function() {
		this.started = false;
		this.config = {};
	},

	getData: function(name) {
		console.log("Getting data for "+name);
		var self = this;
		
		var apiUrl = this.config[name].urlApi.replace("{{APIKEY}}",this.config[name].apiKey);
				
		request({
			url: apiUrl,
			method: 'GET',
		}, function (error, response, body) {
			console.log("Received response for "+this.callerName);
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("DATA_" + this.callerName, body );
			} else if (response.statusCode === 401) {
          		self.sendSocketNotification("DATA_ERROR_" + this.callerName, error);
          		console.error(self.name, error);
        	} else {
          		console.error(self.name, "Could not load data.");
        	}
		}.bind({callerName:name})
		);
		setTimeout(function() { self.getData(name); }, this.config[name].updateInterval);
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'CONFIG') {
			if (!(payload.name in self.config)) {
				console.log("Starting data calls for "+payload.name);
				self.config[payload.name] = payload;
				self.sendSocketNotification("STARTED", payload.name);
				self.getData(payload.name);
			}
		}
	}

});