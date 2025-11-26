"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pingui = void 0;
class Pingui {
    static setConfig(token) {
        Pingui.token = token;
    }
    // This method is used to send a critical alert to the user. This is the only method that you should use on production environments along with the warning method.
    static async critical(message) {
        const response = await fetch("http://localhost:8000/alert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Pingui.token}`
            },
            body: JSON.stringify({ alert: message })
        });
        const data = await response.json();
        return data;
    }
    // This method is used to send a warning alert to the user. This is the only method that you should use on production environments along with the critical method.
    static async warning(message) {
        const response = await fetch("http://localhost:8000/alert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Pingui.token}`
            },
            body: JSON.stringify({ alert: message })
        });
        const data = await response.json();
        return data;
    }
    // This method is used to send an info message to the user. ONLY USE IT IN DEVELOPMENT ENVIRONMENTS IN ORDER TO AVOID SPAMMING THE BOT AND GET BANNED.
    static async info(message) {
        const response = await fetch("http://localhost:8000/alert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Pingui.token}`
            },
            body: JSON.stringify({ alert: message })
        });
        const data = await response.json();
        return data;
    }
}
exports.Pingui = Pingui;
