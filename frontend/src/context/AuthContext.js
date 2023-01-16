import { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function getInitialState() {
  const loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);

    return user;
  }

  return null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialState);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
