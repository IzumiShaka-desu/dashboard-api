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
    let dates = [...new Set(results.map((item) => item.tanggal_mps))];
    let types = [...new Set(results.map((item) => item.type))];
    let result = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let lineData = results.filter((item) => item.line == line);
        let lineResult = {
            line: line,
            data: [],
        };
        for (let j = 0; j < dates.length; j++) {
            let date = dates[j];
            let dateData = lineData.filter((item) => item.tanggal_mps == date);
            let dateResult = {
                tanggal_mps: date,
                data: [],
            };
            for (let k = 0; k < types.length; k++) {
                let type = types[k];
                let typeData = dateData.filter((item) => item.type == type);
                let typeResult = {
                    type: type,
                    qty: 0,
                };
                if (typeData.length > 0) {
                    typeResult.qty = typeData[0].qty;
                }
                dateResult.data.push(typeResult);
            }
            lineResult.data.push(dateResult);
        }
        result.push(lineResult);
    }

    return h.response({
        status: 'success',
        data: result,
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
}