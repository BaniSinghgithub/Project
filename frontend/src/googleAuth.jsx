// import React from "react";
// import {toast} from "react-toastify";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// // from google cloud console
// //I got this client id from there (googlecloud console)

// const CLIENT_ID = "713538226120-j4dvkdhdu03r21vr4bm8j7f0lp0u5c4r.apps.googleusercontent.com"; 

// const GoogleAuth = () => {

//   const onSuccess = (response) => {
//     console.log("Login Successful!", response.profileObj);
//   };

//   const onFailure = (response) => {
//     console.log("Login Failed!", response);
//   };

//   const onLogoutSuccess = () => {
//     console.log("User Logged Out");
//   };

//   return (
//     <div>
//       <GoogleOAuthProvider clientId={CLIENT_ID}>
//           <div className="google">
//             <div className="auth">
//               <GoogleLogin
//                 onSuccess={onSuccess}
//                 onError={() => toast.error("Login Failed")}
//               />
//             </div>
//           </div>
//         </GoogleOAuthProvider>
//       <h2>Google Authentication</h2>

//       {/* google sign in */}
//       <GoogleLogin
//         clientId={CLIENT_ID}
//         buttonText="Sign in with Google"
//         onSuccess={onSuccess}
//         onFailure={onFailure}
//         cookiePolicy={"single_host_origin"}
//       />

//       {/* google sign out */}
//       {/* <GoogleLogout
//         clientId={CLIENT_ID}
//         buttonText="Logout"
//         onLogoutSuccess={onLogoutSuccess}
//       /> */}
//     </div>
//   );
// };

// export default GoogleAuth;

