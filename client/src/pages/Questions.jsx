import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiHash } from 'react-icons/fi';
import Avatar from '../components/pageComponents/profileComponents/Avatar';


const Questions = () => {
  // Sample questions data
  const initialQuestions = [
    { 
      id: 1, 
      title: 'როგორ გამოვიყენოთ React hooks?', 
      votes: 42, 
      date: '2023-05-15', 
      tags: ['react', 'javascript', 'hooks'], 
      answered: true,
      author: {
        fullname: 'გიორგი გიორგაძე',
        profileImg: ''
      }
    },
    { 
      id: 2, 
      title: 'API-თან მუშაობის საუკეთესო პრაქტიკები', 
      votes: 28, 
      date: '2023-06-20', 
      tags: ['api', 'javascript', 'async'], 
      answered: false,
      author: {
        fullname: 'მარიამ მარიამიძე',
        profileImg: ''
      }
    },
    { 
      id: 3, 
      title: 'CSS grid vs flexbox', 
      votes: 35, 
      date: '2023-04-10', 
      tags: ['css', 'frontend'], 
      answered: true,
      author: {
        fullname: 'ნიკა ნიკოლოზაშვილი',
        profileImg: ''
      }
    },
  ];

  // State variables
  const [questions, setQuestions] = useState(initialQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState('ახალი');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Available tags from all questions
  const allTags = Array.from(new Set(initialQuestions.flatMap(q => q.tags)));

  // Filter and sort questions based on user input
  useEffect(() => {
    let filtered = [...initialQuestions];
    
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
    
    setQuestions(filtered);
  }, [searchTerm, selectedTags, sortOption]);

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
          {questions.length > 0 ? (
            questions.map(question => (
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
                          {new Date(question.date).toLocaleDateString('ka-GE')}
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
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            <span>{question.votes} ვოუთი</span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                            <span>პასუხები</span>
                          </button>
                        </div>
                        
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          question.answered 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {question.answered ? 'პასუხი არსებობს' : 'ელოდება პასუხს'}
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
      </div>
    </div>
  );
};

export default Questions;