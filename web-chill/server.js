const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const fs = require('fs');
const axios = require('axios');

const lpaasUrl = 'http://localhost:8080'
const theoryPath = '/lpaas/theories/chill'
const chillTheoryPath = 'src/chess.pl'
const headers = {
  'Content-Type':'text/plain',
  'Accept': 'application/json'
}

app = express();
app.use(serveStatic(__dirname + "/dist"));

fs.readFile(chillTheoryPath, 'utf8', function(err, parsed) {
    if (err) throw err

    let body = parsed.replace(/%.*/g, '').replace(/\n/g, ' ').trim()
    
    axios.post(lpaasUrl+theoryPath, body, {headers: headers},
    ).then(function(response) {
      console.log("Chill Theory Loaded to "+lpaasUrl)
    }).catch(function(error) {
      console.log(error)
    })
})

const port = process.env.PORT || 5000;
app.listen(port);

console.log('server started '+ port);
