import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { db } from "./firebase";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {doc, setDoc} from 'firebase/firestore';

import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

const hostname = "0.0.0.0";
const port = 8000;

app.use(cors());
app.use(express.json());

const firebaseConfig ={
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};

const fb = initializeApp(firebaseConfig);
const storage = getStorage(fb, process.env.STORAGE_BUCKET);

type FoodData = {
    description: string;
    favorite: boolean;
    img: string[];
    name: string;
    rating: string;
}

app.get("/api/fooddata/:name", async( req, res) => {
     console.log("GET /api/fooddata was called");
     try {
         const response = await db.collection("foodinfo").doc(req.params.name).get();
         if (response.exists){
            const data = response.data();
            res.json(data);
         } else {
            console.log("No such document")
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({error: "Unable to Retrieve Food Information"});
     }
 });

 app.get("/api/allfoods/", async( req, res) => {
    console.log("GET /api/allfoods was called");
    try {
        var output: any = {};
        await db.collection("foodinfo").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                output[doc.id] = data;
            });
        });
        res.json(output);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Unable to Retrieve Food Information"});
    }
});

app.get("/api/favfoods/", async(req, res) => {
    console.log("GET /api/favfoods was called");
    try{
        var output: any = {};
        await db.collection("foodinfo").where("favorite", "==", true).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                output[doc.id] = data;
            });
        });
        res.json(output);
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Unable to Retrieve Favorite Foods"});
    }
});

 app.post("/api/submit", async(req, res) => {
     console.log("POST /api/submit was called");
     try{
        console.log(req.body);
         const body = req.body;
         const docRef = db.collection("foodinfo").doc(body.name.toLowerCase());
         docRef.set({
            name: body.name,
            img: body.img,
            description: body.description,
            rating: body.rating,
            favorite: body.favorite,
          });
          console.log("done");
          res.status(200).json({body: "Post successful"});
        } catch(error) {
         console.error(error);
         res.status(500).json({error: "Unable to make New Post"});
     }
 });

 app.post("/api/upload", async(req,res) => {
    console.log("POST /api/upload was called");
    try {
        const file = req.body.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log(file);
        const metadata = { contentType: 'image/jpeg' };
        const storageRef = ref(storage, 'images/' + file.originalname);
        const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);
        
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, 
            (error) => {
                switch (error.code) {
                case 'storage/unauthorized':
                    break;
                case 'storage/canceled':
                    break;
                case 'storage/unknown':
                    break;
                }
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    res.send(downloadURL);
                    console.log('File available at', downloadURL);
                });
            }
            );
        
    }catch(error) {
        console.error(error);
        res.status(500).json({error: "Unable to upload file"});
    }
 });

 app.get("/api/favorites", async(req, res) => {
     console.log("GET /api/favorites was called");
     try {
         const response = await db.collection("favorites").get();
         res.json(response);
     } catch(error) {
         console.error(error);
         res.status(500).json({error: "Unable to get Favorites"});
     }
 });

 app.put("/api/addfavorite/:name", async(req, res) => {
    console.log("PUT /api/addfavorite was called");
    try {
        console.log(req.body);
        const body: boolean = req.body.favorite;
        const response = await db.collection("foodinfo").doc(req.params.name).get();
        if (response.exists){
            await db.collection("foodinfo").doc(req.params.name).update({favorite: body});
            res.send(body);
        } else {
            console.log("No such document");
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Unable to add favorite"});
    }
 });

 app.delete("/api/del/:name", async(req, res) => {
    console.log("DELETE /api/del was called");
    try{
        const response = await db.collection("foodinfo").doc(req.params.name).get();
        if (response.exists){
            await db.collection("foodinfo").doc(req.params.name).delete();
            res.send()
        } else {
            console.log("No such document")
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Unable to delete post"});
    }
 });

app.listen(port, hostname, () => {
    console.log("Listening");
});