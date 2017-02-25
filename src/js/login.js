const remote = require('electron').remote;


window.onload = function(){
};

function register(){
	remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/register.html`);
}

function login(){

	var http = new XMLHttpRequest();
	var url = "http://83.212.118.131:3000/login";
	http.open("POST", url, true);

    var usernameTxt = document.getElementById("username_txt").value;
    var password_txt = document.getElementById("password_txt").value;

    if(usernameTxt == "" || password_txt == ""){
        alert("Please provide both username and password");
    }else{
        var postBody = {
            "username" : usernameTxt,
            "password" : password_txt
        };

        document.getElementById("btnTxt").innerHTML = "<div id='loader' class='loader' style='display: block; margin: auto;'></div>";
        http.setRequestHeader("Content-type", "application/json");
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                var json = JSON.parse(http.responseText);
                console.log(json);
                document.getElementById("btnTxt").innerHTML = "Log In";

                if (typeof(Storage) !== "undefined") {
		            		localStorage.setItem("userid",json.ID);
										remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/index.html`);
                }else{
                    alert("Sorry, your browser does not support Local Storage files. Please upgrade your browser.");
                }
            }
        }
        http.send(JSON.stringify(postBody));
    }
}
