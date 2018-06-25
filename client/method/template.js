Meteor.subscribe('Projects');
Meteor.subscribe('AllProject');

Template.method.helpers({
  allProjects : function() {
    // console.log(Projects.find());
    return Projects.find().fetch()
  }
});

Template.method.events({
  'click': function(){
        console.log("You clicked something");
    },
    'click .project' : function(event){
      console.log('project');
      Session.set('project', event.currentTarget.id)
      console.log(Session.get('project'));
    },
  'click .open': function(event){
        console.log('click');
        var x = document.getElementById("myFile").value;

        // var xobj = new XMLHttpRequest();
        //    xobj.overrideMimeType("application/json");
        //    xobj.open('GET', x, true); // Replace 'my_data' with the path to your file
        //    xobj.onreadystatechange = function () {
        //    if (xobj.readyState == 4 && xobj.status == "0") {
        //    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        //    console.log(xobj.responseText);
        //    }
        //    };
        //    console.log(xobj);
        //    xobj.send(null); 
        //    }

        // var xmlhttp = new XMLHttpRequest();

        // xmlhttp.onreadystatechange = function() {
        //         console.log(this.responseText);
        //         var myArr = JSON.parse(this.responseText);
        //         console.log(myArr);
            
        // };
        // xmlhttp.open("GET", x, true);
        // xmlhttp.send();


        // var json = JSON.stringify(x);
        // console.log(json);
        // var data=JSON.parse(json);
    
        // // x.disabled = true;
        // // var data = JSON.parse(Assets.getText(x));

        // console.log(data);

        // Projects.insert(data[0]);

        // data.forEach(function (item, index, array) {
        //     Projects.insert(item);
        //     console.log(Projects)
        // })
        // },
      }
  });

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});