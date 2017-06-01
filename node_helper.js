/* Magic Mirror
 * Node Helper: MMM-AirVPN
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

module.exports = NodeHelper.create({
	start: function() {
		this.started = false;
		this.config = null;
	},

	getData: function() {
		var self = this;
		
		var apiUrl = this.config.urlApi.replace("{{APIKEY}}",this.config.apiKey);
				
		request({
			url: apiUrl,
			method: 'GET',
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("DATA", body);
			} else if (response.statusCode === 401) {
          		self.sendSocketNotification("DATA_ERROR",error);
          		console.error(self.name, error);
        	} else {
          		console.error(self.name, "Could not load data.");
        	}
		});

		setTimeout(function() { self.getData(); }, this.config.updateInterval);
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'CONFIG' && self.started === false) {
			self.config = payload;
			self.sendSocketNotification("STARTED", true);
			self.getData();
			self.started = true;
		}
	}

});