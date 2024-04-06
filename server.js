const dotenv=require("dotenv");
process.env.NODE_ENV=process.env.NODE_ENV?process.env.NODE_ENV:"local";
dotenv.config({
    path:`.env.${process.env.NODE_ENV}`
});
const express=require("express");
const cors=require("cors");
const logger=require("morgan");
const helmet=require("helmet");
const bodyParser=require("body-parser");
const swaggerUi = require("swagger-ui-express");
  const YAML = require("yamljs");

const app = express();
let server = require("http").createServer(app);
const swaggerDocument = YAML.load('./swagger/collection.yml');
const common = require("./common/index");
const v1Routes = require("./v1/routes/index");
const services = require("./services/index");
app.use("/", express.static(__dirname + "/public"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  //Allow cors policy
app.use(cors());
app.use(common.responses());
app.use(helmet());
app.use(logger("dev"));


app.use(bodyParser.json({
    limit:"30mb"
}));
app.use(bodyParser.urlencoded({
    limit:"30mb",
    extended:true,
    parameterLimit:10000
}));

app.use("/api/v1",v1Routes);

// 404, Not Found
app.use((req, res) => res.error(404, "NOT_FOUND"));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// error handling
  // Error handling
  app.use((error, req, res, next) => {
    console.error(error);
    next();
    return res.error(400, error.message || error);
  });

server.listen(process.env.PORT || process.env.PORT, async () => {
    console.log(`Environment:`, process.env.NODE_ENV);
    console.log(`Running on:`, process.env.PORT);
    common.connection.mongodb();
    services.Swagger.createSwagger();
  });