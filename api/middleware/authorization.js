import jsonwebtoken from "jsonwebtoken";

function Authorization(req, res, next){
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            message:"Yetkilendirme başarısız"
        })
    }

    try{
        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.payload = payload;

        next();
    }catch(err){
        return res.status(401).json({
            message:"Yetkilendirme başarısız"
        })
    }
}

export default Authorization;