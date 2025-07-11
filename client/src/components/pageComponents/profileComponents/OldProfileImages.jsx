const OldProfileImages = ({ images = [] }) => {
  if (!images.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-green-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4">ძველი პროფილის ფოტოები</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {images.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`Old profile ${index + 1}`}
            className="w-30 h-30 object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default OldProfileImages;