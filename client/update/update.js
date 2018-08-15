Meteor.subscribe('Projects');

Template.update.onCreated(function helloOnCreated() {
    console.log('start');
    var id = Session.get('project');
    var projectAlphas = Projects.findOne({_id:id}).alphas;
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
        var arr_states = arrayify(project.alphas[alphas].states);
        
        var idx_states = 0;
        var i = 0;
        var is_states = false;
        while (!(is_states)) {
            if (arr_states[i].name === project.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                idx_states = i + 1;
                is_states = true;
            }
            i++;
        }

        console.log('idx_states : ' + idx_states);
        if (project.alphas[alphas].states[states].result) {
            for (var j = arr_states.length; j >= idx_states; j--) {
                var fields = {}
                var appendString = "alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
                fields[appendString] = false;
                var appendString = "alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields)
                Projects.update({_id:id}, {$set : fields});
            }
        } else {
            for (var j = 0; j < idx_states; j++) {
                var fields = {}
                var appendString = "alphas." + alphas + ".states." + arr_states[j].name + ".result";
                fields[appendString] = true;
                var appendString = "alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
            }
        }
    },
    'click .activity_spaces': function(event) {
        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        console.log(activity);
        var project = Projects.findOne();
        var completionCriteria = project.activityspaces[activity].completioncriteria;
        console.log(completionCriteria);

        //update activity spaces
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});

        if (project.activityspaces[activity].result) {
            completionCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;

                var arr_states = arrayify(project.alphas[alphas].states);
                var idx_states = 0;
                var i = 0;
                var is_states = false;
                while (!(is_states)) {
                    if (arr_states[i].name === project.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                        idx_states = i + 1;
                        is_states = true;
                    }
                    i++;
                }

                for (var j = arr_states.length; j >= idx_states; j--) {   
                    var fields = {}
                    var appendString = "alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
                    fields[appendString] = false;
                    var appendString = "alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
                    fields[appendString] = new Date();
                    console.log(fields);
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }
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

                var arr_states = arrayify(project.alphas[alphas].states);
                // console.log(arr_states);
                var idx_states = 0;
                var i = 0;
                var is_states = false;
                while (!(is_states)) {
                    if (arr_states[i].name === project.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                        idx_states = i + 1;
                        is_states = true;
                    }
                    i++;
                }

                for (var j = 0; j < idx_states; j++) {
                    var fields = {}
                    var appendString = "alphas." + alphas + ".states." + arr_states[j].name + ".result";
                    fields[appendString] = true;
                    var appendString = "alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
                    fields[appendString] = new Date();
                    console.log(fields);
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                    // console.log(streetaddress);
                }
            });
            var fields = {}
            var appendString = "activityspaces." + activity + ".result";
            fields[appendString] = true;
            var appendString = "activityspaces." + activity + ".timestamp";
            fields[appendString] = new Date();
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});  
        }
    },

    //if click activities
    'click .activities': function(event) {
        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        console.log(activity);
        string_activity = 'activity_spaces' + activity;
        var activity_spaces = document.getElementById(string_activity).value;
        console.log(activity_spaces);
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var activities = project.activityspaces[activity_spaces].activities;
        console.log(activities);
        var completionCriteria = activities[activity].completioncriteria;
        console.log(completionCriteria);

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
            });
            var fields = {}
            var appendString = "activityspaces." + activity_spaces + ".activities." + activity + ".result";
            fields[appendString] = true;
            var appendString = "activityspaces." + activity_spaces + ".activities." + activity + ".timestamp";
            fields[appendString] = new Date();
            Projects.update({_id:id}, {$set : fields});
        }
    },

    'mouseenter .states':function(event) {
        document.getElementById("checklist").innerHTML = "";
        Session.set('checklist', event.currentTarget.id);
        var states = Session.get('checklist');
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var string_alphas = 'alpha' + states;
        var alphas = document.getElementById(string_alphas).value;
        alphas = alphas.replace(/\s/g,'');
        var checklist = project.alphas[alphas].states[states].checklists;

        var tbody = document.getElementById('checklist');

        var arr_checklist = arrayify(checklist);
        tbody.innerHTML = "<h3>Checklists</h3>";

        for (var i = 0; i < arr_checklist.length; i++) {
            var tr = "<li>" + arr_checklist[i].name + "</li>";

            /* We add the table row to the table body */
            tbody.innerHTML += tr;
        }
    },

    // if click checklist
    'click .checklists': function(event) {
        Session.set('checklist', event.currentTarget.id);
        var checklist = Session.get('checklist');
        var id = Session.get('project');

        var project = Projects.findOne({_id:id});
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

        if (project.alphas[alpha].workproducts[workproduct].result) {
            states.forEach(function(entry) {
                var fields = {}
                var appendString = "alphas." + alpha + ".states." + entry + ".result";
                fields[appendString] = false;
                var appendString = "alphas." + alpha + ".states." + entry + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
            });

            var fields = {}
            var appendString = "alphas." + alpha + ".workproducts." + workproduct + ".result";
            fields[appendString] = false;
            var appendString = "alphas." + alpha + ".workproducts." + workproduct + ".timestamp";
            fields[appendString] = new Date();
            Projects.update({_id:id}, {$set : fields});
        } else {
            states.forEach(function(entry) {
                var fields = {}
                var appendString = "alphas." + alpha + ".states." + entry + ".result";
                fields[appendString] = true;
                var appendString = "alphas." + alpha + ".states." + entry + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
            });

            var fields = {}
            var appendString = "alphas." + alpha + ".workproducts." + workproduct + ".result";
            fields[appendString] = true;
            var appendString = "alphas." + alpha + ".workproducts." + workproduct + ".timestamp";
            fields[appendString] = new Date();
            Projects.update({_id:id}, {$set : fields});
        }
    },

    'mouseenter .activities':function(event) {
        document.getElementById("checklist").innerHTML = "";

        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        string_activity = 'activity_spaces' + activity;
        var activity_spaces = document.getElementById(string_activity).value;
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var competencies = project.activityspaces[activity_spaces].activities[activity].competencies;

        var tbody = document.getElementById('checklist');

        tbody.innerHTML = "<h3>Competencies</h3>";

        for (var i = 0; i < competencies.length; i++) {
            var tr = "<li>" + competencies[i].name + "</li>";

            console.log(competencies[i]);

            /* We add the table row to the table body */
            tbody.innerHTML += tr;
        }
    },
});