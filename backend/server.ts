import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { db } from "./firebase";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes} from "firebase/storage";
import {doc, setDoc} from 'firebase/firestore';

import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

const hostname = "0.0.0.0";
const port = 8080;

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

app.get("/fooddata/:name", async( req, res) => {
     console.log("GET /fooddata was called");
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

 app.get("/allfoods/", async( req, res) => {
    console.log("GET /allfoods was called");
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

app.get("/favfoods/", async(req, res) => {
    console.log("GET /favfoods was called");
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

 app.post("/submit", async(req, res) => {
     console.log("POST /submit was called");
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
 
 app.get("/favorites", async(req, res) => {
     console.log("GET /favorites was called");
     try {
         const response = await db.collection("favorites").get();
         res.json(response);
     } catch(error) {
         console.error(error);
         res.status(500).json({error: "Unable to get Favorites"});
     }
 });

 app.put("/addfavorite/:name", async(req, res) => {
    console.log("PUT /addfavorite was called");
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

 app.delete("/del/:name", async(req, res) => {
    console.log("DELETE /del was called");
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