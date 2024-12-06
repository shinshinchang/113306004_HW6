const generateAnswer = () => {
    const digits = [...Array(10).keys()];
    const answer = [];
    for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * digits.length);
        answer.push(digits.splice(index, 1)[0]);
    }
    return answer;
};

const answer = generateAnswer();
let attempts = 0;

// 提交猜測
function submitGuess() {
    const input = document.getElementById("guessInput").value;

    if (!/^[0-9]{4}$/.test(input)) {
        alert("請輸入四位數字！");
        return;
    }
    const guess = input.split("");
    if (new Set(guess).size !== 4) {
        alert("數字不能重複！");
        return;
    }

    attempts++;
    const result = checkGuess(guess.map(Number));
    const resultsDiv = document.getElementById("results");
    const resultText = document.createElement("p");

    resultText.textContent = `第${attempts}次: ${input} ⮕ ${result}`;
    resultsDiv.appendChild(resultText);

    if (result === "4A0B") {
        alert(`恭喜答對了！總共猜了 ${attempts} 次。`);
        launchFireworks();
        document.getElementById("guessInput").value = "";
        return;
    }
    document.getElementById("guessInput").value = "";
}

// 檢查猜測
function checkGuess(guess) {
    let a = 0;
    let b = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === answer[i]) {
            a++;
        } else if (answer.includes(guess[i])) {
            b++;
        }
    }
    return `${a}A${b}B`;
}

// 煙火和音樂效果
function launchFireworks() {
    const fireworksDiv = document.getElementById("fireworks");
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    const sound = document.getElementById("fireworksSound");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    fireworksDiv.style.visibility = "visible";
    sound.play();

    let particles = [];

    function createFireworks() {
        for (let i = 0; i < 300; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 10,
                dy: (Math.random() - 0.5) * 10,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                size: Math.random() * 10 + 5,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }

    function update() {
        particles.forEach((p) => {
            p.x += p.dx;
            p.y += p.dy;
            p.size *= 0.95;
        });
        particles = particles.filter((p) => p.size > 0.5);
    }

    function animateFireworks() {
        draw();
        update();
        if (particles.length > 0) {
            requestAnimationFrame(animateFireworks);
        }
    }

    let iteration = 0;
    sound.play();

    function repeatFireworks() {
        if (iteration < 4) {
            createFireworks();
            animateFireworks();
            iteration++;
            setTimeout(repeatFireworks, 2000);
        }
    }
    repeatFireworks();
}