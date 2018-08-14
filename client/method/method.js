Meteor.subscribe('Projects');
Meteor.subscribe('AllProject');

Template.method.helpers({
  allProjects : function() {
    return Projects.find().fetch()
  }
});

Template.method.events({
    'click .project' : function(event){
      Session.set('project', event.currentTarget.id);
    }
  });

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});