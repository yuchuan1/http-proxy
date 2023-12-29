const httpProxy = require("http-proxy");
const http = require("http");

let servers = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createProxyServer = (config) => {
  const startServer = async () => {
    const proxy = httpProxy.createProxyServer({ target: config.target });

    proxy.on("error", async (error) => {
      console.log(`Proxy Error: ${error}`);
      await delay(2000);
      startServer();
    });

    const server = http.createServer((req, res) => {
      res.on("error", (error) => console.log("Response Error", error));
      proxy.web(req, res);
    });

    server.on("upgrade", (req, socket, head) => {
      console.log(`upgrade ${config.target}`);
      socket.on("error", (error) => console.log("Socket Error", error));
      proxy.ws(req, socket, head);
    });

    server.on("error", async (error) => {
      console.log(`Server Error: ${error}`);
      if (error.code === "EADDRINUSE") {
        console.log(`Port ${config.port} is in use. Waiting before restart.`);
        await delay(5000);
      }
      server.close(async () => {
        console.log(
          `Restarting server for ${config.target} on port ${config.port}`
        );
        await delay(2000);
        startServer();
      });
    });

    server.listen(config.port, () => {
      console.log(`Listening on port ${config.port}`);
      servers.push(server);
    });
  };

  startServer();
};

const startProxyServers = () => {
  const proxyConfigs = [
    { target: "http://10.136.136.36:8080", port: 8336 }, // stage server
    { target: "http://10.136.136.31:8080", port: 8333 }, // Dev server
    { target: "http://10.136.136.33:8080", port: 8334 }, // SNR Dev server
    { target: "http://10.136.132.145:8080", port: 8145 }, // WJ3 server
    { target: "http://10.136.132.131:8080", port: 8146 }, // TY1 server
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
    { target: "http://10.136.136.33:8081", port: 8881 }, // Custom server 7 demo oauth
    { target: "http://10.136.136.33:8080", port: 8882 }, // Custom server 8 demo oauth swagger
  ];

  proxyConfigs.forEach((config) => {
    createProxyServer(config);
  });
};

startProxyServers();
