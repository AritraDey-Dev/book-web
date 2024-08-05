"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PointsPage = () => {
  const { data: session } = useSession();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get(`/api/users/${session?.user?.id}`);
        setPoints(response.data.points);
      } catch (error) {
        toast.error("Failed to fetch points");
      }
    };
    if (session) {
      fetchPoints();
    }
  }, [session]);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">My Points</h1>
      <div className="p-4 bg-white rounded shadow-md">
        <p className="text-lg">Points: {points}</p>
      </div>
    </div>
  );
};

export default PointsPage;
