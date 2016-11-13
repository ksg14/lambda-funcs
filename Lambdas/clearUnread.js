var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();
var PubNub = require('pubnub');

exports.handler = function(event, context) {

    var table = "Chat_Users";
    var SenderID = event.params.querystring.userid;


    var params = {
      TableName:table,
      Key:{
          "SenderID" : SenderID
      },
      UpdateExpression: "set unread_count = :z",
      ExpressionAttributeValues:{
          ":z":0,
      },
      ReturnValues:"UPDATED_NEW"
    };


    //console.log("Updating the item...");

    dynamo.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            context.fail();
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));


            var pubnub = new PubNub({
                        subscribeKey: "sub-c-ec403f8c-8fa8-11e6-a68c-0619f8945a4f",
                        publishKey: "pub-c-a97f9f51-aedf-46ce-8006-051a05e502b8",
                        secretKey: "sec-c-ODQxYmNmZGMtMzU5Yy00MzFlLWFhNzAtMmU0NjI3ODc5ODQ3",
                        logVerbosity: true,
                        ssl: true,
                        presenceTimeout: 130
                    });


                    function publishSampleMessage(pubnub, notify) {

                      var channel_string = event.params.querystring.pageid + ":unread";
                      console.log(channel_string);

                        pubnub.publish(
                            {
                                    message: notify ,
                                    channel: channel_string,// <- PageID:unread
                            },
                            function (status, response) {
                                // handle status, response
                                //console.log(response);
                                context.done(null, {});
                            }
                        );


                    }

                    var notify = {

                      "user_id" : event.params.querystring.userid
                    };

                    publishSampleMessage(pubnub, notify);


            //context.done(null, {});
        }
    });

};
