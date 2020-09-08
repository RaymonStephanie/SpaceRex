var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstacle11, obstacle22, obstacle33, obstacle44; 

var score;
var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;

function preload() {
  trex_running = loadAnimation("spacerex.png", "spacerex2.png", "spacerex3.png");
  trex_collided = loadAnimation("spacerex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, windowHeight-50, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(windowWidth, windowHeight - windowHeight/20, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.depth = trex.depth-1;

  gameOver = createSprite(width/2, height/2 - 50);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(windowWidth/2, windowHeight - 10, windowWidth, 20);
  invisibleGround.visible = false;
  invisibleGround.collide(trex);

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("rectangle", -10, 0, 35, 70);

  score = 0;

}

function draw() {

  background("darkblue");
  //displaying score
  text("SURVIVAL TIME " + score, width - 100, height - 50);

  if (mousePressedOver(restart) && gameState === END) {
    reset();
  }

  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;
    //change the trex animation
    trex.changeAnimation("running", trex_running);

    ground.velocityX = -(4 + 3 * getFrameRate()/30);
    //scoring
    score = score + Math.round(frameCount/60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()

    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    trex.scale = 0.125;
    ground.velocityX = 0;
    trex.velocityY = 0


    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  
  }


  //stop trex from falling down
  trex.collide(invisibleGround);


  drawSprites();
}




function spawnObstacles() {

  obstacle11 = createSprite(windowWidth, height-75 + 30, 10, 40);
  obstacle11.visible = false;
  obstacle11.velocityX = ground.velocityX;

  obstacle22 = createSprite(windowWidth, height-75 + 30, 10, 40);
  obstacle22.visible = false;
  obstacle22.velocityX = ground.velocityX;

  if (frameCount % 60 === 0) {


    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch (rand) {
      case 1:
        obstacle11.addImage(obstacle1);
        obstacle11.visible = true;
        obstacle11.depth = trex.depth;
        break;
      case 2:
        obstacle22.addImage(obstacle2);
        obstacle22.visible = true;
        obstacle22.depth = trex.depth;
        break;
      
      default:
        break;
    
    }

    //assign scale and lifetime to the obstacle           
    obstacle11.scale = 2;
    obstacle11.lifetime = windowWidth*2;
    obstacle11.setCollider("rectangle",20,-8,10,25);
    
    obstacle22.scale = 0.5;
    obstacle22.lifetime = windowWidth*2;
    obstacle22.setCollider("rectangle",-17.5,-10,30,10);

    //add each obstacle to the group
    obstaclesGroup.add(obstacle11);
    obstaclesGroup.add(obstacle22);

  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = windowWidth*2;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  trex.scale = 0.5;
}
