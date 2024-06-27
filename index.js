const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path');
const filePath = path.resolve(__dirname, 'index.html');
/* 
    Incase you are using mongodb atlas database uncomment below line
    and replace "mongoAtlasUri" with your mongodb atlas uri.
*/
// mongoose.connect( mongoAtlasUri, {useNewUrlParser: true, useUnifiedTopology: true})

app.get('/', (req, res) => {
  res.sendFile(filePath);
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})