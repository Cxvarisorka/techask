import { useEffect, useState } from "react";
import Avatar from "./Avatar";

const Answers = ({ answers, onAnswerSubmit, currentUser }) => {
  const [newAnswer, setNewAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    onAnswerSubmit(newAnswer);
    setNewAnswer('');
  };


  return (
    <div className="mt-10 pl-2">
      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="mb-4 flex items-start gap-3">
        <Avatar user={currentUser} size="small" />
        <div className="flex-1">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-georgia"
            rows="2"
            placeholder="დაწერე პასუხი..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            required
          />
          <div className="flex justify-end mt-2">
            <button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
            >
              პასუხის დამატება
            </button>
          </div>
        </div>
      </form>

      {/* Answers List */}
      <div className="space-y-3">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <div key={answer?._id} className="bg-green-50 rounded-lg p-3 flex items-start gap-3">
              <Avatar user={{ username: answer?.fullname }} size="small" />
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Link to={`/profile/${answer?.author}`} className="font-medium text-sm">{answer?.fullname}</Link>
                  <span className="mx-2 text-gray-400">·</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(answer?.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800 text-sm">{answer?.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            ჯერჯერობით არანაირი პასუხი არ არის.
          </div>
        )}
      </div>
    </div>
  );
};

// QuestionItem Component (also uses the Answers component)
const QuestionItem = ({ question, user, addAnswer, deleteQuestion, getAnswers, authUser, toggleLike }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [likes, setLikes] = useState(question.likes);

  const handleLikeClick = async () => {
    const newLikes = await toggleLike(question._id);
    if (newLikes) setLikes(newLikes);
  }

  const handleAnswerSubmit = async (answerText) => {
    const answer = await addAnswer(question._id, answerText);
    if(answer) setAnswers([...answers, answer]);
    
  };

  useEffect(() => {
    (async () => {
      const data = await getAnswers(question._id);
      setAnswers(data)
    })();
  }, []);

  const toggleImage = () => {
    setShowFullImage(!showFullImage);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    setShowDropdown(false);
    // Add your edit logic here
    console.log("Edit question");
  };

  const handleDelete = () => {
    setShowDropdown(false);
    deleteQuestion(question._id);
  };

  // Close dropdown when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-green-100 relative">
      {/* Dropdown menu */}
      <div className="absolute top-3 right-3">
        <button 
          onClick={toggleDropdown}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button
                onClick={handleEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                შეცვლა
              </button>
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                წაშლა
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full sm:flex-row flex-col sm:gap-0 gap-3 items-start space-x-3">
        <Avatar user={user} size="small" />
        <div className="flex-1 w-full flex flex-col sm:gap-0 gap-3">
          <div className="flex sm:flex-row flex-col-reverse sm:items-center">
            <h3 className="font-bold text-gray-800 hover:underline cursor-pointer">{user.fullname}</h3>
            <span className="mx-1 text-gray-500 sm:block hidden">·</span>
            <span className="text-gray-500 text-sm">
              {new Date(question.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-gray-800 font-semibold text-lg">{question.title}</p>
          <p className="text-gray-700 mt-2">{question.description}</p>
          
          {question.image && (
            <div className="mt-3">
              <img
                src={question.image}
                alt="question image"
                className={`rounded-lg cursor-pointer max-h-72 w-auto`}
                onClick={toggleImage}
              />
              {showFullImage && (
                <div 
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                  onClick={toggleImage}
                >
                  <div className="relative max-w-full max-h-full">
                    <img
                      src={question.image}
                      alt="question image fullscreen"
                      className="max-h-[90vh] max-w-full object-contain"
                    />
                    <button 
                      className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
                      onClick={toggleImage}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex xs:flex-col  justify-between mt-3 pt-3 border-t border-gray-200">
            <button 
              className={`flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 ${
                likes?.includes(authUser._id) ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={handleLikeClick}
            >

              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>დალაიქება ({likes?.length || 0})</span>
            </button>
            <button 
              className="flex items-center space-x-1 text-gray-500 hover:text-green-600 px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() => setShowAnswers(!showAnswers)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
              <span>{showAnswers ? 'დამალე პასუხები' : `პასუხები (${answers.length || 0})`}</span>
            </button>
          </div>
          
          {showAnswers && (
            <Answers 
              answers={answers} 
              onAnswerSubmit={handleAnswerSubmit} 
              currentUser={authUser} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;