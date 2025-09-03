const signup = async (user) => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ user })
    });

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error("Signup Error:", err);
    return null;
  }
};

const signin = async (user) => {
  try {
    const response = await fetch("http://localhost:3000/users/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ user })
    });

    const data = await response.json();
    return data; // return the JSON data
  } catch (err) {
    console.error("Signin Error:", err);
    return null;
  }
};

export { signup, signin };
