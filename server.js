// Modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

// Express - Instance
const app = express();

// Route
const OrchestratorRoute = require('./src/modules/orchestrator/assistant.route');
const routes = require('./src/index.route');

// Setting's default
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Setting's view engine
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// Router /api/message
app.use('/', OrchestratorRoute);
app.use('/', routes);

// Starting servers
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Backend is running on port ${port}...🚀 http://localhost:${port}/`);
});
