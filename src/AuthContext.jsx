import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup

  async function signup(username) {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username }),
    });
    if (!res.ok) {
      throw new Error("Signup failed");
    }

    const {token: newToken} = await res.json();
    setToken(newToken);
    setLocation("TABLET");
  }

  // TODO: authenticate
async function authenticate() {
  if (!token) {
    throw new Error("No token, please sign up first or log in.");
  
  }

  const res = await fetch(`${API}/authenticate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Authentication failed");
  }
  setLocation("TUNNEL");
}

const value = {
  location,
  signup,
  authenticate,
};

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
}

export function useAuth() {
const context = useContext(AuthContext);
if (!context) {
  throw new Error("useAuth must be used inside an AuthProvider");
}
return context;
}
