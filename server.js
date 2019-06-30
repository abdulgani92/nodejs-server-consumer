const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const config = require('config');
require('./consumer/consumer');
const PORT = config.get('port') || 5000;

app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}`);
});