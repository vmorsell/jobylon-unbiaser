"use strict";

/*
 * Define available unbiasing filters.
 */
const filters = {
    picture: {
        label: "Profile picture",
        css: "/content_scripts/picture.css",
    },
    multipleApplications: {
        label: "Multiple applications",
        css: "/content_scripts/multiple_applications.css",
    },
    alva: {
        label: "Alva results",
        css: "/content_scripts/alva.css",
    },
    layke: {
        label: "Layke matching",
        css: "/content_scripts/layke.css",
    },
    answers: {
        label: "Answers",
        css: "/content_scripts/answers.css",
    },
}

/*
 * Set the URL we operate for.
 */
const url = "*://emp.jobylon.com/*";

/*
 * Store the addon popup checkbox states.
 *
 * This can get out of sync with what filter's actually registered.
 * Possible to merge these two states?
 */
const storageKey = "state";

function getState() {
    const state = JSON.parse(localStorage.getItem(storageKey));
    if (state === null) {
        // First-time use. Return a state where all functionality is visible.
        let s = {};
        for (var k in filters) {
            s[k] = true;
        }
        saveState(s);
        return s;
    }
    return state;
} 

function saveState(state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
}

/*
 * Populate the popup with checkboxes.
 */
let state = getState();

for (var id in filters) {
    const cb = document.createElement("input")
    cb.setAttribute("type", "checkbox");
    cb.setAttribute("id", id);
    const checked = state[id]
    if (checked) {
        cb.checked = true;
    }
    cb.addEventListener("change", async (e) => {
        browser.runtime.sendMessage({
            id: e.target.id,
            hosts: [url],
            css: filters[e.target.id].css,
            enabled: !e.target.checked,
        });

        state[e.target.id] = e.target.checked;
        saveState(state);
    })

    const lb = document.createElement("label")
    lb.setAttribute("for", id);
    lb.append(filters[id].label);

    const form = document.getElementById("form");
    form.appendChild(cb);
    form.appendChild(lb);
    form.appendChild(document.createElement("br"));
}
