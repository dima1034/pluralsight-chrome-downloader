var tabId;

// Get active tabId
chrome.tabs.query({active: true}, function(tabs) {
    tabId =  tabs[0].id;

    // Get course request data
    chrome.runtime.sendMessage({type: 'initialRequest', tabId: tabId}, function (requestInfo) {
        if (!requestInfo) {
            return;
        }

        chrome.tabs.sendMessage(tabId, {type: 'status', requestInfo: requestInfo}, displayStatus);

        document.getElementById('dl-course').addEventListener('click', function () {
            // Tell content to download
            chrome.tabs.sendMessage(tabId, {type: 'download', requestInfo: requestInfo}, displayStatus);
        });

        document.getElementById('dl-playlist-xspf').addEventListener('click', function () {
            chrome.tabs.sendMessage(tabId, {type: 'downloadXSPF', requestInfo: requestInfo});
        });

        document.getElementById('dl-playlist-m3u').addEventListener('click', function () {
            chrome.tabs.sendMessage(tabId, {type: 'downloadM3U', requestInfo: requestInfo});
        });
    });

});

function displayStatus(info) {
    var progress = document.getElementById('course-progress');
    progress.style.display = 'block';
    progress.setAttribute('max', info.downloads.total);
    progress.setAttribute('value', info.downloads.downloaded);

    if (info.downloads.end !== null) {
        var endTime = new Date();
        endTime.setTime(info.downloads.end);
        document.getElementById('end-time').appendChild(document.createTextNode(endTime.toTimeString()));
    }
}

var progress = document.getElementById('course-progress');
progress.style.display = 'none';
