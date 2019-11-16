'use strict;'

const URL_SHORTEN_URL = 'https://dycg2mna2f.execute-api.ap-southeast-1.amazonaws.com/njdev/NJShorten-Url';
var viewModel = {
    url: ko.observable(),
    shortUrl: ko.observable(),
    status: ko.observable(),
    clearInput: function() {
        this.url("");
    },
    shortenUrl: function() {
        var self = this;
        self.status(`... PROCESSING ...`);
        self.shortUrl("");

        $.ajax({
            type: "POST",
            url: URL_SHORTEN_URL,
            data: JSON.stringify({
                "url": self.url()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                console.log(data);
                self.shortUrl(data.shorturl);
                self.status(`DONE`);
            },
            failure: function(errMsg) {
                console.log(`Error: ${errMsg}`);
                self.status(`ERROR: ${errMsg}`);
            }
        });
    },
    setupCustomDomain: function() {

    }
};
const TODAY_DEAL = "https://www.amazon.com/international-sales-offers/b/?ie=UTF8&node=15529609011&ref_=nav_navm_intl_deal_btn";
viewModel.url(TODAY_DEAL);
viewModel.shortUrl("");
viewModel.status("");
ko.applyBindings(viewModel);