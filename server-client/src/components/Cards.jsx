import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from "sweetalert2";
import UseCart from "../Hooks/UseCart";

const Cards = ({ item }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Correctly initialize navigate
  const location = useLocation(); // Correctly initialize location

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };
  const [cart, refetch] = UseCart();



  const handleAddtoCart = (item) => {
    const { name, image, price, recipe, _id } = item;

    if (user && user?.email) {
      const cartItem = { 
        menuItem: _id, 
        name, 
        image, 
        price, 
        recipe, 
        quantity: 1, 
        email: user.email 
      };

      // Make the fetch request
      fetch('http://localhost:6001/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      })
      .then((res) => {
        if (res.status === 409) {
            // Handle the case where the item is already in the cart
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Item already in cart",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        return res.json(); // Process the response
      })
      .then((data) => {
        if (data && data.insertedId) { 
          // Check if the data was inserted successfully
          refetch(); // Refetch the cart items
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your item has been added to the cart",
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Failed to add item to cart",
          showConfirmButton: false,
          timer: 1500
        });
      });
    } else {
      Swal.fire({
        title: "Forgot Logging In?",
        text: "Create an account if you are new",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Create Account!"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signup', { state: { from: location } });
        }
      });
    }
  };


  return (
    <div className="card shadow-xl relative mr-5 md:my-5">
      <div
        className={`rating gap-1 absolute right-2 top-2 p-4 heartStar bg-green rounded-tr-xl rounded-bl-xl ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="w-5 h-5 cursor-pointer" />
      </div>
      <Link to={`/menu/${item._id}`}>
        <figure>
          <img src={item.image} alt="Shoes" className="hover:scale-105 transition-all duration-300 md:h-72" />
        </figure>
      </Link>
      <div className="card-body">
        <Link to={`/menu/${item._id}`}>
          <h2 className="card-title">{item.name}!</h2>
        </Link>
        <p>Description of the item</p>
        <div className="card-actions justify-between items-center mt-2">
          <h5 className="font-semibold">
            <span className="text-sm text-red">$ </span> {item.price}
          </h5>
          <button className="btn bg-green text-white" onClick={() => { handleAddtoCart(item); }}>Add to Cart </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
