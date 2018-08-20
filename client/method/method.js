Meteor.subscribe('Projects');
Meteor.subscribe('Methods');
Meteor.subscribe('AllProject');

Template.method.helpers({
  allProjects : function() {
    return Projects.find().fetch()
  },
  allMethods : function() {
    console.log(Methods.find().fetch());
    return Methods.find().fetch()
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