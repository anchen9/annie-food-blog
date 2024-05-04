import { useState } from "react";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

import "./NewPost.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";


type FoodData = {
        description: string;
        favorite: boolean;
        img: string[];
        name: string;
        rating: string;
};

const NewPost = () => {
    const [name, setName] = useState("");
    const [descrip, setDescrip] = useState("");
    const [rating, setRating] = useState("");

    // const [imageUpload, setImageUpload] = useState<File | null>(null);
    // const [filename, setFilename] = useState("");
    // const [imgUrl, setImgUrl] = useState("");

    // const handleImgUpload = (f:React.ChangeEvent<HTMLInputElement> | null) => {
    //     if (f && f.target.files && f.target.files.length > 0) {
    //         const file = f.target.files[0];
    //         setImageUpload(file);
    //         console.log(file);
    //     }
    // };

    const foodInput: FoodData = {
            description: descrip,
            favorite: false,
            img: [""],
            name: name,
            rating: rating,
    }
    const navigate = useNavigate();


    const handleSubmit = () => {
        try{
            fetch(
                `${BACKEND_BASE_PATH}/api/submit`, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                      },
                    body: JSON.stringify(foodInput),
                }
            ).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to submit form');
                }
                console.log('Response status:', res.status); // Log the response status
            }).then(() => navigate("/formsubmitted"))
            .catch((error) => console.log(error));
        } catch(error){
            console.log(error);
        }
    };
    // const handleUpload = () => {
    //     try{
    //         const formData = new FormData();
    //         if (imageUpload) {
    //             formData.append('image', imageUpload);
    //         }

    //         fetch(
    //             `${BACKEND_BASE_PATH}/api/upload`, {
    //                 method: "POST",
    //                 headers: {
    //                     'content-type': 'multipart/form-data',
    //                 },
    //                 body: formData,
    //             }
    //         ).then((res) => res.json()).then((d) => setImgUrl(d))
    //         .catch((error) => console.log(error));
    //     } catch(error) {
    //         console.log(error);
    //     }
    // };

    return (
        <div className = "post-bg">
        <div className="post-container">
            <div className="centered-text">
                <form action="/formsubmitted" onSubmit = {handleSubmit} method="post" encType="multipart/form-data">
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
                            
                            <button type="submit">Submit</button> 
                </form>

        {/* <form action="/api/upload" method="post" encType="multipart/form-data">
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
                        handleImgUpload(e)
                        console.log(imageUpload);
                    }}
                    ></input>
                    <button type="submit" onClick = {handleUpload}>Upload</button>
                </p>
                </form> */}
            </div>
    </div>
    </div>
    );
    
};


export default NewPost;