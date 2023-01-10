import dbConnection from "../../dbConnection.js";
import Joi from "joi"

async function getAll(req, res){
    try{
        const { userId } = req.payload;
        let search = req.query.search

        let notesFromUser;
        if(search == null) {
             [notesFromUser] = await dbConnection.query("SELECT * FROM note WHERE userid = ?", [userId]);
            console.log("Get all notes")

        }
        else{
             [notesFromUser] = await dbConnection.query("SELECT * FROM note WHERE userid = ? AND ( title = %?% OR body = %?% )", [userId,search,search])
            console.log("Get searched notes")

        }
        
        

        return res.json(notesFromUser);
    }catch(err){
        console.error(err);
        
        return res.status(500).json({
            message:"Bir hata oluştu"
        })
    }
}

async function getSingle(req, res){
    try{
        const {id: noteId} = req.params;
        const { userId } = req.payload;

        const [notesFromUser] = await dbConnection.query("SELECT * FROM note WHERE userid = ? AND id = ?", [userId, noteId]);

        if(notesFromUser.length == 0)
            return res.status(404).json({message:"Not bulunamadı"});

        return res.json(notesFromUser[0]);
    }catch(err){
        console.error(err);
        
        return res.status(500).json({
            message:"Bir hata oluştu"
        })
    }
}

const noteScheme = Joi.object({
    title:Joi.string().max(200).required(),
    body:Joi.string().optional()
});

async function getNoteWhere(req,res){




}

async function createNote(req,res){
    try{
        const { userId } = req.payload;
        const { title, body} = await noteScheme.validateAsync(req.body);

        try{
            const [{ insertId }] = await dbConnection.query("INSERT INTO note (userid, title, body) VALUES (?, ?, ?)", [userId, title, body]);
            const [[ newNote ]] = await dbConnection.query("SELECT * FROM note WHERE id = ?", [insertId]);
            return res.json(newNote);
        }catch(err){
            return res.status(500).json({
                message:"Bir hata oluştu"
            })
        }
    }catch(err){
        return res.status(400).json({
            message:"Doğrulama hatası, " + err.details[0].message,
        });
    }
}

async function updateNote(req,res){
    try{
        const {id: noteId} = req.params;
        const { userId } = req.payload;
        const { title, body} = await noteScheme.validateAsync(req.body);

        try{
            const a = await dbConnection.query("UPDATE note  SET title = ?, body = ? WHERE id = ? AND userId = ?", [title, body, noteId, userId]);
            if(a[0].affectedRows == 0)
                throw new Error("Böyle bir not yok");

            const [[ updatedNote ]] = await dbConnection.query("SELECT * FROM note WHERE id = ?", [noteId]);
           
            return res.json(updatedNote);
        }catch(err){
            return res.status(500).json({
                message:"Bir hata oluştu"
            })
        }
    }catch(err){
        return res.status(400).json({
            message:"Doğrulama hatası, " + err.details[0].message,
        });
    }
}

async function deleteNote(req,res){
    try{
        const {id: noteId} = req.params;
        const { userId } = req.payload;

        try{
            const a = await dbConnection.query("DELETE FROM note WHERE id = ? AND userid = ?", [noteId, userId]);
            if(a[0].affectedRows == 0)
                throw new Error("Böyle bir not yok");

            return res.json({message:"Başarıyla silindi."});
        }catch(err){
            return res.status(500).json({
                message:"Bir hata oluştu"
            })
        }
    }catch(err){
        return res.status(400).json({
            message:"Doğrulama hatası, " + err.details[0].message,
        });
    }
}

export { getAll, getSingle, createNote, updateNote, deleteNote }