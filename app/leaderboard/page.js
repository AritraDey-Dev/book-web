// app/leaderboard/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("/api/leaderboard");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 justify-start md:px-8">
      <h1 className="text-center font-main text-2xl font-semibold lg:text-3xl">Leaderboard</h1>
      <table className="table-auto w-full mt-6">
        <thead>
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
