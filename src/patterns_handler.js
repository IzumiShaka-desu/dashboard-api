const { getMpsPattern } = require('./pool');
const mpsPatternHandler = async (request, h) => {
    let results = await getMpsPattern();
    return h.response({
        status: 'success',
        data: results.map((item) => {
            return {
                tanggal_mps: item.tanggal_mps,
                line: item.line_mps,
                qty: item.qty_mps,
                type: item.type,
            }
        },),
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