import httpProxy from "http-proxy";
import http from "http";

type ProxyConfig = {
  target: string;
  port: number;
  name?: string;
};

const createProxyServer = (config: ProxyConfig) => {
  const proxy = httpProxy.createProxyServer({
    target: config.target,
    keepAlive: true,
  });

  const server = http.createServer((req, res) => {
    res.on("error", (error) => console.log("Error", error));
    proxy.web(req, res);
  });

  server.on("upgrade", (req, socket, head) => {
    console.log(`upgrade ${config.name || ""}`);
    socket.on("error", (error) => console.log("socket Error", error));
    proxy.ws(req, socket, head);
  });

  server.listen(config.port);
};

const startProxyServers = () => {
  const proxyConfigs: ProxyConfig[] = [
    // Stage Server
    { target: "http://10.136.136.36:8080", port: 8336, name: "stage" },
    
    // Dev Server
    { target: "http://10.136.136.31:8080", port: 8333, name: "dev" },
    
    // WJ3 Server
    { target: "http://10.136.132.145:8080", port: 8145, name: "wj3" },
    
    // Analytics for Dev
    { target: "http://10.148.208.48:8084", port: 8184 },
    
    // Analytics for Production
    { target: "http://10.148.208.47:8084", port: 8185 },
    
    // Nexus Server
    { target: "http://10.136.217.47:8080", port: 8080 },
    
    // Another Nexus Server
    { target: "http://10.136.132.96:8080", port: 8096 },
    
    // Some Server
    { target: "http://10.136.208.75:8080", port: 8083 },
    
    // Another Server
    { target: "http://10.136.208.54:8080", port: 8084 },
    
    // NPM Server
    { target: "http://10.148.208.49:8081", port: 8081 },
    
    // Docker Server 1
    { target: "http://10.148.208.49:8080", port: 8180 },
    
    // Docker Server 2
    { target: "http://10.148.208.49:8082", port: 8182 },
    
    // GitLab Server
    { target: "http://10.146.208.7", port: 8001 },
    
    // Another Server
    { target: "http://10.136.208.34:8080", port: 8034 },
    
    // Yet Another Server
    { target: "http://10.136.208.36:8080", port: 8036 },
    
    // One More Server
    { target: "http://10.136.208.23:8080", port: 8023 },
    
    // Last Server
    { target: "http://10.136.132.140:8080", port: 8141 },
  ];

  proxyConfigs.forEach(createProxyServer);
};

startProxyServers();
