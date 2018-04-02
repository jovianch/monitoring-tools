import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	Meteor.call('newProject');
});

Meteor.publish('Projects', function () {
	return Projects.find();
});

newProject = function() {
	projectId = Projects.insert(
    	{ name : "aaa", description : "bbbb"}
    );
    projectId = Projects.insert(
    	{ name : "ccc", description : "ddd"}
    );

    return projectId;
}

Meteor.methods({
    newProject: function() {
        return newProject();
    }
});
