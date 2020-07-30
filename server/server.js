const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000
const api = require('./routes/api')
const cors = require('cors')

app.use(bodyParser.json())
app.use('/api', api)
app.use(cors())
app.use((req, res, next)=>{
	/*res.header("content-type", "application/json");*/
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
})

app.get('/', (req, res)=>{
	res.send("App Work Fine")
})

app.listen(PORT, ()=>{
	console.log("Server listening at PORT:"+PORT)
})