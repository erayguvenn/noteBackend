import dbConnection from "../../dbConnection.js"
import Joi from "joi"
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken"

const loginScheme = Joi.object({
    email:Joi.string().email({minDomainSegments: 2}),
    password:Joi.string().min(8).max(64).required(),
});

async function login(req,res){
    try{
        const { email, password} = await loginScheme.validateAsync(req.body);

        const [usersWithSameEmail] = await dbConnection.query("SELECT * FROM user WHERE email = ?", [email]);

        if(usersWithSameEmail.length == 0){
            return res.status(404).send({
                message:"Hatalı eposta ya da şifre"
            });
        }

        const user = usersWithSameEmail[0];

        try{
            
            const isPasswordSame = await bcrypt.compare(password, user.password);
            if(!isPasswordSame)
                throw new Error("Hatalı şifre");

            const token = jsonwebtoken.sign({
                userId:user.id
            },process.env.JWT_SECRET);

            return res.json({
                message:"Başarıyla giriş yaptınız",
                token
            })
        }catch(err){
            return res.status(404).send({
                message:"Hatalı eposta ya da şifre"
            });
        }

    }catch(err){
        console.error(err)
        res.status(400).json({
            message:"Doğrulama hatası, " + err.details[0].message,
        });
        return;
    }
}

const registerScheme = Joi.object({
    name:Joi.string().min(3).max(64).required(),
    surname:Joi.string().min(3).max(64).required(),
    email:Joi.string().email({minDomainSegments: 2}),
    password:Joi.string().min(8).max(64).required(),
    
});

async function register(req,res){
    try{
        const { name, surname, email, password} = await registerScheme.validateAsync(req.body);

        const [usersWithSameEmail] = await dbConnection.query("SELECT * FROM user WHERE email = ?", [email]);

        if(usersWithSameEmail.length > 0){
            return res.status(409).send({
                message:"Eposta zaten kullanılıyor"
            });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        try{
            await dbConnection.query("INSERT INTO user (name,surname,email,password) VALUES (?,?,?,?)", [name, surname, email, hashedPassword]);
            
            return res.send({
                message:"Başarıyla kayıt oldunuz"
            })
        }catch(err){
            console.error(err);
            return res.status(500).send({
                message:"Bir hata oluştu"
            })
        }
        return;
    }catch(err){
        console.error(err)
        res.status(400).json({
            message:"Doğrulama hatası, " + err.details[0].message,
        });
        return;
    }
}

export { login, register}