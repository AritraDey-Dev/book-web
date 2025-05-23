"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Update the path to your CartContext file
import toast from "react-hot-toast";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Bank");

  const router = useRouter();
  const { cartItems, calculateTotalPrice } = useCart();
  const [items, setItems] = useState({});

  const saveCartToDatabase = async (e) => {
    e.preventDefault();

    try {
      setItems(cartItems);
      // const total = calculateTotalPrice();
      const res = await fetch("api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          payment,
          items,
        }),
      });
      if (res.ok) {
        setName("");
        toast.success("Payment Done successfully");
        router.push("/");
      } else {
        console.log("Data saving failed.");
      }
    } catch (error) {
      console.log("Error during saving data into cart: ", error);
    }
  };

  const makePayment = async () => {
    setItems(cartItems);
    // const total = calculateTotalPrice();

    const stripe = await stripePromise;
    const { id } = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cartItems }),
    }).then((res) => res.json());

    const { error } = await stripe.redirectToCheckout({
      sessionId: id,
    });

    if (error) {
      console.error("Error redirecting to Stripe checkout:", error);
      toast.error("Failed to redirect to payment page.");
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 justify-start md:px-8">
      <h1 className="text-center font-main text-2xl font-semibold lg:text-3xl">Checkout</h1>
      <p className="mb-8 text-center font-MyFont lg:mb-14">
        Provide your payment and delivery address information to finalize your order.
      </p>
      <form
        onSubmit={saveCartToDatabase}
        className="my-4 md:grid md:grid-cols-2 md:gap-x-6 lg:grid-cols-5 lg:gap-x-10 font-MyFont divide-x"
      >
        <div className="md:col-span-1 lg:col-span-3">
          <h2 className="text-xl font-bold">Billing Details</h2>
          <div className="mb-4">
            <label className="font-MyFont font-medium">
              Full Name
              <input
                placeholder="Enter Your Full Name"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                type="text"
                name="fullName"
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="font-MyFont font-medium">
              Email Address
              <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Valid Email"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                type="email"
                name="email"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="font-MyFont font-medium">
              Phone
              <input
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919021457863 (or) 09932146687"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                type="text"
                name="phone"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="font-MyFont font-medium">
              Address
              <textarea
                onChange={(e) => setAddress(e.target.value)}
                placeholder="No (27), 11 M, 370205, gujarat, India"
                rows="4"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                name="address"
              ></textarea>
            </label>
          </div>
          <label className="ml-1">
            <input
              className="mr-2 scale-125 accent-skin-accent outline-skin-accent"
              type="checkbox"
              name="saveInfo"
            />
            Save this information for next time
          </label>
          <div className="my-4">
            <label className="font-MyFont font-medium">
              Order Notes (optional)
              <textarea
                rows="4"
                className="my-1 block w-full md:pr-10 rounded border-2 border-gray-300 bg-primary py-1 px-2 font-normal outline-skin-accent"
                name="orderNotes"
              ></textarea>
            </label>
          </div>
          <div>
            <Link
              className="text-link hidden items-center underline decoration-dashed underline-offset-8 hover:decoration-solid md:inline-flex font-MyFont opacity-60"
              href="/"
            >
              <MdArrowBackIos />
              Return To Cart
            </Link>
          </div>
        </div>

        <div className="my-4 flex flex-col gap-3 rounded justify-between divide-y bg-bggray p-4 md:col-span-1 md:p-6 lg:col-span-2 lg:my-0 lg:p-8">
          <div className="flex flex-col justify-between ">
            <h2 className="text-center text-lg font-semibold">Order Summary</h2>
            <span className="font-medium mt-10 mb-2">Have a Coupon code?</span>
            <div className="mt-1 flex justify-between">
              <input
                placeholder="Enter Your Coupon code"
                className=" block  md:pr-10 rounded border-2 border-gray-300 bg-primary py-1font-normal outline-skin-accent mr-3 flex-1 px-2 "
                type="text"
              />
              <button
                type="button"
                className="rounded z-100 bg-gray-800 px-4 py-1 text-lg font-medium tracking-widest text-primary outline-offset-2 hover:bg-opacity-80 active:bg-opacity-100"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between ">
            <div className="flex items-center py-6 justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-semibold">
                {calculateTotalPrice()} &#x20B9;
              </span>
            </div>
            <div className="flex flex-col font-MyFont gap-3 justify-center ">
              <label htmlFor="Cash" className="flex">
                <input
                  type="radio"
                  name="payment"
                  value="Cash"
                  id="Cash"
                  className="h-5 w-5 mt-2  border-2 border-black cursor-default rounded-full bg-primary shadow-[0_0_0_2px] shadow-bggray  focus-within:border-2 focus-within:border-skin-accent"
                  checked={payment === "Cash"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                <h1 className=" ml-auto w-11/12 mt-2 text-left font-bold leading-none text-skin-dark">
                  Cash on Delivery
                </h1>
              </label>

              <label htmlFor="Bank" className="flex">
                <input
                  type="radio"
                  name="payment"
                  value="Bank"
                  id="Bank"
                  className="h-5 w-5 mt-2  border-2 border-black cursor-default rounded-full bg-primary shadow-[0_0_0_2px] shadow-bggray  focus-within:border-2 focus-within:border-skin-accent"
                  checked={payment === "Bank"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                <h1 className=" ml-auto w-11/12 mt-2 text-left font-bold leading-none text-skin-dark">
                  Bank Transfer
                  <p className="flex text-sm font-normal py-1 font-MyFont">
                    Make your payment directly from googlepay, paytm, UPI
                  </p>
                </h1>
              </label>
            </div>

            <button
              type="button"
              onClick={makePayment}
              className="bg-textgray text-white w-full flex justify-center py-2 px-2 mt-2 font-MyFont text-lg font-medium md:rounded md:py-1"
            >
              <span>Place order</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


