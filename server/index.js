
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();



const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lakodatabase",
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

// displaying all product on Stocks
app.get("/stocks/show", (req, res)=>{
    const sqlSelect = "SELECT * FROM stockstb";
    db.query(sqlSelect, (err, result)=>{
        res.send(result)
        // console.log(result)
    })
})


// displaying product by ID
app.get("/stocks/show/:productId", (req, res) =>{

    const productId = req.params.productId

    const sqlFilter = "SELECT `id`, `productName`, `productQty`, `originalPrice`, `resellPrice`, `productCategory`, `productImage`, `createdAt`, `updatedAt` FROM `stockstb` WHERE id = ?";
    db.query(sqlFilter, productId, (err, result)=> {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
});

// inserting product on db
app.post('/stocks/add', (req, res) => {
    
    const productName = req.body.productName
    const productQty = req.body.productQty
    const originalPrice = req.body.originalPrice
    const resellPrice = req.body.resellPrice
    const productCategory = req.body.productCategory
    const productImage = req.body.productImage
    

    const sqlInsert = "INSERT INTO stockstb( productName, productQty, originalPrice, resellPrice, productCategory, productImage) VALUES (?,?,?,?,?,?);"
    db.query(sqlInsert, [productName, productQty, originalPrice, resellPrice, productCategory, productImage], (err, result) => {
        console.log(err)
    })
})

// update product data
app.put("/stocks/update", (req, res) =>{

    const updatedProductName = req.body.updatedProductName
    const updatedProductQty = req.body.updatedProductQty
    const updatedOriginalPrice = req.body.updatedOriginalPrice
    const updatedResellPrice = req.body.updatedResellPrice
    const updatedProductCategory = req.body.updatedProductCategory
    const productId = req.body.productId

    const sqlUpdate = "UPDATE `stockstb` SET `productName`= ?,`productQty`= ?,`originalPrice`= ?,`resellPrice`= ?,`productCategory`= ? WHERE id = ?";

    db.query(sqlUpdate, [updatedProductName, updatedProductQty, updatedOriginalPrice, updatedResellPrice, updatedProductCategory, productId], (err, result) => {
        if (err) {console.log(err)}
        else console.log(result)
    })
})

// Delete a product data
app.delete("/stocks/delete/:productId", (req, res)=> {

    const productId = req.params.productId

    
    db.query(`DELETE FROM stockstb WHERE id = ?`, productId, (err, result)=> {
        if(err) {console.log(productID)}
        else console.log(result)
    })
})

// POS
// displaying all product on POS
app.get("/pos/display", (req, res)=>{


    const sqlSelect = "SELECT * FROM stockstb";
    db.query(sqlSelect, (err, result)=>{
        res.send(result)
        // console.log(result)
    })
});

// updating inventory stocks base on soldproducts

app.put("/pos/update-stocks",(req, res) => {


    const productId = req.body.productId
    const productQty = req.body.productQty
    console.log("productidIndex", productId)
    console.log("productQty", productQty)

    for ( let i = 0; i < productId.length; i++) {

    const sqlUpdate = "UPDATE `stockstb` SET `productQty`= ? WHERE id = ?";

    db.query(sqlUpdate,[productQty[i], productId[i]],(err, result) => {
        if(err)  {console.log(err)}
        else {console.log("updated")}
    })

    };

});

    










//TRANSACTION

//add transction to db

app.post("/transaction/insert", (req, res) => {

    const soldProducts = req.body.counterItems
    const totalSoldQty = req.body.allSoldQty
    const totalSoldPrice = req.body.allTotalPrice
    const cashPayment = req.body.cashPayment
    const paymentChange = req.body.paymentChange
    const transactionDate = req.body.transactionDate

    sqlInsert = "INSERT INTO `transactiontb`(`soldProducts`, `totalSoldQty`, `totalSoldPrice`, `cashPayment`, `paymentChange`, `transactionDate`) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sqlInsert, [soldProducts, totalSoldQty, totalSoldPrice, cashPayment, paymentChange, transactionDate], (err, result) =>{
        if(err) { console.log(err)}
        else {console.log("data inserted to transaction db")}
    })
});

//display transaction to transaction page

app.get("/transaction/show", (req, res)=> {

    const sqlSelect = "SELECT * FROM `transactiontb` ORDER BY `transactiontb`.`transaction_id` DESC";

    db.query(sqlSelect, (err, result) =>{
        res.send(result)
    })
});

// displaying transaction by Id
app.get("/transaction/show/:transactionId", (req, res) =>{

    const transactionId = req.params.transactionId

    const sqlFilter = "SELECT `transaction_id`, `soldProducts`, `totalSoldQty`, `totalSoldPrice`, `transactionDate`,`cashPayment`, `paymentChange` FROM `transactiontb` WHERE transaction_id = ?";
    db.query(sqlFilter, transactionId, (err, result)=> {
        if(err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
});

// SALES
// displaying all data for Sales
app.get("/sales/show", (req, res)=> {

    const sqlSelect = "SELECT * FROM `transactiontb`";

    db.query(sqlSelect, (err, result) =>{
        res.send(result)
    })
});

app.get("/sales/show/stock", (req, res)=>{
    const sqlSelect = "SELECT * FROM stockstb";
    db.query(sqlSelect, (err, result)=>{
        res.send(result)
        // console.log(result)
    })
})




app.listen(3001, () => {
    console.log('running on port 3001')
});











// app.get('/', (req, res) => {
//     res.send('<h1>Test</h1>')
// })