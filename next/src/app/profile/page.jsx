"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Replace with your logic to get the logged-in user's email
    const email = "test@example.com";

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user?email=${email}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 ml-20">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender}
        </p>
        <p>
          <strong>Age:</strong> {user.age}
        </p>
        <p>
          <strong>Country:</strong> {user.country}
        </p>
        <p>
          <strong>City:</strong> {user.city}
        </p>
        <p>
          <strong>Occupation:</strong> {user.occupation}
        </p>
        <p>
          <strong>Mental State:</strong> {user.mentalstate}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Total Journals:</strong> {user.totalJournals}
        </p>
      </div>
    </div>
  );
}
