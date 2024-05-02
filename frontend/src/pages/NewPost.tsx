import "./NewPost.css";

const NewPost = () => {
    const handleSubmit = () => {

    };

    const handleUpload = () => {

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
                    <input type="text" id="name" name="name" required></input>
                </p>
                
                <p>
                    <label htmlFor="description">Description:</label>
                    <input type="text" id="description" name="description" required></input>
                </p>
                
                <p>
                    <label htmlFor="rating">Rating:</label>
                    <input type="text" id="rating" name="rating" required></input>
                </p>
                
                <p>
                    <form action="/upload" method="post">
                    <input type="file" name="image" accept="image/*"></input>
                    <button type="submit">Upload</button>
                    </form>
                </p>
                
                <button type="submit">Submit</button>
            </div>
        </div>
        
    </form>
    );
    
};

export default NewPost;