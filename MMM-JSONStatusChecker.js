/* global Module */

/* Magic Mirror
 * Module: MMM-JSONStatusChecker
 *
 * By shbatm
 * MIT Licensed.
 */

Module.register("MMM-JSONStatusChecker", {
    defaults: {
        name: "JSONUpdater",
        updateInterval: 600000,
        apiKey: "",
        urlApi: "",
        keyToCheck: "user.connected",
        keyValue: true,
        trueString: "VPN Connected",
        falseString: "VPN Disconnected",
        icon: "plug",
        trueClass: "",
        falseClass: "",
        showTrueAlert: false,
        showFalseAlert: true,
    },

    requiresVersion: "2.1.0", // Required version of MagicMirror

    start: function() {
        var self = this;
        var dataRequest = null;
        var dataNotification = null;
        this.trueResult = false;
        this.resultChanged = true;

        //Flag for check if module is loaded
        this.loaded = false;
        this.error = false;
        this.sendSocketNotification('CONFIG', this.config);
    },

    getDom: function() {
        var self = this; 

        // create element wrapper for show into the module
        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = "Loading "+this.config.name+" Status ...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        if (this.error) {
            wrapper.innerHTML = "Error loading data for " + this.config.name;
            return wrapper;
        }
        // If this.dataRequest is not empty
        if (this.dataRequest) {
            var icon;
            if (this.config.icon) {
            icon = document.createElement("i");
            icon.setAttribute("aria-hidden","true");
            icon.className = "fa fa-"+this.config.icon;
            }
            var txt = document.createElement("span");

            if (this.trueResult) {
                if (icon) { icon.style.cssText="color:green;"; }
                txt.innerHTML = "&nbsp;&nbsp;" + this.config.trueString;
                wrapper.className = this.config.trueClass;
                if (this.config.showTrueAlert && this.resultChanged) {
                    this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: "Alert",
                    message: this.config.trueString,
                    });
                }
            } else {
            if (icon) { icon.style.cssText="color:red;"; }
                txt.innerHTML = "&nbsp;&nbsp;" + this.config.falseString;
                wrapper.className = this.config.falseClass;
                if (this.config.showFalseAlert && this.resultChanged) {
                    this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: "Alert",
                    message: this.config.falseString,
                    });
                }
            }
            if (icon) { wrapper.appendChild(icon); }
            wrapper.appendChild(txt);
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

        var oldValue = this.trueResult;
        var connKeyValue = this.resolveKey(this.config.keyToCheck, this.dataRequest);
        this.trueResult = connKeyValue === this.config.keyValue;
        this.resultChanged = oldValue !== this.trueResult;
        this.updateDom();
    },

    resolveKey: function(path, obj) {
        return path.split('.').reduce(function(prev, curr) {
            return prev ? prev[curr] : undefined;
        }, obj || self);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STARTED" && payload === this.config.name) {
            this.updateDom();
        }
        else if (notification === "DATA_" + this.config.name) {
            this.loaded = true;
            this.error = false;
            this.processData(JSON.parse(payload));
        }        
        else if (notification === "DATA_ERROR_" + this.config.name) {
            this.loaded = true;
            this.error = true;
            this.updateDom();
        }
    },
});
