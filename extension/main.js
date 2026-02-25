function showPhishingBanner() {
    chrome.storage.sync.get("oce", function(obj) {
        var result = obj["oce"];

        var title = "Fake Okta Page";
        var disable = true;
        if (typeof result !== 'undefined') {
            const conf = JSON.parse(result);
            title = conf.fb;
            disable = conf.disable;
        }

        var d = document.createElement("div");
        d.setAttribute("id", "okta-phishing-banner");
        d.style.cssText = [
            "position: sticky",
            "top: 0",
            "left: 0",
            "right: 0",
            "width: 100%",
            "min-height: 48px",
            "padding: 12px 20px",
            "display: flex",
            "align-items: center",
            "justify-content: center",
            "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            "font-size: 16px",
            "font-weight: 600",
            "text-align: center",
            "color: #fff",
            "background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%)",
            "box-shadow: 0 2px 8px rgba(0,0,0,0.25)",
            "border-bottom: 3px solid #8b0000",
            "z-index: 2147483647",
            "letter-spacing: 0.02em",
            "line-height: 1.3"
        ].join("; ");

        var text = document.createElement("span");
        text.textContent = title;

        d.appendChild(text);
        document.body.insertBefore(d, document.body.firstChild);

        if (disable) {
            var element = document.getElementById("okta-sign-in");
            var attempts = 0;
            while (element === null && attempts < 50) {
                element = document.getElementById("okta-sign-in");
                attempts++;
            }
            if (element) {
                element.style.pointerEvents = "none";
            }
        }
    });
}

// Login footer has copyright details
var copyright = document.getElementsByClassName('copyright');
var domain = location.hostname;

// Check if the domain is in the allowlist
function isDomainAllowed(hostname, allowlistStr) {
    if (!allowlistStr || allowlistStr.trim() === "") return false;
    var entries = allowlistStr.split(/\r?\n/).map(function(line) { return line.trim().toLowerCase(); }).filter(function(line) { return line.length > 0; });
    var host = hostname.toLowerCase();
    for (var i = 0; i < entries.length; i++) {
        if (host === entries[i] || host === entries[i].replace(/^\./, "") || host.endsWith("." + entries[i])) return true;
    }
    return false;
}

chrome.storage.sync.get("oce", function(obj) {
    var result = obj["oce"];
    var allowlist = "";
    if (typeof result !== "undefined") {
        try {
            var conf = JSON.parse(result);
            if (conf.allowlist) allowlist = conf.allowlist;
        } catch (e) {}
    }
    if (isDomainAllowed(domain, allowlist)) return;
    if (!domain.endsWith(".okta.com")) {
        if (copyright.length === 1 && copyright[0].innerText === "Powered by Okta") {
            showPhishingBanner();
        }
    }
});