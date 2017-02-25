const remote = require('electron').remote;

window.onload = function(){};

function startGame(){
  var text = document.getElementById("input").value;
  console.log(text);
  if (typeof(Storage) !== "undefined") {
      localStorage.setItem("typedata",text);
      var url = `paragraph_review.html?data=` + encodeURIComponent("_typed_");
      remote.getCurrentWindow().loadURL(`file://${__dirname}/../html/`+url);
  }else{
    alert("Sorry, your browser does not support Local Storage files. Please upgrade your browser.");
  }

}
