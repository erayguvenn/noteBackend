import { json } from "express";
import dbConnection from "../../dbConnection.js";
import Joi from "joi"

const changeUserScheme = Joi.object({
    name:Joi.string().min(3).max(64).required(),
    surname:Joi.string().min(3).max(64).required(),

})

async function getUser(req, res){
    try{
    
        const { userId } = req.payload;

        const [users] = await dbConnection.query("SELECT name,surname,email FROM user WHERE id = ?", [userId]);

        if(users.length == 0)
            return res.status(404).json({message:"Kullanıcı bulunamadı"});

        return res.json(users[0]);
    }catch(err){
        console.error(err);
        
        return res.status(500).json({
            message:"Bir hata oluştu"
        })
    }
}
async function putUser(req, res){
    try{
    
        const { userId } = req.payload;
        const { name,surname} = changeUserScheme.validateAsync(req.body)

        const [users] = await dbConnection.query("UPDATE user set name=?,surname = ? WHERE id = ?", [name,surname,userId]);

        if(users.length == 0)
            return res.status(404).json({message:"Kullanıcı bulunamadı"});

        return res.json(users[0]);
    }catch(err){
        console.error(err);
        
        return res.status(500).json({
            message:"Bir hata oluştu"
        })
    }
}

export {getUser}