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

            connection = await oracledb.getConnection({ user: env.DBBAANUSERNAME, password: env.DBBAANPASS, connectionString: "localhost/baan" });

            console.log("Successfully connected to Oracle Database");



            connection.commit();

            // Now query the rows back

            result = await connection.execute(
                `select distinct(trim(t$item)) from baan.twhwmd215777 where t$stoc > 0 and t$cwar = 'K-MTX';`,
                [],
                { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

            const rs = result.resultSet;
            let row;

            while ((row = await rs.getRow())) {
                console.log(result.rows);
                if (row.DONE)
                    console.log(row.DESCRIPTION, "is done");
                else
                    console.log(row.DESCRIPTION, "is NOT done");
            }

            // await rs.close();

        } catch (err) {
            console.error(err);
        } finally {
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

module.exports = { getMpsPattern, getWpsPattern, initConnection };