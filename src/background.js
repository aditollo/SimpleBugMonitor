var bugMonitor = {

	bugApiUrl: 'http://tcwiki.wp.yoox.net/tools/dashboard.api.php?op=get&key=bugs',
	colors: {
		ok: [67, 172, 106, 255],
		warn: [240, 65, 36, 255],
		alarm: [240, 138, 36, 255],
		unknow: [142, 142, 142, 255],
	},
	lanAvailable: true,

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
		this.lanAvailable = false;
		chrome.browserAction.setBadgeText({ text: 'x' });
		chrome.browserAction.setBadgeBackgroundColor({ color: this.colors.unknow });
	},

	updateBadge: function (e, a) {
		this.lanAvailable = true;

		var response = JSON.parse(e.target.responseText);

		var badgedBugs = response.our;
		var badgeColor;

		if (badgedBugs > 0) {
			badgeColor = badgedBugs === 1 ? this.colors.warn : this.colors.alarm;
		} else {
			badgeColor = this.colors.ok;
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

	// cant'd do nothing if the internal servers aren't available
	if (!this.lanAvailable) { return; }

	// find the right tab or creates a new one
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
