//board
let board;
let boardWidth = 1200;
let boardHeight = 721;
let context;

//bird
let birdWidth=54;
let birdHeight=44;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}
//pipes
let pipeArray=[]
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;

let toppipeimg;
let bottompipeimg;

//game physics
let velocityX=-2; //moving left speed
let velocityY=0; //jump speed
let gravity=0.4;
let gameover=false;
let score=0;
window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");//used for drawing on the board

    //draw bird
    //context.fillStyle="green";
    //context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load images
    birdImg=new Image();
    birdImg.src="./myybird-removebg-preview.png";
    birdImg.onload=function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    toppipeimg=new Image();
    toppipeimg.src="./toppipe - Copy.png";

    bottompipeimg= new Image();
    bottompipeimg.src="./bottompipe - Copy.png";

    requestAnimationFrame(update);
    setInterval(placePipes,2000);
    document.addEventListener("keydown",moveBird)
}
function update() {
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    //bird
    velocityY+=gravity;
    //bird.y+=velocityY;
    bird.y=Math.max(bird.y+velocityY,0)
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    if(bird.y>board.height){
        gameover=true;
    }
    //pipes
    for(let i=0;i<pipeArray.length;i++) {
        let pipe=pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if(!pipe.passed&&bird.x>pipe.x+pipe.width){
        score+=0.5;//2 pipes ;)
        pipe.passed=true;
        }
        if(detectCollision(bird,pipe)){
            gameover=true;
        }
        //clear pipes
        while (pipeArray.length>0&&pipeArray[0].x<-pipeWidth){
            pipeArray.shift();
        }
    }
    //score
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(score,5,45);

    if(gameover){
        context.fillText("GAME OVER :(",5,90);
    }
}
function placePipes() {
    if(gameover){
        return;
    }
    let randomPipeY = pipeY-pipeHeight/4 - Math.random()*(pipeHeight/2)
    let openingSpace=board.height/4;

    let topPipe={
        img : toppipeimg,
        x : pipeX,
        y: randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);
    let bottomPipe ={
        img : bottompipeimg,
        x:pipeX,
        y:randomPipeY + pipeHeight + openingSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }
    pipeArray.push(bottomPipe)
}
function moveBird(e){
    if (e.code=="Space"||e.code=="ArrowUp"||e.code=="keyX"){
        velocityY=-6;//jump
        //RESET GAME
        if(gameover){
            bird.y=birdY;
            pipeArray=[]
            score=0;
            gameover=false;
        }
    }
}
function detectCollision(a,b){//program to detect collision between 2 rect
    return a.x<b.x+b.width&&
    a.x+a.width>b.x&&
    a.y<b.y+b.height&&
    a.y+a.height>b.y;
}