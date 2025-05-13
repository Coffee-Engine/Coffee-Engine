(function() {
    //Our browser IDs
    const browserID = {
        "WebPositive": "Web Positive",
        "NetPositive": "Net Positive",
        "Netscape": "Netscape Navigator",
        "OTT Navigator": "Netscape Navigator",

        //note some browsers do not use the Opera engine, but are Opera branded
        "Opera": "Opera",

        //Edge
        "Edg": "Edge",

        //Electron
        "Electron": "Native App",
        //Most likely Tauri
        "Deno": "Tauri",

        "Chrome": "Chrome",
        "Firefox": "Firefox",
        "Safari": "Safari",
    }

    //Our OS/distro listings
    const osID = {
        //I don't know if we will ever have a die hard win98 user but just in case
        "Windows NT": "Windows",
        "Windows": "Legacy Windows",
        
        //Are linux but different enough to be commonly considered their own thing
        "Android": "Android",
        "Quest": "Horizon",
        "CrOS": "Chrome OS",

        //Unix...
        "Mac OS": "Mac OS",
        "iPhone": "iOS",
        "iPod": "iOS",
        "iPad": "iOS",
        "Watch OS": "iOS",
        "watchOS": "iOS",

        //Not linux, but claim to be linux.
        "BeOS": "BeOS",
        "Haiku": "Haiku",
        "AmigaOS": "Amiga",

        //The boy
        "Linux": "Linux",
    }

    const distroID = {
        Windows: {
            "NT 10.0": "10/11",
            "NT 6.2": "8",
            "NT 6.1": "7",
            "NT 6.0": "Vista",
            "NT 5.1": "XP"
        },
        //Link ID to name due to them being named that on apple's database? (They don't do this for IOS for some reason?)
        "Mac OS": {
            "OS X 11": "Big Sur",
            "OS X 12": "Monterey",
            "OS X 13": "Ventura",
            "OS X 14": "Sonoma",
            "OS X 15": "Sequoia",
            "OS X": "X",
        },
        //Known versions of amiga.
        Amiga: {
            "OS 4.1": "4.1",
            "OS 4.0": "4.0",
            "OS 3.2": "3.2",
            "OS 3.1": "3.1",
            "OS 3.0": "3.0",
        },
        //No I am not including every linux distro that has a unique id, I'm only including ones that are commonly used
        Linux: {
            "Ubuntu": "Ubuntu",
            "Linux Mint": "Mint",

            //Guys? Can't we just be uniform?
            "Red Hat Enterprise": "Red Hat",
            "Red Hat": "Red Hat",
            "Fedora": "Fedora",
            "Arch Linux": "Arch",
            "ArchLinux": "Arch",
            "Linux/SmartTV": "WebOS",
            "webOS": "WebOS",
        }
    };

    //Hell
    coffeeEngine.getEnviornment = () => {
        const returned = {
            os: "Unknown",
            distro: "n/a",
            runtime: "Unknown",
            ram: 0,
        };

        for (let i in browserID) {
            //Set our browser
            if (coffeeEngine.agentData.includes(i)) {
                returned.runtime = browserID[i];
            }
        }
        
        //Identify our OS
        for (let i in osID) {
            //Set our OS
            if (coffeeEngine.agentData.includes(i)) {
                returned.os = osID[i];
                break;
            }
        }

        //Identify distrobution
        const distros = distroID[returned.os];
        if (distros) {
            returned.distro = "Unknown";

            for (let i in distros) {
                //Set our Distro
                if (coffeeEngine.agentData.includes(i)) {
                    returned.distro = distros[i];
                    break;
                }
            }
        }

        returned.ram = navigator.deviceMemory || "Unreadable";

        return returned;
    }
})()