const remote = require('electron').remote;


window.onload = function(){
};

function register(){

	var http = new XMLHttpRequest();
	var url = "http://83.212.118.131:3000/register";
	http.open("POST", url, true);

    var usernameTxt = document.getElementById("username_txt").value;
    var password_txt = document.getElementById("password_txt").value;
    var email_txt = document.getElementById("email_txt").value;

    if(usernameTxt == "" || password_txt == "" || email_txt == ""){
        alert("Please provide all credentials");
    }else{
        var postBody = {
            "username" : usernameTxt,
            "password" : password_txt,
            "email"    : email_txt
        };

        document.getElementById("btnTxt").innerHTML = "<div id='loader' class='loader' style='display: block; margin: auto;'></div>";
        http.setRequestHeader("Content-type", "application/json");
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                if(http.responseText == "OK"){
                  alert("You are successfully registered.\nNow you can login with your credentials.");
                }else{
                  alert("We encountered a problem : "+http.responseText);
                }
                remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/login.html`);
            }else if(http.readyState == 4 && http.status != 200){
                alert(http.responseText);
                document.getElementById("btnTxt").innerHTML = "Register";

            }
        }
        http.send(JSON.stringify(postBody));
    }
}
