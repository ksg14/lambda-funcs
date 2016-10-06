exports.handler = function(event, context) {

  try {

    var verify_token = 'my_awesome_token';


    if(event.params && event.params.querystring)
    {   // for GET request
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
  }  catch (error) {
     context.fail("Caught: " + error);
   }
};
