import { useState } from "react";
import { BACKEND_BASE_PATH } from "../constants/Navigation";
import "./NewPost.css";

type FoodData = {
    [key: string]: {
        description: string;
        favorite: boolean;
        img: string[];
        name: string;
        rating: string;
    }
}

const NewPost = () => {
    const [name, setName] = useState("");
    const [descrip, setDescrip] = useState("");
    const [rating, setRating] = useState("");
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [filename, setFilename] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const handleImgUpload = (f:React.ChangeEvent<HTMLInputElement>) => {
        if (f.target.files != null) {
            setImageUpload(f.target.files[0]);
            console.log(f.target.files[0]);
        }
    };

    const foodInput: FoodData = {
        [name.toLowerCase()]: {
            description: descrip,
            favorite: false,
            img: [imgUrl],
            name: name,
            rating: rating,
        }
    }

    const handleSubmit = () => {
        try{
            fetch(
                `${BACKEND_BASE_PATH}/submit`, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                      },
                    body: JSON.stringify(foodInput),
                }
            ).then((res) => res.json()).then((value) => console.log("Form submitted"))
            .catch((error) => console.log(error));
            
        } catch(error){
            console.log(error);
        }
    };

    const handleUpload = () => {
        try{
            fetch(
                `${BACKEND_BASE_PATH}/upload`, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/file',
                    },
                    body: imageUpload,
                }
            ).then((res) => res.json()).then((d) => setImgUrl(d))
            .catch((error) => console.log(error));
        } catch(error) {
            console.log(error);
        }
    };

    return (
        
    <form action="/submit" method="post" encType="multipart/form-data" className="post-bg">
        <div className="post-container">
            <div className="centered-text">
                <h1>
                    Post a New Food!
                </h1>
                <p>
                    <label htmlFor="name">Name:</label>
                    <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required value={name} 
                    onChange={(e) => setName(e.target.value)} />
                </p>
                
                <p>
                    <label htmlFor="description">Description:</label>
                    <input 
                    type="text" 
                    id="description" 
                    name="description" 
                    required value={descrip} 
                    onChange={(d) => setDescrip(d.target.value)}></input>
                </p>
                
                <p>
                    <label htmlFor="rating">Rating:</label>
                    <input 
                    type="text" 
                    id="rating" 
                    name="rating" 
                    required value={rating} 
                    onChange={(r) => setRating(r.target.value)}></input>
                </p>
                <form action="/upload" method="post">
                <p>
                    <input 
                    type="file" 
                    name="image" 
                    accept="image/jpeg" 
                    id="image" 
                    required value={filename} 
                    onChange={(e) => {
                        setFilename(e.target.value);
                        console.log(filename);
                        handleImgUpload;
                        console.log(imageUpload);}}
                        ></input>
                    <button type="submit" onClick = {handleUpload}>Upload</button>
                </p>
                </form>
                
                <button type="submit" onClick = {handleSubmit}>Submit</button>
            </div>
        </div>
        
    </form>
    );
    
};

export default NewPost;