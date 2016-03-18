var net = require('net');
var winston = require('winston');

var chatServer = net.createServer();


chatServer.on('connection', function(client) {
  client.write('<=Welcome to the ChatRoomXYZ!\n');
  client.write('<=Please enter a login name...\n');
  client.write("=>");     
  client.on('data',function(data){
        
        console.log("getting data");
        
        data=data.toString().trim();
        var actPattern=new RegExp("\/[a-z]");
        if (actPattern.test(data))
            {
                if(data.toString().trim()=="/quit")
                {   console.log("  useraction closing chat server....");
                    client.write("closing chat room");
                    client.end();    
                }
            }
        else
        {
            client.write(data);
        }
    });
    
});

chatServer.listen(9000);
console.log("Chatserver listening on ... 9000");