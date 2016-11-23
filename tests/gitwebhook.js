var express = require('express');
var morgan = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
//var slack = require('./slackAlert');

var hostname = "localhost";
var port = 3000;

//ngrok url http://abd63058.ngrok.io

var slackNotify = function(hook, channel, message) {

  //var slack_hook = 'https://hooks.slack.com/services/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';

  var slack_hook = hook;

  var slack = require('slack-notify')(slack_hook);//acquire slack module
  //var channel = '#test_channel';//slack channel

  slack.success({
    username:   "github-bot",
    icon_emoji: ":github:",
    text:       message,
    channel:    channel
  });

  console.log("in slack notify");
  console.log("in slack Msg : " + message);
};


var app = express();

app.use( morgan('dev') );

var gitRouter = express.Router();

gitRouter.use( bodyParser.json() );

gitRouter.route('/')

  .post( function(req, res, next){

    console.log(JSON.stringify(req.headers));

    var message = "";

    if(req.body.commits)
    {
      //handling commits

      message = "Repo : " + req.body.repository.name + "\nPusher : " + req.body.pusher.name;
      message = message + "\nCommit Message : " + req.body.commits[0].message;
    }
    else if( req.body.pull_request )
    {
      //handling pull requests
      //console.log("in pull");

      message = "Repo : " + req.body.repository.name + "\nPull Requester : " + req.body.pull_request.user.login;
      message = message + "\nTitle : " + req.body.pull_request.title;

    }
    else if( req.body.forkee )
    {
      //handling forks
      //console.log("in forks");

      message = "Repo : " + req.body.repository.name + "\nForkee : " + req.body.forkee.owner.login;
      //message = message + "\nCommit Message : " + req.body.commits[0].message;

    }
    else if( req.body.action )
    {
      if(req.body.action == 'started')
      {
        //handling starred
        console.log("in starred");

        message = "Repo : " + req.body.repository.name + "\nStarred By : " + req.body.sender.login;
        //message = message + "\nCommit Message : " + req.body.commits[0].message;

      }
    }
    else
    {
        //print event from headers
        message = "Unhandled Event by " + req.body.sender.login + " on Repo : " + req.body.repository.name;
    }




    var slack_hook = 'https://hooks.slack.com/services/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';
    var channel = '#test_channel';//slack channel
    //var message = req.headers.toString();
    //var message = "Event : " + req.headers + " User : " + req.body.sender.login;

    slackNotify( slack_hook, channel, message );

    res.writeHead( 200, {"Content-Type":"text/plain"} );
    res.end( "Done" );

  } );

app.use( '/payload', gitRouter );


var server = http.createServer( app );

server.listen( port, hostname, function(){

  console.log(`Server running at http://${hostname}:${port}/`);

} );
