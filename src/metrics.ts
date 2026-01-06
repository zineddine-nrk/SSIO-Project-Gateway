import * as client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register }); // metrics automatiques Node.js

export default register;
