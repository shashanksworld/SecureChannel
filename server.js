var net = require('net');
var winston = require('winston');
var chatServer = net.createServer();
var clientList=[];

//generic chatClient for allchat rooms
function chatClient(handle,user){
    this.handle=handle;
    this.username=user;
}

chatClient.prototype.dump=function()
{
        console.log(this.handle);
        console.log(this.username);
    
};

chatClient.prototype.setName=function(name)
{
    this.username=name;
    
};

function getClientList()
{
    var users=[];
    for(var i=0;i<clientList.length;i++)
    {
        users.push(clientList[i].handle.name);
        }
        return JSON.stringify(users);
    
}

chatServer.on('connection', function(client) {
  client.write('<=Welcome to the ChatRoomXYZ!\n');
    
  var c= new chatClient(client,"Shashank");
  
  c.handle.message="name";
  client.write('<=Please enter a login name...\n');
  client.write("=>");     
  clientList.push(c);
      
            
    
  c.handle.on('data',function(data){
        console.log("getting data");
        
        
        data=data.toString().trim();
        var actPattern=new RegExp("\/[a-z]");
        if (actPattern.test(data))
            {
                if(data.toString().trim()=="/quit")
                {   console.log("  useraction closing chat server....by"+c.handle.name);
                     c.handle.write("closing chat room");
                     c.handle.end();        
                }
                else if(data.toString().trim()=="/users")
                {   console.log("fetching userlist");
                    console.log(getClientList());
                    c.handle.write(getClientList());
                }
                else if(data.toString().trim()=="/cast")
                {   console.log("setting broadcast");
                    for(var k=0;k<clientList.length;k++)
                    {
                            clientList[k].handle.write("\n");
                            clientList[k].handle.write(c.handle.name+"<="+"Hello ");
                    }
                    
                }

            }
        else
        {
            if(c.handle.message!=null && c.handle.message=="name")
            {
                c.handle.name=data;
                console.log("handle name",c.handle.name);
                c.handle.write(data+"<=");
                c.handle.message=null;
            }else{
                c.handle.write(c.handle.name+"<=");
            }
            
        }
    });
    
    
    
    
});

chatServer.listen(9000);
console.log("Chatserver listening on ... 9000");