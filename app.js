const express=require("express");
const app=express();
const  mongoose=require("mongoose");
const Transaction=require("./models/transaction.js");
const MONGO_URL="mongodb://127.0.0.1:27017/Data";
const path=require("path");
const axios=require('axios');
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.set(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.send("Hi,I am root");
});

//index route
app.get("/transaction",async(req,res)=>{
    const {page=1,search="",month=""}=req.query;
    const limit=10;
    const skip=(page-1)*limit;
    try{
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        let transactions = response.data;
        //const filteredTransactions = transactions.filter(transaction => {
            if (month) {
                transactions = transactions.filter(transaction => {
                    const transactionMonth = new Date(transaction.dateOfSale).toLocaleString('en-US', { month: 'long' }).toLowerCase();
                    return transactionMonth === month.toLowerCase();
                });
            }
            
            if(search){
                transactions = transactions.filter(transaction => {
                    const matchesTitle = transaction.title.toLowerCase().includes(search.toLowerCase());
                    const matchesDescription = transaction.description.toLowerCase().includes(search.toLowerCase());
                    const matchesPrice = transaction.price.toString().includes(search);
                    return matchesTitle || matchesDescription || matchesPrice;
                });
            }
           
        
    
        const paginatedTransactions = transactions.slice(skip, skip + limit);
        const totalPages = Math.ceil(transactions.length / limit);
    
   

   
if (req.xhr || req.headers.accept.indexOf('json') > -1) {
   return res.json({ transactions: paginatedTransactions, currentPage: parseInt(page), totalPages:totalPages });
}
// Otherwise, render the EJS view
res.render("transactions/index.ejs", { allTransactions: paginatedTransactions, currentPage: page, totalPages:totalPages });
}catch(error){
    console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
}
    });

//show route
app.get("/transaction/:id",async(req,res)=>{
    let{id}=req.params;
    const transactionId = req.params.id; // or req.body.id, etc.
    // Validate ObjectId
if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    return res.status(400).send('Invalid ID format');
}
    const transaction=await Transaction.findById(id);
    res.render("transaction/show.ejs",{transaction});
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});

