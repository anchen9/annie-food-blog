import FoodCard from "../components/FoodCard.tsx";
import { useState, useEffect } from "react";
import "./Food.css";
import { BACKEND_BASE_PATH } from "../constants/Navigation.tsx";

type FoodData = {
    [key: string]: {
        description: string;
        favorite: boolean;
        img: string[];
        name: string;
        rating: string;
    }
}

const FoodPage = () => {

    const [data, setData] = useState<FoodData | null>(null);

    useEffect(() => {
        fetch(
            `${BACKEND_BASE_PATH}/allfoods`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                  },
            }
        )
          .then((res) => res.json())
          .then((d) => {
            console.log("Fetched", d);
            setData(d);
          })
          .catch((error) => {
            console.log("unable to fetch");
            console.log("Errored", error);
          })
      }, []
    );

    useEffect(() => {
        console.log("Data changed to", data);
    }, [data]);


    return (
        <div className="food-bg">
            <h1 className="food-header">Food Feed</h1>
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
    );
};

export default FoodPage;