import { useState } from "react";

const Avatar = ({ user, size = 'profile', uploadProfileImage, isOwnProfile = false }) => {
  const [isHover, setIsHover] = useState(false);

  if (!user) return null;
  
  const colors = ['bg-green-600', 'bg-blue-600', 'bg-purple-600', 'bg-red-600', 'bg-yellow-600'];
  
  const color = colors[user.fullname?.charCodeAt(0) % colors.length] || colors[0];

  const handleMouseOver = () => {
    setIsHover(true);
  }

  const handleMouseOut = () => {
    setIsHover(false);
  }

  

  return (
    <div 
      className={`relative ${size === 'profile' ? 'w-24 h-24 md:w-32 md:h-32' : 'w-10 h-10'}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {/* Display profile image if available */}
      {user.profileImg ? (
        <img 
          src={user.profileImg} 
          alt={user.fullname || user.username}
          className={`${size === 'profile' ? 'w-full h-full' : 'w-10 h-10'} rounded-full border-4 border-white shadow-lg`}
        />
      ) : (
        /* Display initials avatar if no profile image */
        <div className={`${color} ${size === 'profile' ? 'w-full h-full text-3xl' : 'w-10 h-10'} rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg`}>
          {(user.fullname || user.username)?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;