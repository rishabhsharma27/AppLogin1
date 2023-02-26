const LocalStrategy = require("passport-local").Strategy;

const {pool} = require("./dbConfig");

const bcrypt = require("bcrypt");

const passport = require("passport");



function initialize(passport) {
    const authenticateUser = (email,password,done) =>{

        pool.query(
            `SELECT * FROM users WHERE email = $1`, 
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }
           // console.log(results.rows);
            
            if (results.rows.length > 0){

                const user = results.rows[0];

                bcrypt.compare(password, user.password, (err, isMatch) =>{
                    if (err) {
                        throw err;
                    }
                
                    if (isMatch) {
                        //console.log('pass');
                        return done(null, user);
                        
                    }else{
                        //console.log('fail');
                        return done(null, false, {message: "Password is not correct"});
                    }
                });
            }
            else{
                return done(null, false, {message: "Email is not registered"});
            }
            } 
        );
    };  

    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    );

    passport.serializeUser((users, done) => done(null, users));

    passport.deserializeUser((users, done) => {
        //console.log(users);
        
        pool.query(
            `Select * FROM users WHERE id = $1`, [users.id], 
            (err, results) => {
                if (err){
                    throw err;
                }
                //console.log(results.rows);
                return done(null, results.rows[0]);
            }
        )
        
    }
    )
    
}

module.exports = initialize;