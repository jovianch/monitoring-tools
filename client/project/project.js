Meteor.subscribe('Projects');
Meteor.subscribe('Methods');
Meteor.subscribe('AllProject');

Template.project.helpers({
  Activities : function() {
    var project = Session.get('project');
    console.log(project);
    return Projects.findOne({_id:project}).method.activityspaces;
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
    // console.log(project);
    console.log(Projects.findOne({_id:project}).method.activityspaces);
    var activities = arrayify(Projects.findOne({_id:project}).method.activityspaces);
    activities.forEach(function(activity) {
      var fields = {}
      var appendString = "method.activityspaces." + activity.name + ".end_date";
      var string_activity = "activity" + activity.name;
      if (document.getElementById(string_activity).value == "") {

      } else {
          fields[appendString] = new Date(document.getElementById(string_activity).value);
          console.log(fields);
          var id = Session.get('project');
          Projects.update({_id:id}, {$set : fields});
      }
      
    })  
  }
});