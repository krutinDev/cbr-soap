const express = require("express");
const soap = require("soap");
const bodyParser = require("body-parser");
const services = require("./services/services");

const app = express();
app.use(bodyParser.raw({ type: () => true, limit: "5mb" }));

const path = require("path");
const wsdlPath = path.join(__dirname, "services", "ServiceDefinition.wsdl");
const port = 8000;

app.listen(port, function () {
	const wsdl = require("fs").readFileSync(wsdlPath, "utf8");
	soap.listen(app, "/wsdl", services, wsdl);
	console.log(`SOAP сервер запущен на порту ${port}`);
	console.log(`WSDL доступен по адресу http://localhost:${port}/wsdl?wsdl`);
});
