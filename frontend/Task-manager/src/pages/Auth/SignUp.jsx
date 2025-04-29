import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import Input from '../../components/inputs/Input';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext'; // Adjust path as needed
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);


  const handleSignUp = async (e) => {
    e.preventDefault();
  
    // Validate form fields
    if (!fullName || !validateEmail(email) || !password || password.length < 8) {
      setError('Please ensure all fields are correctly filled.');
      return;
    }
  
    let profileImageUrl = '';
  
    // Handle profile picture upload if available
    if (profilePic) {
      const imgUploadRes = await uploadImage(profilePic);
      profileImageUrl = imgUploadRes.imageUrl || '';
    }
  
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl, // Send the profileImageUrl to backend
        adminInviteToken,
      });
  
      const { token, role } = response.data;
  
      // Check if token is present and update user context and localStorage
      if (token) {
        localStorage.setItem('token', token);  // Store token
        updateUser(response.data);  // Update user context
  
        // Redirect based on the role
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred during registration. Please try again.');
    }
  };
  

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>  
          Please enter your details to create an account
        </p>  

        <form onSubmit={handleSignUp}>  
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="kuldeep@example.com"
              type="text"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 digit code"
              type="text"
            />
          </div>

          {error && <p className='text-red-500 text-xs mt-3'>{error}</p>}

          <button 
            type="submit" 
            className='w-full bg-primary text-white py-2 rounded-md mt-5'>
            SIGN UP
          </button>

          <p className='text-[13px] text-slate-700 mt-3'>
            Already have an account?{" "}
            <Link className='text-primary cursor-pointer' to="/login">
              LOGIN
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
