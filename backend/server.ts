import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { WeatherResponse } from "@full-stack/types";
import { db } from "./firebase";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import 'firebase/firestore';

const app: Express = express();

const hostname = "0.0.0.0";
const port = 8000;

app.use(cors());
app.use(express.json());

type WeatherData = {
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation: string;
    current: {
        time: string;
        interval: number;
        precipitation: number;
    };
};

type FoodData = {
    description: string;
    favorite: boolean;
    img: string[];
    name: string;
    rating: string;
}

app.get("/weather", async (req, res) => {
    console.log("GET /api/weather was called");
    try {
        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=40.7411&longitude=73.9897&current=precipitation&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FNew_York&forecast_days=1"
        );
        const data = (await response.json()) as WeatherData;
        const output: WeatherResponse = {
            raining: data.current.precipitation > 0.5,
        };
        res.json(output);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

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
})

 app.post("/submit", async(req, res) => {
     console.log("POST /api/submit was called");
     try{
         const body: FoodData = req.body;
         const docRef = await db.collection("foodinfo");
         await docRef.doc(body.name).set( {
             name: body.name,
             img: body.img,
             description: body.description,
             rating: body.rating,
             favorite: body.favorite,
         });
         res.send("New Post Created");
     } catch(error) {
         console.error(error);
         res.status(500).json({error: "Unable to make New Post"});
     }
 });

 app.post("/api/upload", async(req,res) => {
    console.log("POST /api/upload was called");
    try {
        const storage = getStorage();
        const file = req.body;
        const metadata = {
            contentType: 'image/jpeg'
          };
        const storageRef = ref(storage, 'images/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
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

 app.delete("api/delfood/:name", async(req, res) => {
    console.log("DELETE /api/delfood was called");
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
