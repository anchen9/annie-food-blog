import { ChevronLeft , ChevronRight, Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import "./FoodCard.css"
import { BACKEND_BASE_PATH } from "../constants/Navigation";

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
    const input = {favorite: !heart};

    const makeFav =() => {
        try {
            fetch(
                `${BACKEND_BASE_PATH}/api/addfavorite/${foodname.toLowerCase()}`, {
                    method: "PUT",
                    headers: {
                        'content-type': 'application/json',
                      },
                    body: JSON.stringify(input),
                }
            ).then((res) => res.json())
            .then((b) => setHeart(b))
            .catch((error) => {
                console.log("Errored", error);
              })
        } catch(error) {
            console.log(error);
        }
    };

    const handleDelete = () => {
        try {
            fetch (`${BACKEND_BASE_PATH}/api/delfood/${foodname.toLowerCase()}`)
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