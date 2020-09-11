//Create variables here
var dog, happyDog,dog_anime,happydog_anime;
var  database;
var foodS, foodStock;
var  milk,milk_anime;
var feed,addFood;
var lastFed,time;
var bedroom,garden,washroom;
var readState,changeState;
var gameState;


function preload(){
  //load images here
  dog_anime = loadImage("images/dogImg.png");
  happydog_anime = loadImage("images/dogImg1.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  garden = loadImage("virtual pet images/Garden.png");
  washroom = loadImage("virtual pet images/Wash Room.png");

}

function setup() {
	createCanvas(800,700);
   
  dog = createSprite(250,300,30,40);
  dog.addImage(dog_anime);
  dog.scale = 0.2;
  
  /*milk = createSprite(200,200,1,1);
  milk.addImage(milk_anime);
  milk.scale = 0.1;
  milk.visible = false;
  */

  database = firebase.database();
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  lastFed = database.ref('lastFed');
  lastFed.on("value",(data)=>{
    time = data.val();
  })


  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  food = new Food();

  readState = database.ref('gameState');
  readState.on("value",(data) =>{
    gameState = data.val();
  })  
}


function draw() {  
background(46,139,87)


food.display();

if(gameState === "hungry"){
  feed.show();
  addFood.show();
  
}

if(gameState != "hungry"){
  feed.hide();
  addFood.hide();
  
}
currenttime = hour();
if(currenttime === lastFed+1){
  food.garden();
  gameState = "playing";
  database.ref('/').update({
    gameState:"playing",
  })

}

else if(currenttime === lastFed+2){
food.bedroom();
gameState = "sleeping"
database.ref('/').update({
  gameState:"sleeping"
})
}
else if( currenttime< lastFed+2  &&currenttime <= lastFed+4){
food.washroom();
gameState = "bathing"
database.ref('/').update({
  gameState:"bathing"
})
}
else{
  food.display();
  gameState = "hungry"
database.ref('/').update({
  gameState:"hungry"
})
}

  drawSprites();
  //add styles here
  fill("red");
  textSize(20);
text("Food Left :"+ foodS,200,100);
text("lastFed :" + time + "   hours",80,20);
}

function readStock(data){
  foodS = data.val();
}

function feedDog(){
  dog.addImage(happydog_anime);

database.ref("/").update({
  Food:foodS-1,
  lastFed:hour()
})
}
function addFoods(){
  database.ref("/").update({
    Food:foodS+1,
  })
}



