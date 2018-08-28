Meteor.subscribe('Projects');

Template.monitor.helpers({
	alphas : function() {
        var id = Session.get('project');
		return Projects.findOne({_id:id}).method.alphas
	},
    activities : function() {
        var id = Session.get('project');
        return Projects.findOne({_id:id}).method.activityspaces
    }
});

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});

function arrayify(obj) {
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
}

function drawConcern() {
     var columns = [
        ['string', 'Alphas'],
        ['number', 'Progress'],
        ];

        //get data from database for every alphas
        var id = Session.get('project');
        var alphas = Projects.findOne({_id:id}).method.alphas;
        var arr_alphas = arrayify(alphas);
        var total_alpha_customer = 0;
        var total_alpha_solution = 0;
        var total_alpha_endeavor = 0;
        var total_states_customer = 0;
        var total_states_solution = 0;
        var total_states_endeavor = 0;
        var alpha_customer = [];
        var alpha_solution = [];
        var alpha_endeavor = [];
        arr_alphas.forEach(function(alpha) {
            if (alpha.value.concern == "Customer") {
                var alpha_states = arrayify(alpha.value.states)
                var total_states = alpha_states.length;
                total_states_customer = total_states_customer + total_states;
                total_alpha_customer = total_alpha_customer + 1;
                alpha_customer.push(alpha);
            } else if (alpha.value.concern == "Solution") {
                var alpha_states = arrayify(alpha.value.states)
                var total_states = alpha_states.length;
                total_states_solution = total_states_solution + total_states;
                total_alpha_solution = total_alpha_solution+ 1;
                alpha_solution.push(alpha);
            } else if (alpha.value.concern == "Endeavor") {
                var alpha_states = arrayify(alpha.value.states)
                var total_states = alpha_states.length;
                total_states_endeavor = total_states_endeavor + total_states;
                total_alpha_endeavor = total_alpha_endeavor + 1;
                alpha_endeavor.push(alpha);
            }
        });
        
        var done_customer = 0;
        var latest_customer = 0;
        var flag_customer = false;
        for (var i = 0; i < total_alpha_customer; i++) {
            var arr_states = arrayify(alpha_customer[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result) {
                    flag_customer = true;
                    done_customer++;
                }
            }
        }

        var done_solution = 0;
        var latest_solution = 0;
        var flag_solution = false;
        for (var i = 0; i < total_alpha_solution; i++) {
            var arr_states = arrayify(alpha_solution[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result) {
                    flag_solution = true;
                    done_solution++;
                }
            }
        }

        var done_endeavor = 0;
        var latest_endeavor = 0;
        var flag_endeavor = false;
        for (var i = 0; i < total_alpha_endeavor; i++) {
            var arr_states = arrayify(alpha_endeavor[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result) {
                    flag_endeavor = true;
                    done_endeavor++;
                }
            }
        }

        var data = [
        ['Customer', (done_customer/total_states_customer) * 100],
        ['Solution', (done_solution/total_states_solution) * 100],
        ['Endeavor', (done_endeavor/total_states_endeavor) * 100]

        ];
        chart = {
        target: 'chart1',
        type: 'BarChart',
        columns: columns,
        rows: data,
        options: {
            'title':'Progress per Alpha',
            'width':400,
            'height':300,
            'hAxis': {
                'viewWindow' : {
                    min: 0,
                    max: 100
                }
            }
        }
    };

    drawChart(chart);
}

function drawAlpha() {
     var columns = [
        ['string', 'Alphas'],
        ['number', 'Progress'],
        ];

        //get data from database for every alphas
        var id = Session.get('project');
        var alphas = Projects.findOne({_id:id}).method.alphas;
        var arr_alphas = arrayify(alphas);
        var count_state = [];
        var count_state_done = [];

        arr_alphas.forEach(function(alpha) {
            var alpha_states = arrayify(alpha.value.states);
            var total_states = alpha_states.length;
            var done_states = 0;
            alpha_states.forEach(function(alpha) {
                if (alpha.value.result) {
                    done_states += 1;
                }
            });
            count_state.push([alpha.name, (done_states/total_states) * 100]);
        });

        var data = count_state;

        chart = {
        target: 'alpha',
        type: 'BarChart',
        columns: columns,
        rows: data,
        options: {
            'title':'Progress per Alpha',
            'width':400,
            'height':300,
            'hAxis': {
                'viewWindow' : {
                    min: 0,
                    max: 100
                },
            }
        }
    };

    drawChart(chart);
}

function drawActivity() {
    document.getElementById("table_activity").innerHTML = "";

    var tbody = document.getElementById('table_activity');

    var html = "<h3>Progress Activity</h3><table><tr><th>Number</th><th>Activity</th><th>Target</th><th>Reality</th><th>Status</th></tr>";
    
    var id = Session.get('project');
    var arr_activityspaces = arrayify(Projects.findOne({_id:id}).method.activityspaces);

    var idx = 1;

    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    arr_activityspaces.forEach(function(activityspace) {
        if (activityspace.value.timestamp != '') {
            var data = "<tr><td>" + idx + "</td>" + "<td>" + activityspace.name + "</td>" + "<td>" + activityspace.value.end_date.getDate() + " " + month[activityspace.value.end_date.getMonth()] + " " + activityspace.value.end_date.getFullYear() + "</td>" + "<td>" + activityspace.value.timestamp.getDate() + " " + month[activityspace.value.timestamp.getMonth()] + " " + activityspace.value.timestamp.getFullYear() + "</td>";
        } else {
            var data = "<tr><td>" + idx + "</td>" + "<td>" + activityspace.name + "</td>" + "<td>" + activityspace.value.end_date.getDate() + " " + month[activityspace.value.end_date.getMonth()] + " " + activityspace.value.end_date.getFullYear() + "</td>" + "<td>" + activityspace.value.timestamp + "</td>";

        }

        // console.log("End Date : " + idx + " : " + activityspace.value.end_date.getTime());
        // console.log("End Date : " + idx + " : " + activityspace.value.timestamp.getTime());
        // var selisih = activityspace.value.end_date.getTime() - activityspace.value.timestamp.getTime();
        // console.log(selisih);
        if (activityspace.value.timestamp == '') {
            data += "<td>Not Done</td></tr>"
        } else {
            if (activityspace.value.end_date <= activityspace.value.timestamp) {
                data += "<td>Late</td></tr>";
            } else {
                data += "<td>Done</td></tr>";
            }
        }
        

        html += data;
        // console.log(tbody.innerHTML);
        idx++;
    });
    html += "</table>";
    tbody.innerHTML = html;
        // for (var i = 0; i < competencies.length; i++) {
        //     var tr = "<li>" + competencies[i].name + "</li>";

        //     console.log(competencies[i]);

        //     /* We add the table row to the table body */
        //     tbody.innerHTML += tr;
        // }
}

function drawSpider() {
    var ctx2 = document.getElementById("myChart2").getContext("2d");
    console.log('ctx2 : ' + ctx2);

    var options2 = {
        //Boolean - Whether to show lines for each scale point
        scaleShowLine: true,

        //Boolean - Whether we show the angle lines out of the radar
        angleShowLineOut: true,

        //Boolean - Whether to show labels on the scale
        scaleShowLabels: false,

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,

        //String - Colour of the angle line
        angleLineColor: "rgba(0,0,0,.1)",

        //Number - Pixel width of the angle line
        angleLineWidth: 1,

        //String - Point label font declaration
        pointLabelFontFamily: "'Arial'",

        //String - Point label font weight
        pointLabelFontStyle: "normal",

        //Number - Point label font size in pixels
        pointLabelFontSize: 10,

        //String - Point label font colour
        pointLabelFontColor: "#666",

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 3,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    }

    var id = Session.get('project');
    var alphas = Projects.findOne({_id:id}).method.alphas;
    var arr_alphas = arrayify(alphas);
    // console.log(arr_alphas)
    var name_state = [];
    var count_state = [];

    arr_alphas.forEach(function(alpha) {
        var alpha_states = arrayify(alpha.value.states);
        var total_states = alpha_states.length;
        var done_states = 0;
        alpha_states.forEach(function(alpha) {
            if (alpha.value.result) {
                done_states += 1;
            }
        });
        name_state.push(alpha.name);
        count_state.push(done_states/total_states);
    });

    // console.log(count_state[][0]);

    var data = count_state;


    var data2 = {
        labels: name_state,
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: count_state
        }]
    };

    var myRadarChart = new Chart(ctx2).Radar(data2, options2);
}

function drawSubalpha() {
     var columns = [
        ['string', 'Subalpha'],
        ['number', 'Progress'],
        ];

        //get data from database for every alphas
        var id = Session.get('project');
        var subalphas = Projects.findOne({_id:id}).subalpha;
        var arr_subalphas = arrayify(subalphas);
        var count_state = [];
        var count_state_done = [];

        arr_subalphas.forEach(function(subalpha) {
            var subalpha_states = arrayify(subalpha.value.states);
            var total_states = subalpha_states.length;
            var done_states = 0;
            subalpha_states.forEach(function(subalpha) {
                if (subalpha.value.result) {
                    done_states += 1;
                }
            });
            count_state.push([subalpha.name, (done_states/total_states) * 100]);
        });

        var data = count_state;

        chart = {
        target: 'subalpha',
        type: 'BarChart',
        columns: columns,
        rows: data,
        options: {
            'title':'Progress per Alpha',
            'width':400,
            'height':300,
            'hAxis': {
                'viewWindow' : {
                    min: 0,
                    max: 100
                },
            }
        }
    };

    drawChart(chart);
}

Template.monitor.events({
	'click': function(){
        console.log("You clicked something");
    },
    'click .bar': function(event) {
       drawConcern();
    },
    'click .activity_bar': function(event) {
       drawActivity();
    },
    'click .alpha': function(event) {
       drawAlpha();
    },
    'click .spider_chart': function(event) {
       drawSpider();
    },
    'click .subalpha': function(event) {
        drawSubalpha();
    }
});
