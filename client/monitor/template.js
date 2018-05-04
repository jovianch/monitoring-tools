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
		return Projects.findOne().alphas
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
    	var states = Session.get('states');
    	var fields = {}
    	var appendString = "alphas.Opportunity.states." + states + ".result";
    	fields[appendString] = "true";
        var appendString = "alphas.Opportunity.states." + states + ".timestamp";
        fields[appendString] = new Date();
    	console.log(appendString);
    	Projects.update({_id:"iwjTMn3i67J4Tn6yK"}, {$set : fields});
    },
    'click .activities': function(event) {
        Session.set('activity', event.currentTarget.id);
        var activity = Session.get('activity');
        var completionCriteria = activity + ".completioncriteria";
        var project = Projects.findOne();
        var completionCriteria = project.activityspaces.ExplorePossibilities['completioncriteria'];
        completionCriteria.forEach(function(entry) {
            var streetaddress = entry.split('::')[1]; //o sbelum, 1 sesudah
            console.log(streetaddress);
        });
    }

});

function asArray(obj){
    var result = [];
    for (var key in obj){
        if (obj[key].hasOwnProperty('order'))
            result.push({name:key,value:obj[key],order:obj[key].order});
        else
            result.push({name:key,value:obj[key]});
    }

    if (result != null && result[0].hasOwnProperty('order'))
            return result.sort(function(a,b) { return parseFloat(a.order) - parseFloat(b.order) } );
        else
            return result;
    }