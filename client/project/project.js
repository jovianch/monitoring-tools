Meteor.subscribe('Projects');
Meteor.subscribe('Methods');
Meteor.subscribe('AllProject');

Template.project.helpers({
    Activities : function() {
        var project = Session.get('project');
        return Projects.findOne({_id:project}).method.activityspaces;
    },
    allMethods : function() {
        return Methods.find().fetch()
    },
    alphas : function() {
        var project = Session.get('project');
        return Projects.findOne({_id:project}).method.alphas;
    },
    workproducts : function() {
        var is_workproducts = Session.get('is_workproducts');
        if (is_workproducts) {
            var project = Session.get('project');
        return arrayify(Projects.findOne({_id:project}).workproducts);
        }
    },
    states_workproduct : function(workproduct) {
        var project = Session.get('project');
        var alpha = Projects.findOne({_id:project}).workproducts[workproduct].alpha;
        var subalpha = Projects.findOne({_id:project}).workproducts[workproduct].subalpha;

        if (subalpha == '') {
            return arrayify(Projects.findOne({_id:project}).method.alphas[alpha].states);
        } else {
            return arrayify(Projects.findOne({_id:project}).subalpha[subalpha].states);
        }
    },
    subalpha_bounded : function(alpha) {
        var project = Session.get('project');
        var subalphas = arrayify(Projects.findOne({_id:project}).method.alphas[alpha].subalphas);
        var arr_subalpha = []
        subalphas.forEach(function(subalpha) {
            console.log(subalpha);
            if (subalpha.value.bound == "1..*") {
                console.log('masuk');
                arr_subalpha.push(subalpha);
            }
        });
        return arr_subalpha;
    },
    is_bounded : function(bound) {
        var project = Session.get('project');
        if (bound == "1..*") {
            return true;
        } else {
            return false;
        }
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

Template.project.events({
    'click .submit' : function(event) {
        var project = Session.get('project');
        var activities = arrayify(Projects.findOne({_id:project}).method.activityspaces);
        activities.forEach(function(activity) {
            var fields = {}
            var appendString = "method.activityspaces." + activity.name + ".end_date";
            var string_activity = "activity" + activity.name;
            if (document.getElementById(string_activity).value == "") {
                var appendString ="method.activityspaces." + activity.name + ".result";
                fields[appendString] = false;
                var appendString ="method.activityspaces." + activity.name + ".timestamp";
                fields[appendString] = "";
                console.log(fields);
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
            } else {
                fields[appendString] = new Date(document.getElementById(string_activity).value);
                var appendString ="method.activityspaces." + activity.name + ".result";
                fields[appendString] = false;
                var appendString ="method.activityspaces." + activity.name + ".timestamp";
                fields[appendString] = "";
                console.log(fields);
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
            }

            var sub_activities = arrayify(Projects.findOne({_id:project}).method.activityspaces[activity.name].activities);
            sub_activities.forEach(function(sub_activity) {
                var fields = {}
                var appendString = "method.activityspaces." + activity.name + ".activities." + sub_activity.name + ".end_date";
                var string_activity = "sub_activity" + sub_activity.name;
                if (document.getElementById(string_activity).value == "") {
                    var appendString ="method.activityspaces." + activity.name + ".activities." + sub_activity.name + ".result";
                    fields[appendString] = false;
                    var appendString ="method.activityspaces." + activity.name + ".activities." + sub_activity.name + ".timestamp";
                    fields[appendString] = "";
                    var id = Session.get('project');
                    console.log(fields);
                    Projects.update({_id:id}, {$set : fields});
                } else {
                    fields[appendString] = new Date(document.getElementById(string_activity).value);
                    var appendString ="method.activityspaces." + activity.name + ".activities." + sub_activity.name + ".result";
                    fields[appendString] = false;
                    var appendString ="method.activityspaces." + activity.name + ".activities." + sub_activity.name + ".timestamp";
                    fields[appendString] = "";
                    var id = Session.get('project');
                    console.log(fields);
                    Projects.update({_id:id}, {$set : fields});
                }
            });
        });

        var workproducts = arrayify(Projects.findOne({_id:project}).workproducts);
        workproducts.forEach(function(workproduct) {
            var fields = {};
            var appendString = "workproducts." + workproduct.name + ".states";
            var e = document.getElementById(workproduct.name);
            var arr_states = [];
            arr_states.push(e.options[e.selectedIndex].value);
            // console.log(arr_states);
            fields[appendString] = arr_states;
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
        });
    },

    'click .submit_workproduct' : function(event) {
        var project = Session.get('project');

        var alphas = arrayify(Projects.findOne({_id:project}).method.alphas);
        alphas.forEach(function(alpha) {
            var subalphas = arrayify(Projects.findOne({_id:project}).method.alphas[alpha.name].subalphas);
            if(subalphas.length > 0) {
                subalphas.forEach(function(subalpha) {
                    var str_subalpha = "subalpha" + subalpha.name;
                    var count_subalpha = document.getElementById(str_subalpha).value;

                    for (var i = 0; i < count_subalpha; i++) {
                        var fields = {};
                        var appendString = "subalpha." + subalpha.name + (i + 1);
                        fields[appendString] = Projects.findOne({_id:project}).method.alphas[alpha.name].subalphas[subalpha.name];
                        var id = Session.get('project');
                        Projects.update({_id:id}, {$set : fields});

                        var str_name = subalpha.name + (i + 1);
                        var arr_states = arrayify(Projects.findOne({_id:project}).subalpha[str_name].states);

                        arr_states.forEach(function(state) {
                            var fields = {};
                            var appendString = "subalpha." + subalpha.name + (i + 1) + ".states." + state.name + ".subalpha";
                            fields[appendString] = subalpha.name + (i + 1);
                            var id = Session.get('project');
                            Projects.update({_id:id}, {$set : fields});
                        });
                    }
                });
            }
        });

        var alphas = arrayify(Projects.findOne({_id:project}).method.alphas);
        alphas.forEach(function(alpha) {
            var workproducts = arrayify(Projects.findOne({_id:project}).method.alphas[alpha.name].workproducts);
            if (workproducts.length > 0) {
                workproducts.forEach(function(workproduct) {
                    var str_workproduct = "workproduct" + workproduct.name;
                    var count_workproduct = document.getElementById(str_workproduct).value;

                    for (var i = 0; i < count_workproduct; i++) {
                        var fields = {};
                        var appendString = "workproducts." + workproduct.name + (i + 1);
                        fields[appendString] = Projects.findOne({_id:project}).method.alphas[alpha.name].workproducts[workproduct.name];
                        var id = Session.get('project');
                        Projects.update({_id:id}, {$set : fields});

                        if (workproduct.value.subalpha == '') {

                        } else {
                            var fields = {};
                            var appendString = "workproducts." + workproduct.name + (i + 1) + ".subalpha";
                            fields[appendString] = workproduct.value.subalpha + (i + 1); 
                            var id = Session.get('project');
                            Projects.update({_id:id}, {$set : fields});
                        }
                    }
                });
            }
        });
        Session.set('is_workproducts', true);

        var element = document.getElementById('after-next');
        element.style.visibility = "visible";
    },

    'click .after_activity' : function(event) {
        var element = document.getElementById('after-activity');
        element.style.visibility = "visible";
    }
});