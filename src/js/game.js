const remote = require('electron').remote;

var tagData;
var curSentence = 0;
var wordsRemoved = 0;

var words,answers;
var wordsArr = [];
var answersArr = [];
var wrongAnswers = [];
var correctCount = 0;

var longTags = ["Coordinating conjunction" , "Cardinal number" , "Determiner", "Existential there", "Foreign word", "Preposition or subordinating conjunction", "Adjective", "Adjective comparative", "Adjective superlative", "List item marker", "Modal", "Noun singular or mass", "Noun plural", "Proper noun singular", "Proper noun plural", "Predeterminer", "Possessive ending", "Personal pronoun", "Possessive pronoun", "Adverb", "Adverb comparative", "Adverb superlative", "Particle", "Symbol", "to", "Interjection", "Verb base form", "Verb past tense", "Verb gerund or present participle", "Verb past participle", "Verb non-3rd person singular present", "Verb 3rd person singular present", "Wh-determiner", "Wh-pronoun", "Possessive wh-pronoun", "Wh-adverb","Symbol"];

var shortTags = ["CC", "CD", "DT", "EX", "FW", "IN", "JJ", "JJR", "JJS", "LS", "MD", "NN", "NNS", "NNP", "NNPS", "PDT", "POS", "PRP", "PRP$", "RB", "RBR", "RBS", "RP", "SYM", "TO", "UH", "VB", "VBD", "VBG", "VBN", "VBP", "VBZ", "WDT", "WP", "WP$", "WRB",":"];


window.onload = function(){
	var url = window.location.href;
  var captured = /data=([^&]+)/.exec(url)[1];
  var result = captured ? captured : 'myDefaultValue';
	tagData = JSON.parse(decodeURIComponent(result));
	document.getElementById("category_p").innerHTML = "Category : "+tagData.category;

	processSentece(curSentence);
};

function processSentece(cnt){
	var sentence = tagData.sentences[cnt].posTagging;

	wordsArr = [];
	answersArr = [];

	document.getElementById("sentence_p").innerHTML = "Sentece : "+(cnt+1)+"/"+tagData.sentences.length;

	for(var i=0; i<sentence.length; i++){
		var word = sentence[i].word;
		var pos = sentence[i].textpos
		if(word == "\""){ continue; }
		else if(word == "'"){ continue; }
		else if(word == "{"){ continue; }
		else if(word == "}"){ continue; }
		else if(word == "("){ continue; }
		else if(word == ")"){ continue; }
		else if(word == ","){ continue; }
		else if(word == "!"){ continue; }
		else if(word == "?"){ continue; }
		else if(word == ":"){ continue; }
		else if(word == "\\"){ continue; }
		else if(word == "|"){ continue; }
		else if(word == "."){ continue; }
		else if(word == ";"){ continue; }


		wordsArr.push(word);
		answersArr.push(pos);
	}


	words = document.getElementById("words");
	answers = document.getElementById("answers");

	var wordsString = "";
	for(var i=0; i<wordsArr.length; i++){
		wordsString += wordName(i,wordsArr[i],answersArr[i]);
	}

	words.innerHTML = wordsString;

	answersArr = shuffle(answersArr);
	var answersString = "";
	for(var i=0; i<answersArr.length; i++){
		answersString += cardName(i,getTagLongName(answersArr[i]));
	}
	answers.innerHTML = answersString;
}

function cardName(cnt,name){
	return "<paper-card elevation=2 draggable='true' ondragstart='drag(event)' class='mycardclass' id='"+cnt+"'><div id='content"+cnt+"'>"+name+"</div></paper-card>";
}

function wordName(cnt,name,correct){
	var str = "<table ondrop='drop(event)' onclick='wordClick(this.id)' ondragover='allowDrop(event)' class='mytable' id='t_"+cnt+"' ><tr><td id='w_"+cnt+"'>"+name+"</td></tr> <tr><td class='myans' id='a_"+cnt+"'>--</td></tr> <tr><td> <p id='c_"+cnt+"' hidden>"+correct+"</p> </td></tr></table>";
	return str;
}

function nextSentence(){

	for(var i=0; i<wordsArr.length; i++){
		var word = document.getElementById("w_"+i).innerHTML;
		var answ = document.getElementById("a_"+i).innerHTML;
		var corr = document.getElementById("c_"+i).innerHTML;

		if(answ == corr){
			document.getElementById("w_"+i).style.color = '#CDDC39';
			document.getElementById("a_"+i).style.color = '#CDDC39';
			correctCount++;
		}else{
			document.getElementById("w_"+i).style.color = '#f44336';
			document.getElementById("a_"+i).style.color = '#f44336';
			if(answ != "--"){
				wrongAnswers.push(corr);
			}
		}

		//console.log("Word : "+word+" guess : "+answ+" correct : "+corr);
	}

	setTimeout(
    function() {
    	if(curSentence < tagData.sentences.length-1){
			curSentence++;
			processSentece(curSentence);
		}else{
			finishGame();
		}
    }, 3000);


}

function finishGame(){
	console.log(wrongAnswers);

	var wrongs_json = new Object();

	if (typeof(Storage) !== "undefined") {
    	//localStorage.setItem("userid", 6);
		var userid = localStorage.getItem("userid");

		for(var i=0; i<shortTags.length; i++){
    		wrongs_json[shortTags[i]] = 0;
	  }

	  for(var i=0; i<wrongAnswers.length; i++){
	  	var cur_error = wrongAnswers[i];
	    wrongs_json[cur_error] = wrongs_json[cur_error] + 1;
	 	}

		if(tagData.practice){
			alert("You scored "+correctCount+" point(s).\nThat was a great practice! We hope to see you again!");
			var url = 'index.html';
			remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/`+url);
		}else{
			var postBody = new Object();
		  postBody.user_id = userid;
		  postBody.score = correctCount;
		  postBody.wrong_answers = wrongs_json;

		  //console.log(postBody);
		  var http = new XMLHttpRequest();
			var url = "http://83.212.118.131:3000/game_end/";
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", "application/json");
			http.onreadystatechange = function() {//Call a function when the state changes.
		    	if(http.readyState == 4 && http.status == 200) {
			    	//console.log(http.responseText);

			    	var resp = http.responseText;
			    	if(resp == "OK"){
				    	alert("You scored "+postBody.score+" point(s).\nYour score was successfully submitted! Hope to see you again!");
							var url = 'index.html';
							remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/`+url);
			    	}else{
				    	alert(resp);
			    	}

		    	}
			}
			http.send(JSON.stringify(postBody));
		}

	} else {
    alert("Sorry, your browser does not support Local Storage files. Please upgrade your browser.");
	}
}

function getTagLongName(shortName){
	for(var i=0; i<shortTags.length; i++){
		if(shortName == shortTags[i]){
			return longTags[i];
		}
	}
}


function getTagShortName(longName){
	for(var i=0; i<longTags.length; i++){
		if(longName == longTags[i]){
			return shortTags[i];
		}
	}
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }

    return a;
}


/* ------- DRAG & DROP FUNCTIONS ---------- */

function wordClick(id){
	var ansId =  "a_"+id.substring(2, id.length);
	if(!(document.getElementById(ansId).innerHTML === "--")){
		wordsRemoved++;
		var myHtml = ((String)(answers.innerHTML));
		myHtml += cardName(1000+wordsRemoved, getTagLongName(document.getElementById(ansId).innerHTML));
		answers.innerHTML = "";
		answers.innerHTML = myHtml;
		document.getElementById(ansId).innerHTML = "--";
	}
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
	var contentId = "content"+ev.target.id;
	var card = document.getElementById(contentId);
	console.log("Drag on : "+card.innerHTML);

    ev.dataTransfer.setData("elementId", ev.target.id);
    ev.dataTransfer.setData("text", card.innerHTML);
}

function drop(ev) {
    ev.preventDefault();
    var data = getTagShortName(ev.dataTransfer.getData("text"));
    var elementId = ev.dataTransfer.getData("elementId");

    console.log("Drop on : "+ev.target.id);
    var el_id = ev.target.id;
    var ansID = "a_"+el_id.substring(2, el_id.length);

    if(document.getElementById(ansID).innerHTML === "--"){
		document.getElementById(ansID).innerHTML = data;
		var element = document.getElementById(elementId);
		element.parentNode.removeChild(element);
    }
}
