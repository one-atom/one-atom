//@ts-check
/* eslint-disable */

const express = require('express');
const path = require('path');

const PORT = 8080;
const PUBLIC = path.join(__dirname, 'dist');

const app = express();
app.use(express.static(`${PUBLIC}`));
app.use('/scripts', express.static(`${PUBLIC}`));
app.get('/', (_, res) => {
  res.sendFile(path.join(`${PUBLIC}/public_path/index.html`));
});
app.listen(PORT, () => console.log(`serving "run_prod" http://localhost:${PORT}`));
