import React, { useState, useEffect } from "react";

const UserCredentials = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:3000/user/current-user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat fixed top-0 left-0"
      style={{ backgroundImage: "url('/Background-14.png')" }}
    >
      <div className="h-full w-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg">
        <div
          style={{
            maxWidth: "400px",
            textAlign: "center",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
          className="z-10"
        >
          <h2 className="text-white">შეცვალე მონაცემები</h2>
          {user ? (
            <div style={{ textAlign: "left", marginBottom: "10px" }} className="text-white">
              <p><strong>სახელი:</strong> {user.first_name}</p>
              <p><strong>გვარი:</strong> {user.last_name}</p>
              <p><strong>მობილური ტელეფონი:</strong> {user.phone_number}</p>
              <p><strong>იმეილი:</strong> {user.email}</p>
            </div>
          ) : (
            <p className="text-white">No user data found.</p>
          )}
          <button
            className="bg-gray-800 text-white border border-gray-800 p-2 rounded hover:border-3 hover:border-gray-800 hover:bg-transparent"
            onClick={handleEditClick}
          >
            შეცვლა
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal} user={user} setUser={setUser} />
      )}
    </div>
  );
};

const Modal = ({ onClose, user, setUser }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: user.email,
    };

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setUser(updatedUser); // Optimistic UI update
      onClose(); // Close the modal after a successful update
    } catch (error) {
      alert(`Error updating user: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">მომხმარებლის მონაცემები</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-gray-700">სახელი</label>
            <input
              type="text"
              id="first_name"
              className="w-full p-2 border rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-gray-700">გვარი</label>
            <input
              type="text"
              id="last_name"
              className="w-full p-2 border rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-gray-700">მობილური ტელეფონი</label>
            <input
              type="text"
              id="phone_number"
              className="w-full p-2 border rounded"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-red-800 text-white p-2 rounded"
              onClick={onClose}
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded"
            >
              შენახვა
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCredentials;
