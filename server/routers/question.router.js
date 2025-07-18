const express = require("express");

// controllers
const { addQuestion, getUserQuestions, deleteQuestion, toggleLike, getAllQuestions, getQuestion } = require("../controllers/question.controller.js");

// middlewares
const verifyToken = require("../middlewares/auth.js");
const upload = require("../middlewares/multer.js");

// content filterers by AI
const contentFilterOpenAi = require("../middlewares/AI Filters/contentFilterOpenAI.js");
const contentFilterDeepSeek = require("../middlewares/AI Filters/contentFilterDeepSeek.js");


const questionRouter = express.Router();

questionRouter.post('/', verifyToken, upload.single('image'), addQuestion);
questionRouter.get('/one/:questionId', verifyToken, getQuestion);
questionRouter.put('/like/:questionId', verifyToken, toggleLike)
questionRouter.delete('/:questionId', verifyToken, deleteQuestion);
questionRouter.get('/:userId', verifyToken, getUserQuestions);
questionRouter.get('/', verifyToken, getAllQuestions);

module.exports = questionRouter;