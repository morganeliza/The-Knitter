function requireUser(req, res, next) {
  const isLoggedIn = async(req, res, next)=> {
    try {
      req.user = await findUserByToken(req.headers.authorization);
      next();
    }
    catch(ex){
      next(ex);
    }
  };

}

module.exports = {
  requireUser
 
}