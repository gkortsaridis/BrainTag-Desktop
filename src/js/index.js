const remote = require('electron').remote;

window.onload = function(){

     if (typeof(Storage) !== "undefined") {
        if(localStorage.getItem("userid") == -1 || localStorage.getItem("userid") == undefined){ logout(); }
        else{ getData(); }
    }else{
    	alert("Sorry, your browser does not support Local Storage files. Please upgrade your browser.");
    }


};

function getData(){
  var http = new XMLHttpRequest();
	var url = "http://83.212.118.131:3000/scoreboard";
	http.open("POST", url, true);

    if (typeof(Storage) !== "undefined") {
		var userid = localStorage.getItem("userid");
        var postBody = { ID : userid };

        document.getElementById("user_data").innerHTML = "<div id='loader' class='loader' style='display: block; margin: auto;'></div>";

            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/json");

            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                    //console.log(http.responseText);

                    var json = JSON.parse(http.responseText);
                    console.log(json);
                    var rank = json.rank;
                    var score = json.score;
                    document.getElementById("user_data").innerHTML = "Your Score</br>"+score+"</br>Your Ranking</br>"+ordinal_suffix_of(rank);
                }
            }
            http.send(JSON.stringify(postBody));

    }else{
    	alert("Sorry, your browser does not support Local Storage files. Please upgrade your browser.");
    }

}

function showInfo(){
    remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/info.html`);
}

function showTags(){
    remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/tags.html`);
}

function startRandomGame(){
    var url = `paragraph_review.html?data=` + encodeURIComponent("_random_");
    remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/`+url);
}

function startNews(){
  var url = `paragraph_review.html?data=` + encodeURIComponent("_news_");
  remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/`+url);
}

function showCategories(){
    remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/categories.html`);
}

function startType(){
  remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/type.html`);
}

function logout(){

    if (typeof(Storage) !== "undefined") {
		    localStorage.setItem("userid",-1);
        var url = 'login.html';
        remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/login.html`);
    }else{
    	alert("Sorry, your browser does not support Local Storage files. Please upgrade your browser.");
    }

}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
