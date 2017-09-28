var ws = require("nodejs-websocket")

var PORT = 8000;

var clientCount = 0;

// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (conn) {
    console.log("新的连接...");
    clientCount++;
    conn.nickname = "用户" + clientCount;
    var msg = {};
    msg.type = "进入";
    msg.data = conn.nickname + "进入了聊天室";
    broadcast(JSON.stringify(msg));
    conn.on("text", function (str) {
        console.log("接收到内容: "+str);
        msg.type = "内容";
	    msg.data = conn.nickname + "说:"+ str;
	    broadcast(JSON.stringify(msg));
    })
    conn.on("close", function (code, reason) {
        console.log("连接已关闭!");
        msg.type = "离开";
	    msg.data = conn.nickname + "离开了聊天室";
	    broadcast(JSON.stringify(msg));
    })
    conn.on("error",function (err) {
    	console.log("处理错误...");
    	console.log(err);
    })
}).listen(PORT)

console.log("websocket服务已开启，端口号:"+PORT);


function broadcast(str) {
	server.connections.forEach(function(connection) {
		connection.sendText(str);
	})
}