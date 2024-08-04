"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

export default function UserInfo() {
  const { data: session } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }

    const fetchPayments = async () => {
      try {
        const response = await axios.get("/api/paymentverify");
        const data = response.data;
        if (data.length > 0) {
          setPayments(data);
        }
        console.log("Fetched payments: ", data);
      } catch (error) {
        console.error("Error fetching payments: ", error);
      }
    };

    fetchPayments();
  }, [session]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/change-password", {
        email,
        currentPassword,
        newPassword,
      });
      console.log("Change password response:", response);

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while changing the password.");
      console.error("Change password error:", error);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/reset-password", { email });
      console.log("Request OTP response:", response);

      if (response.status === 200) {
        toast.success("OTP sent to your email");
        setUserId(response.data.userId); // Assuming response includes userId
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while requesting OTP.");
      console.error("Request OTP error:", error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("/api/reset-password", {
        otp,
        id: userId,
        newPassword,
      });
      console.log("Reset password response:", response);

      if (response.status === 200) {
        toast.success("Password reset successfully");
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while resetting the password.");
      console.error("Reset password error:", error);
    }
  };

  const downloadPdf = (payment) => {
    const pdf = new jsPDF();

    pdf.setFontSize(30);
    pdf.text("Book Odysseys", 15, 15);

    const columns = ["Field", "Value"];
    const rows = [
      ["Name", payment.name],
      ["Email", payment.email],
      ["Phone", payment.phone],
      ["Address", payment.address],
      ["Payment Mode", payment.payment],
      ...payment.items.map((item) => [
        "Ordered Items",
        `Id: ${item.id}, Name: ${item.title}, Price: ${item.price}`,
      ]),
      ["Total Amount", payment.total],
      ["Payment ID", payment.razorpay_payment_id],
      ["Payment Order", payment.razorpay_order_id],
      ["Razorpay Signature", payment.razorpay_signature],
      ["", ,],
    ];

    pdf.autoTable(columns, rows, {
      startY: 40,
      didDrawPage: (data) => {
        pdf.setFontSize(20);
        pdf.text("Invoice", data.settings.margin.left, 35);
      },
    });

    pdf.setFontSize(12);
    pdf.text(
      "Thank you for shopping with us",
      15,
      pdf.internal.pageSize.getHeight() - 10
    );

    pdf.save(`order_details_${payment.razorpay_order_id}.pdf`);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 justify-start md:px-8">
      <div className="flex pb-8 md:pb-0 md:pr-10 xl:pr-20 font-main text-xl md:text-3xl ">
        Welcome to Book Odyssey
      </div>
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col  text-md gap-2 my-6">
        <div className="font-main ">
          Name:{" "}
          <span className="font-bold font-MyFont pl-3">
            {session?.user?.name}
          </span>
        </div>
        <div className="font-main">
          Email:{" "}
          <span className="font-bold font-MyFont pl-3">
            {session?.user?.email}
          </span>
        </div>
        <button
          onClick={() => {
            toast.success("Logout successfully");
            signOut();
            Cookies.remove("user");
            Cookies.remove("token");
            router.push("/");
          }}
          className="bg-red-500 text-white w-[150px] font-bold px-6 py-2 mt-3"
        >
          Log Out
        </button>
      </div>
      <div className="flex pb-8 md:pb-0 md:pr-10 xl:pr-20 font-main text-xl md:text-3xl mt-8 ">
        Recent Order Details
      </div>
      {payments.map((payment, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">Order {index + 1}</h2>
          <p>
            <strong>Name:</strong> {payment.name}
          </p>
          <p>
            <strong>Email:</strong> {payment.email}
          </p>
          <p>
            <strong>Phone:</strong> {payment.phone}
          </p>
          <p>
            <strong>Address:</strong> {payment.address}
          </p>
          <p>
            <strong>Payment:</strong> {payment.payment}
          </p>
          <p>
            <strong>Ordered Items:</strong>{" "}
            {payment.items
              .map((item) => `${item.id}, ${item.title}, ${item.price}`)
              .join(", ")}
          </p>
          <p>
            <strong>Total Amount:</strong> {payment.total}
          </p>
          <p>
            <strong>Razorpay Order ID:</strong> {payment.razorpay_order_id}
          </p>
          <p>
            <strong>Razorpay Payment ID:</strong> {payment.razorpay_payment_id}
          </p>
          <p className="break-words">
            <strong>Razorpay Signature:</strong> {payment.razorpay_signature}
          </p>
          <div className="flex justify-between flex-col md:flex-row gap-4">
            <button
              className="mt-4 text-xl w-max bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => downloadPdf(payment)}
            >
              Download Order Details as PDF
            </button>
            <Link
              className="flex items-center font-MyFont font-medium w-max  bg-blue-500 text-white py-2 px-4 rounded"
              href={{
                pathname: "/Track",
                query: {
                  paymentid: payment.razorpay_order_id,
                  date: new Date(payment.createdAt).toISOString().split("T")[0],
                },
              }}
            >
              Track your order
              <IoIosArrowForward className="ml-2" />
            </Link>
          </div>
        </div>
      ))}
      <div className="flex pb-8 md:pb-0 md:pr-10 xl:pr-20 font-main text-xl md:text-3xl mt-8 ">
        Change Password
      </div>
      <form onSubmit={handleChangePassword} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Change Password
        </button>
      </form>
      <div className="flex pb-8 md:pb-0 md:pr-10 xl:pr-20 font-main text-xl md:text-3xl mt-8 ">
        Request OTP for Password Reset
      </div>
      <form onSubmit={handleRequestOtp} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Request OTP
        </button>
      </form>
      <div className="flex pb-8 md:pb-0 md:pr-10 xl:pr-20 font-main text-xl md:text-3xl mt-8 ">
        Reset Password
      </div>
      <form onSubmit={handleResetPassword}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
