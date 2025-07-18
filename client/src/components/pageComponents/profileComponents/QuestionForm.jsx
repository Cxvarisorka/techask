import { useState } from "react";
import Avatar from "./Avatar.jsx";

const QuestionForm = ({ authUser, handleSubmit }) => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, tags); // Or modify according to your API requirements
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-green-100">
      <div className="flex items-start space-x-3">
        <Avatar user={authUser} size="small" />
        <form 
          className="flex-1 flex flex-col gap-3" 
          onSubmit={handleFormSubmit} 
          encType="multipart/form-data"
        >
          <input 
            type="text" 
            name="title" 
            placeholder="შეკითხვის სათაური" 
            required  
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-georgia"
          />
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-georgia"
            rows="3"
            name="description"
            placeholder="შეკითხვის აღწერა"
            required
          />
          
          {/* Tags Input */}
          <div className="w-full border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                  <button 
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1.5 text-green-600 hover:text-green-900"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              placeholder="დაამატეთ თეგები (დააჭირეთ Enter)"
              className="w-full border-none p-0 focus:outline-none focus:ring-0 font-georgia"
            />
  
          </div>
          
          <input 
            type="file" 
            name="image"  
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-georgia"
          />
          
          <div className="flex justify-end mt-2">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              type="submit"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;