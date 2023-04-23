// Default values
var vb = "Valid Okta Page";
var fb = "Fake Okta Page";
var ic = "1";

// Get configuration from storage
function loadConfig() {
    var defaultObj = `{"vb":"", "fb":"", "icon":""}`;

    // Get storage
    chrome.storage.sync.get("oce", function(obj) {
        var result = obj["oce"];

        if (typeof result === 'undefined') {
            result = defaultObj;
        }

        // Parse the config
        const conf = JSON.parse(result);
    
        // Load the valid text
        if (conf.vb === "") {
            document.getElementById("vbanner").value = vb;
        } else {
            document.getElementById("vbanner").value = conf.vb;
        }
    
        // Load the fake text
        if (conf.fb === "") {
            document.getElementById("fbanner").value = fb;
        } else {
            document.getElementById("fbanner").value = conf.fb;
        }
    
        // Load the icon
        const ivals = ["1", "2", "3", "4", "5"];
        if (!ivals.includes(conf.icon)) {;
            var iconlist = document.getElementById("iconlist")
            iconlist.value = ic;
        } else {
            var iconlist = document.getElementById("iconlist")
            iconlist.value = conf.icon;
        }
    });
}

// Update/save new config details
function saveConfig() {
    var vtext = document.getElementById("vbanner").value;
    var ftext = document.getElementById("fbanner").value;
    var iconlist = document.getElementById("iconlist")
    var iconvalue = iconlist.value;

    // Check for empty values
    if (vtext === "") {
        vtext = vb;
    }
    if (ftext === "") {
        ftext = fb;
    }
    if (iconvalue === "") {
        iconvalue = ic;
    }

    // Remove any special characters from user's input
    vtext = vtext.replace(/[^a-zA-Z0-9 -.]/g, '');
    ftext = ftext.replace(/[^a-zA-Z0-9 -.]/g, '');
    iconvalue = iconvalue.replace(/[^0-9]/g, '');
    
    var obj = {"vb":vtext, "fb":ftext, "icon":iconvalue};
    var json = JSON.stringify(obj);

    // Save config to storage
    chrome.storage.sync.set({"oce": json}, (j) => {

    });
}

document.getElementById("savebutton").addEventListener("click", saveConfig);
window.onload = loadConfig();
