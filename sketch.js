
var trex ,trex_running, trex_gameOver, trex_pausa
var suelo, imagen_suelo, suelo_invisible;
var nube, imagen_nube
var imagen_obstaculo1
var imagen_obstaculo2
var imagen_obstaculo3
var imagen_obstaculo4
var imagen_obstaculo5
var imagen_obstaculo6
var puntos=0
var group_clouds
var group_obstacles
var gamestate="play"
var play, playImg
var pause, pauseImg
var gameOver_img,gameOver_sprite
var reiniciar_img,reiniciar_sprite
var sonido_salto
var sonido_over
var sonido_puntos
var velocidad= 0.5
var fondo
function preload(){ //cargar img, animaciones y sonidos
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  trex_gameOver=loadAnimation("trex_collided.png")
  trex_pausa=loadAnimation("trex1.png")
  imagen_suelo=loadImage("ground2.png")
  imagen_nube=loadImage("cloud2.png")
  imagen_obstaculo1 = loadImage("obstacle1.png")
  imagen_obstaculo2 = loadImage("obstacle2.png")
  imagen_obstaculo3 = loadImage("obstacle3.png")
  imagen_obstaculo4 = loadImage("obstacle4.png")
  imagen_obstaculo5 = loadImage("obstacle5.png")
  imagen_obstaculo6 = loadImage("obstacle6.png")
  playImg=loadImage("play.png")
  pauseImg = loadImage("pausa.png")
  reiniciar_img = loadImage("restart.png")

  gameOver_img = loadImage("OVER.png")
  sonido_salto= loadSound ("jump.mp3")
  sonido_over= loadSound("die.mp3")
  sonido_puntos= loadSound("checkPoint.mp3")
  fondo= loadImage("bg.jpg")
}

function setup(){
 // createCanvas(600,200)
 createCanvas(windowWidth,windowHeight )
  
  //crear sprite del t-rex.
  trex=createSprite(50,height-50,20,50)
  trex.addAnimation("running",trex_running)
  trex.addAnimation("gameOver",trex_gameOver);
  trex.addAnimation("pausa",trex_pausa)
  trex.scale= 0.5
  trex.y=height-50
 // trex.debug=true
  trex.setCollider("circle",0,0,30);

  //suelo invisible
  suelo_invisible=createSprite(width/2,height-20,width,15);
  suelo_invisible.visible=false

  //crear sprite suelo
  suelo=createSprite(width/2,height-30,400,20) 
  suelo.addImage("suelo",imagen_suelo)
  suelo.scale=1.2

  //Crear grupos
  group_clouds= new Group()
  group_obstacles=new Group()

  //crear sprites para pausa
  play=createSprite(30,30,30, 30)
  play.addImage("play", playImg);
  play.scale= 0.2
  pause = createSprite(80, 30, 30,30)
  pause.addImage("pause", pauseImg);
  pause.scale = 0.2

  //boton gameover y  reiniciar
   reiniciar_sprite = createSprite(width/2,height/2+50)
   reiniciar_sprite.addImage(reiniciar_img)
   reiniciar_sprite.scale=1

   gameOver_sprite = createSprite(width/2,height/2-50)
   gameOver_sprite.addImage(gameOver_img)
   gameOver_sprite.scale = 1
}

function draw(){//repite
  background(fondo)


  fill("#fa7abc")
  textSize(30)
  text ("score "+puntos,width-200,50)


  if(gamestate === "play"){
    puntos+=Math.round((getFrameRate()/60))


     // && and 2 condicion sean verdaderas
     // || or  1 sea verdadera
    if((keyDown("space") || touches.length > 0)&& trex.y>=height-70){
      trex.velocityY= -12 
      sonido_salto.play()
      touches=[]
    } 
    trex.velocityY+=0.5
    trex.collide(suelo_invisible)

    if(puntos===0){
      suelo.velocityX=-(3)
      group_obstacles.setVelocityXEach(-3)
    }
    else if(puntos % 100 === 0){
      suelo.velocityX=-(2+velocidad)
      velocidad+=0.5
    }
   
    if(suelo.x<0){
      suelo.x=200 
    }
    crear_nubes()
    crear_obstaculos()

    if (puntos%1000===0 && puntos>0){
      sonido_puntos.play()
    }

    if(group_obstacles.isTouching(trex)){
      gamestate="game over"
      sonido_over.play()
    }

    if (mousePressedOver(pause)){
     gamestate="pausa" 
    }

    reiniciar_sprite.visible= false
    gameOver_sprite.visible = false
  }
  else if(gamestate === "game over"){
    suelo.velocityX=0
    group_obstacles.setVelocityXEach(0)
    group_clouds.setVelocityXEach(0)
    group_obstacles.setLifetimeEach(-20)
    group_clouds.setLifetimeEach(-20)
    trex.velocityY=0
    trex.changeAnimation("gameOver",trex_gameOver)
    reiniciar_sprite.visible= true
    gameOver_sprite.visible = true

    if(mousePressedOver(reiniciar_sprite)){
      velocidad= 0.5
      puntos= 0
      group_obstacles.destroyEach()
      group_clouds.destroyEach()  
      trex.changeAnimation("running",trex_running)
      gamestate="play"
    }
  }
  else if(gamestate === "pausa"){
    suelo.velocityX=0
    group_obstacles.setVelocityXEach(0)
    group_clouds.setVelocityXEach(0)
    group_obstacles.setLifetimeEach(-20)
    group_clouds.setLifetimeEach(-20)
    trex.velocityY=0
    trex.changeAnimation("pausa",trex_pausa)
    if (mousePressedOver(play)){
      gamestate="play" 
      group_obstacles.setLifetimeEach(300)
      group_clouds.setLifetimeEach(300)
      group_obstacles.setVelocityXEach(-2)
      group_clouds.setVelocityXEach(-2)
      trex.changeAnimation("running",trex_running)
    }
  }
  
  

 
 
  drawSprites();
}
function crear_nubes(){
  if(frameCount%60===0){
  nube=createSprite(width+10,100,40,10)
  nube.addImage("nube",imagen_nube)
   nube.velocityX=-2
   nube.scale=Math.random(0,1)
   nube.y=Math.round(random(15,150))
   trex.depth=nube.depth+1
   nube.lifetime=width/2
   group_clouds.add(nube)

  }
  
}
function crear_obstaculos(){
  if(frameCount%110===0){
    obstaculo=createSprite(width+10,height-40,10,40)
    var rando=Math.round(random(1,6))
    switch(rando){
     case 1:
       obstaculo.addImage(imagen_obstaculo1);
       obstaculo.scale=0.4
       break;
    case 2:
        obstaculo.addImage(imagen_obstaculo2);
        obstaculo.scale=0.5
        break;
    case 3:
        obstaculo.addImage(imagen_obstaculo3);
        obstaculo.scale=0.4
        break; 
    case 4:
        obstaculo.addImage(imagen_obstaculo4);
        obstaculo.scale=0.4
        break;
    case 5:
        obstaculo.addImage(imagen_obstaculo5);
        obstaculo.scale=0.4
        break; 
    case 6:
        obstaculo.addImage(imagen_obstaculo6);
        obstaculo.scale=0.3
        break;
    }
   // obstaculo.velocityX=-2 + velocidad
    obstaculo.lifetime=width/2
    trex.depth=obstaculo.depth+1
    group_obstacles.add(obstaculo)
    group_obstacles.setVelocityXEach(suelo.velocityX)
    
  }
}