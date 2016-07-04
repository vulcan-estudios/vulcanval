const express = require('express');
const bodyParser = require('body-parser');
const vulcanval = require('../../src/js/main');
const settings = require('./settings');

const port = process.env.PORT || 7000;
const app = express();

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname.replace(/demo\/complete$/, '')));

app.get('/', (req, res) => res.redirect('/demo/complete'));

// Login validation.
app.post('/api/login', (req, res) => {

  const map = req.body;
  const invalids = vulcanval.validateMap(map, settings);

  res.status(invalids ? 400 : 200);
  res.json({
    success: !invalids,
    data: invalids
  });
});

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Demos server is running at http://127.0.0.1:${port}`);
});
