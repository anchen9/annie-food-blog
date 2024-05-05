import { Link } from "react-router-dom";
import "./Submitted.css";

const Submitted = () => {

    return (
        <div className= "page-bg">
            <div className="submit-container">
                <div className="centered-text">
                    <h1> Form Submitted </h1>
                    <div className="format-buttons">
                        <Link to="/newpost">
                            <button type="button">Submit Another</button>
                            </Link>
                        <Link to="/">
                            <button type="button">Back to Home</button>
                            </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Submitted;