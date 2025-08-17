import Word from "../models/word.js";

const words = [
    new Word("Test", "Test-Wort")
];

export function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}