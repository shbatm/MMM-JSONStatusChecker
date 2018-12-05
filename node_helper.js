/* Magic Mirror
 * Node Helper: MMM-JSONStatusChecker
 *
 * By shbatm
 * MIT Licensed.
 */
/* jshint node: true, esversion: 6*/

var NodeHelper = require("node_helper");
var request = require('request');

module.exports = NodeHelper.create({
	start: function() {
		this.started = false;
		this.config = {};
	},

	getData: function(name) {
		// console.log("Getting data for "+name);
		var self = this;
		
		var apiUrl = this.config[name].urlApi.replace("{{APIKEY}}",this.config[name].apiKey);
				
		request.get(apiUrl, (error, response, body) => {
		 	if (!error && response.statusCode == 200) {
				self.sendSocketNotification("DATA_" + name, body);
			} else if (response.statusCode === 401) {
          		self.sendSocketNotification("DATA_ERROR_" + name);
          		console.warn(name, "401 Error");
        	} else {
          		console.warn(name, "Could not load data.");
        	}
		 });
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