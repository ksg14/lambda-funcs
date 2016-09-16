//Lambda to Query an item from DynamoDB Table

var AWS = require('aws-sdk');// Using aws sdk for node.js
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {
  var callback = function(err, data) { // callback with error and data objects
    if (err) {
      console.log('error on getUserInfo: ', err);
      context.done('Unable to retrieve user information', null);
    } else {
      if(data.Item && data.Item.users) {
        context.done(null, data.Item.users);
      } else {
        context.done(null, {});
      }
    }
  };

  dynamo.getItem({TableName:"Plug_Users", Key:{email:"something"}}, callback);//Querying for email : something in Table Plug_users
};