import { ChevronLeft , ChevronRight, Heart, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import "./FoodCard.css"
//import { db } from "../../../backend/firebase";

type Props = {
    children?: React.ReactNode | React.ReactNode[]
    foodname: string,
    imglist: Array<string>,
    descrip: string,
    rating: string,
    favorite: boolean,
};

const FoodCard = ({foodname, imglist, descrip, rating, favorite}:Props) => {
    const [img, setImg] = useState(0);
    const [heart, setHeart] = useState(favorite);

    const nextImg = () => {
        if (img + 1 < imglist.length){
            setImg(img+1);
        }
    };
    const prevImg = () => {
        if(img > 0){
            setImg(img-1);
        }
    };
    const makeFav =() => {
        setHeart(!heart);
    };

    const handleDelete = () => {
        try {
            fetch ("/api/delfood/${foodname}", { method: "DELETE"})
                .then(() => console.log("Delete successful"))
        } catch(error) {
            console.log(error)
        }
    };

    return (
         <div className="format-text">
            <img className="food-img" src = {imglist[img]} alt= {foodname}></img>
            <button onClick={makeFav}>
            {heart ? (<Heart style={{ color: 'red' }} size={10} />) : (<Heart size={10} />)}
            </button>
            <button onClick={handleDelete}>
                <Trash2 size = {10}></Trash2>
            </button>
            <p>Name: {foodname}</p>
            <p>Description: {descrip}</p>
            <p>Rating: {rating} </p>
            
            <button onClick={prevImg}>
                <ChevronLeft size = {15}></ChevronLeft>
            </button>
            <button onClick={nextImg}>
                <ChevronRight size={15}></ChevronRight>
            </button>
        </div>
            
    );
};

export default FoodCard;