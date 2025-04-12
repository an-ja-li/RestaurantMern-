import React from 'react';

const FoodCard = ({ food, onEdit, onDelete }) => {
  return (
    <div style={styles.card}>
      <img src={food.imageUrl} alt={food.name} style={styles.image} />
      <h3>{food.name}</h3>
      <p>Price: ₹{food.price}</p>
      <p>Category: {food.category}</p>
      <p>Type: {food.type}</p>
      <button onClick={() => onEdit(food)} style={styles.editBtn}>Edit</button>
      <button onClick={() => onDelete(food._id)} style={styles.deleteBtn}>Delete</button>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    padding: '1rem',
    margin: '1rem',
    borderRadius: '8px',
    width: '250px',
    textAlign: 'center',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '1rem',
  },
  editBtn: {
    marginRight: '10px',
    padding: '5px 10px',
  },
  deleteBtn: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
  }
};

export default FoodCard;
