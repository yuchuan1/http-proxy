const httpProxy = require("http-proxy");
const http = require("http");

const createProxyServer = (config) => {
  let server;

  const startServer = () => {
    const proxy = new httpProxy.createProxyServer({ target: config.target });

    server = http.createServer((req, res) => {
      res.on("error", (error) => console.log("Response Error", error));
      proxy.web(req, res);
    });

    server.on("upgrade", (req, socket, head) => {
      console.log(`upgrade ${config.target}`);
      socket.on("error", (error) => console.log("Socket Error", error));
      proxy.ws(req, socket, head);
    });

    server.on("error", (error) => {
      console.log(`Server Error: ${error}`);
      server.close(() => {
        console.log(`Restarting server for ${config.target} on port ${config.port}`);
        startServer();
      });
    });

    server.listen(config.port);
    console.log(`Listening on port ${config.port}`);
  };

  startServer();
};

const startProxyServers = () => {
  const proxyConfigs = [
    { target: "http://10.136.136.36:8080", port: 8336 }, // Holmes dev server
    { target: "http://10.136.136.31:8080", port: 8333 }, // Dev server
    { target: "http://10.136.132.145:8080", port: 8145 }, // WJ3 server
    { target: "http://10.148.208.48:8084", port: 8184 }, // Analytics for dev
    { target: "http://10.148.208.47:8084", port: 8185 }, // Analytics for production
    { target: "http://10.136.217.47:8080", port: 8080 }, // Nexus server
    { target: "http://10.136.132.96:8080", port: 8096 }, // Another Nexus server
    { target: "http://10.136.208.75:8080", port: 8083 }, // Custom server 1
    { target: "http://10.136.208.54:8080", port: 8084 }, // Custom server 2
    { target: "http://10.148.208.49:8081", port: 8081 }, // NPM server
    { target: "http://10.148.208.49:8080", port: 8180 }, // Docker server 1
    { target: "http://10.148.208.49:8082", port: 8182 }, // Docker server 2
    { target: "http://10.146.208.7", port: 8001 }, // GitLab server
    { target: "http://10.136.208.34:8080", port: 8034 }, // Custom server 3
    { target: "http://10.136.208.36:8080", port: 8036 }, // Custom server 4
    { target: "http://10.136.208.23:8080", port: 8023 }, // Custom server 5
    { target: "http://10.136.132.140:8080", port: 8141 }, // Custom server 6
  ];

  proxyConfigs.forEach((config) => {
    createProxyServer(config);
  });
};

startProxyServers();
