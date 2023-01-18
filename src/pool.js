const Connection = require('tedious').Connection;
const Request = require('tedious').Request;


var connection;

const initConnection = (env) => {
    var config = {
        server: `${env.DBHOST}`, // or "localhost"
        options: {
            trustServerCertificate: true,
        },
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
const getMpsPattern = () => {
    const query = `select * from mps_pattern_raw`;
    try {
        const request = new Request(query, (err, rowCount) => {
            if (err) {
                throw err;
            }
            console.log(`${rowCount} row(s) returned`);

            console.log('DONE!');
        });
        request.on('row', (columns) => {
            columns.forEach((column) => {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    console.log(column.value);
                }
            });
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