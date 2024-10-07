const jwt = require('jsonwebtoken')
const secretKey = 'my-secret-key';



module.exports=(req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,secretKey);
        const user_id=decodedToken.user_id;
        req.auth={
            user_id:user_id
        };
        next();
    }catch(error){
        res.status(401).send({ message: "You are not authorized to access here !" });
    }
};