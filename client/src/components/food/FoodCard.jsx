import React from 'react';
 import Button from '../button'; // ✅ correct path from components/food/
 import '../food/FoodCard.css';
 
 
 
 const FoodCard = ({ food, onEdit, onDelete }) => {
   return (
     <div className="food-card">
       <img
         src={food.imageUrl}
         alt={food.name}
         className="food-image"
       />
       <h3 className="food-name">{food.name}</h3>
       <p className="food-price">₹{Number(food.price).toFixed(2)}</p>
       <p className="food-type">{food.type}</p>
       <div className="food-actions">
         <button className="food-btn" onClick={() => onEdit(food)}>
           Edit
         </button>
         <button className="food-btn" onClick={() => onDelete(food._id)}>
           Delete
         </button>
       </div>
     </div>
   );
 };
 
 export default FoodCard;