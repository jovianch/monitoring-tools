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
        return Projects.findOne().activityspaces
    }
});

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});

Template.monitor.events({
	'click': function(){
        console.log("You clicked something");
    },
    'click .alphas': function(event) {
    	Session.set('states', event.currentTarget.id);
    	var states = Session.get('states');
        $("." + states).css('visibility', 'hidden');
    },
    'click .states': function(event) {
    	Session.set('states', event.currentTarget.id);
        var alphas = document.getElementById('alphas').value;
        console.log(alphas);
    	var states = Session.get('states');
    	var fields = {}
    	var appendString = "alphas." + alphas + ".states." + states + ".result";
    	fields[appendString] = "true";
        var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
        fields[appendString] = new Date();
    	// console.log(fields);
    	Projects.update({_id:"bNkP9pQLQTvocamnS"}, {$set : fields});
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
            Projects.update({_id:"bNkP9pQLQTvocamnS"}, {$set : fields});
            // console.log(streetaddress);
        });

        //update activity spaces
        var fields = {}
        var appendString = "activityspaces." + activity + ".result";
        fields[appendString] = "true";
        var appendString = "activityspaces." + activity + ".timestamp";
        fields[appendString] = new Date();
        Projects.update({_id:"bNkP9pQLQTvocamnS"}, {$set : fields});
    },

    //if click activities
    'click .activities': function(event) {
        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        // console.log(activity);
        var activity_spaces = "CoordinateActivity";
        // console.log(activity_spaces);
        // var completionCriteria = activity + ".completioncriteria";
        var project = Projects.findOne();
        var activities = project.activityspaces[activity_spaces].activities;
        // console.log(activities.length);
        var idx;
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].name = "Daily Scrum") {
                idx = i;
            }
        }
        // console.log(idx);
        var completionCriteria = activities[idx].completioncriteria;
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
            Projects.update({_id:"bNkP9pQLQTvocamnS"}, {$set : fields});
            // console.log(streetaddress);
        });

        //update activities -> ubah format
        var fields = {}
        var appendString = "activityspaces.CoordinateActivity.activities[" + idx + "].result";
        fields[appendString] = "true";
        var appendString = "activityspaces.CoordinateActivity.activities[" + idx + "].timestamp";
        fields[appendString] = new Date();
        Projects.update({_id:"bNkP9pQLQTvocamnS"}, {$set : fields});
    }

});

Meteor.startup(function () {

    chart = {
      target: 'chart1',
      type: 'BarChart',
      columns: [
        ['string', 'Topping'],
        ['number', 'Slices']
      ],
      rows: [
        ['Mushrooms', 3],
        ['Onions', 1],
        ['Olives', 1],
        ['Zucchini', 1],
        ['Pepperoni', 2]
      ],
      options: {
        'title':'How Much Pizza I Ate Last Night',
        'width':400,
        'height':300
      }
    };

    drawChart(chart);
});