const express = require('express')
const router = express.Router()
const session = require('express-session')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
let userinfo = null

passport.use(new LocalStrategy(
    (username, password, done)=>{
        //match the username and password with users db
        conn.query("SELECT * FROM userdetails WHERE email='"+username+"' LIMIT 1", (err, result)=>{
            if(err) throw err
            if(result.length<=0) {
                //res.status(401).send({'message' : 'Invalid User'})
                return done("unauthorized access1", false)    
            }
            else if(result[0].password !== password) {
                //res.status(401).send({'message' : 'Invalid Password'})
                return done("unauthorized access2", false)
            }
            else {
                let payload =  {subject: result[0].id }
                let token = jwt.sign(payload, 'secretKey')
                this.userinfo = {
                    'name' : result[0].name,
                    'email' : result[0].email,
                    'user_role' : result[0].user_role,
                    'message' : 'LoggedIn',
                    'token' : token
                }
                return done(null, username)
            }
        })

        /*if(username === 'superadmin@gmail.com' && password === 'super123') {
            return done(null, username)
        } else {
            //when username and password fails
            return done("unauthorized access", false)
        }*/
    }
))

passport.serializeUser((user, done)=>{
    if(user) done(null, user)
})

passport.deserializeUser((id, done)=>{
    done(null, id)
})

router.use(session({secret: 'anything', resave: true, saveUninitialized: true}))
router.use(passport.initialize())
router.use(passport.session())

router.use(cors())
router.use((req, res, next)=>{
	/*res.header("content-type", "application/json");*/
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
})

const auth = ()=>{
    return (req, res, next)=>{
        passport.authenticate('local', (error, user, info)=>{
            if(error) res.status(400).json({'statusCode': 400, 'message': error})
            req.login(user, (error)=>{
                if(error) return next(error)
                next()
            })
        })(req, res, next)
    }
}

const conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "trainingsite2"
})

conn.connect((err)=>{
	if(err) throw err;
	console.log("Connected to Database")
})


function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized Request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
        return res.status(401).send('Unauthorized Request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
        return res.status(401).send('Unauthorized Request')
    }

    req.userId = payload.subject
    //console.log(req.userId + " " + payload.subject) 
    next()
}

router.post('/authenticate', auth(), (req, res)=>{
    //res.status(200).json({'statusCode': 200, 'user': req.user})
    res.status(200).send(JSON.stringify(this.userinfo))
})

const isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return true
    }
    //res.redirect('/login')
    return res.status(400).json({'statusCode': 400, 'message': 'not authenticated'})
}

router.get('/', (req, res)=>{
    res.send("From API route")
})

router.get('/getAdmins',  verifyToken, (req, res)=>{
    const sql = "SELECT id, name, email, mobile, user_role ,added_by, added_on FROM userdetails WHERE user_role='admin'"
    conn.query(sql, (err, result)=>{
        if(err) throw err
        res.status(200).send(JSON.stringify(result))
    })
})

router.get('/getCustomers', verifyToken, (req, res)=>{
    const sql = "SELECT id, name, email, mobile, user_role, added_by, added_on FROM userdetails WHERE user_role='customer'"
    conn.query(sql, (err, result)=>{
        if(err) throw err
        res.status(200).send(JSON.stringify(result))
    })
})

router.get('/getProducts', verifyToken, (req, res)=>{
    const sql = "SELECT * FROM productdetails"
    conn.query(sql, (err, result)=>{
        if(err) throw err
        if(result.length<=0) {
            res.status(200).send({
                'message': 'No Products'
            })
        }
        else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})

router.get('/getCart/:cuser', verifyToken, (req, res)=>{
    let cuser = req.params.cuser
    const sql = "SELECT * FROM cartdetails WHERE added_by=?"
    conn.query(sql, [cuser], (err, result)=>{
        if(err) throw err
        if(result.length <= 0) {
            res.status(200).send({
                'message' : 'No Products in Cart'
            })
        }
        else {
            res.status(200).send(JSON.stringify(result))
        }
    })
    
})

router.get('/getOrder/:cuser', verifyToken, (req, res)=>{
    let cuser = req.params.cuser
    const sql = "SELECT * FROM placedorderdetails WHERE useremail = ?"
    conn.query(sql, [cuser], (err, result)=>{
        if(err) throw err
        if(result.length <= 0) {
            res.status(200).send({
                'message' : 'No Orders'
            })
        }
        else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})

router.get('/getAllOrders', verifyToken, (req, res)=>{
    let cuser = req.params.cuser
    const sql = "SELECT * FROM placedorderdetails"
    conn.query(sql, [cuser], (err, result)=>{
        if(err) throw err
        if(result.length <= 0) {
            res.status(200).send({
                'message' : 'No Orders'
            })
        }
        else {
            res.status(200).send(JSON.stringify(result))
        }
    })
})

router.post('/register', (req, res)=>{
    let userData = req.body
    let name = userData.name
    let email = userData.email
    let mobile = userData.mobile
    let role = 'customer'
    let added_by = 'self'
    let password = userData.password
    let cfpassword = userData.cfpassword
    let date = new Date()
    const sql = "INSERT INTO userdetails (name, email, mobile, user_role, added_by, password, cfpassword, added_on) VALUES ?"
    const values = [
        [name, email, mobile, role, added_by, password, cfpassword, date]
    ];
    conn.query(sql, [values], (err, result)=>{
        if(err) {
           if (err.code === "ER_DUP_ENTRY") {
                res.status(401).send({"message" : "Email available already"})
            }
        } else {
            res.status(200).send({'message' : 'Registered'})
        }
    })
})

/*router.post('/login', (req,res)=>{
    let userData = req.body
    let email = userData.email
    let password = userData.password
    //console.log(userData)
    conn.query("SELECT * FROM userdetails WHERE email='"+email+"' LIMIT 1", (err, result)=>{
        if(err) throw err
        if(result.length<=0) {
            res.status(401).send({'message' : 'Invalid User'})
        }
        else if(result[0].password !== password) {
            res.status(401).send({'message' : 'Invalid Password'})
        }
        else {
            let payload =  {subject: result[0].id }
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({
                'name' : result[0].name,
                'email' : result[0].email,
                'user_role' : result[0].user_role,
                'message' : 'LoggedIn',
                'token' : token
            })
        }
    })
})*/

router.post('/login', passport.authenticate('local'), function(req, res, info){
    res.status(200).send("Pass port login")
})

router.post('/addUser', verifyToken, (req, res)=>{
    let userData = req.body
    let name = userData.name
    let email = userData.email
    let mobile = userData.mobile
    let role = userData.user_role
    let added_by = userData.added_by
    let password = userData.password
    let cfpassword = userData.cfpassword
    let date = new Date()
    const sql = "INSERT INTO userdetails (name, email, mobile, user_role, added_by, password, cfpassword, added_on) VALUES ?"
    const values = [
        [name, email, mobile, role, added_by, password, cfpassword, date]
    ];
    conn.query(sql, [values], (err, result)=>{
        if(err) {
           if (err.code === "ER_DUP_ENTRY") {
                res.status(401).send({"message" : "Email available already"})
            }
        } else {
            res.status(200).send({'message' : 'Registered'})
        }
    })
})

router.post('/addCustomer/:myid', verifyToken, (req, res)=>{
    let userData = req.body
    let name = userData.name
    let email = userData.email
    let mobile = userData.mobile
    let role = 'customer'
    let added_by = req.params.myid
    let password = userData.password
    let cfpassword = userData.cfpassword
    let date = new Date()
    const sql = "INSERT INTO userdetails (name, email, mobile, user_role, added_by, password, cfpassword, added_on) VALUES ?"
    const values = [
        [name, email, mobile, role, added_by, password, cfpassword, date]
    ];
    conn.query(sql, [values], (err, result)=>{
        if(err) {
           if (err.code === "ER_DUP_ENTRY") {
                res.status(401).send({"message" : "Email available already"})
            }
        } else {
            res.status(200).send({'message' : 'Registered'})
        }
    })
})

router.post('/addProduct/:cuser', verifyToken, (req, res)=>{
    let prodData = req.body
    let date = new Date()
    let cuser = req.params.cuser
    let product_name = prodData.product_name
    let product_amount = prodData.product_amount
    let product_description = prodData.product_description
    const sql = "INSERT INTO productdetails (product_name, product_amount, product_description, added_by, added_on) VALUES ? "
    values = [
        [product_name, product_amount, product_description, cuser, date] 
    ]
    conn.query(sql, [values], (err, result)=>{
        if(err) throw err
        res.status(200).send({
            'message' : 'Product Added'
        })
    })
})

router.post('/addCart/:cuser', verifyToken, (req, res)=>{
    let added_by = req.params.cuser
    let p_id = req.body.id
    let p_name = req.body.product_name
    let p_amount = req.body.product_amount
    let p_quantity = 1
    let p_totalamount = req.body.product_amount
    
    sql = "INSERT INTO cartdetails (added_by, product_id, product_name, product_amount, product_quantity, product_totalamount) VALUES ?"
    values = [[added_by, p_id, p_name, p_amount, p_quantity, p_totalamount]]
    conn.query(sql, [values], (err, result)=>{
        if(err) throw err
        if(result.affectedRows>0){
            res.status(200).send({
                'message' : 'Added To Cart'
            })
        }
        else {
            res.status(200).send({
                'message': 'Invalid'
            })
        }
    })
})

router.post('/addOrder', verifyToken, (req, res)=>{
    let orderData = req.body
    let useremail = orderData.added_by
    let product_name = orderData.product_names
    let product_amount = orderData.product_amount
    let product_quantity = orderData.product_quantity
    let order_totalamount = orderData.order_totalamount
    let date = new Date()

    const sql = "INSERT placedorderdetails (useremail, product_name, product_amount, product_quantity, order_totalamount, ordered_on) VALUES ?"
    const values = [[useremail, product_name, product_amount, product_quantity, order_totalamount, date]]
    conn.query(sql, [values], (err, result)=>{
        if(err) throw err
        if(result.affectedRows == 0) {
            res.status(200).send({
                'message' : 'could not add order'
            })
        }
        else {
            res.status(200).send({
                'message' : 'PlacedOrder'
            })
        }
    })
})

router.put('/editUser/:cid', verifyToken, (req, res)=>{
    let userData = req.body
    let name = userData.ename
    let email = userData.eemail
    let mobile = userData.emobile
    let role = userData.euser_role
    let cid = req.params.cid
    const sql = "UPDATE userdetails SET name=?, email=?, mobile=? WHERE user_role=? and id=?"
    conn.query(sql, [name, email, mobile, role, cid], (err, result)=>{
        if(err) throw err
        if(result.affectedRows<=0) {
            res.status(200).send({
                'message': 'No such User Found'
            })
        }
        else {
        res.status(200).send({
            'message' : 'Updated User'
        })
        }
    })
})

router.delete('/delUser/:cid', verifyToken, (req, res)=>{
    let cid = req.params.cid
    const sql = "DELETE FROM userdetails WHERE id=?"
    conn.query(sql, [cid], (err, result)=>{
        if(err) throw err
        if(result.affectedRows<=0) {
            res.status(200).send({
                'message' : 'No such user Found'
            })
        } else{
            res.status(200).send({
                'message' : 'Deleted User'
            })
        }
    })
})

router.put('/editProduct/:cid', verifyToken, (req, res)=>{
    let userData = req.body
    let product_name = userData.ename
    let product_amount = userData.eamount
    let product_description = userData.edescription
    let cid = req.params.cid
    const sql = "UPDATE productdetails SET product_name=?, product_amount=?, product_description=? WHERE id=?"
    conn.query(sql, [product_name, product_amount, product_description, cid], (err, result)=>{
        if(err) throw err
        if(result.affectedRows<=0) {
            res.status(200).send({
                'message': 'No such Product Found'
            })
        }
        else {
        res.status(200).send({
            'message' : 'Updated Product'
        })
        }
    })
})

router.delete('/delProduct/:cid', verifyToken, (req, res)=>{
    let cid = req.params.cid
    const sql = "DELETE FROM productdetails WHERE id=?"
    conn.query(sql, [cid], (err, result)=>{
        if(err) throw err
        if(result.affectedRows<=0) {
            res.status(200).send({
                'message' : 'No such product Found'
            })
        } else{
            res.status(200).send({
                'message' : 'Deleted Product'
            })
        }
    })
})

module.exports = router