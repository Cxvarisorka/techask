import Avatar from "./Avatar";

// FriendsList Component
const FriendsList = ({ friends, navigate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">მეგობრები</h2>
        <p className="text-sm text-gray-500 mt-1">{friends?.length} მეგობარი</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {friends.map(({ user }) => (
          <div 
            key={user._id}
            className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            <div className="flex-shrink-0">
              <Avatar user={user} size="small" />
            </div>
            
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">{user.fullname || user.username}</h3>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
            
            <div className="ml-auto">
              <button 
                className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${user._id}`);
                }}
              >
                მესიჯი
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {friends.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-gray-500">თქვენ არ გყავთ მეგობრები</p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;