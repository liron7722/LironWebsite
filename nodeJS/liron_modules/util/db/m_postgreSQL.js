
const { Client } = require('pg');
const client = new Client({ ssl: true });
(async () => {
    await client.connect();
    let sql = 'SELECT $1::text as message';
    const res = await client.query(sql, ['Hello world!']);
    console.log(res.rows[0].message); // Hello world!
    await client.end()
})();
