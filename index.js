document.getElementById("file-input").addEventListener("change", function (evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var contents = e.target.result;
        var jsonData = csvToJson(contents);
        var data = JSON.parse(jsonData);
        document.getElementById("file-input").dataset.jsonData = jsonData;
        var headers = Object.keys(data[0]);
        populateAxisSelectors(headers);
        console.log(data);
        // createChart(data);
    };

    reader.readAsText(file);
});

function csvToJson(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentLine = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }

        result.push(obj);
    }

    return JSON.stringify(result);
}

function populateAxisSelectors(headers) {
    var xSelect = document.getElementById("x-axis-select");
    var ySelect = document.getElementById("y-axis-select");

    xSelect.innerHTML = "";
    ySelect.innerHTML = "";

    headers.forEach(function (header) {
        var option = document.createElement("option");
        option.text = header;
        xSelect.add(option);

        option = document.createElement("option");
        option.text = header;
        ySelect.add(option);
    });

    xSelect.addEventListener("change", updateChart);
    ySelect.addEventListener("change", updateChart);
}

function updateChart() {
    var xSelect = document.getElementById("x-axis-select");
    var ySelect = document.getElementById("y-axis-select");
    var xVariable = xSelect.options[xSelect.selectedIndex].text;
    var yVariable = ySelect.options[ySelect.selectedIndex].text;

    var jsonData = document.getElementById("file-input").dataset.jsonData;
    var data = JSON.parse(jsonData);

    var labels = data.map(function (obj) {
        return obj[xVariable];
    });
    var values = data.map(function (obj) {
        return parseInt(obj[yVariable]);
    });

    var chart = document.getElementById("chart").getContext("2d");
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(chart, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: yVariable,
                    data: values,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}