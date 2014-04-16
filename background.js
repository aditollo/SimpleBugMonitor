var bugMonitor = {

	bugApiUrl: 'http://tcwiki.wp.yoox.net/tools/dashboard.api.php?op=get&key=bugs',
	alarmColor: [240, 65, 36, 255],
	warnColor: [240, 138, 36, 255],
	okColor: [67, 172, 106, 255],

	requestBugs: function() {
		var req = new XMLHttpRequest();
		req.overrideMimeType("application/json"); 
		req.open("GET", this.bugApiUrl, true);
		req.onload = this.updateBadge.bind(this);
		req.send(null);
	},

	updateBadge: function (e, a) {
		var response = JSON.parse(e.target.responseText);

		var badgedBugs = response.our;
		var badgeColor = this.okColor;

		if (badgedBugs > 0) {
			badgeColor = badgedBugs === 1 ? this.warnColor : this.alarmColor;
		}

		chrome.browserAction.setBadgeText({
			text: badgedBugs.toString()
		});

		chrome.browserAction.setBadgeBackgroundColor({
			color: badgeColor
		});
	}
};


var dashboardUrl = 'http://tcwiki.wp.yoox.net/tools/dashboard.php';


function goToDashboard() {
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (tab.url && tab.url === dashboardUrl) {
				chrome.tabs.update(tab.id, {selected: true});
				return;
			}
		}
		chrome.tabs.create({ url: dashboardUrl });
	});
}


chrome.browserAction.onClicked.addListener(goToDashboard);



bugMonitor.requestBugs();
setInterval(bugMonitor.requestBugs, 60*1000);
