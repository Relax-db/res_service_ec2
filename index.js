/* eslint-disable global-require */
/* eslint-disable no-console */

require('newrelic');
const cluster = require('cluster');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const model = require('./models');

if (cluster.isMaster) {
  const cpuCount = require('os').cpus().length;
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  const app = express();
  const port = 3000;

  app.use('/', express.static(path.resolve(__dirname, './dist')));
  app.use(bodyParser.json());

  app.get('/api/locations/:id', (req, res) => {
    const locationid = req.params.id;
    model.Locations.get({ locationid })
      .then((location) => {
        res.send(location);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get('/api/bookings/:id', (req, res) => {
    const locationid = req.params.id;
    model.Bookings.getAll({ locationid })
      .then((bookings) => {
        res.send(bookings);
      })
      .catch((err) => {
        console.log(err);
      });
  });

/*  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
*/
	
  app.listen(port, () => console.log(`App listening on port ${port}! with WorkerID: ${cluster.worker.id}`));
}

