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

function isOktaLoginPage() {
    // Login footer has copyright details
    const copyright = document.getElementsByClassName('copyright');
    if (copyright.length === 1 && copyright[0].innerText === "Powered by Okta") {
        return true;
    }

    // Not all login pages have the "Powered by Okta" copyright footer
    // This is mainly custom domains that are not subdomains of Okta
    // In this case, it'll flag as "fake" but the user can add to allowlist

    // Main login container contains a div with id=okta-sign-in
    const oktaSignIn = document.getElementById("okta-sign-in");
    if (oktaSignIn !== null) {
        return true
    }

    return false;
}

// Check if the domain is in the allowlist
function isDomainAllowed(hostname, allowlistStr) {
    if (!allowlistStr || allowlistStr.trim() === "") return false;
    var entries = allowlistStr
        .split(/\r?\n/)
        .map(function(line) { return line.trim().toLowerCase(); })
        .filter(function(line) { return line.length > 0; });
    var host = hostname.toLowerCase();

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];

        // Exact match
        if (host === entry) return true;

        // Allowlist entry covers subdomains too if it starts with a dot or otherwise (e.g. "example.com" allows "okta.example.com")
        // Match if host is subdomain of entry
        if (host === entry || host.endsWith("." + entry)) {
            return true;
        }
    }
    return false;
}

// Get domain to check if it ends with .okta.com
const domain = location.hostname;

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
    if (!domain.endsWith(".okta.com") && isOktaLoginPage()) {
        showPhishingBanner();
    }
});