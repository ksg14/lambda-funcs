//Lambda to Add an item to DynamoDB Table

var AWS = require('aws-sdk'); // Using aws sdk for node.js
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {
  var item = { email:"something", //item to be added
               users: event.users || {}
          };

  var callback = function(err, data) { // callback with error and data objects
    if (err) {
      console.log(err);
      context.fail('unable to update at this time');
    } else {
      console.log(data);
      context.done(null, data);
    }
  };

  dynamo.putItem({TableName:"Plug_Users", Item:item}, callback);//Adding item to Table
};