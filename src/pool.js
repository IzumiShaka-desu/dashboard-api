const Connection = require('tedious').Connection;
const Request = require('tedious').Request;


var connection;

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
const getMpsPattern = (callback) => {
    // const query = `select mps.*,part_number.*,part_number_series.* from mps right join part_number on mps.id_part_number =part_number.id_part_number right join part_number_series on part_number.part_number = part_number_series.pn where MONTH(mps.tanggal_mps) = MONTH(GETDATE()) AND YEAR(mps.tanggal_mps) = YEAR(GETDATE()) order by tanggal_mps`;
    const query = `select * from [portal_ppc].[dbo].[mps_pattern_raw]`;
    try {
        const request = new Request(query, (err, rowCount) => {
            if (err) {
                throw err;
            }
            console.log(`${rowCount} row(s) returned`);

            console.log('DONE!');
        });
        request.on('row', (columns) => {
            // columns.forEach((column) => {
            //     if (column.value === null) {
            //         console.log('NULL');
            //     } else {
            //         console.log(column.value);
            //     }
            // });
            callback(columns);
        });

        request.on('done', (rowCount) => {
            console.log('Done is called!');
        });

        request.on('doneInProc', (rowCount, more) => {
            console.log(rowCount + ' rows returned');
        });

        // In SQL Server 2000 you may need: connection.execSqlBatch(request);
        connection.execSql(request);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getMpsPattern, initConnection };