var name = ""
name = localStorage.getItem('username');
var base_url = window.location.origin;
console.log(base_url);
function base64encode(str) {
	return btoa(unescape(encodeURIComponent(str)));
}
function base64decode(str) {
	return decodeURIComponent(escape(atob(str)));
}

function set_username() {
	var user_name = document.getElementById("username").value;
	name = base64encode(user_name);
	localStorage.setItem('username', name);
}

function send() {
	var message = {
		"sender": name,
		"text": base64encode(document.getElementById("message").value),
	};
	var request = {
		"chat": chat,
		"message": message
	};
	alert(JSON.stringify(request)); /*
	const HTTP = new XMLHttpRequest();
	const url="http://localhost:3000/send"
	HTTP.open("POST", url);
	HTTP.setRequestHeader("Content-Type", "application/json");
	HTTP.send(JSON.stringify(request));
	HTTP.upload.onprogress = function(e) {
		console.log(e.loaded);
		console.log(e.total);
	}
	HTTP.upload.onload = function(e) {
		console.log("Data sent");
	}
	HTTP.onload = function() {
		console.log(HTTP.status);
	}
	HTTP.onerror = function() {
		console.log("Unknown error");
	} */
}

function get_message(n) {
	var request = base_url + "/get?chat=" + chat + "&n=" + n;

}

function scrollToBottom() {
	const chatHistory = document.getElementById('chat-history');
	chatHistory.scrollTop = chatHistory.scrollHeight;
}
