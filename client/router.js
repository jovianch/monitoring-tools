// FlowRouter.route('/monitor', {
//   name: 'monitor',
//   action() {
//     BlazeLayout.render('monitor', {});
//   }
// });

// FlowRouter.route('/method', {
//   name: 'method',
//   action() {
//     BlazeLayout.render('method', {});
//   }
// });

// FlowRouter.route('/update', {
//   name: 'update',
//   action() {
//     BlazeLayout.render('update', {});
//   }
// });

Router.route('/monitor', function () {
  this.render('monitor');
});

Router.route('/method', function () {
  this.render('method');
});

Router.route('/update', function () {
  this.render('update');
});