// Extension by BrowserNative apps@browsernative.com https://browsernative.com/click-and-clean-chrome-extension/
const LS = chrome.storage.local;

function callback() {
  chrome.notifications.clear("clicknclean");
  chrome.notifications.create("clicknclean", {
    type: "basic",
    iconUrl: "../files/icon-128.png",
    title: "Click & Clean by BrowserNative",
    message: "All selected browsing data deleted!",
    contextMessage: "Click here to change preferences ...",
  });
}

function notificationClicked() {
  chrome.runtime.openOptionsPage();
  chrome.notifications.clear("clicknclean");
}

async function clean() {
  let removeTabs,
    dataTypesObj = {};

  let whitelist = await LS.get("whitelist").then(function (result) {
    return result.whitelist;
  });

  removeTabs = whitelist.includes("tabs") ? true : false;
//   if (whitelist) whitelist = whitelist.split(",");
//   else whitelist = [""];

  let dataTypes = [
    "appcache",
    "cache",
    "cookies",
    "downloads",
    "fileSystems",
    "formData",
    "history",
    "indexedDB",
    "localStorage",
    "pluginData",
    "webSQL",
    "tabs",
  ];

  let dataToRemove = dataTypes.filter((el) => !whitelist.includes(el));
  if (dataToRemove.includes("tabs")) {
    let index = dataToRemove.indexOf("tabs");
    if (index > -1) dataToRemove.splice(index, 1);
    // removeTabs = true;
  }

  for (let key of dataToRemove) {
    dataTypesObj[key] = true;
  }

    if (!removeTabs) {
      chrome.windows.create({}, function (thisWin) {
        chrome.windows.getAll({}, function (wins) {
          for (let win of wins) {
            if (win.id !== thisWin.id) chrome.windows.remove(win.id);
          }
        });
      });
    }

  chrome.notifications.clear("clicknclean");
  chrome.notifications.create("clicknclean", {
    type: "basic",
    iconUrl: "files/icon-128.png",
    title: "Click & Clean by BrowserNative",
    message: "Started deleting browsing data",
    contextMessage: "Please wait ...",
  });

  chrome.browsingData.remove({}, dataTypesObj, callback);
}

chrome.action.onClicked.addListener(function (tab) {
  clean();
});

chrome.notifications.onClicked.addListener(notificationClicked);

// first run
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.tabs.create({
      url: "https://browsernative.com/click-and-clean-chrome-extension/",
    });
  }
});
