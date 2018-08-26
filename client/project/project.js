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
  },
  workproducts : function() {
    var is_workproducts = Session.get('is_workproducts');
    if (is_workproducts) {
      var project = Session.get('project');
      return arrayify(Projects.findOne({_id:project}).workproducts);
    }
  },
  states_workproduct : function(workproduct) {
      var project = Session.get('project');
      console.log(workproduct);
      var alpha = Projects.findOne({_id:project}).workproducts[workproduct].alpha;
      var subalpha = Projects.findOne({_id:project}).workproducts[workproduct].subalpha;

      if (subalpha == '') {
        return arrayify(Projects.findOne({_id:project}).method.alphas[alpha].states);
      } else {
        return arrayify(Projects.findOne({_id:project}).method.alphas[alpha].subalphas[subalpha].states);
      }
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

            var str_name = subalpha.name + (i + 1);
            var arr_states = arrayify(Projects.findOne({_id:project}).subalpha[str_name].states);

            arr_states.forEach(function(state) {
              var fields = {};
              var appendString = "subalpha." + subalpha.name + (i + 1) + ".states." + state.name + ".subalpha";
              fields[appendString] = subalpha.name + (i + 1);
              console.log(fields);
              var id = Session.get('project');
              Projects.update({_id:id}, {$set : fields});
            });
          }
        });
      }
    });

    var workproducts = arrayify(Projects.findOne({_id:project}).workproducts);
    workproducts.forEach(function(workproduct) {
      var fields = {};
      var appendString = "workproducts." + workproduct.name + ".states";
      var e = document.getElementById(workproduct.name);
      var arr_states = [];
      arr_states.push(e.options[e.selectedIndex].value);
      console.log(arr_states);
      fields[appendString] = arr_states;
      console.log(fields);
      var id = Session.get('project');
      Projects.update({_id:id}, {$set : fields});
    });
  },

  'click .submit_workproduct' : function(event) {
    var project = Session.get('project');

    var alphas = arrayify(Projects.findOne({_id:project}).method.alphas);
    alphas.forEach(function(alpha) {
      var workproducts = arrayify(Projects.findOne({_id:project}).method.alphas[alpha.name].workproducts);
      if(workproducts.length > 0) {
        workproducts.forEach(function(workproduct) {
          var str_workproduct = "workproduct" + workproduct.name;
          var count_workproduct = document.getElementById(str_workproduct).value;

          for (var i = 0; i < count_workproduct; i++) {
            var fields = {};
            var appendString = "workproducts." + workproduct.name + (i + 1);
            fields[appendString] = Projects.findOne({_id:project}).method.alphas[alpha.name].workproducts[workproduct.name];
            console.log(fields);
            var id = Session.get('project');
            Projects.update({_id:id}, {$set : fields});
          }
        });
      }
    });
    Session.set('is_workproducts', true);
  }
});