var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();
var PubNub = require('pubnub');
var https = require('https');
var PAGE_TOKEN = "EAACw84y2ZAZBEBAJR0u4PY53YnT9eB8x6bs6Jqidkom6i0SfF81JsNcS4JbbmJXMvL9vrmEk6Sk97DZCvb7iSmM3eWNmBq0hDhv7JFdEUkUYa8gCTwWK7jZCPkDQCB7qb4UpXglWtBhWcQWKOSnF1WZAq1yPyDWE190gt5YRq3wZDZD";
/*
{
    "SenderID":"1621225528175698",
    "RecipientID":"1109074349205972",
    "Msg":"test for func",
    "MessageID":"sesaf",
    "kind":"outbound",
    "Date":"1477512010013"
}
*/
exports.handler = function(event, context) {
    // TODO implement

    var callback = function(err, data) {
    if (err) {
      console.log(err);
      context.fail('unable to update at this time');
    } else {
      //console.log(data);
      //context.done(null, data);

      var sendFbMessage = function sendTextMessage() {

          var json = {

            "recipient": {"id": event.RecipientID},
            "message": {"text": event.Msg}

          };
          var body = JSON.stringify(json);

          var path = "/v2.6/me/messages?access_token=" + PAGE_TOKEN;

          var options = {
            host: "graph.facebook.com",
            path: path,
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
          };

          var callback = function(response) {

            var str = '';
            response.on('data', function (chunk)
            {
              str += chunk;
              console.log(str); //logs FB's response (recipientid and msg id)
            });
            response.on('end', function ()
            {
                context.done(null,{});
            });
          }

          var req = https.request(options, callback);

          req.on('error', function(e)
          {
            console.log('problem with request: '+ e);
            context.fail(e,{});
          });

          req.write(body);//send json
          req.end();
    };


      var pubnub = new PubNub({
                        subscribeKey: "sub-c-ec403f8c-8fa8-11e6-a68c-0619f8945a4f",
                        publishKey: "pub-c-a97f9f51-aedf-46ce-8006-051a05e502b8",
                        secretKey: "sec-c-ODQxYmNmZGMtMzU5Yy00MzFlLWFhNzAtMmU0NjI3ODc5ODQ3",
                        logVerbosity: true,
                        ssl: true,
                        presenceTimeout: 130
                    });


                    function publishSampleMessage(pubnub, notify) {

                        pubnub.publish(
                            {
                                    message: notify ,
                                    channel: notify.SenderID,
                            },
                            function (status, response) {
                                // handle status, response
                                //console.log(response);
                                sendFbMessage();
                            }
                        );


                    }

                    var notify = {

                      //"MessageID":  messagingEvents[0].message.mid,
                      "SenderID":  event.SenderID,
                      "RecipientID": event.RecipientID,
                      "Date": event.Date.toString()

                    };

                    publishSampleMessage(pubnub, notify);



    }
  };

  dynamo.putItem({TableName:"Plug_Msg", Item: event}, callback);
};
