function createChart(element, label, labels, data, color) {
    var ctx = document.getElementById(element).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                label: label,
                backgroundColor: color,
                borderColor: color,
                data: data
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: '#fff',
                    },
                    gridLines: {
                        color: '#fff'
                    },
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#fff',
                    },
                    gridLines: {
                        color: '#fff'
                    },
                }]
            },
            legend: {
                labels: {
                    fontColor: '#fff'
                }
            }
        }
    });

    return chart;
}

function updateData(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update({
        duration: 800,
    });
}


function getData() {
    return new Promise(function(resolve, reject) {
        $.getJSON(window.location.pathname + '_get_sensors_values', { 
            count: $('#values_count').val(),
            date_from: $('#datetimepicker1 > input').val(),
            date_to: $('#datetimepicker2 > input').val()
        }, function(data) {
            resolve(data);
        }).fail(function() {
            reject('Error');
        });
    });
}

async function update() {

    try {
        let data = await getData();

        labels = [];
        for (let i=0; i < data.time_values.length; i++) {
            labels.push(data.time_values[i].split(' ')[4]);
	}
        humidity_data = data.humidity_values;
        temp_data = data.temp_values;
        ppm_data = data.ppm_values;
        heat_index_data = data.heat_index_values

	let last_heat_index = heat_index_data[heat_index_data.length - 1];

        $('#heat_index').text(last_heat_index);
        if (last_heat_index < 27) {
            $('#heat_index').css('background-color', '#d7fff7');
        } else if (last_heat_index >= 27 && last_heat_index < 32) {
            $('#heat_index').css('background-color', '#60ff00');
        } else if (last_heat_index >= 32 && last_heat_index < 52) {
            $('#heat_index').css('background-color', '#ffcd00');
        } else {
            $('#heat_index').css('background-color', '#f00');
        }
        $('#current_humidity').text(humidity_data[humidity_data.length - 1]);
        $('#current_temperature').text(temp_data[temp_data.length - 1]);

        table_data = '';
        for(let i = 0; i < labels.length; i++) {
            table_data += '<tr class="centered"><td>' + labels[i] + '</td>' +
                '<td>' + humidity_data[i] + '</td>' +
                '<td>' + temp_data[i] + '</td>' +
                '<td>' + ppm_data[i] + '</td></tr>';
        }

        $('#table_body').html(table_data);


        updateData(humidity_chart, labels, humidity_data)
        updateData(temp_chart, labels, temp_data)
        updateData(ppm_chart, labels, ppm_data)
    } catch(error) {
        console.log(error);
    }

    setTimeout(update, 1000);
}


var labels;
var humidity_data;
var temp_data;
var ppm_data;
var table_data;

var humidity_chart = createChart('humidity', 'Humidity, %', labels, humidity_data, 'rgb(126,255,212)');
var temp_chart = createChart('temp', 'Temperature, °C', labels, temp_data, 'rgb(255,140,0)');
var ppm_chart = createChart('ppm', 'CO2, ppm', labels, ppm_data, 'rgb(173,255,47)');

$("#values_count").change(function() {
    $('#count').text($('#values_count').val());
});

$("#clear_btn").click(function() {
    $('#datetimepicker1 > input').val('');
    $('#datetimepicker2 > input').val('');
});

$(function () {
    $('#datetimepicker1').datetimepicker({
        useCurrent: false
    });
    $('#datetimepicker2').datetimepicker({
        useCurrent: false
    });
    $("#datetimepicker1").on("change.datetimepicker", function (e) {
        $('#datetimepicker2').datetimepicker('minDate', e.date);
    });
    $("#datetimepicker2").on("change.datetimepicker", function (e) {
        $('#datetimepicker1').datetimepicker('maxDate', e.date);
    });
});

$(update());
