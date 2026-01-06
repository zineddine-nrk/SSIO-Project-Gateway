import client from "prom-client";

const register = new client.Registry();

// Metrics automatiques Node.js : CPU, RAM, event loop
client.collectDefaultMetrics({ register });

export default register;
