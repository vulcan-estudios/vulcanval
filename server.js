const express = require('express');

const app = express();
const port = process.env.PORT || 7000;

app.use(express.static(__dirname));

app.listen(port, function(err) {
  if (err) throw err;
  console.log('server running at http://127.0.0.1:' + port);
});
