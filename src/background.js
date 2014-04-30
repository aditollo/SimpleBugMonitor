/*
(function(){
	"use strict";

	var bugMonitor = {

		bugApiUrl: 'http://tcwiki.wp.yoox.net/tools/dashboard.api.php?op=get&key=bugs',
		bugs: {
			open: []
		},

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
			req.addEventListener("load", this.processResponse.bind(this), false);
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

		processResponse: function (e, a) {
			this.lanAvailable = true;

			var response = JSON.parse(e.target.responseText);

			this.bugs.open = response.open;

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
	var bugTrackerUrl = 'http://bugtracker.yoox.net/view.php?id=';


	function openUrl(url) {

		// find the right tab or creates a new one
		chrome.tabs.getAllInWindow(undefined, function(tabs) {
			for (var i = 0, tab; tab = tabs[i]; i++) {
				if (tab.url && tab.url === url) {
					chrome.tabs.update(tab.id, {selected: true});
					return;
				}
			}
			chrome.tabs.create({ url: url });
		});

	}

	function goToDashboard() {

		// cant'd do nothing if the internal servers aren't available
		

		
	}


chrome.browserAction.onClicked.addListener(function() {
	if (!bugMonitor.lanAvailable) {
		return;
	}

	if (bugMonitor.bugs.open.length > 0) {
		var bug = bugMonitor.bugs.open[0];
		openUrl(bugTrackerUrl + bug.bug_id);

	} else {
		openUrl(dashboardUrl);
	}


});



bugMonitor.requestBugs();
setInterval(function() {
	bugMonitor.requestBugs();
}, 60*1000);


})();*/
