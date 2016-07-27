// var chartMaxCounter = 0;
var startingChartData = [0, 0, 0, 0, 0, 0, 0];
var canvas = document.getElementById('viewers_chart'),
    ctx = canvas.getContext('2d'),
    startingChartParams = {
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [
          {
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              data: startingChartData
          }
      ]
    },
    latestLabel = startingChartParams.labels[6];

var myLiveChart = new Chart.Line(ctx, {data: startingChartParams});

//function ready() {
getStreamInfo();
setInterval(getStreamInfo, 15000);
//};

//document.addEventListener("DOMContentLoaded", ready);

function getStreamInfo() {
  var stream = 'anaxuname';
  var link = "https://streams.twitch.tv/kraken/streams?channel=" + stream + "&on_site=1";
  ajax(link,
    function (data) {
      if (data._total != 0) {
        foundStream(data);
      } else {
        noStream();
      }
    },
    noStream
  );
}

function noStream() {
  document.getElementById("info").hidden = false;
  document.getElementsByClassName("content")[0].hidden = true;
}

function foundStream(data) {
  startingChartData.push(data.streams[0].viewers);
  startingChartData.shift();
  myLiveChart.update();
  document.getElementById("info").hidden = true;
  document.getElementsByClassName("content")[0].hidden = false;
  document.getElementById("viewers").innerHTML = data.streams[0].viewers;
  document.getElementById("followers").innerHTML = data.streams[0].channel.followers;
  document.getElementById("game").innerHTML = data.streams[0].channel.game;
  document.getElementById("status").innerHTML = data.streams[0].channel.status;
}


function ajax(url, success = function () {}, fail = function () {}) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var data = JSON.parse(xhttp.responseText);
      if (data) {
        success(data);
      } else {
        fail();
      }
    } else {
      fail();
    }
  }
  xhttp.open("GET", url, true);
  xhttp.send();
}
