/* global Module */

/* Magic Mirror
 * Module: MMM-AirVPN
 *
 * By shbatm
 * MIT Licensed.
 */

Module.register("MMM-AirVPN", {
  defaults: {
    updateInterval: 60000,
    retryDelay: 20000,
    apiKey: "",
    urlApi: "https://airvpn.org/api/?service=userinfo&format=json&key={{APIKEY}}",
    connectedKey: "user.connected",
    connectedKeyValue: true,
    connectedString: "VPN Connected",
    disconnectedString: "VPN Disconnected",
  },

  requiresVersion: "2.1.0", // Required version of MagicMirror

  start: function() {
    var self = this;
    var dataRequest = null;
    var dataNotification = null;
    this.connected = false;

    //Flag for check if module is loaded
    this.loaded = false;
    this.sendSocketNotification('CONFIG', this.config);
  },

  getDom: function() {
    var self = this; 

    // create element wrapper for show into the module
    var wrapper = document.createElement("div");

    if (!this.loaded) {
      wrapper.innerHTML = "Loading VPN Status ...";
      wrapper.className = "dimmed light small";
      return wrapper;
    }
    // If this.dataRequest is not empty
    if (this.dataRequest) {
      if (this.connected) {
        wrapper.innerHTML = '<i class="fa fa-plug" aria-hidden="true" style="color:green;"></i>&nbsp;&nbsp;' + this.config.connectedString;
      } else {
        wrapper.innerHTML = '<i class="fa fa-plug" aria-hidden="true" style="color:red;"></i>&nbsp;&nbsp;' + this.config.disconnectedString;
        this.sendNotification("SHOW_ALERT", {
          type: "notification",
          title: "Alert",
          message: this.config.disconnectedString,
        });
      }
    }
    return wrapper;
  },

  getScripts: function() {
    return [];
  },

  // Define requird styles
  getStyles: function() {
    return ["font-awesome.css"];
  },

  processData: function(data) {
    var self = this;
    this.dataRequest = data;
    if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
    this.loaded = true;

    var connKeyValue = this.resolveKey(this.config.connectedKey, this.dataRequest);
    this.connected = connKeyValue === this.config.connectedKeyValue;
    console.log(connKeyValue, this.connected);
    this.updateDom();
  },

  resolveKey: function(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined;
    }, obj || self);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "STARTED") {
        this.updateDom();
    }
    else if (notification === "DATA") {
        this.loaded = true;
        this.processData(JSON.parse(payload));
        this.updateDom();
    }
  },
});