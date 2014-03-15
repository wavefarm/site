var wf = require('wavefarm')
module.exports = wf({url: process.env.API_URL || 'http://localhost:1039'})
