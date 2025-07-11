import { useRef, useState } from "react";
import Avatar from "./Avatar";

// Add this component near your other components (QuestionForm, Answers, etc.)
const ChangeProfileImage = ({ uploadProfileImage, currentUser }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData(e.target);
      
      await uploadProfileImage(formData);
      
      // Reset after successful upload
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to update profile image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-green-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4">პროფილის სურათის შეცვლა</h2>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium text-gray-700 mb-2">მიმდინარე სურათი</h3>
          <Avatar user={currentUser} size="profile" />
        </div>
        
        {preview && (
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium text-gray-700 mb-2">ახალი სურათი</h3>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            აირჩიეთ ახალი სურათი
          </label>
          <input
            type="file"
            ref={fileInputRef}
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={!selectedFile || isUploading}
          className={`px-4 py-2 rounded-md text-white ${selectedFile ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {isUploading ? 'ატვირთვა...' : 'ატვირთვა'}
        </button>
      </form>
    </div>
  );
};

export default ChangeProfileImage;