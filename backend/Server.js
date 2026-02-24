import express from 'express';
import multer from 'multer';
import cors from 'cors';
import cloudinary from './config/cloudinary.js';
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app=express();
app.use(cors());

const storage = multer.diskStorage({
  destination: "uploads/",  // where the images has to be stored not a database name
  filename: (req, file, cb) => { //cb is the callback 
    const ext = path.extname(file.originalname);// extracting the filemextension from the name 
    cb(null, Date.now() + ext);// creating a unique file name using date +extensiom
  }
});
//console.log(process.env.API_SECRET);
const upload=multer({storage});
const images=[];

app.post("/upload",upload.single("image"),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({ message: "No file uploaded" });
        }
        const filePath = path.resolve(req.file.path); // convert the multer's relative file path into an absoluute system path 
        //console.log("file:", filePath);
        const result=await cloudinary.uploader.upload(filePath); //Uploads the image file from your server to Cloudinary.
        // send file to cloud storage 
        images.push(result.secure_url);
        //secure_url -> a https link 
        res.json({imageUrl: result.secure_url});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }

});

app.get("/images", (req, res) => {
  res.json(images);
});

app.listen(2007,()=>{
    console.log("Server is runnin on port 2007");
})