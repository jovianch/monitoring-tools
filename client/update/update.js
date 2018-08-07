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

Template.update.onCreated(function helloOnCreated() {
    console.log('start');
    var id = Session.get('project');
    var projectAlphas = Projects.findOne({_id:id}).alphas;
    // for (var projectAlpha in projectAlphas) {
    //     for (var state in projectAlpha.states) {
    //         var state = state.name;
    //         $("." + state).css('color', '00FFFF');
    //     }
    // }
});

Template.update.helpers({
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

Template.update.events({
	'click': function(){
        console.log("You clicked something");
    },
    'click .bar': function(event) {
       drawAlpha();
    },
    'click .activity_bar': function(event) {
       drawActivity();
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
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});
        if (project.alphas[alphas].states[states].result) {
            var fields = {}
            var appendString = "alphas." + alphas + ".states." + states + ".result";
            fields[appendString] = false;
            var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
            fields[appendString] = new Date();
            console.log(fields);
        } else {
            var fields = {}
            var appendString = "alphas." + alphas + ".states." + states + ".result";
            fields[appendString] = true;
            var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
            fields[appendString] = new Date();
            console.log(fields)
        }
    	Projects.update({_id:id}, {$set : fields});
        // drawAlpha();
        // drawActivity();
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
        // completionCriteria.forEach(function(entry) {
        //     var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
        //     var states = entry.split('::')[1].replace(/ +/g, "");;
        //     var fields = {}
        //     var appendString = "alphas." + alphas + ".states." + states + ".result";
        //     fields[appendString] = true;
        //     var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
        //     fields[appendString] = new Date();
        //     console.log(fields);
        //     var id = Session.get('project');
        //     Projects.update({_id:id}, {$set : fields});
        //     // console.log(streetaddress);
        // });

        //update activity spaces
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});
        if (project.activityspaces[activity].result) {
            completionCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;
                var fields = {}
                var appendString = "alphas." + alphas + ".states." + states + ".result";
                fields[appendString] = false;
                var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
                // console.log(streetaddress);
            });
            var fields = {}
            var appendString = "activityspaces." + activity + ".result";
            fields[appendString] = false;
            var appendString = "activityspaces." + activity + ".timestamp";
            fields[appendString] = new Date();
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
        } else {
            completionCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;
                var fields = {}
                var appendString = "alphas." + alphas + ".states." + states + ".result";
                fields[appendString] = true;
                var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
                // console.log(streetaddress);
            });
            var fields = {}
            var appendString = "activityspaces." + activity + ".result";
            fields[appendString] = true;
            var appendString = "activityspaces." + activity + ".timestamp";
            fields[appendString] = new Date();
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});  
        }
        

        // drawAlpha();
        // drawActivity();
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
        // completionCriteria.forEach(function(entry) {
        //     var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
        //     var states = entry.split('::')[1].replace(/ +/g, "");;
        //     var fields = {}
        //     var appendString = "alphas." + alphas + ".states." + states + ".result";
        //     fields[appendString] = true;
        //     var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
        //     fields[appendString] = new Date();
        //     console.log(fields);
        //     Projects.update({_id:id}, {$set : fields});
        //     // console.log(streetaddress);
        // });

        //update activities -> ubah format
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});
        console.log(project.activityspaces[activity_spaces].activities[activity].result);
        if (project.activityspaces[activity_spaces].activities[activity].result) {
            completionCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;
                var fields = {}
                var appendString = "alphas." + alphas + ".states." + states + ".result";
                fields[appendString] = false;
                var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
                // console.log(streetaddress);
            });
            var fields = {}
            var appendString = "activityspaces." + activity_spaces + ".activities." + activity + ".result";
            fields[appendString] = false;
            var appendString = "activityspaces." + activity_spaces + ".activities." + activity + ".timestamp";
            fields[appendString] = new Date();
            console.log(fields);
            Projects.update({_id:id}, {$set : fields});
        } else {
            completionCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;
                var fields = {}
                var appendString = "alphas." + alphas + ".states." + states + ".result";
                fields[appendString] = true;
                var appendString = "alphas." + alphas + ".states." + states + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
                // console.log(streetaddress);
            });
            var fields = {}
            var appendString = "activityspaces." + activity_spaces + ".activities." + activity + ".result";
            fields[appendString] = true;
            var appendString = "activityspaces." + activity_spaces + ".activities." + activity + ".timestamp";
            fields[appendString] = new Date();
            Projects.update({_id:id}, {$set : fields});
        }

        // drawAlpha();
        // drawActivity();
    },

    'mouseenter .states':function(event) {
        // console.log('mouseenter');
        document.getElementById("checklist").innerHTML = "";
        Session.set('checklist', event.currentTarget.id);
        var states = Session.get('checklist');
        // console.log('states : ' + states);
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var string_alphas = 'alpha' + states;
        // console.log('string_alphas : ' + string_alphas);
        var alphas = document.getElementById(string_alphas).value;
        alphas = alphas.replace(/\s/g,'');
        var checklist = project.alphas[alphas].states[states].checklists;
        // console.log(checklist);

        var tbody = document.getElementById('checklist');

        var arr_checklist = arrayify(checklist);
        // console.log(arr_checklist);

        for (var i = 0; i < arr_checklist.length; i++) {
            var tr = "<li>" + arr_checklist[i].name + "</li>";

            console.log(arr_checklist[i]);

            /* We add the table row to the table body */
            tbody.innerHTML += tr;
        }
        // document.getElementById("checklist").innerHTML=
        // ""
        // "";
    },

    // if click checklist
    'click .checklists': function(event) {
        Session.set('checklist', event.currentTarget.id);
        var checklist = Session.get('checklist');
        var id = Session.get('project');

        var project = Projects.findOne({_id:id});

        // var value = project.alphas.({}).states.({}).checklists[checklist];
        // console.log(value);
    },

    'click .workproduct': function(event) {
        console.log('Work Product clicked');
        Session.set('workproduct', event.currentTarget.id);
        var workproduct = Session.get('workproduct');
        console.log(workproduct);
        string_workproduct = 'workproduct' + workproduct;
        var alpha = document.getElementById(string_workproduct).value;
        console.log(alpha);

        var id = Session.get('project')
        var project = Projects.findOne({_id:id});

        var states = project.alphas[alpha].workproducts[workproduct].states;
        console.log(states);
        states.forEach(function(entry) {
                var fields = {}
                var appendString = "alphas." + alpha + ".states." + entry + ".result";
                fields[appendString] = true;
                var appendString = "alphas." + alpha + ".states." + entry + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
                // console.log(streetaddress);
            });
        // console.log(activity);
        // var completionCriteria = activity + ".completioncriteria";
        // var project = Projects.findOne();
        // var completionCriteria = project.activityspaces[activity].completioncriteria;
        // // var completionCriteriaStr = 'project.activityspaces.' + activity + '.completioncriteria';
        // // console.log(typeof(completionCriteriaStr));
        // // var completionCriteria = JSON.parse(completionCriteriaStr);
        // console.log(completionCriteria);
    }
});