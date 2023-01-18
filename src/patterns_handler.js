const { getMpsPattern } = require('./pool');
const mpsPatternHandler = (request, h) => {
    let results = [];
    const callback = (columns) => {
        columns.forEach((column) => {
            results.push(column);
        });
    }
    getMpsPattern(callback);
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
}