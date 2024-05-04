import "./About.css";

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
                    <img className="about-img" src="https://firebasestorage.googleapis.com/v0/b/annie-food-blog.appspot.com/o/IMG_6903.png?alt=media&token=d6244068-1fde-4584-9aee-e834c4747fb1" alt="profile-pic"></img>
            </div>
        </>
    );
};
export default AboutPage;