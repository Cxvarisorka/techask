import { useEffect, useState } from "react";
import { useParams } from "react-router";
import QuestionItem from "../components/pageComponents/profileComponents/QuestionItem";
import useAuth from "../components/hooks/useAuth";
import useUserMethods from "../components/hooks/useUserMethods";


const Question = () => {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const { getQuestion, addAnswer, deleteQuestion, getAnswers, toggleLike } = useUserMethods();
    const { user } = useAuth();
    const { questionId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const questionData = await getQuestion(questionId);
            setQuestion(questionData);
            
            const answersData = await getAnswers(questionId);
            setAnswers(answersData);
        };
        
        fetchData();
    }, [questionId]);


    const handleAddAnswer = async (answerText) => {
        const newAnswer = await addAnswer(questionId, answerText);
        if (newAnswer) {
            setAnswers([...answers, newAnswer]);
        }
    };

    const handleDeleteQuestion = async () => {
        await deleteQuestion(questionId);
        // You might want to redirect after deletion
        // navigate('/questions');
    };

    const handleToggleLike = async () => {
        const updatedLikes = await toggleLike(questionId);
        if (updatedLikes) {
            setQuestion({...question, likes: updatedLikes});
        }
    };

    if (!question) {
        return (
            <main className="container mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <p>Loading question...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-4 max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Question</h1>
                <QuestionItem 
                    question={question} 
                    user={question.author} 
                    addAnswer={handleAddAnswer}
                    deleteQuestion={handleDeleteQuestion}
                    getAnswers={getAnswers}
                    authUser={user}
                    toggleLike={handleToggleLike}
                />
            </div>
        </main>
    );
};

export default Question;