import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const dbConfig: sql.config = {
  port: 1433,
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD ,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'BookLibrary',
  connectionTimeout:15000,
  pool:{
    max:10,
    min:0,
    idleTimeoutMillis:30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
}
//create a connection pool
let globalPool:sql.ConnectionPool | null = null;
const initDatabaseConnection = async()=>{
  if(globalPool){
    console.log("using db connection")
    return globalPool
  }
  try{
    const globalPool = await sql.connect(dbConfig)
    console.log("connect to ms sql db")
    return globalPool;
    }catch(err){
      console.log("db is not connected", err)
      throw err
  }
}
//function to connect
export async function connectDB() {
  try {
    const poolConnection = await sql.connect(dbConfig)
    console.log(`Connected to SQL Server database: ${dbConfig.database} on ${dbConfig.server}`)
    return poolConnection
  } catch (err) {
    console.error('Database connection failed:', err)
    throw err
  }
}