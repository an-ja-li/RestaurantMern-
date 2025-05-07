import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Homepage.css";
import Button from "../components/button";

const Homepage = () => {
  return (
    <section className="restaurant-home d-flex align-items-center justify-content-between min-vh-100">
      <div className="container text-center py-5">
        <h1 className="welcome-text mb-4">Welcome to Food O'clock</h1>
        <p className="instruction mb-4">Tap below to start your order</p>
        <Button className="big-order-btn">Start Ordering</Button>
      </div>

      <div className="burger-image-container">
       
      <img
           src="/Homepage image.png"
        alt="Burger"
        className="img-fluid burger-display"
      />

      </div>
    </section>
  );
};

export default Homepage;
