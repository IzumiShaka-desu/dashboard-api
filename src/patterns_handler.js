const { getMpsPattern } = require('./pool');
const mpsPatternHandler = (request, h) => {
    getMpsPattern();
    return h.response({
        status: 'success',
        data: {
            pattern: 'MPS',
        }
    },).code(200);
}

const wpsPatternHandler = (request, h) => {



}
const woPatternHandler = (request, h) => {
}
module.exports = {
    mpsPatternHandler,
    wpsPatternHandler,
    woPatternHandler,
}