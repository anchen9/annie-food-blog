import { useState } from "react";
import { BACKEND_BASE_PATH } from "../constants/Navigation";

import "./NewPost.css";
import { useNavigate } from "react-router-dom";


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
    const [imgUrl, setImgUrl] = useState("");

    const foodInput: FoodData = {
            description: descrip,
            favorite: false,
            img: [imgUrl],
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
                res.json(); 
                console.log("Received");
            }).then(() => navigate("/formsubmitted"))
            .catch((error) => console.log(error));
        } catch(error){
            console.log(error);
        }
    };

    return (
        <div className= "post-bg">
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

                            <p>
                                <label htmlFor="imgUrl">Image URL:</label>
                                <input 
                                type="text" 
                                id="imgurl" 
                                name="imgurl" 
                                required value={imgUrl} 
                                onChange={(i) => setImgUrl(i.target.value)}></input>
                            </p>

                            <button type="submit" onClick={handleSubmit}>Submit</button> 
                </div>
            </div>
        </div>
    );
    
};


export default NewPost;