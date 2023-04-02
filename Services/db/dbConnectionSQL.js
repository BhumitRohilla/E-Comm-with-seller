const sql = require('mssql');

const dbConfig={
  user: 'admin',
  password: 'admin',
  server:'LAPTOP-46BPBE09',
  database: 'E-COMM',
  options: {
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

async function newConnectionSQL(queury){
  const pool = await sql.connect(dbConfig);
  const result = await pool.request().query(queury);
  await pool.close();
  return result.recordset;
}


module.exports ={newConnectionSQL};