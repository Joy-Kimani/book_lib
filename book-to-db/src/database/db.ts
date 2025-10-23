import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool:{
    max: 10,
    min: 0
    // timeoutMillis:100
  }
}
//holds the coonection key to the databse which is currently null
let poolConnection: sql.ConnectionPool | null;
//gets the database
export const connectDb = async()=>{
    //see if the connection exists and if it does we will use this connection
    if(poolConnection && poolConnection.connected) {
        console.log('Lets use this existing DB connection');
        //we shall return the existing connection
        return poolConnection;
    }
    try{
       poolConnection = await sql.connect(config);
        //log our message if it connects
        console.log('connected to db successfully');
        return poolConnection;
    }//log our message if it doesnt connect
    catch(error){
        console.error('Failed to connect to db',error);
        throw error;
    };
}
export const getDbConnectPool = (): sql.ConnectionPool => {
  if (!poolConnection || !poolConnection.connected) {
    throw new Error('DB not Connected')
  }
  return poolConnection
}

export default connectDb