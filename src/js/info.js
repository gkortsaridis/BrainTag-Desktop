const remote = require('electron').remote;

window.onload = function(){

  var shell = require('electron').shell;
  //open links externally by default

  var link1 = document.getElementById("extLink1");
  var link2 = document.getElementById("extLink2");
  var link3 = document.getElementById("extLink3");

  link1.addEventListener("click", function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
  });

  link2.addEventListener("click", function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
  });

  link3.addEventListener("click", function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
  });

};
