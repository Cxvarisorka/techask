import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiHash } from 'react-icons/fi';
import Avatar from '../components/pageComponents/profileComponents/Avatar';
import useUserMethods from '../components/hooks/useUserMethods';
import { Link } from 'react-router';

const Questions = () => {
  const { getAllQuestions } = useUserMethods();
  // State for original and filtered questions
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState('ახალი');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);

  // Available tags from all questions
  const allTags = Array.from(new Set(originalQuestions.flatMap(q => q.tags)));

  // Fetch questions on mount
  useEffect(() => {
    getAllQuestions(currentPage, (fetchedQuestions, info) => {
      setOriginalQuestions(fetchedQuestions);
      setFilteredQuestions(fetchedQuestions); // Initialize filtered questions
      setPages(info.totalPages);
      setCurrentPage(info.currentPage);
    });
  }, [currentPage]);

  // Filter and sort questions based on user input
  useEffect(() => {
    let filtered = [...originalQuestions]; // Start with original questions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(q => 
        selectedTags.every(tag => q.tags.includes(tag))
      );
    }
    
    // Sort questions
    switch (sortOption) {
      case 'ახალი':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'ძველი':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'ყველაზე მეტი ვოუთი':
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case 'ყველაზე ნაკლები ვოუთი':
        filtered.sort((a, b) => a.votes - b.votes);
        break;
      default:
        break;
    }
    
    setFilteredQuestions(filtered); // Update filtered questions
  }, [searchTerm, selectedTags, sortOption, originalQuestions]);

  // Handle tag selection
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove a selected tag
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSortOption('ახალი');
    setFilteredQuestions(originalQuestions); // Reset to original questions
  };

  return (
    <div className="min-h-screen bg-green-50 font-georgia pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">შეკითხვები</h2>
          <p className="text-gray-600">გაეცანით საზოგადოების მიერ დასმულ შეკითხვებს</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 border border-green-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ძებნა..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <button 
                className="inline-flex justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
              >
                <FiFilter className="mr-2" />
                ფილტრი ტეგების მიხედვით
                <FiChevronDown className="ml-2" />
              </button>
              
              {showTagDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1 max-h-60 overflow-auto">
                    {allTags.map(tag => (
                      <div 
                        key={tag} 
                        className={`px-4 py-2 text-sm flex items-center cursor-pointer ${selectedTags.includes(tag) ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => handleTagClick(tag)}
                      >
                        <FiHash className="mr-2" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                className="inline-flex justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                დალაგება: {sortOption}
                <FiChevronDown className="ml-2" />
              </button>
              
              {showSortDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    {['ახალი', 'ძველი', 'ყველაზე მეტი ვოუთი', 'ყველაზე ნაკლები ვოუთი'].map(option => (
                      <div 
                        key={option} 
                        className={`px-4 py-2 text-sm cursor-pointer ${sortOption === option ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => {
                          setSortOption(option);
                          setShowSortDropdown(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {selectedTags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  #{tag}
                  <button 
                    type="button"
                    className="ml-1.5 inline-flex text-green-500 hover:text-green-700"
                    onClick={() => removeTag(tag)}
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </span>
              ))}
              <button 
                className="text-sm text-green-600 hover:text-green-800 ml-2"
                onClick={clearFilters}
              >
                გასუფთავება
              </button>
            </div>
          )}
        </div>
        
        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map(question => (
              <div key={question.id} className="bg-white rounded-lg shadow overflow-hidden border border-green-100">
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Avatar user={question.author} size="small" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{question.author.fullname}</h3>
                        <span className="mx-2 text-gray-500">·</span>
                        <span className="text-sm text-gray-500">
                          {new Date(question.createdAt).toLocaleDateString('ka-GE')}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <h2 className="text-xl font-semibold text-gray-800">{question.title}</h2>
                        <p className="mt-1 text-gray-600">{question.description}</p>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {question.tags.map(tag => (
                          <span 
                            key={tag}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              selectedTags.includes(tag) 
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            onClick={() => handleTagClick(tag)}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          

                          <Link to={`/question/${question._id}`} className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span>სრულად ნახვა</span>
                          </Link>
                        </div>
                        
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          question.answers.length > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {question.answers.length > 0 ? 'პასუხი არსებობს' : 'ელოდება პასუხს'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center border border-green-100">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">შეკითხვები ვერ მოიძებნა</h3>
              <p className="mt-1 text-gray-500">სცადეთ სხვა ძებნის პარამეტრები</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FiX className="-ml-1 mr-2 h-5 w-5" />
                  ფილტრების გასუფთავება
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <nav className="mt-8 flex justify-center items-center space-x-2 pb-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`px-3 py-1 rounded-md border text-sm ${
                currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white hover:bg-green-50 text-green-600 border-green-300'
              }`}
            >
              წინა
            </button>

            {Array.from({ length: pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md border text-sm ${
                  page === currentPage
                    ? 'bg-green-600 text-white border-green-700'
                    : 'bg-white hover:bg-green-50 text-green-600 border-green-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === pages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages))}
              className={`px-3 py-1 rounded-md border text-sm ${
                currentPage === pages ? 'bg-gray-200 text-gray-400' : 'bg-white hover:bg-green-50 text-green-600 border-green-300'
              }`}
            >
              შემდეგი
            </button>
          </nav>
        )}

      </div>
    </div>
  );
};

export default Questions;