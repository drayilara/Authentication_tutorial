
const isAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        res.sendStatus(401);
    }
}


const isAdmin = (req,res,next) => {
    if(req.isAuthenticated()){
        if(req.user.admin){
            next();
            return;
        }
    }

    res.send("Unauthorised, admins only");
}

module.exports.isAuth = isAuth;
module.exports.isAdmin = isAdmin;