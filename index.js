const httpProxy = require("http-proxy");
const fs = require("fs");
const https = require("https");
const http = require("http");

// holmes dev server
startProxyServers();

function startProxyServers() {
  const stageProxy = new httpProxy.createProxyServer({
    target: "http://10.136.136.36:8080",
  });

  const stageHttpServer = http.createServer(function (req, res) {
    res.on("error", (error) => {
      console.log("Error", error);
    });
    stageProxy.web(req, res);
  });

  stageHttpServer
    .on("upgrade", function (req, socket, head) {
      console.log("upgrade stage");
      socket.on("error", (error) => {
        console.log("socket Error", error);
      });
      stageProxy.ws(req, socket, head);
    })
    .listen(8336);

  const devProxy = new httpProxy.createProxyServer({
    target: "http://10.136.136.31:8080",
  });

  const devProxyServer = http.createServer(function (req, res) {
    res.on("error", (error) => {
      console.log("Error", error);
    });
    devProxy.web(req, res);
  });

  devProxyServer
    .on("upgrade", function (req, socket, head) {
      console.log("upgrade");
      socket.on("error", (error) => {
        console.log("socket Error", error);
      });
      devProxy.ws(req, socket, head);
    })
    .listen(8333);

  // nexus

  httpProxy
    .createProxyServer({ target: "http://10.136.217.47:8080" })
    .listen(8080);
  httpProxy
    .createProxyServer({ target: "http://10.136.132.96:8080" })
    .listen(8096);

  httpProxy
    .createProxyServer({ target: "http://10.136.208.75:8080" })
    .listen(8083);
  httpProxy
    .createProxyServer({ target: "http://10.136.208.54:8080" })
    .listen(8084);
  // npm server

  httpProxy
    .createProxyServer({ target: "http://10.148.208.49:8081" })
    .listen(8081);

  //docker
  httpProxy
    .createProxyServer({ target: "http://10.148.208.49:8080" })
    .listen(8180);
  httpProxy
    .createProxyServer({ target: "http://10.148.208.49:8082" })
    .listen(8182);

  // gitlab server
  httpProxy.createProxyServer({ target: "http://10.146.208.7" }).listen(8001);

  httpProxy
    .createProxyServer({ target: "http://10.136.208.34:8080" })
    .listen(8034);

  httpProxy
    .createProxyServer({ target: "http://10.136.208.36:8080" })
    .listen(8036);
  httpProxy
    .createProxyServer({ target: "http://10.136.208.23:8080" })
    .listen(8023);

  // dg3
  httpProxy
    .createProxyServer({ target: "http://10.136.132.145:8080" })
    .listen(8140);

  // wj3
  httpProxy
    .createProxyServer({ target: "http://10.136.132.140:8080" })
    .listen(8141);
}

/*
// holmes stage server
httpProxy
  .createProxyServer({ target: "http://10.136.132.92:8080" })
  .listen(8010);
  
*/

// WJ3
//10.136.208.75:8080/holmes-web/equipmentParameterMonitoring/rootcause/list/interval?executeStatus=cycle-interval&startTime=2021-10-06T16:00:00.000Z&endTime=2021-10-14T15:59:59.999Z&rangeType=last7days

//10.136.217.47:8080

// holmes stage server
/*
httpProxy
  .createProxyServer({ target: "http://10.136.132.96:8080" })
  .listen(8002);

httpProxy
  .createProxyServer({
    target: {
      protocol: "https:",
      host: "jiradelta.deltaww.com",
      port: 443,
      ca: fs.readFileSync("./jira.cert.p7b"),
    },
    changeOrigin: true,
    agent: https.globalAgent,
    secure: false,
  })
  .listen(8013);
  */
