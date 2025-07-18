import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

// Hooks
import useUserMethods from "../components/hooks/useUserMethods.js";
import useAuth from "../components/hooks/useAuth.js";

// Components
import FriendActionButtons from "../components/pageComponents/profileComponents/FriendActionButtons.jsx";
import QuestionForm from "../components/pageComponents/profileComponents/QuestionForm.jsx";
import QuestionItem from "../components/pageComponents/profileComponents/QuestionItem.jsx";
import FriendsList from "../components/pageComponents/profileComponents/FriendsList.jsx";
import ChangeProfileImage from "../components/pageComponents/profileComponents/ChangeProfileImage.jsx";
import OldProfileImages from "../components/pageComponents/profileComponents/OldProfileImages.jsx";
import Avatar from "../components/pageComponents/profileComponents/Avatar.jsx";

// Main Profile Component
const Profile = () => {
  const { user: authUser, version } = useAuth();
  const {
    fetchUser,
    addFriend,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    friends,
    fetchFriends,
    addQuestion,
    questions,
    setQuestions,
    getQuestions,
    deleteQuestion,
    addAnswer,
    getAnswers,
    uploadProfileImage,
    toggleLike
  } = useUserMethods();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [friendStatus, setFriendStatus] = useState("none");
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    if (userId) {
      fetchUser(userId, setUser, setFriendStatus);
      getQuestions(userId)
    } else {
      setUser(authUser);
      getQuestions(authUser._id)
    }
  }, [userId, authUser, version]);

  useEffect(() => {
    if (user) {
      fetchFriends(user);
    }
  }, [user]);

  const handleSubmit = (e, tags) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    tags.forEach(tag => {
      formData.append('tags[]', tag);
    });

    addQuestion(formData);
    e.target.reset();
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <p className="text-green-700 text-lg font-georgia">მომხმარებელი არ არის ამოცნობილი.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <p className="text-green-700 text-lg font-georgia">იტვირთება...</p>
      </div>
    );
  }

  const isOwnProfile = !userId || userId === authUser._id;

  return (
    <div className="min-h-screen bg-green-50 font-georgia pt-10">
      {/* Profile Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col md:flex-row items-start md:items-end pb-6">
          {/* Profile Picture */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            <Avatar uploadProfileImage={uploadProfileImage} isOwnProfile={isOwnProfile} user={user} size="profile" />
          </div>

          {/* Profile Info */}
          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {user.fullname}
              </h1>
              {user.isVerified && (
                <span className="ml-2 text-green-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-gray-600">@{user.username}</p>
            
            {/* Friend Status Display */}
            {!isOwnProfile && (
              <p className="text-green-700 mt-1">
                {friendStatus === "friends" && "Friends"}
                {friendStatus === "request_sent" && "Friend request sent"}
                {friendStatus === "request_received" && "Wants to be friends"}
              </p>
            )}
          </div>

          <FriendActionButtons 
            isOwnProfile={isOwnProfile}
            friendStatus={friendStatus}
            user={user}
            addFriend={addFriend}
            cancelFriendRequest={cancelFriendRequest}
            acceptFriendRequest={acceptFriendRequest}
            rejectFriendRequest={rejectFriendRequest}
            removeFriend={removeFriend}
            navigate={navigate}
            setFriendStatus={setFriendStatus}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-green-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("questions")}
              className={`py-4 px-1 border-b-2 font-medium sm:text-sm text-xs ${activeTab === "questions" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              შეკითხვები
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "friends" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              მეგობრები
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab("change-profile-img")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "change-profile-img" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                პროფილის სურათის შეცვლა
              </button>
            )}
          </nav>
        </div>

      {/* Main Content */}
      <div className="container mx-auto  py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - About */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="bg-white rounded-lg shadow p-4 border border-green-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3">მომხმარებლის აღწერა</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="text-gray-800">@{user.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-2/3 space-y-4">
            {/* Questions Feed */}
            {activeTab === "questions" && (
              <>
                {isOwnProfile && <QuestionForm authUser={authUser} handleSubmit={handleSubmit} />}
                
                <div className="space-y-4">
                  {questions.map((question) => (
                    <QuestionItem key={question._id} toggleLike={toggleLike} deleteQuestion={deleteQuestion} addAnswer={addAnswer} getAnswers={getAnswers} authUser={authUser} question={question} user={user} />
                  ))}
                </div>
              </>
            )}

            {/* Friends List */}
            {activeTab === "friends" && <FriendsList friends={friends} navigate={navigate} />}
            
            {/* Change Profile Image */}
            {activeTab === "change-profile-img" && isOwnProfile && (
              <>
                <ChangeProfileImage uploadProfileImage={uploadProfileImage} currentUser={authUser} />
                <OldProfileImages images={authUser.images}/>
              </>
              
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;