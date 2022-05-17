const express = require("express");
const app = express();

require("express-async-errors");

require("./start/db")();
require("./start/config")();
require("./start/routes")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
