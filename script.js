let board;
let boardWidth = 900;
let boardHeight = 300;
let context;

let playerwidth = 85;
let playerheight = 85;
let playerX = 50;
let playerY = 220;
let playerImg;

let player = {
    x:playerX,
    y:playerY,
    width:playerwidth,
    height:playerheight
}

let gameOver = false;
let score = 0;
let time = 0;

let boxImg;
let boxX = 700;

let boxsArray = [];

let velocityY = 0;
let gravity = 0.25;

let isJumping = false;
let rotation = 0;

let lives = 3;

window.onload = function() {

    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    playerImg = new Image();
    playerImg.src = "takjoo.png";

    boxImg = new Image();
    boxImg.src = "bakzenya.png";

    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);

    document.addEventListener("touchstart", function(){
        if(player.y == playerY){
            velocityY = -10;
            isJumping = true;
        }
    });

    setInterval(createBox,2000)
}

function update() {
    requestAnimationFrame(update);

    if(gameOver) return;

    context.clearRect(0,0,board.width,board.height);

    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("❤️".repeat(lives), 450, 60);

    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, playerY);

    if(player.y >= playerY){
        isJumping = false;
        rotation = 0;
    }

    if(isJumping) rotation += 0.15;

    context.save();
    context.translate(player.x + player.width/2, player.y + player.height/2);
    context.rotate(rotation);

    context.drawImage(playerImg,-player.width/2,-player.height/2,player.width,player.height);
    context.restore();

    if(time >= 60){
        gameOver = true;
        context.font = "bold 40px Arial";
        context.fillText("takjoo escape successfully!!!",450,150);
    }

    for(let box of boxsArray){
        box.x += box.speed;
        context.drawImage(box.img , box.x , box.y , box.width , box.height);

        if(onCollision(player,box)){
            lives--;
            box.x = -200;

            if(lives <= 0){
                gameOver = true;
                context.font = "bold 40px Arial";
                context.fillText("Zenya has caught takjoo",450,150);
            }
        }
    }

    score++;
    context.font = "bold 40px Arial";
    context.textAlign = "left";
    context.fillText("Score : "+ score ,0,30);

    time += 0.01;
    context.textAlign = "right";
    context.fillText("Time : "+ time.toFixed(2) ,900,30);
}

function movePlayer(e) {
    if(gameOver) return;

    if(e.code == "Space" && player.y == playerY) {
        velocityY = -10;
        isJumping = true;
    }
}

function createBox(){
    if(gameOver) return;

    let randomSpeed = -(Math.random()*3+4);
    let randomSize = Math.random()*30+60;

    let box = {
        img: boxImg,
        x: boxX,
        y: boardHeight - randomSize,
        width: randomSize,
        height: randomSize,
        speed: randomSpeed
    }

    boxsArray.push(box);

    if(boxsArray.length > 5) boxsArray.shift();
}

function onCollision(a,b){
    return a.x < b.x+b.width &&
           a.x+a.width > b.x &&
           a.y < b.y+b.height &&
           a.y+a.height > b.y;
}