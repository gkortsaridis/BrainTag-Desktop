const remote = require('electron').remote;

var tagRequests = {
		"wiki_category" : "Technology",
		"wiki_language" : "en",
		"wrongs" : ""
	};

var tagOnly;

var tagOnlyRequets = {
	"paragraph" : "",
	"wrongs" : "",
	"category" : ""
};

var tagResponse;
var gotEverything = false;

window.onload = function(){
	getCategory();
};

function getCategory(){

	var url = window.location.href;
  var captured = /data=([^&]+)/.exec(url)[1];
  var result = captured ? captured : 'myDefaultValue';

	if(result == "_random_"){
		var http = new XMLHttpRequest();
		var url = "http://83.212.118.131:3000/categories";
		http.open("GET", url, true);
		tagOnly = false;

		document.getElementById("paragraph").innerHTML = "<div id='loader' class='loader' style='display: block; margin: auto;'></div>";
		document.getElementById("btn").style.backgroundColor = "#757575";
		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {//Call a function when the state changes.
			if(http.readyState == 4 && http.status == 200) {

				//console.log(http.responseText);
				var json = JSON.parse(http.responseText);
				tagRequests.wiki_category = json.category;
				console.log("Random Game on "+json.category);
				document.getElementById("categoryTxt").innerHTML = "Category : "+beautify(json.category);
				getWrongs(tagOnly);
			}
		}
		http.send();
	}else if(result == "_news_"){
		var http = new XMLHttpRequest();
		var apikey = "50d716cb112e4a5db187990b0c011b96";
		var sources = ["techcrunch"];
		var source = sources[0];
		var url = "https://newsapi.org/v1/articles?source="+source+"&apiKey="+apikey;
		http.open("GET", url, true);
		tagOnly = true;

		document.getElementById("paragraph").innerHTML = "<div id='loader' class='loader' style='display: block; margin: auto;'></div>";
		document.getElementById("btn").style.backgroundColor = "#757575";
		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function() {//Call a function when the state changes.
			if(http.readyState == 4 && http.status == 200) {
				//console.log(http.responseText);
				var json = JSON.parse(http.responseText);
				console.log("Random News From "+json.source);
				tagOnlyRequets.paragraph = json.articles[0].title;
				tagOnlyRequets.category = "News from "+beautify(source);
				document.getElementById("categoryTxt").innerHTML = "Category : News from "+beautify(source);
				getWrongs(tagOnly);
			}
		}
		http.send();
	}else if(result == "_typed_"){
		tagOnly = true;
		var paragraph = localStorage.getItem("typedata");
		console.log("Typed Paragraph "+paragraph);
		tagOnlyRequets.paragraph = paragraph;
		tagOnlyRequets.category = "Typed Paragraph";
		document.getElementById("categoryTxt").innerHTML = "Category : Typed Paragraph";
		getWrongs(tagOnly);
	}else{
		tagOnly = false;
		console.log("Category Game on : "+result);
		tagRequests.wiki_category = result;
		document.getElementById("categoryTxt").innerHTML = "Category : "+beautify(result);
		getWrongs(tagOnly);
	}

}

function getWrongs(tagOnly){
	var http = new XMLHttpRequest();
	var url = "http://83.212.118.131:3000/wrongs";
	http.open("GET", url, true);


	document.getElementById("paragraph").innerHTML = "<div id='loader' class='loader' style='display: block; margin: auto;'></div>";
	document.getElementById("btn").style.backgroundColor = "#757575";
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json");

	http.onreadystatechange = function() {//Call a function when the state changes.
    	if(http.readyState == 4 && http.status == 200) {

	    	//console.log(http.responseText);
	    	var json = JSON.parse(http.responseText);
	    	tagRequests.wrongs = json;
				tagOnlyRequets.wrongs = json;
	    	//console.log(tagRequests);
				if(tagOnly){
					getTagsOnly();
				}else{
					getTags();
				}
    	}
	}
	http.send();
}

function startGame(){
	if(gotEverything == true){
		if(tagOnly){
			tagResponse.category = beautify(tagOnlyRequets.category);
			tagResponse.practice = true;
		}else{
			tagResponse.category = beautify(tagRequests.wiki_category);
			tagResponse.practice = false;
		}
		var array = JSON.stringify(tagResponse);
		var url = 'game.html?data=' + encodeURIComponent(array);
		remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/`+url);
	}
}

function refreshQuestion(){
	getCategory();
}

function beautify(word){
    word = word.replace("_"," ");
    word = word.capitalizeFirstLetter();
    return word;
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getTagsOnly(){

	var http = new XMLHttpRequest();
	var url = "http://83.212.118.131:3000/tag";
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json");

	http.onreadystatechange = function() {//Call a function when the state changes.
    	if(http.readyState == 4 && http.status == 200) {
	    	//console.log(http.responseText);

	    	var json = JSON.parse(http.responseText);
	    	tagResponse = json;

	    	document.getElementById("paragraph").innerHTML = json.paragraph;
				var diff = Math.round((json.difficulty*100) * 100) / 100;
				if(diff > 100) diff = 100;
	    	document.getElementById("difficultyTxt").innerHTML = ("Difficulty : "+diff+"%");

	    	gotEverything = true;
	    	document.getElementById("btn").style.backgroundColor = "#1976D2";
    	}
	}
	http.send(JSON.stringify(tagOnlyRequets));

}

function getTags(){

	var http = new XMLHttpRequest();
	var url = "http://83.212.118.131:3000";
	http.open("POST", url, true);


	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json");

	http.onreadystatechange = function() {//Call a function when the state changes.
    	if(http.readyState == 4 && http.status == 200) {
	    	//console.log(http.responseText);

	    	var json = JSON.parse(http.responseText);
	    	tagResponse = json;

	    	document.getElementById("paragraph").innerHTML = json.paragraph;
				var diff = Math.round((json.difficulty*100) * 100) / 100;
				if(diff > 100) diff = 100;
	    	document.getElementById("difficultyTxt").innerHTML = ("Difficulty : "+diff+"%");

	    	gotEverything = true;
	    	document.getElementById("btn").style.backgroundColor = "#1976D2";
    	}
	}
	http.send(JSON.stringify(tagRequests));

}
