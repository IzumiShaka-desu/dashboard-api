const { deletebookByIdHandler } = require('./handler');
const { editbookByIdHandler } = require('./handler');
const { getbookByIdHandler } = require('./handler');
const { addbookHandler, getAllbooksHandler } = require('./handler');
const { mpsPatternHandler, wpsPatternHandler, woPatternHandler, mpsRawHandler } = require('./patterns_handler');

const routes = [
  {
    method: 'GET',
    path: '/patterns/mps',
    handler: mpsPatternHandler,
    options: {
      cache: {
        expiresIn: (60 * 60) * 1000,
        privacy: 'private'
      }
    }
  },
  {
    method: 'GET',
    path: '/raw/mps',
    handler: mpsRawHandler,
    options: {
      cache: {
        expiresIn: (60 * 60) * 1000,
        privacy: 'private'
      }
    }
  },
  {
    method: 'GET',
    path: '/patterns/wps',
    handler: wpsPatternHandler,
    options: {
      cache: {
        expiresIn: (60 * 60) * 1000,
        privacy: 'private'
      }
    }
  },
  {
    method: 'GET',
    path: '/patterns/wo',
    handler: woPatternHandler,
    options: {
      cache: {
        expiresIn: (60 * 60) * 1000,
        privacy: 'private'
      }
    }
  },
];

module.exports = routes;
