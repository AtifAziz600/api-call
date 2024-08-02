import { useEffect, useState } from "react";

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUserInfo, setEditedUserInfo] = useState<User>({
    id: 0,
    name: "",
    username: "",
    email: "",
    address: { street: "", suite: "", city: "", zipcode: "" },
  });

  useEffect(() => {
    const getData = async () => {
      const query = await fetch("https://jsonplaceholder.typicode.com/users");
      const response = await query.json();
      setUserInfo(response);
    };
    getData();
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditedUserInfo({ ...user });
  };

  const handleSaveClick = async () => {
    if (editingUserId === null) return;

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${editingUserId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUserInfo),
      }
    );

    if (response.ok) {
      const updatedUser = await response.json();
      setUserInfo(
        userInfo.map((user) => (user.id === editingUserId ? updatedUser : user))
      );
      setEditingUserId(null);
    }
  };

  const handleDeleteClick = async (userId: number) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setUserInfo(userInfo.filter((user) => user.id !== userId));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("address")) {
      const addressField = name.split(".")[1];
      setEditedUserInfo((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value,
        },
      }));
    } else {
      setEditedUserInfo((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h3 className="text-3xl font-bold mb-6">Howdy!!</h3>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        {userInfo.length > 0 &&
          userInfo.map((user) => (
            <div
              key={user.id}
              className="mb-6 border-b pb-4 last:border-none last:pb-0"
            >
              {editingUserId === user.id ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editedUserInfo.name}
                    onChange={handleInputChange}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="username"
                    value={editedUserInfo.username}
                    onChange={handleInputChange}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editedUserInfo.email}
                    onChange={handleInputChange}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="address.street"
                    value={editedUserInfo.address.street}
                    onChange={handleInputChange}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="address.suite"
                    value={editedUserInfo.address.suite}
                    onChange={handleInputChange}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="address.city"
                    value={editedUserInfo.address.city}
                    onChange={handleInputChange}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="address.zipcode"
                    value={editedUserInfo.address.zipcode}
                    onChange={handleInputChange}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleSaveClick}
                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUserId(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {user.name}
                  </h2>
                  <div className="text-gray-600">
                    <div className="mb-2">
                      <span className="font-bold">Username:</span>{" "}
                      {user.username}
                    </div>
                    <div className="mb-2">
                      <span className="font-bold">Email:</span> {user.email}
                    </div>
                    <div className="mb-2">
                      <span className="font-bold">Address:</span>{" "}
                      {user.address.street}, {user.address.suite},{" "}
                      {user.address.city}, {user.address.zipcode}
                    </div>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="mr-2 px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
