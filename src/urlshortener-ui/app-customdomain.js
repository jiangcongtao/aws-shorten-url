'use strict;'
const URL_SETUP_CUSTOM_DOMAIN = 'https://ndirsdrhbf.execute-api.ap-southeast-1.amazonaws.com/njdev/NJSetup-CustomFqdn';

var viewModel = {
    fqdn: ko.observable(),
    status: ko.observable(),
    clearInput: function() {
        this.fqdn("");
    },
    getCurrentDomain: function() {
        var self = this;
        self.status(`...Quering...`);
        $.ajax({
            type: "GET",
            url: URL_SETUP_CUSTOM_DOMAIN,
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: function(data) {
                console.log(data);
                self.fqdn(data.fqdn);
                self.status(`---DONE --- got [Custom Domain : ${data.fqdn} Last Update: ${data.updatetime}`);
            },
            failure: function(errMsg) {
                console.log(`Error: ${errMsg}`);
                self.status(`!!!Failed! error:  ${errMsg}`);
            }
        });
    },
    setupCustomDomain: function() {
        var self = this;
        self.status(`...Saving... new domain: ${self.fqdn()}`);

        $.ajax({
            type: "POST",
            url: URL_SETUP_CUSTOM_DOMAIN,
            data: JSON.stringify({
                "fqdn": self.fqdn()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                console.log(data);
                self.status(`---Saved--- current domain was changed to ${self.fqdn()}`);
            },
            failure: function(errMsg) {
                console.log(`Error: ${errMsg}`);
                self.status(`!!!Failed! error:  ${errMsg}`);
            }
        });
    }
};
const fqdn = "https://h919hqbhel.execute-api.ap-southeast-1.amazonaws.com/njdev/NJRedirect-URL";
viewModel.fqdn(fqdn);
viewModel.status("");
ko.applyBindings(viewModel);