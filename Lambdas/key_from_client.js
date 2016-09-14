//First ever Lamda
console.log('Token JSON from Client');

exports.handler = function(event, context){
    //Request parameter should follow token key
    context.succeed("Token from Client SPA - " + event.token);
    context.done(null, 'Hello from the other side');
};