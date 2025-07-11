import { useState } from "react";

import Avatar from "./Avatar.jsx";

// QuestionForm Component
const QuestionForm = ({ authUser, handleSubmit }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-green-100">
      <div className="flex items-start space-x-3">
        <Avatar user={authUser} size="small" />
        <form className="flex-1 flex flex-col gap-3" onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="title" placeholder="შეკითხვის სათაური" required  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-georgia"/>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-georgia"
            rows="3"
            name="description"
            placeholder="შეკითხვის აღწერა"
            required
          />
          <input type="file" name="image"  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-georgia"/>
          <div className="flex justify-end mt-2">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
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
