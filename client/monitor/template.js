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
	myobject : function() {
		return Projects.findOne().alphas
	}
});

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    console.log(result);
    return result;
});