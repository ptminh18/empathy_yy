// const handleRegister = async (e) => {
//   e.preventDefault();

//   const response = await fetch("http://localhost:8080/api/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await response.json();

//   if (data.success) {
//     // Navigate to login page
//     navigate("/login");
//   } else {
//     // Show error message
//     setError(data.message);
//   }
// };
