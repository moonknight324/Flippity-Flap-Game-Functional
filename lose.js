const scoreElement = document.getElementById("score1");

const savedScore = localStorage.getItem("flappybird_score");
scoreElement.innerHTML = savedScore;

window.onload = function () {
    localStorage.setItem('flappybird_score', '0');
};