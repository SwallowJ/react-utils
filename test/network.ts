import http from "http";
import dayjs from "dayjs";
import { fork } from "child_process";

const server = http.createServer();

server.on("request", (req, res) => {
	console.log(`[${dayjs().format("YYYY-MM-DD HH-mm:ss")}][5000] ${req.method}- ${req.url}`);
	res.setHeader("Content-type", "text/html;charset=utf-8").end("<h1>Hello World</h1>");
});

server.listen(5000, "0.0.0.0", () => {
	console.log("=====", server.address());
});

// process.on("SIGINT", () => {
// 	console.log("#########");
// });

const filename = "./script/model/listen";

const child = fork(filename);

child.send("hhhhhh");
child.on("message", (msg) => {
	console.log(`parent:`, msg);
});
