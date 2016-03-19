var net = require('net');
var winston = require('winston');
var chatServer = net.createServer();
var clientList=[];
var chatRooms= new Map();

function  createChatRoom(name)
{
        this.name=name;
        this.users=[];
        this.count=0;
};


chatRooms.set("default",new createChatRoom("Gryffindor"));
chatRooms.set("Ravenclaw",new createChatRoom("Ravenclaw"));
chatRooms.set("Hufflepuff",new createChatRoom("Hufflepuff"));
chatRooms.set("Slytherin",new createChatRoom("Slytherin"));


function printChatRooms(handle)
{
//    for (var [key, value] of chatRooms) {
//        handle.write(key + "(" + value.count+")");
//    }
chatRooms.forEach(function(value, key) {
    handle.write(key + "(" + value.count+") \n");
        }, chatRooms);
    
    handle.write("##########end list############ \n");
        
    
}


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
function printAnchor(handle)
    {
        handle.write("\n"+handle.name+"<=");    
    };
            
  

chatServer.on('connection', function(client) {
  client.write('<=Welcome to the ChatRoomXYZ!\n');
  client.write('<=You are in ChatRoom:'+chatRooms.get("default").name+"("+chatRooms.get("default").count+")"+'!\n');
  
  var c= new chatClient(client,"Shashank");

  c.handle.message="name";
  client.write('<=Please enter a login name...\n');
  client.write("=>");     
  clientList.push(c);
  var room=chatRooms.get("default");
  room.count++;
  console.log(room);
    
    
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
                        printAnchor(c.handle);
                    
                }
                else if(data.toString().trim()=="/rooms")
                {   console.log("fetching chatrooms");
                    printChatRooms(c.handle);
                    printAnchor(c.handle);
                }
                else if(data.toString().trim()=="/help")
                {   console.log("fetching help");
                    c.handle.write("##########Commands############ \n");
                    c.handle.write("1.fetch users: /users \n");
                    c.handle.write("2.fetch ChatRooms: /rooms \n");
                    c.handle.write("3.exit: /quit \n");
                    c.handle.write("##########end list############ \n");
                    
                    printAnchor(c.handle);
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
                chatRooms.get("default").users.push(c.handle.name);
                c.handle.message=null;
                
            }else{
                for(var j=0;j<clientList.length;j++)
                    {
                            if(clientList[j].handle.name!=c.handle.name)
                            { clientList[j].handle.write("\n");
                                clientList[j].handle.write(c.handle.name+"<="+data);
                                printAnchor(c.handle);
                            }                        
                    }
            }
            
        }
      
    });

    
    
    
    
});

chatServer.listen(9000);
console.log("Chatserver listening on ... 9000")