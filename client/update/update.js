Meteor.subscribe('Projects');

Template.update.onCreated(function helloOnCreated() {
    console.log('start');
    var id = Session.get('project');
    var projectAlphas = Projects.findOne({_id:id}).method.alphas;
});

Template.update.helpers({
	alphas : function() {
        var id = Session.get('project');
		return Projects.findOne({_id:id}).method.alphas
	},
    activities : function() {
        var id = Session.get('project');
        return Projects.findOne({_id:id}).method.activityspaces
    },
    // is_subalpha : function(alpha) {
    //     var arr_subalpha = arrayify(alpha.subalphas);
    //     if (arr_subalpha.length > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
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
        console.log(string_alphas);
        var alphas = document.getElementById(string_alphas).value;
        alphas = alphas.replace(/\s/g,'');
        console.log('alphas : ' + alphas);
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});

        // var arr_subalpha = arrayify(project.method.alphas[alphas].subalphas);
        // if (arr_subalpha.length > 0) {
        //     var string_subalpha = 'subalpha' + states;
        //     var subalpha = document.getElementById(string_subalpha).value;
        //     subalpha = subalpha.replace(/\s/g,'');
        //     var arr_states = arrayify(project.alphas[alphas].subalphas[subalpha].states);
        
        //     var idx_states = 0;
        //     var i = 0;
        //     var is_states = false;
        //     while (!(is_states)) {
        //         if (arr_states[i].name.replace(/\s/g,'') === project.alphas[alphas].subalphas[subalpha].states[states].name.replace(/\s/g,'')) {
        //             idx_states = i + 1;
        //             is_states = true;
        //         }
        //         i++;
        //     }

        //     var arr_activity_spaces = arrayify(project.activityspaces);

        //     console.log('idx_states : ' + idx_states);
        //     if (project.alphas[alphas].subalphas[subalpha].states[states].result) {
        //         for (var j = arr_states.length; j >= idx_states; j--) {
        //             var fields = {}
        //             var appendString = "method.alphas." + alphas + ".subalphas." + subalpha + ".states." + arr_states[j-1].name + ".result";
        //             fields[appendString] = false;
        //             var appendString = "method.alphas." + alphas + ".subalphas." + subalpha + ".states." + arr_states[j-1].name + ".timestamp";
        //             fields[appendString] = new Date();
        //             console.log(fields)
        //             Projects.update({_id:id}, {$set : fields});
        //         }
        //     } else {
        //         for (var j = 0; j < idx_states; j++) {
        //             var fields = {}
        //             var appendString = "method.alphas." + alphas + ".subalphas." + subalpha + ".states." + arr_states[j].name + ".result";
        //             fields[appendString] = true;
        //             var appendString = "method.alphas." + alphas + ".subalphas." + subalpha + ".states." + arr_states[j].name + ".timestamp";
        //             fields[appendString] = new Date();
        //             console.log(fields);
        //             Projects.update({_id:id}, {$set : fields});
        //             // console.log(project)
        //         }
        //     }

        //     //INI BELUM
        //     arr_activity_spaces.forEach(function(activity_space) {
        //         var completion_criterias = activity_space.value.completioncriteria;
        //         var is_complete = true;
        //         var id = Session.get('project');
        //         var project = Projects.findOne({_id:id});
        //         // console.log("activity_space : " + activity_space.name);
        //         completion_criterias.forEach(function(completion_criteria) {
        //             var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
        //             var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
        //             // console.log("alphas : " + alphas);
        //             // console.log("states : " + states);
        //             // console.log(project.alphas[alphas].states[states].result);
        //             if (project.method.alphas[alphas].states[states].result) {
        //                 is_complete = is_complete && true;
        //             } else {
        //                 is_complete = is_complete && false;
        //             }
        //         });
        //         // console.log(is_complete);
        //         if (is_complete) {
        //             var fields = {}
        //             var appendString = "method.activityspaces." + activity_space.name + ".result";
        //             fields[appendString] = true;
        //             var appendString = "method.activityspaces." + activity_space.name + ".timestamp";
        //             fields[appendString] = new Date();
        //             var id = Session.get('project');
        //             Projects.update({_id:id}, {$set : fields});
        //         } else {
        //             var fields = {}
        //             var appendString = "method.activityspaces." + activity_space.name + ".result";
        //             fields[appendString] = false;
        //             var appendString = "method.activityspaces." + activity_space.name + ".timestamp";
        //             fields[appendString] = new Date();
        //             var id = Session.get('project');
        //             Projects.update({_id:id}, {$set : fields});
        //         }

        //         var arr_activities = arrayify(activity_space.value.activities);
        //         arr_activities.forEach(function(activity) {
        //             var completion_criterias = activity.value.completioncriteria;
        //             var is_complete = true;
        //             var id = Session.get('project');
        //             var project = Projects.findOne({_id:id});
        //             // console.log("activity_space : " + activity_space.name);
        //             completion_criterias.forEach(function(completion_criteria) {
        //                 var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
        //                 var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
        //                 // console.log("alphas : " + alphas);
        //                 // console.log("states : " + states);
        //                 // console.log(project.alphas[alphas].states[states].result);
        //                 if (project.method.alphas[alphas].states[states].result) {
        //                     is_complete = is_complete && true;
        //                 } else {
        //                     is_complete = is_complete && false;
        //                 }
        //             });
        //             // console.log(is_complete);
        //             if (is_complete) {
        //                 var fields = {}
        //                 var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".result";
        //                 fields[appendString] = true;
        //                 var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".timestamp";
        //                 fields[appendString] = new Date();
        //                 var id = Session.get('project');
        //                 Projects.update({_id:id}, {$set : fields});
        //             } else {
        //                 var fields = {}
        //                 var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".result";
        //                 fields[appendString] = false;
        //                 var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".timestamp";
        //                 fields[appendString] = new Date();
        //                 var id = Session.get('project');
        //                 Projects.update({_id:id}, {$set : fields});
        //             }
        //         });
        //     });
        // } else {
            var arr_states = arrayify(project.method.alphas[alphas].states);
        
            var idx_states = 0;
            var i = 0;
            var is_states = false;
            while (!(is_states)) {
                if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                    idx_states = i + 1;
                    is_states = true;
                }
                i++;
            }

            var arr_activity_spaces = arrayify(project.method.activityspaces);

            console.log('idx_states : ' + idx_states);
            if (project.method.alphas[alphas].states[states].result) {
                for (var j = arr_states.length; j >= idx_states; j--) {
                    var fields = {}
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
                    fields[appendString] = false;
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
                    fields[appendString] = new Date();
                    console.log(fields)
                    Projects.update({_id:id}, {$set : fields});
                }
            } else {
                for (var j = 0; j < idx_states; j++) {
                    var fields = {}
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".result";
                    fields[appendString] = true;
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
                    fields[appendString] = new Date();
                    console.log(fields);
                    Projects.update({_id:id}, {$set : fields});
                    // console.log(project)
                }
            }

            arr_activity_spaces.forEach(function(activity_space) {
                var completion_criterias = activity_space.value.completioncriteria;
                var is_complete = true;
                var id = Session.get('project');
                var project = Projects.findOne({_id:id});
                // console.log("activity_space : " + activity_space.name);
                completion_criterias.forEach(function(completion_criteria) {
                    var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                    var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
                    // console.log("alphas : " + alphas);
                    // console.log("states : " + states);
                    // console.log(project.alphas[alphas].states[states].result);
                    if (project.method.alphas[alphas].states[states].result) {
                        is_complete = is_complete && true;
                    } else {
                        is_complete = is_complete && false;
                    }
                });
                // console.log(is_complete);
                if (is_complete) {
                    var fields = {}
                    var appendString = "method.activityspaces." + activity_space.name + ".result";
                    fields[appendString] = true;
                    var appendString = "method.activityspaces." + activity_space.name + ".timestamp";
                    fields[appendString] = new Date();
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                } else {
                    var fields = {}
                    var appendString = "method.activityspaces." + activity_space.name + ".result";
                    fields[appendString] = false;
                    var appendString = "method.activityspaces." + activity_space.name + ".timestamp";
                    fields[appendString] = new Date();
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }

                var arr_activities = arrayify(activity_space.value.activities);
                arr_activities.forEach(function(activity) {
                    var completion_criterias = activity.value.completioncriteria;
                    var is_complete = true;
                    var id = Session.get('project');
                    var project = Projects.findOne({_id:id});
                    // console.log("activity_space : " + activity_space.name);
                    completion_criterias.forEach(function(completion_criteria) {
                        var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                        var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
                        // console.log("alphas : " + alphas);
                        // console.log("states : " + states);
                        // console.log(project.alphas[alphas].states[states].result);
                        if (project.method.alphas[alphas].states[states].result) {
                            is_complete = is_complete && true;
                        } else {
                            is_complete = is_complete && false;
                        }
                    });
                    // console.log(is_complete);
                    if (is_complete) {
                        var fields = {}
                        var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".result";
                        fields[appendString] = true;
                        var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".timestamp";
                        fields[appendString] = new Date();
                        var id = Session.get('project');
                        Projects.update({_id:id}, {$set : fields});
                    } else {
                        var fields = {}
                        var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".result";
                        fields[appendString] = false;
                        var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".timestamp";
                        fields[appendString] = new Date();
                        var id = Session.get('project');
                        Projects.update({_id:id}, {$set : fields});
                    }
                });
            });
        // }
        
    },
    'click .activity_spaces': function(event) {
        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        console.log(activity);
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var completionCriteria = project.method.activityspaces[activity].completioncriteria;
        var entryCriteria = project.method.activityspaces[activity].entrycriteria;
        console.log(completionCriteria);

        //update activity spaces
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});

        if (project.method.activityspaces[activity].result) {
            completionCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;

                var arr_states = arrayify(project.method.alphas[alphas].states);
                var idx_states = 0;
                var i = 0;
                var is_states = false;
                while (!(is_states)) {
                    if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                        idx_states = i + 1;
                        is_states = true;
                    }
                    i++;
                }

                for (var j = arr_states.length; j >= idx_states; j--) {   
                    var fields = {}
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
                    fields[appendString] = false;
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
                    fields[appendString] = new Date();
                    console.log(fields);
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }
            });
            var fields = {}
            var appendString = "method.activityspaces." + activity + ".result";
            fields[appendString] = false;
            var appendString = "method.activityspaces." + activity + ".timestamp";
            fields[appendString] = new Date();
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
        } else {
            var is_complete = true;
            entryCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;

                var arr_states = arrayify(project.method.alphas[alphas].states);
                
                if (project.method.alphas[alphas].states[states].result) {
                    is_complete = is_complete && true;
                } else {
                    is_complete = is_complete && false;
                }
            });

            if (is_complete) {
                completionCriteria.forEach(function(entry) {
                    var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                    var states = entry.split('::')[1].replace(/ +/g, "");;

                    var arr_states = arrayify(project.method.alphas[alphas].states);
                    // console.log(arr_states);
                    var idx_states = 0;
                    var i = 0;
                    var is_states = false;
                    while (!(is_states)) {
                        if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                            idx_states = i + 1;
                            is_states = true;
                        }
                        i++;
                    }

                    for (var j = 0; j < idx_states; j++) {
                        var fields = {}
                        var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".result";
                        fields[appendString] = true;
                        var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
                        fields[appendString] = new Date();
                        console.log(fields);
                        var id = Session.get('project');
                        Projects.update({_id:id}, {$set : fields});
                        // console.log(streetaddress);
                    }
                });
                var fields = {}
                var appendString = "method.activityspaces." + activity + ".result";
                fields[appendString] = true;
                var appendString = "method.activityspaces." + activity + ".timestamp";
                fields[appendString] = new Date();
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields}); 
            } else {
                alert("Cannot do this Activity!");
            }
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
        var activities = project.method.activityspaces[activity_spaces].activities;
        console.log(activities);
        var completionCriteria = activities[activity].completioncriteria;
        var entryCriteria = activities[activity].entrycriteria;

        console.log(completionCriteria);

        //update activities -> ubah format
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});
        console.log(project.method.activityspaces[activity_spaces].activities[activity].result);
        if (project.method.activityspaces[activity_spaces].activities[activity].result) {
            completionCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;

                var arr_states = arrayify(project.method.alphas[alphas].states);
                var idx_states = 0;
                var i = 0;
                var is_states = false;
                while (!(is_states)) {
                    if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                        idx_states = i + 1;
                        is_states = true;
                    }
                    i++;
                }

                for (var j = arr_states.length; j >= idx_states; j--) {   
                    var fields = {}
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
                    fields[appendString] = false;
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
                    fields[appendString] = new Date();
                    console.log(fields);
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }
            });
            var fields = {}
            var appendString = "method.activityspaces." + activity_spaces + ".activities." + activity + ".result";
            fields[appendString] = false;
            var appendString = "method.activityspaces." + activity_spaces + ".activities." + activity + ".timestamp";
            fields[appendString] = new Date();
            console.log(fields);
            Projects.update({_id:id}, {$set : fields});
        } else {
            var is_complete = true;
            entryCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;

                var arr_states = arrayify(project.method.alphas[alphas].states);
                
                if (project.method.alphas[alphas].states[states].result) {
                    is_complete = is_complete && true;
                } else {
                    is_complete = is_complete && false;
                }
            });

            if (is_complete) {
                completionCriteria.forEach(function(entry) {
                    var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                    var states = entry.split('::')[1].replace(/ +/g, "");;

                    var arr_states = arrayify(project.method.alphas[alphas].states);
                    // console.log(arr_states);
                    var idx_states = 0;
                    var i = 0;
                    var is_states = false;
                    while (!(is_states)) {
                        if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                            idx_states = i + 1;
                            is_states = true;
                        }
                        i++;
                    }

                    for (var j = 0; j < idx_states; j++) {
                        var fields = {}
                        var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".result";
                        fields[appendString] = true;
                        var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
                        fields[appendString] = new Date();
                        console.log(fields);
                        var id = Session.get('project');
                        Projects.update({_id:id}, {$set : fields});
                        // console.log(streetaddress);
                    }
                });
                var fields = {}
                var appendString = "method.activityspaces." + activity_spaces + ".activities." + activity + ".result";
                fields[appendString] = true;
                var appendString = "method.activityspaces." + activity_spaces + ".activities." + activity + ".timestamp";
                fields[appendString] = new Date();
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields}); 
            } else {
                alert("Cannot do this Activity!");
            }
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

        // var arr_subalpha = arrayify(project.method.alphas[alphas].subalphas);
        // if (arr_subalpha.length > 0) {
        //     var string_subalpha = 'subalpha' + states;
        //     var subalpha = document.getElementById(string_subalpha).value;
        //     subalpha = subalpha.replace(/\s/g,'');
        //     var checklist = project.method.alphas[alphas].subalphas[subalpha].states[states].checklists;
        // } else {
            var checklist = project.method.alphas[alphas].states[states].checklists;
        // }

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

        var states = project.method.alphas[alpha].workproducts[workproduct].states;
        console.log(states);

        if (project.alphas[alpha].workproducts[workproduct].result) {
            states.forEach(function(entry) {
                var fields = {}
                var appendString = "method.alphas." + alpha + ".states." + entry + ".result";
                fields[appendString] = false;
                var appendString = "method.alphas." + alpha + ".states." + entry + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
            });

            var fields = {}
            var appendString = "method.alphas." + alpha + ".workproducts." + workproduct + ".result";
            fields[appendString] = false;
            var appendString = "method.alphas." + alpha + ".workproducts." + workproduct + ".timestamp";
            fields[appendString] = new Date();
            Projects.update({_id:id}, {$set : fields});
        } else {
            states.forEach(function(entry) {
                var fields = {}
                var appendString = "method.alphas." + alpha + ".states." + entry + ".result";
                fields[appendString] = true;
                var appendString = "method.alphas." + alpha + ".states." + entry + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
            });

            var fields = {}
            var appendString = "method.alphas." + alpha + ".workproducts." + workproduct + ".result";
            fields[appendString] = true;
            var appendString = "method.alphas." + alpha + ".workproducts." + workproduct + ".timestamp";
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
        var competencies = project.method.activityspaces[activity_spaces].activities[activity].competencies;

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