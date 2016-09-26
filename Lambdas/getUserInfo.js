var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {
  var callback = function(err, data) {
    if (err) {//Handles all errors need to break it down for specific erros to display appropriate error messages
      console.log('error on getUserInfo: ', err);
      context.done('Unable to retrieve user information', null);
    } else {

        console.log(data.Item);// Remember data is pushed using the Item key as a param of the DynamoDB putItem
      if(data.Item && data.Item.email) {
        context.done(null, data.Item.name);

      } else {
        context.done(null, {});//Prints empty object if nothing is contained in Item (<- ironic ?)
      }
    }
  };

  dynamo.getItem({TableName:"Plug_Users", Key:{email:"someKey",name:"some sort key"}}, callback);//params for DB
};
