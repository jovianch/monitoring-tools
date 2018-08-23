Meteor.subscribe('Projects');
Meteor.subscribe('Methods');
Meteor.subscribe('AllProject');

Template.project.helpers({
  Activities : function() {
    var project = Session.get('project');
    console.log(project);
    return Projects.findOne({_id:project}).method.activityspaces;
  },
  allMethods : function() {
    console.log(Methods.find().fetch());
    return Methods.find().fetch()
  },
  alphas : function() {
    var project = Session.get('project');
    return Projects.findOne({_id:project}).method.alphas;
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
    });

    var alphas = arrayify(Projects.findOne({_id:project}).method.alphas);
    alphas.forEach(function(alpha) {
      // if(isset(Projects.))
      // console.log("alpha : " + )
      var subalphas = arrayify(Projects.findOne({_id:project}).method.alphas[alpha.name].subalphas);
      if(subalphas.length > 0) {
        subalphas.forEach(function(subalpha) {
          var str_subalpha = "subalpha" + subalpha.name;
          var count_subalpha = document.getElementById(str_subalpha).value;

          for (var i = 0; i < count_subalpha; i++) {
            var fields = {};
            var appendString = "subalpha." + subalpha.name + (i + 1);
            fields[appendString] = Projects.findOne({_id:project}).method.alphas[alpha.name].subalphas[subalpha.name];
            console.log(fields);
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
          }
        });
      }
    });
  }
});