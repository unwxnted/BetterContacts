const bcrypt = require('bcrypt');

const helpers = {};

helpers.encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

helpers.matchPassword = async (password, savedPasword) =>{

    try{
        return await bcrypt.compare(password, savedPasword);
    }catch(e){
        console.log(e)
    }
    

};

helpers.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash('error', 'Please signin first');
        res.redirect('/signin');
    }


}

helpers.isNotLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/profile');


}

module.exports = helpers;