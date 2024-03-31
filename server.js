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
var express = require('express')
var fs = require('fs')
var path = require('path');
var bodyParser = require('body-parser');
var app = express()

app.locals.pretty = true
app.set('views', './view_file')
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.listen(3000, () => {
  console.log("Server has been started")
})

var dataFolderPath = path.join(__dirname, '/data')
var dataPath = path.join(dataFolderPath, '/data.txt') 

app.get("/", (req, res) => {
  res.redirect('/hello')
})

// 저장된 데이터가 있으면 데이터 출력
app.get("/hello", (req, res) => {
  if(!fs.existsSync(dataFolderPath) || !fs.existsSync(dataPath)) {
    res.render('hello', { title: 'Hello', message: 'Hello World!!!'})
  }
  else {
    fs.readFile(dataPath, 'utf-8', (err, data)=> {
      res.render('data', { title: 'Hello', data: data.split('\n')})
    })
  }
})

app.post("/data", (req, res) => {
  var recvData = req.body.data
  // 데이터 저장 폴더 및 데이터 저장 파일 생성
  if(!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath)
  }

  if(!fs.existsSync(dataPath)) {
    fs.appendFile(dataPath, recvData+'\n', (error) => {
      if(error) {
        res.status(500).json({ 'msg': 'Internal server error' });
      }
      else {
        res.status(200).json({ 'msg': 'Data registered successfully' });
      }
    })    
  }
  else {
    fs.readFile(dataPath, 'utf-8', (err, data)=> {
      if(err) {
        res.status(500).json({ 'msg': 'Internal server error' });
      }
      else {
        // 10개 이상 데이터 추가 시 10개만 저장
        var dataArr = data.split('\n')
        if(dataArr.length < 10) {
          fs.appendFile(dataPath, recvData+'\n', (error) => {
            if(error) {
              res.status(500).json({ 'msg': 'Internal server error' });
            }
            else {
              res.status(200).json({ 'msg': 'Data registered successfully' });
            }
          })
        }
        else {
          dataArr.splice(dataArr.length-1, 1)
          dataArr.splice(0,dataArr.length - 9)
          dataArr.push(recvData)
          var file = fs.createWriteStream(dataPath);
          file.on('error', (err) => { if(err) console.log(err) })
          dataArr.forEach((item) => { file.write(item + '\n') })
          file.end();
          res.status(200).json({ 'msg': 'Data registered successfully' });
        }
      }
    })
  }
})