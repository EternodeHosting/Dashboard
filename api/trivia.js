const indexjs = require("../index.js");
const adminjs = require("./admin.js");
const fs = require("fs");
const ejs = require("ejs");
const fetch = require('node-fetch');

module.exports.load = async function (app, db) {

app.get('/api/getquestion', async (req, res) => {
const questions = [
  {
    id: "1",
    question: "What is the largest planet in our solar system?",
    topic: "astronomy",
    answer: "Jupiter",
    description: "Jupiter is the largest planet in our solar system. It has a mass that is 318 times that of Earth, and is the fifth planet from the sun in the solar system. It is a gas giant, mostly composed of hydrogen and helium."
  },
  {
    id: "2",
    question: "Who painted the famous work of art, Mona Lisa?",
    topic: "art history",
    answer: "Leonardo da Vinci",
    description: "Mona Lisa is a portrait painting by the Italian artist Leonardo da Vinci. It is one of the most famous and recognizable paintings in the world, and is believed to have been painted between 1503 and 1506."
  },
  {
    id: "3",
    question: "Who was the first president of the United States?",
    topic: "American history",
    answer: "George Washington",
    description: "George Washington was the first president of the United States. He was elected in 1788 and served two terms from 1789 to 1797. He is known as the 'Father of His Country' and is one of the most important figures in American history."
  },
  //...
];

  // Select a random question from the questions array
  const question = questions[Math.floor(Math.random() * questions.length)];

  // Send the question and its description to the client
  res.send({ question: question.question, id: question.id });
});

let cooldown = false;
const cooldownTime = 60000; // 1 minute in milliseconds

app.get('/answer', async (req, res) => {
const questions = [
  {
    id: "1",
    question: "What is the largest planet in our solar system?",
    topic: "astronomy",
    answer: "Jupiter",
    description: "Jupiter is the largest planet in our solar system. It has a mass that is 318 times that of Earth, and is the fifth planet from the sun in the solar system. It is a gas giant, mostly composed of hydrogen and helium."
  },
  {
    id: "2",
    question: "Who painted the famous work of art, Mona Lisa?",
    topic: "art history",
    answer: "Leonardo da Vinci",
    description: "Mona Lisa is a portrait painting by the Italian artist Leonardo da Vinci. It is one of the most famous and recognizable paintings in the world, and is believed to have been painted between 1503 and 1506."
  },
  {
    id: "3",
    question: "Who was the first president of the United States?",
    topic: "American history",
    answer: "George Washington",
    description: "George Washington was the first president of the United States. He was elected in 1788 and served two terms from 1789 to 1797. He is known as the 'Father of His Country' and is one of the most important figures in American history."
  },
  //...
];

    if (cooldown) {
        return res.status(429).send({ error: 'You can only submit an answer once per minute. Try again later' });
    }
    // Get the id and answer from the request query
    const { id, answer } = req.query;

    // Find the question with the matching id in the questions array
    const question = questions.find(q => q.id === id);

    if (!question) {
        return res.status(404).send({error: 'Question not found'});
    }

    // Compare the answer to the correct answer
    const isCorrect = question.answer.toLowerCase() === answer.toLowerCase();

    // Send the result to the client
    res.send({ isCorrect });

    // Set the cooldown flag
    cooldown = true;
    // Reset the cooldown after the specified time
    setTimeout(() => {
        cooldown = false;
    }, cooldownTime);
});

}
