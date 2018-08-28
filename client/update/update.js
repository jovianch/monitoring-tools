Meteor.subscribe('Projects');

Template.update.onCreated(function helloOnCreated() {
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
    subalphas : function() {
        var id = Session.get('project');
        return Projects.findOne({_id:id}).subalpha
    },
    workproducts : function() {
        var id = Session.get('project');
        return Projects.findOne({_id:id}).workproducts
    },
    project : function() {
        var id = Session.get('project');
        return Projects.findOne({_id:id})
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

function updateState(alpha, state) {
    Session.set('states', event.currentTarget.id);
    var states = state;
    var alphas = alpha;
    var id = Session.get('project')
    var project = Projects.findOne({_id:id});

    var arr_states = arrayify(project.method.alphas[alphas].states);
    
    // UPDATE STATE
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
    console.log(project.method.alphas[alphas].states[states].result);

    if (project.method.alphas[alphas].states[states].result) {
        for (var j = arr_states.length; j >= idx_states; j--) {
            var fields = {}
            var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
            fields[appendString] = false;
            var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
            fields[appendString] = '';
            Projects.update({_id:id}, {$set : fields});

            // UPDATE CHECKLISTS
            var arr_checklists = arrayify(project.method.alphas[alphas].states[arr_states[j-1].name].checklists);
            var fields = {}
            var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".checklists." + arr_checklists[arr_checklists.length - 1].name + ".result";
            fields[appendString] = false;
            var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".checklists." + arr_checklists[arr_checklists.length - 1].name + ".timestamp";
            fields[appendString] = '';
            console.log(fields);
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
        }
    } else {
        for (var j = 0; j < idx_states; j++) {
            var fields = {}
            var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".result";
            fields[appendString] = true;
            var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
            fields[appendString] = new Date();
            Projects.update({_id:id}, {$set : fields});

            // UPDATE CHECKLISTS
            var arr_checklists = arrayify(project.method.alphas[alphas].states[arr_states[j].name].checklists);
            arr_checklists.forEach(function(checklist) {
                var fields = {}
                var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".checklists." + checklist.name + ".result";
                fields[appendString] = true;
                var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".checklists." + checklist.name + ".timestamp";
                fields[appendString] = new Date();
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
            })
        }
    }

    // UPDATE ACTIVITY SPACES
    arr_activity_spaces.forEach(function(activity_space) {
        var completion_criterias = activity_space.value.completioncriteria;
        var is_complete = true;
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        completion_criterias.forEach(function(completion_criteria) {
            var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
            var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
            if (project.method.alphas[alphas].states[states].result) {
                is_complete = is_complete && true;
            } else {
                is_complete = is_complete && false;
            }
        });

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
            fields[appendString] = '';
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
        }

        // UPDATE ACTIVITY
        var arr_activities = arrayify(activity_space.value.activities);
        arr_activities.forEach(function(activity) {
            var completion_criterias = activity.value.completioncriteria;
            var is_complete = true;
            var id = Session.get('project');
            var project = Projects.findOne({_id:id});
            completion_criterias.forEach(function(completion_criteria) {
                var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
                if (project.method.alphas[alphas].states[states].result) {
                    is_complete = is_complete && true;
                } else {
                    is_complete = is_complete && false;
                }
            });

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
                fields[appendString] = '';
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
            }
        });
    });

    //UPDATE WORK PRODUCT
    var id = Session.get('project');
    var workproducts = arrayify(Projects.findOne({_id:id}).workproducts);

    workproducts.forEach(function(workproduct) {
        var alpha = workproduct.value.alpha;
        var subalpha = workproduct.value.subalpha;

        if (subalpha === "") {
            var states = arrayify(Projects.findOne({_id:id}).method.alphas[alpha].states);
            states.forEach(function(state) {
                if (state.value.name.replace(/\s/g,'') == (workproduct.value.states)[0].replace(/\s/g,'')) {
                    if (state.value.result) {
                        var fields = {}
                        var appendString = "workproducts." + workproduct.name + ".result";
                        fields[appendString] = true;
                        var appendString = "workproducts." + workproduct.name + ".timestamp";
                        fields[appendString] = new Date();
                        Projects.update({_id:id}, {$set : fields});
                    } else {
                        var fields = {}
                        var appendString = "workproducts." + workproduct.name + ".result";
                        fields[appendString] = false;
                        var appendString = "workproducts." + workproduct.name + ".timestamp";
                        fields[appendString] = '';
                        Projects.update({_id:id}, {$set : fields});
                    }
                }
            });
        } else {
            var states = arrayify(Projects.findOne({_id:id}).subalpha[subalpha].states);
            states.forEach(function(state) {
                if (state.value.name.replace(/\s/g,'') == (workproduct.value.states)[0].replace(/\s/g,'')) {
                    if (state.value.result) {
                        var fields = {}
                        var appendString = "workproducts." + workproduct.name + ".result";
                        fields[appendString] = true;
                        var appendString = "workproducts." + workproduct.name + ".timestamp";
                        fields[appendString] = new Date();
                        Projects.update({_id:id}, {$set : fields});
                    } else {
                        var fields = {}
                        var appendString = "workproducts." + workproduct.name + ".result";
                        fields[appendString] = false;
                        var appendString = "workproducts." + workproduct.name + ".timestamp";
                        fields[appendString] = '';
                        Projects.update({_id:id}, {$set : fields});
                    }
                }
            });
        }
    })
}

function updateSubalphaState(subalpha, state) {
    var states = state;

    var id = Session.get('project')
    var project = Projects.findOne({_id:id});

    var subalpha = subalpha;
    subalpha = subalpha.replace(/\s/g,'');
   
    var arr_states = arrayify(project.subalpha[subalpha].states);
    
    var idx_states = 0;
    var i = 0;
    var is_states = false;
    while (!(is_states)) {
        if (arr_states[i].name.replace(/\s/g,'') === project.subalpha[subalpha].states[states].name.replace(/\s/g,'')) {
            idx_states = i + 1;
            is_states = true;
        }
        i++;
    }

    // UPDATE SUBALPHA STATE
    if (project.subalpha[subalpha].states[states].result) {
        for (var j = arr_states.length; j >= idx_states; j--) {
            var fields = {}
            var appendString = "subalpha." + subalpha + ".states." + arr_states[j-1].name + ".result";
            fields[appendString] = false;
            var appendString = "subalpha." + subalpha + ".states." + arr_states[j-1].name + ".timestamp";
            fields[appendString] = '';
            console.log(fields)
            Projects.update({_id:id}, {$set : fields});

            // UPDATE CHECKLISTS
            var arr_checklists = arrayify(project.subalpha[subalpha].states[arr_states[j-1].name].checklists);
            var fields = {}
            var appendString = "subalpha." + subalpha + ".states." + arr_states[j-1].name + ".checklists." + arr_checklists[arr_checklists.length - 1].name + ".result";
            fields[appendString] = false;
            var appendString = "subalpha." + subalpha + ".states." + arr_states[j-1].name + ".checklists." + arr_checklists[arr_checklists.length - 1].name + ".timestamp";
            fields[appendString] = '';
            console.log(fields);
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
        }
    } else {
        for (var j = 0; j < idx_states; j++) {
            var fields = {}
            var appendString = "subalpha." + subalpha + ".states." + arr_states[j].name + ".result";
            fields[appendString] = true;
            var appendString = "subalpha." + subalpha + ".states." + arr_states[j].name + ".timestamp";
            fields[appendString] = new Date();
            console.log(fields);
            Projects.update({_id:id}, {$set : fields});

            // UPDATE CHECKLISTS
            var arr_checklists = arrayify(project.subalpha[subalpha].states[arr_states[j].name].checklists);
            arr_checklists.forEach(function(checklist) {
                var fields = {}
                var appendString = "subalpha." + subalpha + ".states." + arr_states[j].name + ".checklists." + checklist.name + ".result";
                fields[appendString] = true;
                var appendString = "subalpha." + subalpha + ".states." + arr_states[j].name + ".checklists." + checklist.name + ".timestamp";
                fields[appendString] = new Date();
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
            })
        }
    }
}

Template.update.events({
    'click .states': function(event) {
    	Session.set('states', event.currentTarget.id);
    	var states = Session.get('states');
        var string_alphas = 'alpha' + states;
        var alphas = document.getElementById(string_alphas).value;
        alphas = alphas.replace(/\s/g,'');
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});

        var arr_states = arrayify(project.method.alphas[alphas].states);
        
        // UPDATE STATE
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

        if (project.method.alphas[alphas].states[states].result) {
            for (var j = arr_states.length; j >= idx_states; j--) {
                var fields = {}
                var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
                fields[appendString] = false;
                var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
                fields[appendString] = '';
                Projects.update({_id:id}, {$set : fields});

                 // UPDATE CHECKLISTS
                var arr_checklists = arrayify(project.method.alphas[alphas].states[arr_states[j-1].name].checklists);
                var fields = {}
                var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".checklists." + arr_checklists[arr_checklists.length - 1].name + ".result";
                fields[appendString] = false;
                var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".checklists." + arr_checklists[arr_checklists.length - 1].name + ".timestamp";
                fields[appendString] = '';
                console.log(fields);
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
            }
        } else {
            for (var j = 0; j < idx_states; j++) {
                var fields = {}
                var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".result";
                fields[appendString] = true;
                var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
                fields[appendString] = new Date();
                Projects.update({_id:id}, {$set : fields});

                // UPDATE CHECKLISTS
                var arr_checklists = arrayify(project.method.alphas[alphas].states[arr_states[j].name].checklists);
                arr_checklists.forEach(function(checklist) {
                    var fields = {}
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".checklists." + checklist.name + ".result";
                    fields[appendString] = true;
                    var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".checklists." + checklist.name + ".timestamp";
                    fields[appendString] = new Date();
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                })
            }
        }

        // UPDATE ACTIVITY SPACES
        arr_activity_spaces.forEach(function(activity_space) {
            var completion_criterias = activity_space.value.completioncriteria;
            var is_complete = true;
            var id = Session.get('project');
            var project = Projects.findOne({_id:id});
            completion_criterias.forEach(function(completion_criteria) {
                var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
                if (project.method.alphas[alphas].states[states].result) {
                    is_complete = is_complete && true;
                } else {
                    is_complete = is_complete && false;
                }
            });

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
                fields[appendString] = '';
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
            }

            // UPDATE ACTIVITY
            var arr_activities = arrayify(activity_space.value.activities);
            arr_activities.forEach(function(activity) {
                var completion_criterias = activity.value.completioncriteria;
                var is_complete = true;
                var id = Session.get('project');
                var project = Projects.findOne({_id:id});
                completion_criterias.forEach(function(completion_criteria) {
                    var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                    var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
                    if (project.method.alphas[alphas].states[states].result) {
                        is_complete = is_complete && true;
                    } else {
                        is_complete = is_complete && false;
                    }
                });

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
                    fields[appendString] = '';
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }
            });
        });

        //UPDATE WORK PRODUCT
        var id = Session.get('project');
        var workproducts = arrayify(Projects.findOne({_id:id}).workproducts);

        workproducts.forEach(function(workproduct) {
            var alpha = workproduct.value.alpha;
            var subalpha = workproduct.value.subalpha;

            if (subalpha === "") {
                var states = arrayify(Projects.findOne({_id:id}).method.alphas[alpha].states);
                states.forEach(function(state) {
                    if (state.value.name.replace(/\s/g,'') == (workproduct.value.states)[0].replace(/\s/g,'')) {
                        if (state.value.result) {
                            var fields = {}
                            var appendString = "workproducts." + workproduct.name + ".result";
                            fields[appendString] = true;
                            var appendString = "workproducts." + workproduct.name + ".timestamp";
                            fields[appendString] = new Date();
                            Projects.update({_id:id}, {$set : fields});
                        } else {
                            var fields = {}
                            var appendString = "workproducts." + workproduct.name + ".result";
                            fields[appendString] = false;
                            var appendString = "workproducts." + workproduct.name + ".timestamp";
                            fields[appendString] = '';
                            Projects.update({_id:id}, {$set : fields});
                        }
                    }
                });
            } else {
                var states = arrayify(Projects.findOne({_id:id}).subalpha[subalpha].states);
                states.forEach(function(state) {
                    if (state.value.name.replace(/\s/g,'') == (workproduct.value.states)[0].replace(/\s/g,'')) {
                        if (state.value.result) {
                            var fields = {}
                            var appendString = "workproducts." + workproduct.name + ".result";
                            fields[appendString] = true;
                            var appendString = "workproducts." + workproduct.name + ".timestamp";
                            fields[appendString] = new Date();
                            Projects.update({_id:id}, {$set : fields});
                        } else {
                            var fields = {}
                            var appendString = "workproducts." + workproduct.name + ".result";
                            fields[appendString] = false;
                            var appendString = "workproducts." + workproduct.name + ".timestamp";
                            fields[appendString] = '';
                            Projects.update({_id:id}, {$set : fields});
                        }
                    }
                });
            }
        })
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

                updateState(alphas, states);

                // var arr_states = arrayify(project.method.alphas[alphas].states);
                // var idx_states = 0;
                // var i = 0;
                // var is_states = false;
                // while (!(is_states)) {
                //     if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                //         idx_states = i + 1;
                //         is_states = true;
                //     }
                //     i++;
                // }

                // for (var j = arr_states.length; j >= idx_states; j--) {   
                //     var fields = {}
                //     var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
                //     fields[appendString] = false;
                //     var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
                //     fields[appendString] = new Date();
                //     console.log(fields);
                //     var id = Session.get('project');
                //     Projects.update({_id:id}, {$set : fields});
                // }
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
            var states_not_done = [];
            entryCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;

                var arr_states = arrayify(project.method.alphas[alphas].states);
                
                if (project.method.alphas[alphas].states[states].result) {
                    is_complete = is_complete && true;
                } else {
                    states_not_done.push(entry);
                    is_complete = is_complete && false;
                }
            });

            if (is_complete) {
                completionCriteria.forEach(function(entry) {
                    var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                    var states = entry.split('::')[1].replace(/ +/g, "");;

                    updateState(alphas, states);
                    // var arr_states = arrayify(project.method.alphas[alphas].states);
                    // // console.log(arr_states);
                    // var idx_states = 0;
                    // var i = 0;
                    // var is_states = false;
                    // while (!(is_states)) {
                    //     if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                    //         idx_states = i + 1;
                    //         is_states = true;
                    //     }
                    //     i++;
                    // }

                    // for (var j = 0; j < idx_states; j++) {
                    //     var fields = {}
                    //     var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".result";
                    //     fields[appendString] = true;
                    //     var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
                    //     fields[appendString] = new Date();
                    //     console.log(fields);
                    //     var id = Session.get('project');
                    //     Projects.update({_id:id}, {$set : fields});
                    //     // console.log(streetaddress);
                    // }
                });
                var fields = {}
                var appendString = "method.activityspaces." + activity + ".result";
                fields[appendString] = true;
                var appendString = "method.activityspaces." + activity + ".timestamp";
                fields[appendString] = new Date();
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields}); 
            } else {
                var err = "";

                for (var i = 0; i < states_not_done.length; i++) {
                    err += states_not_done[i];
                    if ((states_not_done.length != 1) && (i != (states_not_done.length - 1))) {
                        err += ", ";
                    }
                }
                alert(err + " not done. Can not do this activity!");
            }
        }
    },

    //if click activities
    'click .activities': function(event) {
        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        string_activity = 'activity_spaces' + activity;
        var activity_spaces = document.getElementById(string_activity).value;
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var activities = project.method.activityspaces[activity_spaces].activities;
        var completionCriteria = activities[activity].completioncriteria;
        var entryCriteria = activities[activity].entrycriteria;

        var id = Session.get('project')
        var project = Projects.findOne({_id:id});
        if (project.method.activityspaces[activity_spaces].activities[activity].result) {
            completionCriteria.forEach(function(entry) {
                var alphas = entry.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
                var states = entry.split('::')[1].replace(/ +/g, "");;

                updateState(alphas, states);

                // var arr_states = arrayify(project.method.alphas[alphas].states);
                // var idx_states = 0;
                // var i = 0;
                // var is_states = false;
                // while (!(is_states)) {
                //     if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                //         idx_states = i + 1;
                //         is_states = true;
                //     }
                //     i++;
                // }

                // for (var j = arr_states.length; j >= idx_states; j--) {   
                //     var fields = {}
                //     var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".result";
                //     fields[appendString] = false;
                //     var appendString = "method.alphas." + alphas + ".states." + arr_states[j-1].name + ".timestamp";
                //     fields[appendString] = new Date();
                //     console.log(fields);
                //     var id = Session.get('project');
                //     Projects.update({_id:id}, {$set : fields});
                // }
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

                    updateState(alphas, states);

                    // var arr_states = arrayify(project.method.alphas[alphas].states);
                    // // console.log(arr_states);
                    // var idx_states = 0;
                    // var i = 0;
                    // var is_states = false;
                    // while (!(is_states)) {
                    //     if (arr_states[i].name === project.method.alphas[alphas].states[states].name.replace(/\s/g,'')) {
                    //         idx_states = i + 1;
                    //         is_states = true;
                    //     }
                    //     i++;
                    // }

                    // for (var j = 0; j < idx_states; j++) {
                    //     var fields = {}
                    //     var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".result";
                    //     fields[appendString] = true;
                    //     var appendString = "method.alphas." + alphas + ".states." + arr_states[j].name + ".timestamp";
                    //     fields[appendString] = new Date();
                    //     console.log(fields);
                    //     var id = Session.get('project');
                    //     Projects.update({_id:id}, {$set : fields});
                    //     // console.log(streetaddress);
                    // }
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
        Session.set('state', event.currentTarget.id);
        var states = Session.get('state');
        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var string_alphas = 'alpha' + states;
        var alphas = document.getElementById(string_alphas).value;
        Session.set('alpha', alphas);
        alphas = alphas.replace(/\s/g,'');

        var checklist = project.method.alphas[alphas].states[states].checklists;

        var tbody = document.getElementById('checklist');

        var arr_checklist = arrayify(checklist);
        tbody.innerHTML = "<h3>Checklists</h3>";
        var total = "";

        for (var i = 0; i < arr_checklist.length; i++) {
            if (i == 0) {
                if (arr_checklist[i].value.result) {
                    var tr = "<div class='workproduct-content'><a class='states-done checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                } else {
                    var tr = "<div class='workproduct-content'><a class='checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                }
            } else {
                if (arr_checklist[i].value.result) {
                    var tr = "<a class='checklist states-done' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                } else {
                    var tr = "<a class='checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                }
            }

            if (i == arr_checklist.length - 1) {
                tr += "</div>";
            }

            /* We add the table row to the table body */
            total += tr;
        }
        tbody.innerHTML += total;
    },

    // if click checklist
    'click .checklist': function(event) {
        var id = Session.get('project');
        var state = Session.get('state');
        var alpha = Session.get('alpha');
        var checklist = event.currentTarget.id;
        var subalpha_state = Session.get('subalpha_state');
        var subalpha = Session.get('subalpha');

        var project = Projects.findOne({_id:id});

        if (alpha === '') {
            subalpha = subalpha.replace(/\s/g,''); 
            var arr_checklists = arrayify(project.subalpha[subalpha].states[subalpha_state].checklists);
            
            var idx_checklists = 0;
            var i = 0;
            var is_checklists = false;
            while (!(is_checklists)) {
                if (arr_checklists[i].name.replace(/\s/g,'') === project.subalpha[subalpha].states[subalpha_state].checklists[checklist].name.replace(/\s/g,'')) {
                    idx_checklists = i + 1;
                    is_checklists = true;
                }
                i++;
            }

            if (project.subalpha[subalpha].states[subalpha_state].checklists[checklist].result) {
                for (var j = arr_checklists.length; j >= idx_checklists; j--) {
                    var fields = {}
                    var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".checklists." + arr_checklists[j-1].name + ".result";
                    fields[appendString] = false;
                    var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".checklists." + arr_checklists[j-1].name + ".timestamp";
                    fields[appendString] = '';
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }
            } else {
                for (var j = 0; j < idx_checklists; j++) {
                    var fields = {}
                    var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".checklists." + arr_checklists[j].name + ".result";
                    fields[appendString] = true;
                    var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".checklists." + arr_checklists[j].name + ".timestamp";
                    fields[appendString] = new Date();
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }
            }

            document.getElementById("checklist").innerHTML = "";
            var states = Session.get('state');
            var id = Session.get('project');
            var project = Projects.findOne({_id:id});
            var string_subalpha = 'subalpha' + name + subalpha_state;
            var subalpha = Session.get('subalpha');
            
            subalpha = subalpha.replace(/\s/g,'');

            // var arr_subalpha = arrayify(project.method.alphas[alphas].subalphas);
            // if (arr_subalpha.length > 0) {
            //     var string_subalpha = 'subalpha' + states;
            //     var subalpha = document.getElementById(string_subalpha).value;
            //     subalpha = subalpha.replace(/\s/g,'');
            //     var checklist = project.method.alphas[alphas].subalphas[subalpha].states[states].checklists;
            // } else {
                var checklist = project.subalpha[subalpha].states[subalpha_state].checklists;
            // }

            var tbody = document.getElementById('checklist');

            var arr_checklist = arrayify(checklist);
            tbody.innerHTML = "<h3>Checklists</h3>";
            var total = "";

            for (var i = 0; i < arr_checklist.length; i++) {
                if (i == 0) {
                    if (arr_checklist[i].value.result) {
                        var tr = "<div class='workproduct-content'><a class='checklist states-done' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                    } else {
                        var tr = "<div class='workproduct-content'><a class='checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                    }
                } else {
                    if (arr_checklist[i].value.result) {
                        var tr = "<a class='checklist states-done' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                    } else {
                        var tr = "<a class='checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                    }
                }

                if (i == arr_checklist.length - 1) {
                    tr += "</div>";
                    console.log(tr);
                }

                /* We add the table row to the table body */
                total += tr;
            }
            tbody.innerHTML += total;

            if (idx_checklists == arr_checklists.length) {
                console.log(states);
                console.log(Projects.findOne({_id:id}).subalpha[subalpha]);
                if (Projects.findOne({_id:id}).subalpha[subalpha].states[states].checklists[arr_checklists[idx_checklists-1].name].result) {
                    var fields = {}
                    var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".result";
                    fields[appendString] = true;
                    var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".timestamp";
                    fields[appendString] = new Date();
                    console.log(fields);
                    Projects.update({_id:id}, {$set : fields});
                } else {
                    console.log(subalpha);
                    var fields = {}
                    var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".result";
                    fields[appendString] = false;
                    var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".timestamp";
                    fields[appendString] = '';
                    console.log(fields);
                    Projects.update({_id:id}, {$set : fields});
                }
            } else {
                var fields = {}
                var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".result";
                fields[appendString] = false;
                var appendString = "subalpha." + subalpha + ".states." + subalpha_state + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});
            }

        } else {
            console.log(alpha + state);
            var arr_checklists = arrayify(project.method.alphas[alpha].states[state].checklists);
            console.log(arr_checklists);
            
            var idx_checklists = 0;
            var i = 0;
            var is_checklists = false;
            while (!(is_checklists)) {
                console.log(i);
                if (arr_checklists[i].name.replace(/\s/g,'') === project.method.alphas[alpha].states[state].checklists[checklist].name.replace(/\s/g,'')) {
                    idx_checklists = i + 1;
                    is_checklists = true;
                }
                i++;
            }

            if (project.method.alphas[alpha].states[state].checklists[checklist].result) {
                for (var j = arr_checklists.length; j >= idx_checklists; j--) {
                    var fields = {}
                    var appendString = "method.alphas." + alpha + ".states." + state + ".checklists." + arr_checklists[j-1].name + ".result";
                    fields[appendString] = false;
                    var appendString = "method.alphas." + alpha + ".states." + state + ".checklists." + arr_checklists[j-1].name + ".timestamp";
                    fields[appendString] = new Date();
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }
            } else {
                for (var j = 0; j < idx_checklists; j++) {
                    var fields = {}
                    var appendString = "method.alphas." + alpha + ".states." + state + ".checklists." + arr_checklists[j].name + ".result";
                    fields[appendString] = true;
                    var appendString = "method.alphas." + alpha + ".states." + state + ".checklists." + arr_checklists[j].name + ".timestamp";
                    fields[appendString] = new Date();
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                }
            }

            document.getElementById("checklist").innerHTML = "";
            var states = Session.get('state');
            var id = Session.get('project');
            var project = Projects.findOne({_id:id});
            var string_alphas = 'alpha' + states;
            var alphas = document.getElementById(string_alphas).value;
            Session.set('alpha', alphas);
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
            var total = "";

            for (var i = 0; i < arr_checklist.length; i++) {
                if (i == 0) {
                    if (arr_checklist[i].value.result) {
                        var tr = "<div class='workproduct-content'><a class='checklist states-done' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                    } else {
                        var tr = "<div class='workproduct-content'><a class='checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                    }
                } else {
                    if (arr_checklist[i].value.result) {
                        var tr = "<a class='checklist states-done' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                    } else {
                        var tr = "<a class='checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                    }
                }

                if (i == arr_checklist.length - 1) {
                    tr += "</div>";
                    console.log(tr);
                }

                /* We add the table row to the table body */
                total += tr;
            }
            tbody.innerHTML += total;
            console.log(idx_checklists);

            if (idx_checklists == arr_checklists.length) {
                if (Projects.findOne({_id:id}).method.alphas[alphas].states[states].checklists[arr_checklists[idx_checklists-1].name].result) {
                    updateState(alphas, states);
                    // var fields = {}
                    // var appendString = "method.alphas." + alphas + ".states." + states + ".result";
                    // fields[appendString] = true;
                    // var appendString = "method.alphas." + alphas + ".states." + states + ".timestamp";
                    // fields[appendString] = new Date();
                    // console.log(fields);
                    // Projects.update({_id:id}, {$set : fields});
                } else {
                    updateState(alphas, states);
                    // var fields = {}
                    // var appendString = "method.alphas." + alphas + ".states." + states + ".result";
                    // fields[appendString] = false;
                    // var appendString = "method.alphas." + alphas + ".states." + states + ".timestamp";
                    // fields[appendString] = '';
                    // console.log(fields);
                    // Projects.update({_id:id}, {$set : fields});
                }   
            } else {
                updateState(alphas, states);
                // var fields = {}
                // var appendString = "method.alphas." + alphas + ".states." + states + ".result";
                // fields[appendString] = false;
                // var appendString = "method.alphas." + alphas + ".states." + states + ".timestamp";
                // fields[appendString] = new Date();
                // console.log(fields);
                // Projects.update({_id:id}, {$set : fields});
            }
        }

        
    },

    'click .workproduct': function(event) {
        Session.set('workproduct', event.currentTarget.id);
        var id = Session.get('project')
        var project = Projects.findOne({_id:id});
        var workproduct = Session.get('workproduct');
        string_workproduct = 'workproduct' + workproduct;
        var alpha = project.workproducts[workproduct].alpha;
        var subalpha = project.workproducts[workproduct].subalpha;

        var states = project.workproducts[workproduct].states;

        if (project.workproducts[workproduct].result) {
            if (project.workproducts[workproduct].subalpha == '') {
                states.forEach(function(entry) {
                    updateState(alpha, entry);
                    // var fields = {}
                    // var appendString = "method.alphas." + alpha + ".states." + entry + ".result";
                    // fields[appendString] = false;
                    // var appendString = "method.alphas." + alpha + ".states." + entry + ".timestamp";
                    // fields[appendString] = new Date();
                    // console.log(fields);
                    // Projects.update({_id:id}, {$set : fields});
                });
            } else {
                 states.forEach(function(entry) {
                    updateSubalphaState(subalpha, entry);
                    // var fields = {}
                    // var appendString = "subalpha." + subalpha + ".states." + entry + ".result";
                    // fields[appendString] = false;
                    // var appendString = "subalpha." + subalpha + ".states." + entry + ".timestamp";
                    // fields[appendString] = new Date();
                    // console.log(fields);
                    // Projects.update({_id:id}, {$set : fields});
                });
            }

            var fields = {}
            var appendString = "workproducts." + workproduct + ".result";
            fields[appendString] = false;
            var appendString = "workproducts." + workproduct + ".timestamp";
            fields[appendString] = new Date();
            Projects.update({_id:id}, {$set : fields});
        } else {
             if (project.workproducts[workproduct].subalpha == '') {
                states.forEach(function(entry) {
                    updateState(alpha, entry);
                    // var fields = {}
                    // var appendString = "method.alphas." + alpha + ".states." + entry + ".result";
                    // fields[appendString] = true;
                    // var appendString = "method.alphas." + alpha + ".states." + entry + ".timestamp";
                    // fields[appendString] = new Date();
                    // console.log(fields);
                    // Projects.update({_id:id}, {$set : fields});
                });
            } else {
                 states.forEach(function(entry) {
                    updateSubalphaState(subalpha, entry);
                    // var fields = {}
                    // var appendString = "subalpha." + subalpha + ".states." + entry + ".result";
                    // fields[appendString] = true;
                    // var appendString = "subalpha." + subalpha + ".states." + entry + ".timestamp";
                    // fields[appendString] = new Date();
                    // console.log(fields);
                    // Projects.update({_id:id}, {$set : fields});
                });
            }

            var fields = {}
            var appendString = "workproducts." + workproduct + ".result";
            fields[appendString] = true;
            var appendString = "workproducts." + workproduct + ".timestamp";
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

    'click .subalpha_states': function(event) {
        Session.set('subalpha_states', event.currentTarget.id);
        var states = Session.get('subalpha_states');

        var id = Session.get('project')
        var project = Projects.findOne({_id:id});

        var name = Session.get('subalpha_dropdown');
        console.log('name : ' + name);
        name = name.replace(/\s/g,'');

        var string_subalpha = 'subalpha' + name + states;
        var subalpha = document.getElementById(string_subalpha).value;
        subalpha = subalpha.replace(/\s/g,'');
       
        var arr_states = arrayify(project.subalpha[subalpha].states);
        
        var idx_states = 0;
        var i = 0;
        var is_states = false;
        while (!(is_states)) {
            if (arr_states[i].name.replace(/\s/g,'') === project.subalpha[subalpha].states[states].name.replace(/\s/g,'')) {
                idx_states = i + 1;
                is_states = true;
            }
            i++;
        }

        // UPDATE SUBALPHA STATE
        if (project.subalpha[subalpha].states[states].result) {
            for (var j = arr_states.length; j >= idx_states; j--) {
                var fields = {}
                var appendString = "subalpha." + subalpha + ".states." + arr_states[j-1].name + ".result";
                fields[appendString] = false;
                var appendString = "subalpha." + subalpha + ".states." + arr_states[j-1].name + ".timestamp";
                fields[appendString] = '';
                console.log(fields)
                Projects.update({_id:id}, {$set : fields});

                // UPDATE CHECKLISTS
                var arr_checklists = arrayify(project.subalpha[subalpha].states[arr_states[j-1].name].checklists);
                var fields = {}
                var appendString = "subalpha." + subalpha + ".states." + arr_states[j-1].name + ".checklists." + arr_checklists[arr_checklists.length - 1].name + ".result";
                fields[appendString] = false;
                var appendString = "subalpha." + subalpha + ".states." + arr_states[j-1].name + ".checklists." + arr_checklists[arr_checklists.length - 1].name + ".timestamp";
                fields[appendString] = '';
                console.log(fields);
                var id = Session.get('project');
                Projects.update({_id:id}, {$set : fields});
            }
        } else {
            for (var j = 0; j < idx_states; j++) {
                var fields = {}
                var appendString = "subalpha." + subalpha + ".states." + arr_states[j].name + ".result";
                fields[appendString] = true;
                var appendString = "subalpha." + subalpha + ".states." + arr_states[j].name + ".timestamp";
                fields[appendString] = new Date();
                console.log(fields);
                Projects.update({_id:id}, {$set : fields});

                // UPDATE CHECKLISTS
                var arr_checklists = arrayify(project.subalpha[subalpha].states[arr_states[j].name].checklists);
                arr_checklists.forEach(function(checklist) {
                    var fields = {}
                    var appendString = "subalpha." + subalpha + ".states." + arr_states[j].name + ".checklists." + checklist.name + ".result";
                    fields[appendString] = true;
                    var appendString = "subalpha." + subalpha + ".states." + arr_states[j].name + ".checklists." + checklist.name + ".timestamp";
                    fields[appendString] = new Date();
                    var id = Session.get('project');
                    Projects.update({_id:id}, {$set : fields});
                })
            }
        }

        // arr_activity_spaces.forEach(function(activity_space) {
        //     var completion_criterias = activity_space.value.completioncriteria;
        //     var is_complete = true;
        //     var id = Session.get('project');
        //     var project = Projects.findOne({_id:id});
        //     // console.log("activity_space : " + activity_space.name);
        //     completion_criterias.forEach(function(completion_criteria) {
        //         var alphas = completion_criteria.split('::')[0].replace(/ +/g, "");; //o sbelum, 1 sesudah
        //         var states = completion_criteria.split('::')[1].replace(/ +/g, "");;
        //         // console.log("alphas : " + alphas);
        //         // console.log("states : " + states);
        //         // console.log(project.alphas[alphas].states[states].result);
        //         if (project.method.alphas[alphas].states[states].result) {
        //             is_complete = is_complete && true;
        //         } else {
        //             is_complete = is_complete && false;
        //         }
        //     });
        //     // console.log(is_complete);
        //     if (is_complete) {
        //         var fields = {}
        //         var appendString = "method.activityspaces." + activity_space.name + ".result";
        //         fields[appendString] = true;
        //         var appendString = "method.activityspaces." + activity_space.name + ".timestamp";
        //         fields[appendString] = new Date();
        //         var id = Session.get('project');
        //         Projects.update({_id:id}, {$set : fields});
        //     } else {
        //         var fields = {}
        //         var appendString = "method.activityspaces." + activity_space.name + ".result";
        //         fields[appendString] = false;
        //         var appendString = "method.activityspaces." + activity_space.name + ".timestamp";
        //         fields[appendString] = new Date();
        //         var id = Session.get('project');
        //         Projects.update({_id:id}, {$set : fields});
        //     }

        //     var arr_activities = arrayify(activity_space.value.activities);
        //     arr_activities.forEach(function(activity) {
        //         var completion_criterias = activity.value.completioncriteria;
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
        //             var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".result";
        //             fields[appendString] = true;
        //             var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".timestamp";
        //             fields[appendString] = new Date();
        //             var id = Session.get('project');
        //             Projects.update({_id:id}, {$set : fields});
        //         } else {
        //             var fields = {}
        //             var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".result";
        //             fields[appendString] = false;
        //             var appendString = "method.activityspaces." + activity_space.name + ".activities." + activity.name + ".timestamp";
        //             fields[appendString] = new Date();
        //             var id = Session.get('project');
        //             Projects.update({_id:id}, {$set : fields});
        //         }
        //     });
        // });
        // }
        
    },

    'mouseenter .subalpha_dropdown':function(event) {
        Session.set('subalpha_dropdown', event.currentTarget.id);
    },

    'mouseenter .subalpha_states':function(event) {
        document.getElementById("checklist").innerHTML = "";
        Session.set('subalpha_state', event.currentTarget.id);
        Session.set('state', event.currentTarget.id);
        Session.set('alpha', '');
        var subalpha_state = Session.get('subalpha_state');

        var name = Session.get('subalpha_dropdown');
        console.log('name : ' + name);
        name = name.replace(/\s/g,'');

        var id = Session.get('project');
        var project = Projects.findOne({_id:id});
        var string_subalpha = 'subalpha' + name + subalpha_state;
        var subalpha = document.getElementById(string_subalpha).value;
        Session.set('subalpha', subalpha);
        subalpha = subalpha.replace(/\s/g,'');

        // var arr_subalpha = arrayify(project.method.alphas[alphas].subalphas);
        // if (arr_subalpha.length > 0) {
        //     var string_subalpha = 'subalpha' + states;
        //     var subalpha = document.getElementById(string_subalpha).value;
        //     subalpha = subalpha.replace(/\s/g,'');
        //     var checklist = project.method.alphas[alphas].subalphas[subalpha].states[states].checklists;
        // } else {
            var checklist = project.subalpha[subalpha].states[subalpha_state].checklists;
        // }

        var tbody = document.getElementById('checklist');

        var arr_checklist = arrayify(checklist);
        tbody.innerHTML = "<h3>Checklists</h3>";
        var total = "";

        for (var i = 0; i < arr_checklist.length; i++) {
            if (i == 0) {
                if (arr_checklist[i].value.result) {
                    var tr = "<div class='workproduct-content'><a class='checklist states-done' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                } else {
                    var tr = "<div class='workproduct-content'><a class='checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                }
            } else {
                if (arr_checklist[i].value.result) {
                    var tr = "<a class='checklist states-done' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                } else {
                    var tr = "<a class='checklist' id='" + arr_checklist[i].name + "' name='" + arr_checklist[i].name + "'>" + arr_checklist[i].name + "</a>";
                }
            }

            if (i == arr_checklist.length - 1) {
                tr += "</div>";
                console.log(tr);
            }

            /* We add the table row to the table body */
            total += tr;
        }
        tbody.innerHTML += total;
    },
});