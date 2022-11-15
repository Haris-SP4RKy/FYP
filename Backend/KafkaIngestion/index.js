// require('dotenv').config();
const config = require("./config");

const express = require("express");
const cors = require("cors");
// const path = require( 'path');

const expressSanitizer = require("express-sanitizer");
const indexroutes = require("./routes/index");
const bodyParser = require("body-parser");
// const Logger = require('./utils/logger');
// const log = new Logger();
const helmet = require("helmet");
const responseTime = require("response-time");
// const { userDBLogging } = require('./utils/requestLoggingUser')

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(
  helmet({
    frameguard: {
      action: "deny",
    },
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      styleSrc: ["'self'", "maxcdn.bootstrapcdn.com"],
    },
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(expressSanitizer());
// app.use(log.requestLogger);
app.use(responseTime());
//app.use(userDBLogging);

// app.use('/', express.static('public'));
// app.set('view cache', false);
// app.set('views', path.resolve('./views'));
// app.set('view engine', 'ejs');l

app.use(cors());
app.use((req, res, next) => {
  res.header("Content-Security-Policy", "frame-ancestors 'none';");
  next();
});

// app.get("/", (req, res) => res.status(200).send({ server: "public" }));

app.use("/api/services/v1", indexroutes);
// app.use('/api/services', services);

app.use((req, res, next) => {
  res.status(200).send("SORRY REQUESTED SERVICE NOT FOUND..!");
});

const port = config.PORT || 3000;
// const httpServer = http.createServer(app);
// httpServer.listen(port);
// httpServer.setTimeout(9000000);
// console.log(`server listening port--->${port}`);
app.listen(port, () => console.log(`Listening on port ${port}...`));
