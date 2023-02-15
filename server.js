
const express = require ("express");

const { listen } = require("express/lib/application");

const bcrypt = require("bcrypt")

const app = express();

const router = express.Router();

const path  = require('path')

const {pool} = require("./dbConfig")

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    //res.send(__dirname+'/src/app/components/login/login.html');
    res.sendFile(__dirname+'/src/app/components/home/home.component.html');
}
);

app.get("/user/login", (req, res) => {
    //res.send(__dirname+'/src/app/components/login/login.html');
    res.sendFile(__dirname+'/src/app/components/login/login.component.html');
}
);

app.get("/user/register", (req, res) => {
    res.sendFile(__dirname+'/src/app/components/register/register.component.html');

});

app.post('/user/register' , (req,res)=>{
    let{name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    });

    let error = [];
    if (!name || !name || !name || !name){
        error.push({message: "Please enter all fields"})
    }

    if(password.length < 6){
        error.push({message: "Password should be at least 6 characters long"})
    }

    if(password != password2){
        error.push({message: "Password do not match"})
    }

    if (error.length >0){
        res.render(__dirname+'/src/app/components/register/register.component.html', {error});
    }

});


 app.listen(PORT , () => {
    console.log('Server running on port $(PORT)');
 });

 