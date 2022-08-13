const fs = require("fs")
const fetch = require("node-fetch")
require("dotenv").config()
let bots = [process.env.bot1, process.env.bot2]
let reports = require("./reporting.json")
const reportApi = "https://www.roblox.com/abusereport/{type}/?id={id}"
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};
async function getCsrf() {
    const response = await fetch("https://friends.roblox.com/v1/users/2321/request-friendship", {
        method: "POST",
        headers: {
            Cookie: `.ROBLOSECURITY=${cookie}`
        }
    })
 
    if (response.status === 403) {
        return response.headers.get("x-csrf-token")
    } else {
      console.log("Bad csrf req")
    }
}
let currentUser = 1
async function reportLoop(){
    for (const i in reports){
        const v = reports[i]
        for (const r in i){
            const m = i[r]
            try {
                const fetched = await fetch(reportApi.formatUnicorn({type : i, id : r}), {
                    method: "POST",
                    headers: {
                        Cookie: `.ROBLOSECURITY=${bots[currentUser]}`,
                        ["x-csrf-token"]: await getCsrf(),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        reason: m
                    })
                })
            } catch(err) {
                console.log(`error: ${err}`)
            }
            currentUser += 1
            if (currentUser > bots.length){
                currentUser = 1
            }
        }
    }
    reportLoop()
}
reportLoop()