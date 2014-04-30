(function (){
	"use strict";
	var bookmarklets = {
		loginLogout: function() {
			if(!ECPack.account.isLogged()){
				ECPack.account.login('test.' + _$Os.isoCode().toLowerCase() + '@yoox.com', 'password');
			} else {
				ECPack.account.logout();
			}
		}
	};
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {

			var response;
			var actualCode;
			var script;
			if (request.greeting == "login/logout"){
				actualCode = ["if(!ECPack.account.isLogged()){",
					"ECPack.account.login('test.' + _$Os.isoCode().toLowerCase() + '@yoox.com', 'password');",
					"} else {",
					"ECPack.account.logout();",
					"}"].join('\n');
				response = "comando di login/logout lanciato";
			}
			script = document.createElement('script');
			script.textContent = actualCode;
			(document.head||document.documentElement).appendChild(script);
			script.parentNode.removeChild(script);
			sendResponse({farewell: response});
		});

})();