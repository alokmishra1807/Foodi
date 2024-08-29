import React, { useContext, useState, useEffect } from "react";
import UseCart from "../../Hooks/UseCart";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../contexts/AuthProvider";

const Cart = () => {
  const [cart, refetch] = UseCart();
  const { user } = useContext(AuthContext);

  // Fix price calculation function
  const calculatePrice = (item) => {
    return item.price * item.quantity;
  };

  // Handle decreasing quantity
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      const updatedQuantity = item.quantity - 1;

      fetch(`http://localhost:6001/carts/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: updatedQuantity }),
      })
        .then((res) => res.json())
        .then(() => {
          // Update local cart state
          const updatedCart = cart.map((cartItem) => {
            if (cartItem._id === item._id) {
              return {
                ...cartItem,
                quantity: updatedQuantity,
              };
            }
            return cartItem;
          });
          refetch(); // Refetch cart data from server
        })
        .catch((error) => {
          console.error('Error updating cart item:', error);
        });
    } else {
      alert("Item quantity can't be less than 1");
    }
  };

  // Handle increasing quantity
  const handleIncrease = (item) => {
    const updatedQuantity = item.quantity + 1;

    fetch(`http://localhost:6001/carts/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: updatedQuantity }),
    })
      .then((res) => res.json())
      .then(() => {
        // Update local cart state
        const updatedCart = cart.map((cartItem) => {
          if (cartItem._id === item._id) {
            return {
              ...cartItem,
              quantity: updatedQuantity,
            };
          }
          return cartItem;
        });
        refetch(); // Refetch cart data from server
      })
      .catch((error) => {
        console.error('Error updating cart item:', error);
      });
  };

  // Handle deleting cart item
  const handleDeleteCart = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:6001/carts/${item._id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              refetch(); // Refetch cart data from server
              Swal.fire({
                title: "Deleted!",
                text: "Your item has been deleted.",
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              title: "Error!",
              text: "There was an error deleting your item.",
              icon: "error",
            });
          });
      }
    });
  };

  // Calculate subtotal
  const subTotal = cart.reduce((total, item) => total + calculatePrice(item), 0);

  const customerId = user.displayName
    ? user.displayName.substring(0, 5).toUpperCase()
    : "UNKNOWN";

  return (
    <div className="section-container bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%">
      <div className="py-24 flex flex-col justify-center items-center gap-8">
        <div className="pt-[4rem] space-y-7 px-4 w-full justify-center items-center flex flex-col">
          <h2 className="md text-4xl font-bold md:leading-snug leading-snug">
            Item Added to The <span className="text-green">Cart</span>
          </h2>
        </div>

        <div className="w-full">
          <div className="overflow-x-auto w-full">
            <table className="table">
              <thead className="bg-green text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Food</th>
                  <th>Food Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, id) => (
                  <tr key={item._id}>
                    <td>{id + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img src={item.image} alt={item.name} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold">{item.name}</div>
                    </td>
                    <td>
                      <button
                        className="btn btn-xs"
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-10 mx-2 text-center overflow-hidden appearance-none"
                      />
                      <button
                        className="btn btn-xs"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </td>
                    <td>${calculatePrice(item).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger text-red"
                        onClick={() => handleDeleteCart(item)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="w-1/2 space-y-3">
          <h2 className="font-bold text-2xl">User Details</h2>
          <p>User Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>Customer Id: {customerId}{cart.length}</p>
        </div>
        <div className="w-1/2 space-y-3">
          <h2 className="text-2xl font-bold">Shopping Details</h2>
          <h3>Total Number of Items: {cart.length}</h3>
          <h4>Total Price: ${subTotal.toFixed(2)}</h4>
          <button className="btn bg-green text-white">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
