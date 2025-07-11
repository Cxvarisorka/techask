// FriendActionButtons Component
const FriendActionButtons = ({ isOwnProfile, friendStatus, user, addFriend, cancelFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, navigate, setFriendStatus }) => {
  if (isOwnProfile) return null;

  return (
    <div className="mt-4 md:mt-0 flex space-x-2">
      {friendStatus === "none" && (
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          onClick={async () => {
            await addFriend(user._id);
            setFriendStatus("request_sent");
          }}
        >
          Add Friend
        </button>
      )}

      {friendStatus === "request_sent" && (
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
          onClick={async () => {
            await cancelFriendRequest(user._id);
            setFriendStatus("none");
          }}
        >
          Cancel Request
        </button>
      )}

      {friendStatus === "request_received" && (
        <>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            onClick={async () => {
              await acceptFriendRequest(user._id);
              setFriendStatus("friends");
            }}
          >
            Accept
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            onClick={async () => {
              await rejectFriendRequest(user._id);
              setFriendStatus("none");
            }}
          >
            Reject
          </button>
        </>
      )}

      {friendStatus === "friends" && (
        <>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            onClick={() => navigate(`/chat/${user._id}`)}
          >
            Message
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            onClick={async () => {
              const confirmed = window.confirm("Are you sure you want to remove this friend?");
              if (confirmed) {
                await removeFriend(user._id);
                setFriendStatus("none");
              }
            }}
          >
            Remove
          </button>
        </>
      )}
    </div>
  );
};

export default FriendActionButtons;