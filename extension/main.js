const emoji = ['&#128077;', '&#128512;', '&#128507;', '&#128293;', '&#128511;'];

function showValidBanner() {
    chrome.storage.sync.get("oce", function(obj) {
        var result = obj["oce"];

        var title = "Valid Okta Page";
        if (typeof result !== 'undefined') {
            const conf = JSON.parse(result);
            var e = parseInt(conf.icon, 10);
            if (e < 1 || e > 5) {
                e = 1;
            }
            var nt = emoji[e - 1].concat(" ", conf.vb);
            title = nt;
        }

        var d = document.createElement("div");
        d.style.position = "sticky";
        d.style.top = "0px";
        d.style.width = "100%";
        d.style.height = "30px";
        d.style.paddingTop = "2px";
        d.style.paddingBottom = "2px";
        d.style.fontSize = "20px";
        d.style.textAlign = "center";
        d.style.backgroundColor = "#0000FF";
        d.style.color = "#F8F8FF";
        var e = document.createElement("div");
        e.innerHTML = "<div>" + title + "</div>";
        d.append(e);
        document.body.insertBefore(d, document.body.firstChild);
    });
}

function showPhishingBanner() {
    chrome.storage.sync.get("oce", function(obj) {
        var result = obj["oce"];

        var title = "Fake Okta Page";
        if (typeof result !== 'undefined') {
            const conf = JSON.parse(result);
            title = conf.fb;
        }

        var d = document.createElement("div");
        d.style.position = "sticky";
        d.style.top = "0px";
        d.style.width = "100%";
        d.style.height = "30px";
        d.style.paddingTop = "2px";
        d.style.paddingBottom = "2px";
        d.style.fontSize = "20px";
        d.style.textAlign = "center";
        d.style.backgroundColor = "#E53935";
        d.style.color = "#333333";
        var e = document.createElement("div");
        e.innerHTML = "<div>" + title + "</div>";
        d.append(e);
        document.body.insertBefore(d, document.body.firstChild);
    });
}

// Login footer has copyright details
var copyright = document.getElementsByClassName('copyright');

// Check if the page is a subdomain of Okta
var domain = location.hostname;
if (domain.endsWith(".okta.com")) {
    // Login page has the copywrite details
    if (copyright.length === 1) {
        if (copyright[0].innerText === "Powered by Okta") {
            showValidBanner();
        }
    }
} else {
    // Check if the page has Okta content but not a valid page
    if (copyright.length === 1) {
        if (copyright[0].innerText === "Powered by Okta") {
            showPhishingBanner();
        }
    }
}
