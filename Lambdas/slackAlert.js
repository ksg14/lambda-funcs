function(user, context, callback) {
  // Rule for slack alert upon authentication
  if (context.stats.loginsCount > 1) return callback(null, user, context);//checks only for sign up


  var slack_hook = ' Type your slack hook url ';

  var slack = require('slack-notify')(slack_hook);//acquire slack module
  var message = 'New User: ' + (user.name || user.email) + ' ( ' + user.identities[0].provider + ': ' + user.time_zone + ' )';
  var channel = '#random';//slack channel

  slack.success({
   text: message,
   channel: channel
  });

  callback(null, user, context);
}
