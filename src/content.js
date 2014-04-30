(function (){
	"use strict";
	var bookmarklets = {
		loginLogout: function() {
			if(!ECPack.account.isLogged()){
				ECPack.account.login('test.' + _$Os.isoCode().toLowerCase() + '@yoox.com', 'password');
			} else {
				ECPack.account.logout();
			}
		},
		addItemToCart: function(){
			_$Y.watch('ECPack.search:SearchFull', function(data){
				var items = data.Results.Items;
				var item = items[Math.floor(Math.random()*items.length)];
				ECPack.cart.addItem(item.DefaultCode10, item.Sizes[0].Id);
			});

			var dep = Navigation.SITE_CODE.indexOf("THECORNER") === 0 ? "tcwoman": "ssshoesw";

			ECPack.search.getSearchFull({
				department: dep,
				productsPerPage: 10,
				sortRule: 'PriceAscending'
			});
		},
//		openTimedLayer: function(){
//			%7Bfunction%20deleteSession()%7Bvar%20timeToReplace%3Bvar%20myooxTime%20%3D%20_%24Y.cookie.get('MYOOX'%2C%20'TIME')%3Bvar%20accountTime%20%3D%20_%24Y.cookie.get('ACCOUNT'%2C%20'TIME')%3Bif%20(myooxTime)%20%7BtimeToReplace%20%3D%20myooxTime.substring(0%2C%20myooxTime.length-2)%20%2B%20'00'%3B_%24Y.cookie.setProps('MYOOX'%2C%20%7B%20'TIME'%20%3A%20timeToReplace%20%7D)%3B%7Dif%20(accountTime)%20%7BtimeToReplace%20%3D%20accountTime.substring(0%2C%20accountTime.length-2)%20%2B%20'00'%3B_%24Y.cookie.setProps('ACCOUNT'%2C%20%7B%20'TIME'%20%3A%20timeToReplace%20%7D)%3B%7D%7DdeleteSession()%7D
//		},
		addAddressBook: function(){
			$.get('http://randomuser.me/g/', function(data) {
				ECPack.account.addUserAddressBook({
					address: 'via di qua',
					city: 'Bulagna',
					province: 'BO',
					email: data.results[0].user.email,
					name: data.results[0].user.name.first,
					surname: data.results[0].user.name.last,
					zipCode: 12345,
					phone: 123456789
				});
			});

		}

	};

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {

			var response;
			var actualCode;
			var script;
			if(typeof bookmarklets[request.greeting] === "function"){
				actualCode = bookmarklets[request.greeting];
			}
			else{
				sendResponse({farewell: "comando sconosciuto!"});
			}
			response = "comando " + request.greeting + " lanciato";
			script = document.createElement('script');
			script.textContent = $.trim("(" + actualCode + ")();");
			(document.head||document.documentElement).appendChild(script);
			script.parentNode.removeChild(script);
			sendResponse({farewell: response});
		});

})();