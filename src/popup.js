(function (){
	"use strict";

   $('.actionBtn').on('click', function(){
	   var dataGreeting = $(this).data('greeting');
	   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		   chrome.tabs.sendMessage(tabs[0].id, {greeting: dataGreeting}, function(response) {
			   console.log(response.farewell);
		   });
	   });
   });

})();