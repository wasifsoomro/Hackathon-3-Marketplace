"use client";

import { useEffect, useState } from "react";
import { getApiProducts} from "../sanity/lib/client";

const OrderSummary: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    const fetchProducts = async () => {
      try {
        const productData = await getApiProducts();
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (cart.length === 0) {
    return <div>Your cart is empty</div>;
  }

  const cartDetails = cart.map((cartItem) => {
    const product = products.find((item) => item.id === cartItem.id);
    if (!product) return null;

    const subtotal = product.price * cartItem.quantity;
    const discountAmount = product.discount ? subtotal * product.discount : 0;
    const total = subtotal - discountAmount + (product.deliveryFee > 0 ? product.deliveryFee : 0);

    return {
      ...product,
      quantity: cartItem.quantity,
      subtotal,
      discountAmount,
      total,
    };
  });

  const grandTotal = cartDetails.reduce((acc, item) => acc + (item?.total || 0), 0);

  return (
    <div>
      <h2 className="text-lg md:text-2xl font-semibold mb-4">Order Summary</h2>
      {cartDetails.map(
        (item) =>
          item && (
            <div key={item.id} className="mb-6 border-b pb-4">
              <h3 className="font-bold text-md md:text-lg">{item.name}</h3>
              <div className="flex justify-between text-sm md:text-md mb-2">
                <span>Quantity</span>
                <span>{item.quantity}</span>
              </div>
              <div className="flex justify-between text-sm md:text-md mb-2">
                <span>Subtotal</span>
                <span className="font-bold">${item.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-md mb-2">
                <span>Discount</span>
                <span className="text-red-500">-${item.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-md mb-2">
                <span>Delivery Fee</span>
                <span>{item.deliveryFee > 0 ? `$${item.deliveryFee.toFixed(2)}` : "Free"}</span>
              </div>
              <div className="flex justify-between text-md md:text-lg font-bold">
                <span>Total</span>
                <span>${item.total.toFixed(2)}</span>
              </div>
            </div>
          )
      )}
      <hr className="my-4" />
      <div className="flex justify-between text-lg md:text-xl font-bold">
        <span>Grand Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
