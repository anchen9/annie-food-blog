import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { WeatherResponse } from "@full-stack/types";
import { db } from "./firebase";
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

type FoodCardInput = {
    foodname: string,
    imglist: Array<string>,
    descrip: string,
    rating: string,
};

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

 app.post("/api/foodpost", async(req, res) => {
     console.log("POST /api/foodpost was called");
     try{
         const body: FoodCardInput = req.body;
         const response = await db.collection("foodinfo");
         const foodname = body.foodname;
         await response.doc(foodname).set( {
             foodname: body.foodname,
             imglink: body.imglist,
             description: body.descrip,
             rating: body.rating,
         });
         res.send("New Post Created");
     } catch(error) {
         console.error(error);
         res.status(500).json({error: "Unable to make New Post"});
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
        const body: string = req.body;
        const docRef = await db.collection("foodinfo").doc(req.params.name);
        const response = await db.collection("foodinfo").doc(req.params.name).get();
        if (response.exists){
            docRef.update({
                favorite: body
            }).then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
         } else {
            console.log("No such document")
         }
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Unable to add favorite"});
    }
 });

 app.delete("api/delfood/:name", async(req, res) => {
    console.log("DELETE /api/delfood was called");
    try{
        const docRef = await db.collection("foodinfo").doc(req.params.name);
        const response = await db.collection("foodinfo").doc(req.params.name).get();
        if (response.exists){
            docRef.delete().then(() => {
                console.log("Post deleted");
            }).catch((error) => {
                console.error("Error deleting document: ", error);
            });
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
