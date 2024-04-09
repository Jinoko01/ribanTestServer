// const express = require("express");
// const bodyParser = require('body-parser');
// const path = require("path");

// const app = express();

// app.set("port", process.env.PORT || 5000);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.post('/data', (req, res) => {
//   // 데이터 추출
//   const data = req.body.data;
//   console.log(`data from ESP32: ${data}`);

//   // 응답 전송
//   res.send(`request data: ${data}`);
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "/index.html"));
// });

// app.listen(app.get("port"), () => {
//   console.log(app.get("port"), "번 포트에서 대기중..");
// });
const express = require('express');
const winston = require('winston');

let bodyParser = require('body-parser');
let app = express()
let logger = winston.createLogger();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res) => {
  logger.info('you come in path to "/"');
  res.json({
    hello: "world"
  })
})


app.post("/data", (req, res) => {
  console.log(req.body);
  logger.infgo(req.body);
  res.send(req.body);
})

app.listen(5000, () => {
  console.log("Server has been started")
})
