
var slackNotify = function(hook, channel, message) {

  //var slack_hook = 'https://hooks.slack.com/services/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';

  var slack_hook = hook;

  var slack = require('slack-notify')(slack_hook);//acquire slack module
  //var channel = '#test_channel';//slack channel

  slack.success({
   text: message,
   channel: channel
  });

};

exports.slackNotify = slackNotify;
