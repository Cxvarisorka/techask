// Models
const Notification = require("../models/notification.model.js");
const Question = require("../models/question.model.js");
const User = require("../models/user.model.js");

// Utils
const deleteImage = require("../utils/deleteImage.js");
const imageUpload = require("../utils/uploadImage");

// შეკითხვის დამატება
const addQuestion = async (req, res) => {
    try {
        // შეკითხვის შესაქმნელად აუცი;ლებელი ინფორმაციის მიღება
        const {title, description, tags} = req.body;
        const image = req.file.path;
        const author = req.user.id;

        console.log(tags)

        // მომხმარებლის მოძიება
        const user = await User.findById(author);

        // თუ მომხმარებელი არ არსებობს ვაბრუნებთ ერორს
        if(!user) return res.status(404).json("მომხმარებელი არ არსებობს");

        // მიღებული ფოტოს ატვირთვა (თუ გვაქვს)
        const result = await imageUpload('questions', image);

        // ახალი შეკიტხვის შექმნა
        const newQuestion = new Question({
            title,
            description,
            image: result.secure_url,
            author: {
                fullname: user.fullname,
                id: user._id,
                profileImg: user.profileImg
            },
            tags: tags
        });

        // შევინახოთ ბაზაში
        await newQuestion.save();

        // მესიჯის გაგზავნა მეგობრებთან ტუ ისინი არიან ონლაინ
        const friends = user.friends || [];

        const notifications = friends.map(async friendId => {
            const friendSocketId = req.onlineUsers.get(friendId.toString());

            // თუ მეგობრები არიან ონლაინ გავაგზავნოთ მესიჯი რეალურ დროში
            if (friendSocketId) {
                req.io.to(friendSocketId).emit("notification", {
                    from: {
                        _id: user._id,
                        username: user.username
                    },
                    type: "info",
                    message: `${user.username} ატვირთა ახალი კითხვა`,
                    questionId: newQuestion._id,
                    createdAt: new Date()
                });
            }

            // Save to DB
            return Notification.create({
                user: friendId,
                from: author,
                type: "info",
                message: `${user.username} ატვირთა ახალი კითხვა`,
                questionId: newQuestion._id
            });
        });


        await Promise.all(notifications);

        res.status(201).json(newQuestion);
    } catch(err) {
        res.status(500).json(err);
    }
}

// შეკითხვის წაშლა
const deleteQuestion = async (req, res) => {
    try {
        const {questionId} = req.params;
        const userId = req.user.id;

        if(!questionId) res.status(400).json('შეკითხვის ID აუცილებელია!');

        const question = await Question.findById(questionId);

        if(!question) res.status(404).json('შეკითხვა ვერ მოიძებნა!');

        if(question.author.id != userId) return res.status(401).json('თქვენ არ გაქვთ ამ პოსტის წაშლის უფლება!');

        if(question.image) {
            deleteImage(question.image)
        }

        await Question.findByIdAndDelete(questionId);

        res.status(200).json('შეკითხვა წარმატებით წაიშალა!');
    } catch(err) {
        res.status(500).json(err.message);
    }
}

// შეკიტხვების მიღება
const getUserQuestions = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json("მომხმარებელი არ არსებობს.");
        }

        // Find questions with author.id matching userId
        const questions = await Question.find({ 'author.id': userId });

        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// შეკითხვის წამორება id მეშვეპობით
const getQuestion = async (req, res) => {
    try {
        const {questionId} = req.params;

        if(!questionId) return res.status(301).json("შეკიტხვის მოსაძიებლად აუცილებელია ID!");

        const question = await Question.findById(questionId);

        if(!question) return res.status(404).json("შეკითხვის მოძიება ვერ მოხერხდა!");

        res.json(question);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

// ყველა არსებული შეკითხვის წამოღება პაგინაციით (ინფინიტ სკროლისთვის)
const getAllQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;      // მიმდინარე გვერდი
        const limit = parseInt(req.query.limit) || 10;   // რამდენი შეკითხვა წამოვიღოთ ერთდროულად
        const skip = (page - 1) * limit;

        const questions = await Question.find()
            .sort({ createdAt: -1 }) // ახალი ჯერ
            .skip(skip)
            .limit(limit);

        const total = await Question.countDocuments();

        res.status(200).json({
            questions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalQuestions: total,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// შეკითხვის მოწონება / ან არ მოწონება
const toggleLike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { questionId } = req.params;

        if (!questionId) return res.status(400).json("შეკითხვის ID აუცილებელია!");

        const question = await Question.findById(questionId);

        if (!question) return res.status(404).json("შეკითხვა ვერ მოიძებნა");

        if (question.likes.includes(userId)) {
            question.likes = question.likes.filter(id => id.toString() !== userId);
        } else {
            question.likes.push(userId);
        }

        await question.save();
        return res.status(200).json(question.likes);

    } catch (err) {
        return res.status(500).json(err.message);
    }
};


module.exports = {addQuestion, getUserQuestions, getAllQuestions, getQuestion, deleteQuestion, toggleLike};