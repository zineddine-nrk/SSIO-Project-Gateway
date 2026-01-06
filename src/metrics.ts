import * as client from 'prom-client';

// registre global
export const register = new client.Registry();

// métriques automatiques (CPU, mémoire, etc.)
client.collectDefaultMetrics({
  register,
});
