var bugMonitor = {

	bugApiUrl: 'http://tcwiki.wp.yoox.net/tools/dashboard.api.php?op=get&key=bugs',
	warnColor: [240, 65, 36, 255],
	alarmColor: [240, 138, 36, 255],
	okColor: [67, 172, 106, 255],
	netDisabledColor: [142, 142, 142, 255]

	requestBugs: function() {
		var req = new XMLHttpRequest();
		req.overrideMimeType("application/json"); 
		req.addEventListener("load", this.updateBadge.bind(this), false);
		req.addEventListener("error", this.cannotLoad.bind(this), false);
		req.addEventListener("abort", this.cannotLoad.bind(this), false);
		req.open("GET", this.bugApiUrl, true);
		req.send(null);
	},

	cannotLoad: function (e, a) {
		chrome.browserAction.setBadgeText({ text: 'x'})
		chrome.browserAction.setBadgeBackgroundColor({ color: netDisabledColor });
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
setInterval(function() {
	bugMonitor.requestBugs();
}, 60*1000);
