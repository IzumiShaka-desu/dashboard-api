const { getMpsPattern, getWpsPattern, getWOPattern, getWODetail } = require('./pool');
const mpsPatternHandler = async (request, h) => {
    let results = (await getMpsPattern()).map((item) => {
        return {
            tanggal_mps: item.tanggal_mps,
            line: item.line_mps,
            qty: item.qty_mps,
            type: item.series,
        }
    },);
    let lines = [...new Set(results.map((item) => item.line))].sort();
    let date = new Date()
    // let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // create array of Date(object) from first day of this month to last day of this month
    // let dateOfThisMonth = Array.from(new Array(lastDay.getDate()), (val, index) => new Date(date.getFullYear(), date.getMonth(), index + 1, 0));

    let result = lines.map((line) => {
        let data = results.filter((item) => item.line == line);
        //this using type on this line because to make sure every type ini this line is included
        // you can also change this scope to type on this date 
        let typeOnThisLine = [...new Set(data.map((item) => item.type))];
        let dataByType = typeOnThisLine.map((type) => {
            let dataByType = data.filter((item) => item.type == type);
            let dateOnThisType = [...new Set(dataByType.map((item) => item.tanggal_mps))].sort();
            return {
                type: type,
                total: dataByType.reduce((acc, cur) => acc + cur.qty, 0),
                data: dateOnThisType.map((date) => {
                    let dataByDate = dataByType.filter((item) => {
                        // format date to string yyyy-mm-dd to compare with date string
                        let dateStr = new Date(item.tanggal_mps).toISOString().split('T')[0];
                        let dateStr2 = new Date(date).toISOString().split('T')[0];
                        return dateStr === dateStr2;
                    });
                    return {
                        date: date,
                        total: dataByDate.reduce((acc, cur) => acc + cur.qty, 0),
                        data: dataByDate,
                    }
                }),
            };
        });


        return {
            line: line,
            data: dataByType,
        }
    });


    return h.response({
        status: 'success',
        data: {
            //MPS Pattern <current month string><current year>
            title: `MPS Pattern ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
            items: result,
        },
    },).code(200);
}

const mpsRawHandler = async (request, h) => {
    let results = (await getMpsPattern()).map((item) => {
        return {
            tanggal_mps: item.tanggal_mps,
            line: item.line_mps,
            qty: item.qty_mps,
            type: item.type,
        }
    },);
    return h.response({
        status: 'success',
        data: results,
    },).code(200);
}

const wpsPatternHandler = async (request, h) => {
    let results = (await getWpsPattern()).map((item) => {
        return {
            tanggal_mps: item.tanggal_wps,
            line: item.line_wps,
            qty: item.qty_wps,
            type: item.series,
        }
    },);
    let lines = [...new Set(results.map((item) => item.line))].sort();
    let date = new Date()
    // let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // create array of Date(object) from first day of this month to last day of this month
    // let dateOfThisMonth = Array.from(new Array(lastDay.getDate()), (val, index) => new Date(date.getFullYear(), date.getMonth(), index + 1, 0));

    let result = lines.map((line) => {
        let data = results.filter((item) => item.line == line);
        //this using type on this line because to make sure every type ini this line is included
        // you can also change this scope to type on this date 
        let typeOnThisLine = [...new Set(data.map((item) => item.type))];
        let dataByType = typeOnThisLine.map((type) => {
            let dataByType = data.filter((item) => item.type == type);
            let dateOnThisType = [...new Set(dataByType.map((item) => item.tanggal_mps))].sort();
            return {
                type: type,
                total: dataByType.reduce((acc, cur) => acc + cur.qty, 0),
                data: dateOnThisType.map((date) => {
                    let dataByDate = dataByType.filter((item) => {
                        // format date to string yyyy-mm-dd to compare with date string
                        let dateStr = new Date(item.tanggal_mps).toISOString().split('T')[0];
                        let dateStr2 = new Date(date).toISOString().split('T')[0];
                        return dateStr === dateStr2;
                    });
                    return {
                        date: date,
                        total: dataByDate.reduce((acc, cur) => acc + cur.qty, 0),
                        data: dataByDate,
                    }
                }),
            };
        });


        return {
            line: line,
            data: dataByType,
        }
    });


    return h.response({
        status: 'success',
        data: {
            //MPS Pattern <current month string><current year>
            title: `WPS Pattern ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
            items: result,
        },
    },).code(200);

}
const woPatternHandler = async (request, h) => {
    let results = (await getWOPattern()).map((item) => {
        return {
            tanggal_mps: item.tanggal_wo,
            line: item.line,
            qty: item.qty,
            type: item.series,
            pdno: item.pdno,
            pn: item.pn,
            status: item.status,
            rfq: item.rfq,
        }
    });
    let lines = [...new Set(results.map((item) => item.line))].sort();
    let date = new Date()
    // let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // create array of Date(object) from first day of this month to last day of this month
    // let dateOfThisMonth = Array.from(new Array(lastDay.getDate()), (val, index) => new Date(date.getFullYear(), date.getMonth(), index + 1, 0));

    let result = lines.map((line) => {
        let data = results.filter((item) => item.line == line);
        //this using type on this line because to make sure every type ini this line is included
        // you can also change this scope to type on this date 
        let typeOnThisLine = [...new Set(data.map((item) => item.type))];
        let dataByType = typeOnThisLine.map((type) => {
            let dataByType = data.filter((item) => item.type == type);
            let dateOnThisType = [...new Set(dataByType.map((item) => item.tanggal_mps))].sort();
            return {
                type: type,
                total: dataByType.reduce((acc, cur) => acc + cur.qty, 0),
                data: dateOnThisType.map((date) => {
                    let dataByDate = dataByType.filter((item) => {
                        // format date to string yyyy-mm-dd to compare with date string
                        let dateStr = new Date(item.tanggal_mps).toISOString().split('T')[0];
                        let dateStr2 = new Date(date).toISOString().split('T')[0];
                        return dateStr === dateStr2;
                    });
                    return {
                        date: date,
                        total: dataByDate.reduce((acc, cur) => acc + cur.qty, 0),
                        data: dataByDate,
                    }
                }),
            };
        });


        return {
            line: line,
            data: dataByType,
        }
    });


    return h.response({
        status: 'success',
        data: {
            //MPS Pattern <current month string><current year>
            title: `WO Pattern ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
            items: result,
        },
    },).code(200);
}
const woDetailHandler = async (request, h) => {
    // get line from path
    let line = request.params.line;
    // get type from query parameter
    let type = request.query.type;
    // get date from query parameter
    let date = request.query.date;
    // get data from database
    let results = (await getWODetail(line, type, date))
    let title = `WO Detail`;
    if (line) {
        title += ` Line ${line}`;
    }
    if (type) {
        title += ` Type ${type}`;
    }
    if (date) {
        // format tanggal wo to be more readable (ex: "2021-01-01" to "01 Januari 2021")
        let dateString = new Date(date).toLocaleString('default', { day: '2-digit', month: 'long', year: 'numeric' });


        title += ` Date ${dateString}`;
    }

    return h.response({
        status: 'success',
        data: {
            //MPS Pattern <current month string><current year>
            title: title,
            items: results,
        },
    },).code(200);
}
module.exports = {
    mpsPatternHandler,
    wpsPatternHandler,
    woPatternHandler,
    mpsRawHandler,
    woDetailHandler,
}