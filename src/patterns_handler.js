const mpsPatternHandler = (request, h) => {
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