import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Homepage.css"; // Import CSS for additional styling
import Button from "../components/button"; // Custom Button component

const Homepage = () => {
  return (
    <>
      {/* Import Google Font for cursive style */}
      <link
        href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
        rel="stylesheet"
      />

      <div className="container d-flex align-items-center justify-content-between py-5">
        <div className="text-left">
          <h1 className="title">Wait a minute for delicious.</h1>
          <Button>Discover Menu</Button>
        </div>
        <div>
          <img
            src="https://previews.123rf.com/images/smit/smit0810/smit081000273/3745441-round-pizza-isolated-on-white-background.jpg"
            alt="Briko Salad"
            className="img-fluid rounded-circle food-image"
          />
        </div>
      </div>
    </>
  );
};

export default Homepage;