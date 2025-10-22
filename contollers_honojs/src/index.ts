import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import bookRoutes from './books/books.routes.js';

const app = new Hono()

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Hono.js API Server',
    status: 'running'
  });
});


// if not found
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Path not found',
    path: c.req.path
  }, 404);
});

// Mount API routes
app.route("/api", bookRoutes);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})