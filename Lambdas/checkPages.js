var request = require("request");
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

exports.handler = function(event, context) {

    var callback = function(err, data) {
    if (err) {//Handles all errors need to break it down for specific erros to display appropriate error messages
      console.log('error on getUserInfo: ', err);
      context.done('Unable to retrieve user information.', null);
    } else {

      var token = data.Item.identities[0].access_token;

      var token = token;

      var pages = [];

      var options = { method: 'GET',
      url: "https://graph.facebook.com/v2.6/me/accounts?access_token=" + token,
      headers: { 'content-type': 'application/json' } };

      request(options, function (error, response, body) {
          if (error) throw new Error(error);

          //console.log(body);

          var obj = JSON.parse(body);

          //console.log("\n\n " + obj.data.length);

          var i, j, k = 0, flag;

          for(i=0; i<obj.data.length; i++)
          {
              flag = 0;
              for(j=0; j<obj.data[i].perms.length; j++)
                  {
                      if(obj.data[i].perms[j] == "CREATE_CONTENT" || obj.data[i].perms[j] == "MODERATE_CONTENT")
                          flag++;
                  }
              if(flag == 2)
                  {
                      pages[k] = obj.data[i].name;
                      k++;
                  }
          }

          console.log("Pages = " + pages);

          context.done(null,pages);
      });




      }
  };



    dynamo.getItem({TableName:"Plug_Users", Key:{email:event.params.querystring.email, name: event.params.querystring.name}}, callback);
}
