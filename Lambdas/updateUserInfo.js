var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {
/*
    var email_key = event.email;
    var name_key = event.name;
    
  var item = { email:"something",
                name:"karan"
              // users: event.users || {}
          };
*/
  var callback = function(err, data) {
    if (err) {
      console.log(err);
      context.fail('unable to update at this time');
    } else {
      console.log(data);
      context.done(null, data);
    }
  };
//Simply push the received object, need some intelligence in the SPA (the key value pairs must not be nested) works for me right now
  dynamo.putItem({TableName:"Plug_Users", Item: event}, callback);
};
