var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {

  try {

    if(event.params && event.params.querystring)
    {   // for GET request to verify webhook

        var verify_token = 'my_awesome_token';

        var queryParams = event.params.querystring;
        var VerifyToken = queryParams['hub.verify_token']

        if (VerifyToken === verify_token)
        {
            var challenge = queryParams['hub.challenge']
            context.done(null, parseInt(challenge));
        }
        else
        {
            context.done(null, 'Error, wrong validation token');
        }

    }
    // process POST request
    else
    { //recives messeges from FB Page

      var messagingEvents = event.entry[0].messaging;

      for (var i = 0; i < messagingEvents.length; i++) {

        var messagingEvent = messagingEvents[i];
        var sender = messagingEvent.sender.id;

        var callback = function(err, data) {

          if (err)
          {
            console.log(err);
            context.fail('unable to update at this time');
          }
          else
          {

            context.done(null, {});
          }
        };

        if (messagingEvent.message && messagingEvent.message.text)
        {
          var text = messagingEvent.message.text;

          var tableName = "PlugMessage";
          var datetime = new Date().getTime().toString();

          var messageItems = {"TableName": tableName,
              "Item" : {
                  "SenderID": sender ,
                  "MessageID": messagingEvent.message.mid ,
                  "RecipientID": messagingEvent.recipient.id,
                  "Date":  datetime ,
                  "Msg": text}
              };

          dynamo.putItem(messageItems, callback);
        }
      }
    }//else Close

  }  catch (error) {
     context.fail("Caught: " + error);
   }
};
