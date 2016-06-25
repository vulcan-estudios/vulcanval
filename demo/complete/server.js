const express = require('express');

const port = process.env.PORT || 7000;
const app = express();

app.use(express.static(__dirname.replace('/demo/complete', '')));
app.get('/', (req, res, next) => res.redirect('/demo'));

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Demos server is running at http://127.0.0.1:${port}`);
});
