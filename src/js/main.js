(function (name) {
    "use strict";
    var Stream = {};
    var StreamHelper = {};

    Stream.chartColumnsNum = 30;
    Stream.getInfoTimeout = 60000;
    Stream.name = name;

    var debug = false;


    Stream.canvas = document.getElementById(Stream.name + '_chart');
    Stream.ctx = Stream.canvas.getContext('2d');
    Stream.chartParams = {
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


    Stream.chart = new Chart.Line(Stream.ctx, {data: Stream.chartParams});

    // location.search = updateURLParameter(location.search, "stream", stream);


    Stream.getStreamInfo = function () {
        var link = "https://api.twitch.tv/kraken/streams/" + Stream.name;
        StreamHelper.ajax(link,
            function (data) {
                if (data.stream !== null) {
                    Stream.foundStream(data);
                } else {
                    Stream.noStream();
                }
            }
        );
    };



    Stream.noStream = function () {
        document.getElementById("info").hidden = false;
        document.getElementsByClassName("content")[0].hidden = true;
    };

    Stream.foundStream = function (data) {
        Stream.chartParams.datasets[0].data.push(data.stream.viewers);
        Stream.chartParams.labels.push("");
        if (Stream.chartParams.datasets[0].data.length >= Stream.chartColumnsNum) {
            Stream.chartParams.datasets[0].data.shift();
            Stream.chartParams.labels.shift();
        }

        Stream.chartParams.datasets[1].data = [];
        Stream.chartParams.datasets[0].data.forEach(function (value, index, array) {
            var avgSum = 0;
            for (var i = 0; i <= index; i++) {
                avgSum += array[i];
            }
            avgSum /= index + 1;
            Stream.chartParams.datasets[1].data.push(avgSum);
        });
        StreamHelper.consoleOutput(Stream.chartParams);

        Stream.chart.update();

        document.getElementById("info").hidden = true;
        document.getElementsByClassName("content")[0].hidden = false;
        document.getElementById("viewers").innerHTML = data.stream.viewers;
        document.getElementById("followers").innerHTML = data.stream.channel.followers;
        document.getElementById("game").innerHTML = data.stream.channel.game;
        document.getElementById("status").innerHTML = data.stream.channel.status;
    };


    StreamHelper.ajax = function(url, success, fail) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
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
    };

    StreamHelper.consoleOutput = function() {
        if (debug) {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };

    //tnanks Adil Malik
    StreamHelper.updateURLParameter = function(url, param, paramVal) {
        var TheAnchor = null;
        var tmpAnchor;
        var TheParams;
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";

        if (additionalURL) {
            tmpAnchor = additionalURL.split("#");
            TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];
            if (TheAnchor)
                additionalURL = TheParams;

            tempArray = additionalURL.split("&");

            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].split('=')[0] != param) {
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
        else {
            tmpAnchor = baseURL.split("#");
            TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];

            if (TheParams)
                baseURL = TheParams;
        }

        if (TheAnchor)
            paramVal += "#" + TheAnchor;

        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    };

    Stream.getStreamInfo();
    setInterval(Stream.getStreamInfo, Stream.getInfoTimeout);
})("Nightblue3");
