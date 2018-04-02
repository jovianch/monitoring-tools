Meteor.subscribe('Projects');

Template.monitor.projects = function() {
	return Projects.find();
};