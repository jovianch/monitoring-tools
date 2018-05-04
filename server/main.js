import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
 //    Meteor.call('removeAllProject');

 //    var data = JSON.parse(Assets.getText("SCRUM_2.json"));

 //    data.forEach(function (item, index, array) {
 //        Projects.insert(item);
 //    })
	// Meteor.call('newProject');
});

Meteor.publish('Projects', function () {
	return Projects.find({_id:"iwjTMn3i67J4Tn6yK"});
});

// Meteor.publish('Alphas', function () {
//     return Projects.findOne().alphas;
// });

newProject = function() {
    var alphasClient = {
        alphas: {
            "Opportunity": {
                name: "Opportunity",
                concern: "Customer",
                description: "The set of circumstances that makes it appropriate to develop or change a software system",
                isadded: false,
                states: {
                    "Identified": {
                        name: "Identified",
                        order: 1,
                        alpha: "Opportunity",
                        concern: "Customer",
                        description: "A commercial, social, or business opportunity has been identified that could be addressed by a software-based solution",
                        checklists: {
                            1: "An idea for a way of improving current ways of working, increasing market share, or applying a new or innovative software system has been identified.",
                            2: "At least one of the stakeholders wishes to make an investment in better understanding the opportunity and the value associated with addressing it.",
                            3: "The other stakeholders who share the opportunity have been identified."
                        }
                    }, 
                    "SolutionNeeded": {
                        name: "Solution Needed",
                        order: 2,
                        alpha: "Opportunity",
                        concern: "Customer",
                        description: "The need for a software-based solution has been confirmed",
                        checklists: {
                            1: "The stakeholders in the opportunity and the proposed solution have been identified.",
                            2: "The stakeholders' needs that generate the opportunity have been established.",
                            3: "Any underlying problems and their root causes have been identified.",
                            4: "It has been confirmed that a software-based solution is needed.",
                            5: "At least one software-based solution has been proposed."
                        }
                    }, 
                    "ValueEstablished": {
                        name: "Value Established",
                        order: 3,
                        alpha: "Opportunity",
                        concern: "Customer",
                        description: "The value of a successful solution has been established",
                        checklists: {
                            1: "The value of addressing the opportunity has been quantified either in absolute terms or in returns or savings per time period (e.g., per annum).",
                            2: "The impact of the solution on the stakeholders is understood.",
                            3: "The value that the software system offers to the stakeholders that fund and use the software system is understood.",
                            4: "The success criteria by which the deployment of the software system is to be judged are clear.",
                            5: "The desired outcomes required of the solution are clear and quantified."
                        }
                    }, 
                    "Viable": {
                        name: "Viable",
                        order: 4,
                        alpha: "Opportunity",
                        concern: "Customer",
                        description: "It is agreed that a solution can be produced quickly and cheaply enough to successfully address the opportunity",
                        checklists: {
                            1: "A solution has been outlined.",
                            2: "The indications are that the solution can be developed and deployed within constraints.",
                            3: "The risks associated with the solution are acceptable and manageable.",
                            4: "The indicative (ball-park) costs of the solution are less than the anticipated value of the opportunity.",
                            5: "The reasons for the development of a software-based solution are understood by all members of the team.",
                            6: "It is clear that the pursuit of the opportunity is viable."
                        }
                    }, 
                    "Addressed": {
                        name: "Addressed",
                        order: 5,
                        alpha: "Opportunity",
                        concern: "Customer",
                        description: "A solution has been produced that demonstrably addresses the opportunity",
                        checklists: {
                            1: "A usable system that demonstrably addresses the opportunity is available.",
                            2: "The stakeholders agree that the available solution is worth deploying.d",
                            3: "The stakeholders are satisfied that the solution produced addresses the opportunity."
                        }
                    }, 
                    "BenefitAccrued": {
                        name: "Benefit Accrued",
                        order: 6,
                        alpha: "Opportunity",
                        concern: "Customer",
                        description: "The operational use or sale of the solution is creating tangible benefits",
                        checklists: {
                            1: "The solution has started to accrue benefits for the stakeholders.",
                            2: "The return-on-investment profile is at least as good as anticipated."
                        }
                    }
                },
                subalphas: [{name:"Sprint", bound:"1..*", states:["lala", "lili", "ini bakal terurut statesnya"], checklists:["ini panjang bgt", "hohohoho ini terurut"]}],
                workproducts: [{name:"Sprint Backlog", bound: "0..*"}, {name:"Sprint Backlog2", bound: "1..*"}, {name:"Sprint Backlog3", bound: "1"}]
            }
        }
    }

    projectId = Projects.insert(
        {
            alphas : {
                "lalala" : {
                    name : "jovian"
                }
            }
        });

	// projectId = Projects.insert(
 //    	{ name : "aaa", description : "bbbb"}
 //    );
 //    projectId = Projects.insert(
 //    	{ name : "ccc", description : "ddd"}
 //    );

    return projectId;
};

removeAllProject = function() {
    return Projects.remove({});
};

Meteor.methods({
    newProject: function() {
        return newProject();
    },
    removeAllProject: function() {
        return removeAllProject();
    }
});
