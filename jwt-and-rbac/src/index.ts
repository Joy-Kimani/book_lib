import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import connectDb from './database/db.js'
import bookRoutes from './authuser.route.js'
import { prometheus } from '@hono/prometheus'
import { logger } from 'hono/logger'
import { limiter } from './middleware/ratelimiting.js'

const app = new Hono()

const { printMetrics, registerMetrics } = prometheus()

app.use('*', registerMetrics)
app.get('/metrics', printMetrics)
// app.get('/', (c) => c.text('fo'))

app.use('*', logger());

app.use(limiter);
//default route
app.get('/', (c) => {
  return c.json({
    message:'Hello this is my library for books!',
    documentation:'refer to /api to fetch, add, update and delets a book'
  })
})
//api routes
app.get('/api',(c)=>{
  return c.json({
    message:'this is a library',
    routes:{
      books:{
        getAll: '/api/books [GET]',
        getById: '/api/books/:book_id [GET]',
        create: '/api/books [POST]',
        update: '/api/book/:book_id [PUT]',
        delete: '/api/books/:book_id [DELETE]'
      }
    }
  })
})
// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Route not found',
    path: c.req.path
  }, 404);
});

//mount routes
app.route("/api", bookRoutes);


// app.get('/books', async (c) => {
//   try {
//     const pool = await connectDb()
//     const result = await pool.request().query('SELECT * FROM book')
//     return c.json(result.recordset)
//   } catch (err: any) {
//     console.error('Error in /books route:', err)
//     return c.json({ error: err.message || 'Unknown database error' }, 500)
//   }
// })


//start the db connection before opening the port 3000
connectDb().then(()=>
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
)
