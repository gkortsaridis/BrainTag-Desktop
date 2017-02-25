const remote = require('electron').remote;

window.onload = function(){
    getCategories();
};

function getCategories(){
var http = new XMLHttpRequest();
	var url = "http://83.212.118.131:3000/categories";
	http.open("GET", url, true);

    document.getElementById("categories").innerHTML = "<div id='loader' class='loader' style='display: block; margin: auto;'></div>";
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            var json = JSON.parse(http.responseText);
            console.log(json);

            //<h4>B</h4><ul><li><a href="#">Billy</a></li><li><a href="#">Bob</a></li></ul>
            var myInnerHTML = "";
            for(var i=0; i<json.categories.length; i++){
                var category_name = json.categories[i].name;
                var cur_categories = json.categories[i].categories;

                myInnerHTML += "<h2 style='font-size:2em;'>"+beautify(category_name)+"</h2>";
                myInnerHTML += "<ul>";
                for(var j=0; j<cur_categories.length; j++){
                    myInnerHTML += "<li id='category_item' onclick=\"clickedcategory('"+cur_categories[j]+"')\">"+beautify(cur_categories[j])+"</li>";
                }
                myInnerHTML += "</ul>";

                document.getElementById("categories").innerHTML = myInnerHTML;
            }

        }
    }
    http.send();
}

function beautify(word){
    word = word.replace("_"," ");
    word = word.capitalizeFirstLetter();
    return word;
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function clickedcategory(category){
    var url = `paragraph_review.html?data=` + encodeURIComponent(category);
    remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/`+url);
}
