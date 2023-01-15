"use strict";

let registered = {};

async function registerScript(message) {
    const id = message.id;
    const hosts = message.hosts;
    const css = message.css;
    const enabled = message.enabled;

    if (!enabled) {
        registered[id].unregister();
        return;
    }

  const unregister = await browser.contentScripts.register({
    matches: hosts,
    css: [{file: css}],
    runAt: "document_start"
  });
    registered[id] = unregister;
}

browser.runtime.onMessage.addListener(registerScript);
