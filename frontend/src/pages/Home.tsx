import { useEffect, useState } from "react";
import "./Home.css";
import { BACKEND_BASE_PATH } from "../constants/Navigation";
import FoodCard from "../components/FoodCard";

type FoodData = {
    [key: string]: {
        description: string;
        favorite: boolean;
        img: string[];
        name: string;
        rating: string;
    }
}

const HomePage = () => {
    const [data, setData] = useState<FoodData | null>(null);

    useEffect(() => {
        fetch(
            `${BACKEND_BASE_PATH}/favfoods`
        )
          .then((res) => res.json())
          .then((d) => {
            console.log("Fetched", d);
            setData(d);
          })
          .catch((error) => {
            console.log("Errored", error);
          })
      }, []
    );
    
    return (
    <div className="home-bg">
            <h1 className="home-header">Annie's Food Blog</h1>
                <div className="home-container">
                    <p className="centered-text">
                    Welcome to my food blog! Here, I post pictures of food I've eaten during my travels 
                    as well as my daily life. Here are some of my favorite foods that I've eaten recently!
                    </p>
                </div>
           <div className="food-cards-container">
                    {
                        data 
                            ? Object.entries(data)
                                .map(([key, value]) => 
                                    <FoodCard 
                                        key={key}
                                        foodname={value.name} 
                                        descrip={value.description} 
                                        imglist={value.img} 
                                        rating={value.rating} 
                                        favorite={value.favorite} 
                                    />
                                ) 
                            : <p>Loading...</p>
                    }
            </div> 
    </div>  
    )
};

export default HomePage;