import "./About.css";
import { db } from "../firebase";

const AboutPage = () => {

    return (
        <>
             <div className = "about-bg">
                <h1 className="about-header">About Me</h1>
                <div className="about-container">
                    <p className="centered-text">
                        Hi! My name is Annie Chen! Welcome to my Food Blog!
                        I like to post pictures of food I've eaten and also adding 
                        ratings as well as descriptions of the food!
                    </p>
                </div>
                    <img className="about-img" src="gs://annie-food-blog.appspot.com/IMG_6903.png" alt="profile-pic"></img>
            </div>
        </>
    );
};
export default AboutPage;
