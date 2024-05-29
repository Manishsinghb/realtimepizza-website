function auth (req,res,next){
    if(req.isAuthenticated()) {// due to passport
        return next()

}
return res.redirect('/login')
}
module.exports = auth