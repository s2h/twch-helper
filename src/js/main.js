(function() {
  var debug = false;
  var chartColumnsNum = 30,
      getInfoTimeout = 60000,
      stream = 'anaxuname';

  var myLiveChart;

  var canvas = document.getElementById('viewers_chart'),
      ctx = canvas.getContext('2d'),
      chartParams = {
        labels: [],
        datasets: [
            {
                label: "viewers",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: []
            },
            {
                label: "trend",
                fillColor: "rgba(200,200,200,0.2)",
                strokeColor: "rgba(200,200,200,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: []
            }
        ]
      };


  myLiveChart = new Chart.Line(ctx, {data: chartParams});
  getStreamInfo();
  setInterval(getStreamInfo, getInfoTimeout);

  function getStreamInfo() {
    var link = "https://api.twitch.tv/kraken/streams/" + stream;
    ajax(link,
      function (data) {
        if (data.stream !== null) {
          foundStream(data);
        } else {
          noStream();
        }
      }
    );
  }

  function noStream() {
    document.getElementById("info").hidden = false;
    document.getElementsByClassName("content")[0].hidden = true;
  }

  function foundStream(data) {
    chartParams.datasets[0].data.push(data.stream.viewers);
    chartParams.labels.push("");
    if (chartParams.datasets[0].data.length >= chartColumnsNum) {
      chartParams.datasets[0].data.shift();
      chartParams.labels.shift();
    }

    chartParams.datasets[1].data = [];
    chartParams.datasets[0].data.forEach(function (value, index, array) {
      var avgSum = 0;
      for (var i = 0; i<=index; i++) {
        avgSum += array[i];
      }
      avgSum /= index + 1;
      chartParams.datasets[1].data.push(avgSum);
    });
    consoleOutput(chartParams);

    myLiveChart.update();

    document.getElementById("info").hidden = true;
    document.getElementsByClassName("content")[0].hidden = false;
    document.getElementById("viewers").innerHTML = data.stream.viewers;
    document.getElementById("followers").innerHTML = data.stream.channel.followers;
    document.getElementById("game").innerHTML = data.stream.channel.game;
    document.getElementById("status").innerHTML = data.stream.channel.status;
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
      }

    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function consoleOutput() {
    if (debug) {
      for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
      }
    }
  }
})();
