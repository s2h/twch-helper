// var data;
$(document).ready(function() {
  ajax();
  setInterval(ajax, 15000);
});
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
        $("#info").text("OFFLINE");
        $(".content").hide();
      } else if (data) {
        $(".content").show();
        $("#viewers").text(data.streams[0].viewers);
        $("#followers").text(data.streams[0].channel.followers);
        $("#game").text(data.streams[0].channel.game);
        $("#status").text(data.streams[0].channel.status);
      };
    };
  };
  xhttp.open(
    "GET",
    link,
    true
  );
  xhttp.send();
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
