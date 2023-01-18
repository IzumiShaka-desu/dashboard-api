const { deletebookByIdHandler } = require('./handler');
const { editbookByIdHandler } = require('./handler');
const { getbookByIdHandler } = require('./handler');
const { addbookHandler, getAllbooksHandler } = require('./handler');
const { mpsPatternHandler, wpsPatternHandler, woPatternHandler } = require('./patterns_handler');

const routes = [
  {
    method: 'GET',
    path: '/patterns/mps',
    handler: mpsPatternHandler,
  },
  {
    method: 'GET',
    path: '/patterns/wps',
    handler: wpsPatternHandler,
  },
  {
    method: 'GET',
    path: '/patterns/wo',
    handler: woPatternHandler,
  },
];

module.exports = routes;
