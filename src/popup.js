(function (){
	"use strict";

   $('#loginBtn').on('click', function(){
	   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		   chrome.tabs.sendMessage(tabs[0].id, {greeting: "login/logout"}, function(response) {
			   console.log(response.farewell);
		   });
	   });
   });

})();