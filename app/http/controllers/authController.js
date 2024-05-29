const passport = require('passport')
const User = require('../../models/user')
const bcrypt = require("bcrypt")
function authController(){
      const _getRedirectUrl = (req) =>{
        return req.user.role == 'admin' ? '/admin/orders':'/customer/orders'
      }
    return {
        login(req,res){
           res.render('auth/login')
        },
        postLogin(req, res, next) {
          const {  email, password } = req.body;
          
          // Validate request
          if (!email || !password) {
            req.flash('error', 'All fields are required');
      
            return res.redirect('/login');
          }

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err);
                    }

                    return res.redirect(_getRedirectUrl(req))
                });
            })(req, res, next);
        },

        
        register(req,res){
            res.render('auth/register')
         },
         async postRegister(req, res) {
            const { name, email, password } = req.body;
          
            // Validate request
            if (!name || !email || !password) {
              req.flash('error', 'All fields are required');
              req.flash('name', name);
              req.flash('email', email);
              return res.redirect('/register');
            }
          
            try {
              // Check if email exists in the database
              const emailExists = await User.exists({ email: email });
              if (emailExists) {
                req.flash('error', 'Email already taken');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
              }
          
              // Hash password
              const hashedPassword = await bcrypt.hash(password, 10);
          
              // Create a user
              const user = new User({
                name,
                email,
                password: hashedPassword,
              });
          
              // Save the user to the database
              await user.save();
          
              // Redirect to the home page or login page
              return res.redirect('/');
            } catch (err) {
              req.flash('error', 'Something went wrong');
              return res.redirect('/register');
            }
          },
          logout(req, res) {
            req.logout(function (err) {
              if (err) {
                // Handle error if necessary
                console.error(err);
              }
              return res.redirect('/login');
            });
          }
          
          
          

    }
}

module.exports = authController


