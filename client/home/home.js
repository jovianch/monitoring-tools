Meteor.subscribe('Projects');
Meteor.subscribe('Methods');
Meteor.subscribe('AllProject');

Template.home.helpers({
    allProjects : function() {
        return Projects.find().fetch()
    }
});

Template.home.events({
    'click .project' : function(event) {
        Session.set('project', event.currentTarget.id);
    }
  });

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});