exports.handler = function(event, context) {

  try {

    var verify_token = 'my_awesome_token';//my token, expected to be received


    if(event.params && event.params.querystring)
    {   // for GET request
        var queryParams = event.params.querystring;// From Mapping template for integration request
        var VerifyToken = queryParams['hub.verify_token']

        if (VerifyToken === verify_token)
        {
            var challenge = queryParams['hub.challenge']
            context.done(null, parseInt(challenge));//Send back challenge
        }
        else
        {
            context.done(null, 'Error, wrong validation token');
        }
    }
  }  catch (error) {
     context.fail("Caught: " + error);
   }
};
