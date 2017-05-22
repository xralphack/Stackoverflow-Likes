// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log('background triggered');
    chrome.tabs.executeScript(null,{file:"src/inject/inject.js"});
});