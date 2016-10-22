
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();
var request = require("request");

console.log('Loading function');

exports.handler = function(event, context)
{
    var senderid = [];//array for the sender ids
    //console.log('Received event:', JSON.stringify(event, null, 2));
    event.Records.forEach(function(record)
    {
        //console.log(record.eventID);
        //console.log(record.eventName);
        //console.log('DynamoDB Record: %j', record.dynamodb);
        //console.log(record.dynamodb.NewImage.SenderID.S);
        senderid.push(record.dynamodb.NewImage.SenderID.S);//populating the sender id array
    });

    //console.log( 'Successfully processed' +  event.Records.length + ' records.');

    var writeToDb = function(senderid, name){

        var data = {
          "id" : senderid,
          "name" : name
        };

        var callbackDB = function(err, data) {
        if (err) {
          console.log(err);
          context.fail('unable to update at this time');
        } else {
          console.log(data);
          context.done(null, data);
        }
      };

      dynamo.putItem({TableName:"Users", Item: data}, callbackDB);
    };

    var page_token = "page_token";

    var id = senderid[0];//only pushing the first record on the db(generally the case)

    var options = { method: 'GET',
    url: "https://graph.facebook.com/v2.8/"+id+"?access_token="+page_token,
    headers: { 'content-type': 'application/json' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        //console.log(body);

        var obj = JSON.parse(body);


        //console.log("\n\n " + obj.data.length);
        var name = obj.first_name + ' ' + obj.last_name;
        console.log(name);

        writeToDb(id, name);
    });

};
