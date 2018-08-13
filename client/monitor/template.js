Meteor.subscribe('Projects');
// Meteor.subscribe('Alphas');

// Template.monitor.projects = function() {
// 	return Projects.find();
// };

// Template.monitor.alphas = function() {
// 	// console.log(Projects.findOne({_id:"CyctMixX7iiThhNvW"}));
// 	var projects = Projects.find({_id:"CyctMixX7iiThhNvW"});
// 	return projects.alphas;
// };

Template.monitor.helpers({
	alphas : function() {
        var id = Session.get('project');
		return Projects.findOne({_id:id}).alphas
	},
    activities : function() {
        var id = Session.get('project');
        return Projects.findOne({_id:id}).activityspaces
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
        var alphas = Projects.findOne({_id:id}).alphas;
        var arr_alphas = arrayify(alphas);
        // console.log(arr_alphas)
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
                // console.log(total_customer);
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
        
        var id_customer = 0;
        var latest_customer = 0;
        var flag_customer = false;
        for (var i = 0; i < total_alpha_customer; i++) {
            var arr_states = arrayify(alpha_customer[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result) {
                    flag_customer = true;
                    id_customer = latest_customer + j + 1;
                }

                if (j == arr_states.length - 1) {
                    latest_customer = latest_customer + arr_states.length;
                }
            }
        }

        var id_solution = 0;
        var latest_solution = 0;
        var flag_solution = false;
        // console.log(alpha_solution);
        for (var i = 0; i < total_alpha_solution; i++) {
            var arr_states = arrayify(alpha_solution[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result) {
                    flag_solution = true;
                    id_solution = latest_solution + j + 1;
                }

                if (j == arr_states.length - 1) {
                    latest_solution = latest_solution + arr_states.length;
                }
            }
        }

        var id_endeavor = 0;
        var latest_endeavor = 0;
        var flag_endeavor = false;
        for (var i = 0; i < total_alpha_endeavor; i++) {
            var arr_states = arrayify(alpha_endeavor[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result) {
                    flag_endeavor = true;
                    id_endeavor = latest_endeavor + j + 1;
                }

                if (j == arr_states.length - 1) {
                    latest_endeavor = latest_endeavor + arr_states.length;
                }
            }
        }
        console.log(id_endeavor);

        var data = [
        ['Customer', id_customer/total_states_customer],
        ['Solution', id_solution/total_states_solution],
        ['Endeavor', id_endeavor/total_states_endeavor]

        ];
        chart = {
      target: 'chart1',
      type: 'BarChart',
      columns: columns,
      rows: data,
      options: {
        'title':'Progress per Alpha',
        'width':400,
        'height':300
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
        var alphas = Projects.findOne({_id:id}).alphas;
        var arr_alphas = arrayify(alphas);
        // console.log(arr_alphas)
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
            count_state.push([alpha.name, done_states/total_states]);
        });

        console.log(count_state);

        var data = count_state;

        chart = {
      target: 'alpha',
      type: 'BarChart',
      columns: columns,
      rows: data,
      options: {
        'title':'Progress per Alpha',
        'width':400,
        'height':300
      }
    };

    drawChart(chart);
}

function drawActivity() {
     var columns = [
        ['string', 'Alphas'],
        ['number', 'Progress'],
        ];

        //get data from database for every alphas
        var id = Session.get('project');
        var alphas = Projects.findOne({_id:id}).alphas;
        var arr_alphas = arrayify(alphas);
        // console.log(arr_alphas)
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
                // console.log(total_customer);
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
        
        var id_customer = 0;
        var latest_customer = 0;
        var flag_customer = false;
        for (var i = 0; i < total_alpha_customer; i++) {
            var arr_states = arrayify(alpha_customer[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result == "true") {
                    flag_customer = true;
                    id_customer = latest_customer + j + 1;
                }

                if (j == arr_states.length - 1) {
                    latest_customer = latest_customer + arr_states.length;
                }
            }
        }

        var id_solution = 0;
        var latest_solution = 0;
        var flag_solution = false;
        // console.log(alpha_solution);
        for (var i = 0; i < total_alpha_solution; i++) {
            var arr_states = arrayify(alpha_solution[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result == "true") {
                    flag_solution = true;
                    id_solution = latest_solution + j + 1;
                }

                if (j == arr_states.length - 1) {
                    latest_solution = latest_solution + arr_states.length;
                }
            }
        }

        var id_endeavor = 0;
        var latest_endeavor = 0;
        var flag_endeavor = false;
        for (var i = 0; i < total_alpha_endeavor; i++) {
            var arr_states = arrayify(alpha_endeavor[i].value.states);
            for (var j = 0; j < arr_states.length; j++) {
                if (arr_states[j].value.result == "true") {
                    flag_endeavor = true;
                    id_endeavor = latest_endeavor + j + 1;
                }

                if (j == arr_states.length - 1) {
                    latest_endeavor = latest_endeavor + arr_states.length;
                }
            }
        }
        console.log(id_endeavor);

        var data = [
        ['Customer', id_customer/total_states_customer],
        ['Solution', id_solution/total_states_solution],
        ['Endeavor', id_endeavor/total_states_endeavor]

        ];
        chart = {
      target: 'chart2',
      type: 'PieChart',
      columns: columns,
      rows: data,
      options: {
        'title':'Progress per Alpha',
        'width':400,
        'height':300
      }
    };

    drawChart(chart);
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
    var alphas = Projects.findOne({_id:id}).alphas;
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
    'click .alphas': function(event) {
    	Session.set('states', event.currentTarget.id);
    	var states = Session.get('states');
        $("." + states).css('visibility', 'hidden');
    },
    'click .states': function(event) {
    	Session.set('states', event.currentTarget.id);
    	var states = Session.get('states');
        var string_alphas = 'alpha' + states;
        var alphas = document.getElementById(string_alphas).value;
        alphas = alphas.replace(/\s/g,'');
    	var fields = {}
    	var appendString = "alphas." + alphas + ".states." + states + ".result";
    	fields[appendString] = "true";
        var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
        fields[appendString] = new Date();
        console.log(fields)
        var id = Session.get('project')
    	Projects.update({_id:id}, {$set : fields});
        drawAlpha();
        drawActivity();
    },
    'click .activity_spaces': function(event) {
        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        console.log(activity);
        // console.log(activity);
        // var completionCriteria = activity + ".completioncriteria";
        var project = Projects.findOne();
        var completionCriteria = project.activityspaces[activity].completioncriteria;
        // var completionCriteriaStr = 'project.activityspaces.' + activity + '.completioncriteria';
        // console.log(typeof(completionCriteriaStr));
        // var completionCriteria = JSON.parse(completionCriteriaStr);
        console.log(completionCriteria);
        //update alpha completion criteria
        completionCriteria.forEach(function(entry) {
            var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
            var states = entry.split('::')[1].replace(/ +/g, "");;
            var fields = {}
            var appendString = "alphas." + alphas + ".states." + states + ".result";
            fields[appendString] = "true";
            var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
            fields[appendString] = new Date();
            console.log(fields);
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
            // console.log(streetaddress);
        });

        //update activity spaces
        var fields = {}
        var appendString = "activityspaces." + activity + ".result";
        fields[appendString] = "true";
        var appendString = "activityspaces." + activity + ".timestamp";
        fields[appendString] = new Date();
        var id = Session.get('project');
        Projects.update({_id:id}, {$set : fields});

        drawAlpha();
        drawActivity();
    },

    //if click activities
    'click .activities': function(event) {
        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        console.log(activity);
        string_activity = 'activity_spaces' + activity;
        var activity_spaces = document.getElementById(string_activity).value;
        console.log(activity_spaces);
        // var activity_spaces = "CoordinateActivity";
        // console.log(activity_spaces);
        // var completionCriteria = activity + ".completioncriteria";
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var activities = project.activityspaces[activity_spaces].activities;
        console.log(activities);
        // console.log(activities.length);
        // var idx;
        // for (var i = 0; i < activities.length; i++) {
        //     if (activities[i].name = "Daily Scrum") {
        //         idx = i;
        //     }
        // }
        // console.log(idx);
        var completionCriteria = activities[activity].completioncriteria;
        // var completionCriteriaStr = 'project.activityspaces.' + activity + '.completioncriteria';
        // console.log(typeof(completionCriteriaStr));
        // var completionCriteria = JSON.parse(completionCriteriaStr);
        console.log(completionCriteria);
        //update alpha completion criteria
        completionCriteria.forEach(function(entry) {
            var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
            var states = entry.split('::')[1].replace(/ +/g, "");;
            var fields = {}
            var appendString = "alphas." + alphas + ".states." + states + ".result";
            fields[appendString] = "true";
            var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
            fields[appendString] = new Date();
            console.log(fields);
            Projects.update({_id:id}, {$set : fields});
            // console.log(streetaddress);
        });

        //update activities -> ubah format
        var fields = {}
        var appendString = "activityspaces.CoordinateActivity.activities." + activity + ".result";
        fields[appendString] = "true";
        var appendString = "activityspaces.CoordinateActivity.activities." + activity + ".timestamp";
        fields[appendString] = new Date();
        Projects.update({_id:id}, {$set : fields});

        drawAlpha();
        drawActivity();
    },

    // if click checklist
    'click .checklists': function(event) {
        Session.set('checklist', event.currentTarget.id);
        var checklist = Session.get('checklist');
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});

        // var value = project.alphas.({}).states.({}).checklists[checklist];
        // console.log(value);
    }
});
