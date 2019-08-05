
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get('/audio', function(req, res) {
  const path = __dirname + '/Park.4.6.wav'
  // const path = __dirname + '/Beach.1.1.wav'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/wav',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/wav',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

app.listen(port, function () {
  console.log(`Starting server at ${port}!`);
})
