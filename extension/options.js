// Default values
var fb = "Fake Okta Page";
var d = true;

// Get configuration from storage
function loadConfig() {
    var defaultObj = `{"vb":"", "fb":"", "icon":"", "disable":true, "allowlist":""}`;

    chrome.storage.sync.get("oce", function(obj) {
        var result = obj["oce"];

        if (typeof result === 'undefined') {
            result = defaultObj;
        }

        const conf = JSON.parse(result);

        if (conf.fb === "") {
            document.getElementById("fbanner").value = fb;
        } else {
            document.getElementById("fbanner").value = conf.fb;
        }

        if (typeof conf.disable === "boolean") {
            document.getElementById("disable").checked = conf.disable;
        } else {
            document.getElementById("disable").checked = d;
        }

        var allowlistEl = document.getElementById("allowlist");
        if (conf.allowlist !== undefined && conf.allowlist !== "") {
            allowlistEl.value = typeof conf.allowlist === "string" ? conf.allowlist : (Array.isArray(conf.allowlist) ? conf.allowlist.join("\n") : "");
        } else {
            allowlistEl.value = "";
        }
    });
}

// Update/save new config details (preserve existing vb for storage compatibility)
function saveConfig() {
    var ftext = document.getElementById("fbanner").value;
    var disable = document.getElementById("disable").checked;
    var allowlistRaw = document.getElementById("allowlist").value;

    if (ftext === "") ftext = fb;

    ftext = ftext.replace(/[^a-zA-Z0-9 -.]/g, '');

    // Normalize allowlist: one domain per line, trim, remove empty lines
    var allowlist = allowlistRaw.split(/\r?\n/).map(function(line) { return line.trim(); }).filter(function(line) { return line.length > 0; }).join("\n");

    chrome.storage.sync.get("oce", function(obj) {
        var result = obj["oce"];
        var vb = "Valid Okta Page";
        var icon = "1";
        if (typeof result !== 'undefined') {
            var existing = JSON.parse(result);
            if (existing.vb) vb = existing.vb;
            if (existing.icon) icon = existing.icon;
        }
        var saveObj = {"vb": vb, "fb": ftext, "icon": icon, "disable": disable, "allowlist": allowlist};
        chrome.storage.sync.set({"oce": JSON.stringify(saveObj)}, function() {
            document.getElementById("savebutton").textContent = "Saved!";
            setTimeout(function() {
                document.getElementById("savebutton").textContent = "Save";
            }, 1500);
        });
    });
}

document.getElementById("savebutton").addEventListener("click", saveConfig);
window.onload = loadConfig();
