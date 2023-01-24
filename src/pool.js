const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const oracledb = require('oracledb');



var connection;
var oracleConnection;

const initConnection = (env) => {
    var config = {
        server: `${env.DBHOST}`, // or "localhost"
        options: {
            trustServerCertificate: true,
        },
        database: `${env.DBNAME}`,
        authentication: {
            type: "default",
            options: {
                userName: env.DBUSERNAME,
                password: env.DBPASSWORD,

            }
        }
    };
    connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            console.log('Error: ', err)
        }
        // If no error, then good to go...
        // executeStatement();
    });
    connection.connect();


    async function run() {
        let connection;
        try {

            connection = await oracledb.getConnection({ user: env.DBBAANUSERNAME, password: env.DBBAANPASSWORD, connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=10.19.16.7)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME = BAANS.INCOE.ASTRA.CO.ID)))" });

            console.log("Successfully connected to Oracle Database");



            connection.commit();

            // Now query the rows back

            // result = await connection.execute(
            //     `select distinct(trim(t$item)) from baan.twhwmd215777 where t$stoc > 0 and t$cwar = 'K-MTX'`,
            //     [],
            //     { resultSet: false, outFormat: oracledb.OUT_FORMAT_OBJECT });

            // const rs = result.resultSet;
            // let row;
            // row = await rs.getRow();
            // console.log(result.rows);
            // while ((row = await rs.getRow())) {
            //     console.log(result.rows);
            //     if (row.DONE)
            //         console.log(row.DESCRIPTION, "is done");
            //     else
            //         console.log(row.DESCRIPTION, "is NOT done");
            // }

            // await rs.close();

        } catch (err) {
            console.error(err);
        } finally {
            oracleConnection = connection;
            // getWOPattern();

            // if (connection) {
            //     try {
            //         await connection.close();
            //     } catch (err) {
            //         console.error(err);
            //     }
            // }
        }
    }

    run();
}



// Setup event handler when the connection is established. 
// connection.on('connect', function (err) {
//     if (err) {
//         console.log('Error: ', err)
//     }
// If no error, then good to go...
// executeStatement();
// });

// Initialize the connection.
// connection.connect();
const executeSQL = (connection, strgSql, strgOpt) =>
    new Promise((resolve, reject) => {
        var result = [];
        const request = new Request(strgSql, (err, rowCount) => {
            if (err) {
                reject(err);
            } else {
                //console.log("rowCount:",rowCount);
                if ((result == "" || result == null || result == "null")) result = "[]";
                //console.log("result:",result);
                resolve(result);
            }
            // connection.close();    
        });
        request.on('row', columns => {
            if (strgOpt == "array") {
                var arry = []
                columns.forEach(column => {
                    arry.push(column.value);
                });
                result.push(arry);
                //console.log(result);  
            }
            if (strgOpt == "object") {
                var objt = {}
                columns.forEach(column => {
                    objt[column.metadata.colName] = column.value;
                });
                result.push(objt);
                //console.log(result);  
            }
        });
        // connection.on('connect', err => {
        //     if (err) {
        //         reject(err);
        //     }
        //     else {
        connection.execSql(request);
        //     }
        // });   
        // connection.connect();    
    });
const getMpsPattern = async () => {
    const query = `select * from [portal_ppc].[dbo].[mps_pattern_raw]`;
    let result = await executeSQL(connection, query, "object");
    // console.log(result);
    return result;
}
const getWpsPattern = async () => {
    const query = `select [portal_ppc].[dbo].[mps_pattern_raw].*,[portal_ppc].[dbo].[wps].* from [portal_ppc].[dbo].[wps] join [portal_ppc].[dbo].[mps_pattern_raw] on [portal_ppc].[dbo].[wps].id_mps = [portal_ppc].[dbo].[mps_pattern_raw].id_mps`;
    let result = await executeSQL(connection, query, "object");
    // console.log(result);
    return result;
}
const getWOPattern = async () => {
    let queryPn = `select * from [portal_ppc].[dbo].[part_number_series] `;
    let part_num_series = await executeSQL(connection, queryPn, "object");
    const query = `SELECT t$prto as rfq,t$prdt as tgl_prod,t$pdno as pdno,trim(t$mitm) as mitm,t$cwar as cwar, t$qrdr as qty,t$prcd as line, t$osta as status 
    FROM baan.ttisfc001777 where (t$pdno like '%KAS%' OR t$pdno like '%KAB%')
    and (t$osta = 1 OR t$osta = 5 OR t$osta = 7 OR t$osta = 10) and t$prdt between to_date('01-JAN-23','DD-MON-RR') - 7/24 and to_date('31-JAN-23','DD-MON-RR') - 7/24
    order by t$pdno asc`;
    var result;
    result = await oracleConnection.execute(query, [], { resultSet: false, outFormat: oracledb.OUT_FORMAT_OBJECT });
    // console.log(result.rows);
    var obj;

    let results = [];
    result.rows.map(async (row) => {

        obj = {
            tanggal_wo: row.TGL_PROD,
            qty: row.QTY,
            line: row.LINE,
            pdno: row.PDNO,
            pn: row.MITM,
            status: row.STATUS,
            rfq: row.RFQ,
        };
        let part_num = row.MITM;
        let series = part_num_series.find(x => x.pn == part_num);
        if (series) {
            obj.series = series.series;
        }
        else {
            obj.series = "N/A";
        }
        //  obj;
        results.push(obj);
        console.log(obj);
        return;
    });
    console.log(results);
    return results;
}
const getWODetail = async (line, type, date) => {
    let queryPn = `select * from [portal_ppc].[dbo].[part_number_series] `;
    let part_num_series = await executeSQL(connection, queryPn, "object");
    const query = `SELECT t$prto as rfq,t$prdt as tgl_prod,t$pdno as pdno,trim(t$mitm) as mitm,t$cwar as cwar, t$qrdr as qty,t$prcd as line, t$osta as status 
    FROM baan.ttisfc001777 where (t$pdno like '%KAS%' OR t$pdno like '%KAB%')
    and (t$osta = 1 OR t$osta = 5 OR t$osta = 7 OR t$osta = 10) and t$prdt between to_date('01-JAN-23','DD-MON-RR') - 7/24 and to_date('31-JAN-23','DD-MON-RR') - 7/24
    order by t$pdno asc`;
    var result;
    result = await oracleConnection.execute(query, [], { resultSet: false, outFormat: oracledb.OUT_FORMAT_OBJECT });
    // console.log(result.rows);
    var obj;

    let results = [];
    result.rows
    let filteredResult = result.rows.filter(x => {
        if (date) {
            console.log(`${x.TGL_PROD} == ${new Date(date)} = ${x.TGL_PROD == new Date(date)}`);
            return x.LINE == line && x.TGL_PROD == new Date(date)
        }
        return x.LINE == line;

    });
    filteredResult.map(async (row) => {

        obj = {
            tanggal_wo: row.TGL_PROD,
            qty: row.QTY,
            line: row.LINE,
            pdno: row.PDNO,
            pn: row.MITM,
            status: row.STATUS,
            rfq: row.RFQ,
        };
        let part_num = row.MITM;
        let series = part_num_series.find(x => x.pn == part_num);
        // if series not same with type then return

        if (series) {
            obj.series = series.series;
        }
        else {
            obj.series = "N/A";
        }
        if (type) {
            if (obj.series != type) {
                return;
            }
        }
        //  obj;
        results.push(obj);
        console.log(obj);
        return;
    });
    console.log(results);
    return results;
}


module.exports = { getMpsPattern, getWpsPattern, getWOPattern, getWODetail, initConnection };