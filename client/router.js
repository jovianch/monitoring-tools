FlowRouter.route('/monitor', {
  name: 'monitor',
  action() {
    BlazeLayout.render('monitor', {});
  }
});

FlowRouter.route('/method', {
  name: 'method',
  action() {
    BlazeLayout.render('method', {});
  }
});

FlowRouter.route('/update', {
  name: 'update',
  action() {
    BlazeLayout.render('update', {});
  }
});