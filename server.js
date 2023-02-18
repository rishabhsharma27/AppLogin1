const express = require ("express");

const { listen } = require("express/lib/application");

const bcrypt = require("bcrypt")

const app = express();

const session = require("express-session");

const flash = require("express-flash")

const router = express.Router();

const path  = require('path')

const {pool} = require("./dbConfig");

const PORT = process.env.PORT || 4000;

const passport = require("passport");

const initializePassport = require("./passportConfig");

initializePassport(passport);

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(session({ 
    secret: 'secret',
    resave: false,
    saveUninitialized: false
})
);

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

app.get("/", (req, res) => {
    //res.send(__dirname+'/src/app/components/login/login.html');
    res.sendFile(__dirname+'/src/app/components/home/home.component.html');
}
);

app.get("/user/register", checkAuthenticated , (req, res) => {
    res.render(__dirname+'/src/app/components/register/register.component.html');

});

app.get("/user/login", checkAuthenticated, (req, res) => {
    //res.send(__dirname+'/src/app/components/login/login.html');
    let errors = [];
    res.render(__dirname+'/src/app/components/login/login.component.html',{errors});
}
);

app.get("/user/dashboard", checkNotAuthenticated, (req , res) => {
    //let user = [];
    res.render(__dirname+'/src/app/components/dashboard/dashboard.component.html',{user: req.user.name});
}
);


app.get("/user/logout", (req, res) => {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
    });
    let errors = [];
    errors.push({message :"You are logged out"});
    res.render(__dirname+'/src/app/components/login/login.component.html',{errors});
    
});


app.post("/user/register" , async (req,res)=>{
    let{name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    });
    
    let errors = [];

    if (!name || !email || !password || !password2){
        errors.push({message :"Please enter all fields"});
    }

    if(password.length < 6){
        errors.push({message :"Password should be more than 6 characters"});
        
    }

    if(password != password2){
        errors.push({message :"Password mismatch"});
    }

    if (errors.length >0){
        res.render(__dirname+'/src/app/components/register/register.component.html',{errors});
       
    } else {
        let hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword)


        pool.query(
            `Select * FROM users WHERE email = $1`, [email], 
            (err, results) => {
                if (err){
                    throw err;
                }
            console.log(results.rows);

            if(results.rows.length > 0){
                errors.push({message :"Email already registered"});
                res.render(__dirname+'/src/app/components/register/register.component.html',{errors});
            }else{
                pool.query(
                    `INSERT INTO users (name,email,password)
                    VALUES ($1,$2,$3)
                    RETURNING id, password`, [name, email,hashedPassword],
                    (err, results) => {
                        if (err){
                            throw err;
                        }
                    console.log(results.rows);
                    errors.push({message :"You are now registered. Please login"});
                    res.render(__dirname+'/src/app/components/login/login.component.html',{errors});
                    }
                )
            }
            }   
        )
    }

});

app.post("/user/login", passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true

})
);

function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return res.redirect("/user/dashboard");
    }
    next();
}

function checkNotAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/login")
}

 app.listen(PORT , () => {
    console.log('Server running on port : ' + PORT);
 });

 