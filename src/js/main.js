// var data;
//function ready() {
ajax();
setInterval(ajax, 15000);
//};

//document.addEventListener("DOMContentLoaded", ready);

function req() {
  console.log('tost');
}

function ajax() {
  var data;
  var stream = 'anaxuname';
  var link = "https://streams.twitch.tv/kraken/streams?channel=" + stream + "&on_site=1";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      data = JSON.parse(xhttp.responseText);
      if (data && data._total === 0) {
        document.getElementById("info").innerHTML = "OFFLINE";
        document.getElementsByClassName("content")[0].style.display = 'none';
      } else if (data) {
        updateInfo(data);
      };
    };
  };
  xhttp.open("GET", link, true);
  xhttp.send();
}

function updateInfo(data) {
  document.getElementById("info").innerHTML = "";
  document.getElementsByClassName("content")[0].style.display = 'block';
  document.getElementById("viewers").innerHTML = data.streams[0].viewers;
  document.getElementById("followers").innerHTML = data.streams[0].channel.followers;
  document.getElementById("game").innerHTML = data.streams[0].channel.game;
  document.getElementById("status").innerHTML = data.streams[0].channel.status;
}


function request(link) {
  var result;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      result = JSON.parse(xhttp.responseText);
    };
  };
  xhttp.open(
    "GET",
    link,
    true
  );
  xhttp.send();
  return result;
}
