const { getMpsPattern } = require('./pool');
const mpsPatternHandler = async (request, h) => {
    let results = (await getMpsPattern()).map((item) => {
        return {
            tanggal_mps: item.tanggal_mps,
            line: item.line_mps,
            qty: item.qty_mps,
            type: item.type,
        }
    },);
    let lines = [...new Set(results.map((item) => item.line))];
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
                    let dataByDate = dataByType.filter((item) => item.tanggal_mps === date);
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
            title: "MPS Pattern ",
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

const wpsPatternHandler = (request, h) => {

    return h.response({
        status: 'error',
        message: 'WPS Pattern is not implemented yet',
    }).code(500);

}
const woPatternHandler = (request, h) => {
    return h.response({
        status: 'error',
        message: 'WO Pattern is not implemented yet',
    }).code(500);
}
module.exports = {
    mpsPatternHandler,
    wpsPatternHandler,
    woPatternHandler,
    mpsRawHandler,
}