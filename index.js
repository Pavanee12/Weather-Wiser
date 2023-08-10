const express=require('express');
const path =require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { title } = require('process');

const app  = express();
app.use(express.static(__dirname+'/public'));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.get('/',(req,res)=>
{ 
    res.render('weathers/home');
})

app.get('/weathers/home',(req,res)=>{
      res.render('weathers/home');
})

app.get('/weathers/favourites',(req,res)=>{
    res.render('weathers/favourites');
})


app.listen(3000,function(){
    console.log("listening on port 3000");
})
 

// app.use('/public', express.static(path.join(__dirname, "../public")));
// app.use('/css',express.static(__dirname + 'public/js'));
// app.use('/css',express.static(__dirname + 'public/css'));
// app.use('/img',express.static(__dirname + 'public/img'));
