//ToDo: 4-6 and 3-7 random reward.....DONE
//Cohort assignment based on number of ppl on that list 
    let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;
    
    let app = new Application({
        antialiasing: true,
        transparent: true,
        width: 1000,
        height: 600,
        resolution: 1
      }
   );
  //document.body.appendChild(app.view);

  //var baseWidth = Math.floor(window.innerWidth);
  //app.renderer.view.style.position = 'relative';
  //app.view.style.left = Math.floor((baseWidth-512)/2)+'px';
  //app.renderer.view.style.top = '0px';
  //app.renderer.view.style.right = '0px';
  //app.renderer.view.style.bottom = '0px';
  //app.renderer.view.style.left = '0px';

  //app.view.style.left = Math.floor((baseWidth)/2)-512+'px';
    //   
//app.renderer.resize(window.innerWidth, window.innerHeight);
var gameWindow = document.getElementById("gameWindow");
gameWindow.appendChild(app.view);
var size = [1000, 600];
var ratio = size[0] / size[1];


resize()
function resize() {
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.width = w + 'px';
    app.renderer.view.style.height = h + 'px';
    app.renderer.view.style.left = '25%';
    app.renderer.view.style.top = '20%'; 
    //app.renderer.view.style.margin = -w/2 + 'px 0 0 ' -h/2 + 'px';    
}
window.onresize = resize;


//  window.addEventListener("resize", function() {
      //app.renderer.resize(window.innerWidth, window.innerHeight);
//      var w = window.innerWidth;
//      var h = window.innerHeight;
 //     app.renderer.view.style.position = 'fixed';

 //     app.renderer.view.style.width = w + 'px';
 //     app.renderer.view.style.height = h + 'px';
 //     app.renderer.view.style.left = '0px';
      //app.view.style.top = '0px'; 
      //app.view.style.bottom = '0px'; 
  //    app.renderer.view.style.bottom = '0px'; 

 //   });

    var flashStage = new PIXI.Container();
    //var gameScene = new PIXI.Container();

    //First, Create a Pixi renderer and stage
   // var renderer = PIXI.autoDetectRenderer(512, 512);
   // document.body.appendChild(renderer.view);
     
    //Next, create a new instance of Smoothie
    var smoothie = new Smoothie({
      engine: PIXI,
      renderer: app,
      root: flashStage,
      update: gameLoop.bind(this),
      fps: 50,
    });
    var EXPLOSION_FRAMES = [];
    var LIGHTSPEED_FRAMES = [];
    /*
    Here's what those options above mean:
    - `renderingEngine`: the PIXI global object.
    - `renderer`: The `renderer` object you created using Pixi's `autoDetectRenderer`
    - `root`: The `stage` Container object at the top of Pixi's sprite display list heirarchy
    - `updateFunction`: A function, containing your game or application logic, that you want to run in a loop.
    In this example it's the function caled `update` that you'll see ahead in this file.
    Importantly, use `bind(this)` to bind the function to the current application scope.
    - `fps`: The frames-per-second that you want your animation to run at. The default is 60.

    There are other options you could supply:
    - `properties`: An object that defines 5 Boolean sprite properties for which you want
    smooth animation: `position`, `rotation`, `scale`, `size`, `alpha`.
    Set them to `true` to turn them on, and `false` to turn them off. If you leave the `properties` option out,
    Smoothie will automatically give you smooth animation for position and rotation.
    - `interpolate`: A Boolean (true/false) value that determines whether animation smoothing (interpolation) should be on or off.
    */

    //Load any assets you might need and call the `setup` function when
    //they've finished loading

    PIXI.loader
      .add("images/galaguh.json")
      .add("images/blue.png")
      .add("images/close.png")
      .add("images/bg-control-pad.svg")
      .add("images/bg-control-angle-indicator.svg")
      .add("images/spaceship-body.png")
      .add("images/space-background.svg")
      .add("images/asteroid.png")
      .add("images/home.png")
      .load(setup);

    addExplosionFrames();
    addLightSpeedFrames();
    let state, explosion, exit, player,
    door, healthBar, message,scoreMessage, codeMessage, gameOverScene, enemies, id;    //Define any variables used in more than one function
    let  hero, aliens, spaceBackground, playerBullets, enemyBullets;


    let left = keyboard(65);
   let right = keyboard(68);
    let spacebar = keyboard(32);

    let textureButton, textureButtonDown, textureButtonOver, button;

    let displacementSprite, displacementFilter;
    //let quitButton;
    let yourScoreMessage, globalScoreMessage;
    let targetScore; //on screen

    var totalScore = 0;
    var LeftFlash = 0;
    var RightFlash = 0;
    let doors = [];
    var chosenDoor = 0;
    var went_right = 0;

    var rule = 0; //rule = 0: go for More Flashes, rule = 1: go for Less Flashes

    var coin;
    var coin2;
    var radar1;
    var radar2;
    var firstPick = 1;
    //probality of which side being the right choice
    var leftProb;
    var rightProb;
    var lbin;
    var rbin;


    //var trainBinStartTimer = 0;
    var testBinStartTimer = 0;
    var leftBin = [];
    var rightBin = [];

    var endofBinTime = 0;
    //phase
    //train
    var trainPhase;
    var whatPhase = 1;
    var trialCounter;
    var DestroyedAlienCounter;

    //data to send through json
    var cohort; //what training are u gonna get
    var user;

    var highscore;
    ////////////////////////////

    //button
    var up,down;
    var decide = 0;
    var isRadarSelected1 =0;
    var isRadarSelected2 =0;
    //sound
    var goodsound;
    var badsound;
    //var themeso
    var chosenAlienID = 0;

    var HitMiss = 0;
    var ExplosionContainer;

    var lightspeed;


    var reward = '"rw":[';
    var score = '"score":[';
    var choice = '"choice":[';
    var numflashleft = '"lflash":[';
    var numflashright = '"rflash":['; 
    var reactiontime = '"rt":[';
    var choicetime = '"ct":[';
    var leftBinRecord = '"lbin":[';
    var rightBinRecord = '"rbin":[';
    var flashtime = '"ft":[';

    var RT = 0; //reaction 
    var DT = 0; //decision
    var ST = 0; //start

    //The `setup` function will run when the loader has finished loading the image
    function setup() {
      user = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);

      goodsound = new sound('coin.mp3');
      badsound = new sound('boo.mp3');
     // themesong = new sound('StarWars.mp3');
      trialCounter = 0;
      DestroyedAlienCounter = 0;
      app.stage.addChild(flashStage);
      //Create the cat sprite and add it to the stage

      radar1 = new PIXI.Sprite(PIXI.loader.resources["images/bg-control-pad.svg"].texture);
      radar2 = new PIXI.Sprite(PIXI.loader.resources["images/bg-control-pad.svg"].texture);

      radar_a1 = new PIXI.Sprite(PIXI.loader.resources["images/bg-control-angle-indicator.svg"].texture);
      radar_a2 = new PIXI.Sprite(PIXI.loader.resources["images/bg-control-angle-indicator.svg"].texture);

      coin = new PIXI.Sprite(PIXI.loader.resources["images/blue.png"].texture);
      coin2 = new PIXI.Sprite(PIXI.loader.resources["images/blue.png"].texture);
      flashStage.addChild(coin);
      flashStage.addChild(coin2);
      //After everything is set up, start Smoothie by calling its `start`
      //method.
      coin.height=50
      coin.width=50
      coin2.height=50
      coin2.width=50
      coin.visible = 0;
      coin2.visible = 0;
      coin.x = 50;
      coin.y = 150;
      coin2.x = 300;
      coin2.y = 150;

      flashStage.addChild(radar1);
      flashStage.addChild(radar2);
      //After everything is set up,
      //After everything is set up, start Smoothie by calling its `start`
      //method.
      radar1.visible = 1;

      radar1.x = 40
      radar1.y = 150
      //radar1.width=20
      //radar1.heigh=900
      radar2.x = 320
      radar2.y = 150
      radar1.interactive=true
      radar2.interactive=true
      //radar2.width=20
      //radar2.heigh=900

      flashStage.visible = 0;
      ///////////////////////////////////////
        gameScene = new Container();
        
        app.stage.addChild(gameScene);
        id = resources["images/galaguh.json"].textures;
        spaceBackground = new Sprite(id["spaceBackground.psd"]);
        gameScene.addChild(spaceBackground);

        hero = new Sprite(id["hero.psd"]);
        hero.anchor.set(0.5);
        hero.x = gameScene.width/2; //-hero.width;
        hero.y = app.stage.height;
        hero.vx = 0;
        hero.vy = 0;
        hero.width = 100;
        hero.height= 100;
        gameScene.addChild(hero);
        

        let numOfAliens = 10,
            speed = 0.5,
            direction = 1;
        aliens = [];
        playerBullets = [];
        enemyBullets = [];
        ExplosionContainer = [];
        for (let i = 0; i < numOfAliens; i++) {
         // let alien = new Sprite(id["enemy.png"])
          var alienImg;
          alienImg = "images/asteroid.png";
          
          let alien = new PIXI.Sprite(PIXI.loader.resources[alienImg].texture);
          alien.width= randomInt(50, 60);
          alien.height= randomInt(50, 70);
          alien.anchor.x=0.5;
          alien.anchor.y =0.5;
          alien.x = randomInt(0, app.stage.width);
          alien.y = randomInt(0, app.stage.height - 180 - alien.height);
          alien.vx = speed * direction;
          //alien.fire = randomInt(0,120);
          alien.id = i;
          direction *= -1;
          //alien.hitArea = new PIXI.Rectangle(0, 0, alien.width*1.5, alien.height*1.5);
          alien.on('mouseover', function(event){
              alien.tint = 0x00ffff;
          });
          alien.on('mouseout', function(event){
              alien.tint = 0xffffff;
          });

          alien.interactive = true;
          alien.on('mousedown',function (e){
            //alien.tint = 0x00ffff;
            if (coinFlip(0.5)){ //toss coin to see which side will win, L or R
              leftProb = 0.1;
              rightProb = 0.9;
            }
            else{
              leftProb = 0.9;
              rightProb = 0.1;
            }
            chosenAlienID = alien.id;
            testBinStartTimer = performance.now();
            state = trial_init;
          });


          alien.on('touchstart',function (e){
            alien.tint = 0x00ffff;
            if (coinFlip(0.5)){ //toss coin to see which side will win, L or R
              leftProb = 0.1;
              rightProb = 0.9;
            }
            else{
              leftProb = 0.9;
              rightProb = 0.1;
            }
            chosenAlienID = alien.id;
            testBinStartTimer = performance.now();

            state = trial_init;
          });

          alien.on('touchend',function (e){
              alien.tint = 0xffffff;
            });
          aliens.push(alien);
          gameScene.addChild(alien);
        }
        
        healthBar = new Container();
        healthBar.position.set(4, hero.y);
        gameScene.addChild(healthBar);
        var home;
        homeImg = "images/home.png";
          
        //home = new PIXI.Sprite(PIXI.loader.resources[homeImg].texture);
        //home.width= 100;
        //home.height= 100;
        //home.x = 104;
        //home.y = 4;
        //healthBar.addChild(home);
        let innerBar = new Graphics();
        innerBar.beginFill(0x263e49);
        innerBar.drawRect(0, 0, 5, 20);
        innerBar.endFill();
        healthBar.addChild(innerBar);

        let outerBar = new Graphics();
        outerBar.beginFill(0x66CCFF);
        outerBar.drawRect(0, 0, 5, 20);
        outerBar.endFill();
        healthBar.addChild(outerBar);
        healthBar.outer = outerBar;

        gameOverScene = new Container();
        app.stage.addChild(gameOverScene);

        gameOverScene.visible = false;

        let style = new TextStyle({
          fontFamily: "Josefin Sans",
          fontSize: 40,
          fill: "white",
        });

        scoreMessage = new Text("0", style);
        scoreMessage.x = 10;
        scoreMessage.y = hero.y;
        scoreMessage.text = "0";
        scoreMessage.visible=1;
        gameScene.addChild(scoreMessage);

        //message = new Text("The End!", style);
        //message.anchor.set(0.5);
        //message.x = app.stage.width / 2;
        //message.y = app.stage.height / 2 - 32;

        //gameOverScene.addChild(message);
        globalScoreMessage = new Text("High Score", style);
        globalScoreMessage.x = app.stage.width/3;
        globalScoreMessage.y = app.stage.height  - 100;
        gameOverScene.addChild(globalScoreMessage);

        yourScoreMessage = new Text("Your Score", style);
        yourScoreMessage.x = app.stage.width/3;
        yourScoreMessage.y = app.stage.height  - 150;
        gameOverScene.addChild(yourScoreMessage);

        spacebar.press = function() {
          if (playerBullets.length < 1){
            let rectangle = new Graphics();
            rectangle.beginFill(0x66CCFF);
            rectangle.drawRect(0, 0, 5, 50);
            rectangle.endFill();
            rectangle.x = hero.x - rectangle.width/2;
            rectangle.y = hero.y -rectangle.height/2;
            gameScene.addChild(rectangle);
            playerBullets.push(rectangle);
            HitMiss=0;
          }
        };

        radar1.on('mousedown',function (e){
        isRadarSelected1=1;
        if (playerBullets.length < 1){
            let rectangle = new Graphics();
            rectangle.beginFill(0x66CCFF);
            rectangle.drawRect(0, 0, 5, 25);
            rectangle.endFill();
            rectangle.x = hero.x - rectangle.width/2;
            rectangle.y = hero.y -rectangle.height/2;
            gameScene.addChild(rectangle);
            playerBullets.push(rectangle);
          }
      });

      radar2.on('mousedown',function (e){
        isRadarSelected2=1;
        if (playerBullets.length < 1){
            let rectangle = new Graphics();
            rectangle.beginFill(0x66CCFF);
            rectangle.drawRect(0, 0, 5, 25);
            rectangle.endFill();
            rectangle.x = hero.x - rectangle.width/2;
            rectangle.y = hero.y -rectangle.height/2;
            gameScene.addChild(rectangle);
            playerBullets.push(rectangle);
          }
      });

      radar1.on('touchstart',function (e){
        isRadarSelected1=1;
        if (playerBullets.length < 1){
            let rectangle = new Graphics();
            rectangle.beginFill(0x66CCFF);
            rectangle.drawRect(0, 0, 5, 25);
            rectangle.endFill();
            rectangle.x = hero.x - rectangle.width/2;
            rectangle.y = hero.y -rectangle.height/2;
            gameScene.addChild(rectangle);
            playerBullets.push(rectangle);
          }
      });

      radar2.on('touchstart',function (e){
        isRadarSelected2=1;
        if (playerBullets.length < 1){
            let rectangle = new Graphics();
            rectangle.beginFill(0x66CCFF);
            rectangle.drawRect(0, 0, 5, 25);
            rectangle.endFill();
            rectangle.x = hero.x - rectangle.width/2;
            rectangle.y = hero.y -rectangle.height/2;
            gameScene.addChild(rectangle);
            playerBullets.push(rectangle);
          }
      });
        left.press = function() {
          hero.vx = -4;
          hero.vy = 0;
        };

        right.press = function() {
          hero.vx = 4;
          hero.vy = 0;
        };


    //Create the `gameOver` scene
      //state = play;
      //app.ticker.add(delta => gameLoop(delta));
      state = getHC;
      smoothie.start();
    }


    //All your game or application logic goes in this `update` function
    //that you've supplied to Smoothie when you instantiated it above. Smoothie will run this
    //`update` function in loop at
    //whatever fps (frames-per-second) you've defined.

    var frameCount = 0;
    var binDuration = 260; //duration of each bin
    var binCount = 0;
    var inBin = 1;

    var lflash = 0;
    var rflash = 0;


    function coinFlip(prob) {
          return(Math.random() < prob) ? 1 : 0;
     }

    function gameLoop(delta){
     //Update the current game state:
     state(delta);
    }
    //play loop
    function play(delta){
      //
        isRadarSelected1=0;
        isRadarSelected2=0
        gameScene.visible= true;
        gameScene.alpha = 1;
        flashStage.visible = false;
        gameOverScene.visible = false;

        hero.x += hero.vx*smoothie.dt;


        contain(hero, {x: 28, y: 10, width: 480, height: 480});
        let heroHit = false;
        aliens.forEach(function(alien) {
            alien.x += Math.random()*alien.vx*smoothie.dt;
            alien.x -= Math.random()*alien.vx*smoothie.dt;

            //alien.fire += delta;
            //if (alien.fire > 120)
            //{
            //  let rectangle = new Graphics();
            //  rectangle.beginFill(0xd11427);
            //  rectangle.drawRect(0, 0, 5, 6);
            //  rectangle.endFill();
            //  rectangle.x = alien.x + alien.width/2 - rectangle.width/2;
           //  rectangle.y = alien.y + alien.height - rectangle.height/2;
            //  gameScene.addChild(rectangle);
            //  alien.fire = 0;
            //  enemyBullets.push(rectangle);
            //}

            let alienBounded = contain(alien, {x: 28, y: 10, width: 480, height: 480});
            if (alienBounded === "left" || alienBounded === "right") {
              alien.vx *= -1;
            }
          });
          // check if bullet hits player
          //enemyBullets.forEach((bullet)=>{
          //  if(hitTestRectangle(hero, bullet)) {
          //    heroHit = true;
          //  }
          //});
          // player slows to stop on keyup
          if (left.isUp && right.isUp){
            hero.vx *= 0.97*smoothie.dt;
          }


          playerBullets.forEach((playerBullet)=> {

            var toPlayerX = aliens[chosenAlienID].position.x - playerBullet.x;
            var toPlayerY = aliens[chosenAlienID].position.y - playerBullet.y;

            // Normalize
            var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
            toPlayerX = toPlayerX / toPlayerLength;
            toPlayerY = toPlayerY / toPlayerLength;

            // Move towards the player
            playerBullet.x += toPlayerX * 20;
            playerBullet.y += toPlayerY * 20;

            // Rotate us to face the player
            var herotoAlienX = aliens[chosenAlienID].position.x - hero.x;
            var herotoAlienY = aliens[chosenAlienID].position.y - hero.y;
            hero.rotation = Math.PI/2  + Math.atan2(herotoAlienY, herotoAlienX);

            playerBullet.rotation =  Math.atan2(toPlayerY, toPlayerX) - Math.PI/2;

            // check if bullet is out of bounds
            if (Math.sqrt(toPlayerY*toPlayerY+toPlayerX*toPlayerX) <= 0.8){
              playerBullets.splice(playerBullets.indexOf(playerBullet), 1);
              gameScene.removeChild(playerBullet);
            }
            if (hitTestRectangle(aliens[chosenAlienID],playerBullet) && (HitMiss == 1)){
              aliens[chosenAlienID].visible = false;
              aliens[chosenAlienID].interactive = false;
              explosion = new PIXI.extras.MovieClip( EXPLOSION_FRAMES.map( PIXI.Texture.fromImage ) );
              explosion.anchor.x = 0.5;
              explosion.anchor.y = 0.5;
              explosion.loop = false;
              gameScene.addChild(explosion);
              explosion.position.x = aliens[chosenAlienID].position.x;
              explosion.position.y = aliens[chosenAlienID].position.y;
              explosion.play();
              ExplosionContainer.push(explosion);
              //playerBullets.splice(playerBullets.indexOf(playerBullet), 1);
              gameScene.removeChild(aliens[chosenAlienID]);  
              DestroyedAlienCounter += 1;
              //console.log(DestroyedAlienCounter);
              //gameScene.removeChild(explosion);
              playerBullets.splice(playerBullets.indexOf(playerBullet), 1);
              gameScene.removeChild(playerBullet);  
              healthBar.outer.width += 1;
            }

            // check bullet collision on each alien
            /*aliens.forEach((alien)=>{
              if(hitTestRectangle(alien, playerBullet) && (HitMiss == 1)) {
                alien.visible = false;
                alien.interactive = false;
                playerBullet.visible = false;
                gameScene.addChild(explosion);
                explosion.position.x = alien.position.x;
                explosion.position.y = alien.position.y;
                explosion.play();
                aliens.splice(aliens.indexOf(alien), 1);
                playerBullets.splice(playerBullets.indexOf(playerBullet), 1);
                gameScene.removeChild(alien);

              }
            });*/
            
          });



          //enemyBullets.forEach((enemyBullet) =>{
          //  enemyBullet.y += 4*delta;
          //  if (enemyBullet.y < 0){
          //    enemyBullets.splice(enemyBullets.indexOf(enemyBullet), 1);
          //    gameScene.removeChild(enemyBullet);
          //  }
          //});


         // if (healthBar.outer.width < 0) {
         //   state = end;
          //  message.text = "GAME OVER";
          //}
          /*if (ExplosionContainer.length > 1){
            ExplosionContainer.forEach((explosion)=>{
                gameScene.removeChild(explosion);
              });
            ExplosionContainer = [];
          }*/

          if (DestroyedAlienCounter == aliens.length) {
            ExplosionContainer.forEach((explosion)=>{
                gameScene.removeChild(explosion);
              });
            aliens = [];
            
            DestroyedAlienCounter = 0;
            transition();
          }

          if (trialCounter > 12){
            
            state = sendData;
          }
  }
  function decision(delta){
    flashStage.visible = true
    trialCounter = trialCounter + 1;
    coin.visible=0;
    coin2.visible=0;
    radar1.visible=1;
    radar2.visible=1;
    if (isRadarSelected1){
      went_right = 0; //did not go right
      if (chosenDoor == 0){
          state = rightchoice;
      }
      else {
          state = wrongchoice;
      }
    }
    if (isRadarSelected2){
      went_right = 1;
      if (chosenDoor == 1){
          state = rightchoice;
      }
      else {
          state = wrongchoice;
      }
    }
  }
  
  //Test trial
  
  function trial_init(delta) {
    aliens.forEach((alien)=>{
      alien.interactive = false;
    });
    state = test_flash;
  }
  function test_flash(delta) {
    gameScene.visible = true;
    gameScene.alpha = 0.1;
    flashStage.visible = true;
    gameOverScene.visible = false;

     //Use any physics or game logic code here
    coin.x = 60;
    coin.y = 150;
    coin2.x = 410;
    coin2.y = 150;
    if (binCount % 1 == 0){ //every x bins we have 1 flash

      if (inBin){ //what to do in this bin
        //have not flashed left yet
        if (lflash == 0){
          if(coinFlip(leftProb)){
            coin.visible = 1;
            lflash = 1;
            LeftFlash = LeftFlash + 1;
            leftBin.push(performance.now()-testBinStartTimer);
            }
          else {
            coin.visible = 0;
            lflash = 1; // don't flash anymore? or wait for 20ms? and then flash?
            }
          }
        else{
            coin.visible = 0;
            }
        //have not flashed right yet       
        if (rflash == 0){
          if(coinFlip(rightProb)){
            coin2.visible = 1;
            rflash = 1;
            RightFlash = RightFlash + 1;
            rightBin.push(performance.now()-testBinStartTimer);
            }
          else {
            coin2.visible = 0;
            rflash = 1; // don't flash anymore? or wait for 20ms? then stop
            }
          }
        else{ //if flashed right already
            coin2.visible = 0;
          }
      } //end of bin
      else {
        coin.visible = 0;
        coin2.visible = 0;
      }
    } //outside bin, next x bin 
     
    if (frameCount > 13){ // 13 frames total, so a bin is 20*13 = 260ms
      inBin = 0; //next bin
      binCount = binCount + 1;
      frameCount = 0;
      lflash = 0;
      rflash = 0;
   //    console.log(binCount);
    }
    else {
      inBin = 1; //in the same bin
      frameCount = frameCount + 1;
    }
    


    //if ((binCount > 9) || (isRadarSelected2) || (isRadarSelected1)){ //10 bin 13*260ms = 3s ish
    if ( (isRadarSelected2) || (isRadarSelected1)){ //10 bin 13*260ms = 3s ish
      RT = performance.now() - testBinStartTimer;
      binCount = 0;
      frameCount = 0;
      lflash = 0;
      rflash = 0;
      //console.log(LeftFlash);
      //console.log(RightFlash);

      //IF we see 4-6 and 3-7 --> random Reward or random Door
        if (LeftFlash > RightFlash) { //reward location
          if (rule == 0){
              chosenDoor = 0;
          }
          else {
            chosenDoor = 0; //1 to do rule switch
          }
        }
        else if (LeftFlash < RightFlash){
          if (rule == 0){
              chosenDoor = 1;
          }
          else {
            chosenDoor = 1; //0 to do rule switch
          }
        }
        else { //equal 
          chosenDoor = 2;
        }
      //LeftFlash = 0;
      //RightFlash = 0;
      leftBinRecord = leftBinRecord + '{"array":' + JSON.stringify(leftBin) + '},';
      rightBinRecord = rightBinRecord + '{"array":' + JSON.stringify(rightBin) + '},'; 
      state = decision;
      //state = play;
      coin.visible = 0;
      coin2.visible = 0;
 
      leftBin = [];
      rightBin = [];

    }
    //You can change Smoothie's `fps` at any time, like this:
    //smoothie.fps = 1; //basically changing duration of flash
    //You can turn interpolation (animation smoothing) on or off at any
    //time using Smoothie's `interpolate` Boolean property, like this:
    //smoothie.interpolate = false;
  }


function wrongchoice(delta) {

    score = score + '{"iter":0},';

    numflashleft = numflashleft + '{"iter":' + LeftFlash + '},';
    numflashright = numflashright + '{"iter":' + RightFlash + '},';
    reactiontime = reactiontime + '{"iter":' + RT + '},';
    //choicetime = choicetime + '{"iter":' + DT + '},';
    
    choice = choice + '{"iter":' + went_right + '},';

    //////////////unCOMMENT to CHANGE CONDITION
    //////////////////////////////////REAL REWARD instead of Probabilistic reward//////////////////////
    //if ((LeftFlash == 10 & RightFlash == 0) || (LeftFlash == 0 & RightFlash == 10) || (LeftFlash == 9 & RightFlash == 1) || (LeftFlash == 1 & RightFlash == 9)){
    totalScore = totalScore;
    reward = reward + '{"iter":0},';
    //reset
    LeftFlash = 0;
    RightFlash = 0;
    HitMiss = 0;
    scoreMessage.text = totalScore.toString();
    aliens.forEach((alien)=>{
      alien.interactive = true;
      alien.tint = 0xffffff;
    });
    state = play;

}

function rightchoice(delta) {

  //////////////unCOMMENT to CHANGE CONDITION
    //if ((LeftFlash == 10 & RightFlash == 0) || (LeftFlash == 0 & RightFlash == 10) || (LeftFlash == 9 & RightFlash == 1) || (LeftFlash == 1 & RightFlash == 9)){
    
    totalScore = totalScore + 100*(trialCounter+1);
    reward = reward + '{"iter":1},';

    score = score + '{"iter":1},';
    numflashleft = numflashleft + '{"iter":' + LeftFlash + '},';
    numflashright = numflashright + '{"iter":' + RightFlash + '},';
    reactiontime = reactiontime + '{"iter":' + RT + '},';
    //choicetime = choicetime + '{"iter":' + DT + '},';

    choice = choice + '{"iter":' + went_right + '},';


    goodsound.play();
    //reset
    LeftFlash = 0;
    RightFlash = 0;
    HitMiss=1;
    scoreMessage.text = totalScore.toString();
    aliens.forEach((alien)=>{
      alien.interactive = true;
      alien.tint = 0xffffff;
    });

    
    
    state = play;

}



function nextLevel(){

    lightspeed.play();
    lightspeed.onComplete = function(){
      gameScene.removeChild(lightspeed);
      let numOfAliens = randomInt(10, 15);
      speed = 0.5,
      direction = 1;
      aliens = [];
      playerBullets = [];
      ExplosionContainer = [];
      DestroyedAlienCounter = 0; //reset alien counter to 0
      for (let i = 0; i < numOfAliens; i++) {
           // let alien = new Sprite(id["enemy.png"])
            var alienImg;
            alienImg = "images/asteroid.png";
            
            let alien = new PIXI.Sprite(PIXI.loader.resources[alienImg].texture);
            alien.width= randomInt(50, 60);
            alien.height= randomInt(50, 70);
            alien.anchor.x=0.5;
            alien.anchor.y =0.5;
            alien.x = randomInt(0, app.stage.width);
            alien.y = randomInt(0, app.stage.height - 180 - alien.height);
            alien.vx = speed * direction;
            //alien.fire = randomInt(0,120);
            alien.id = i;
            direction *= -1;
            alien.interactive = true;
            //alien.hitArea = new PIXI.Rectangle(0, 0, alien.width*1.5, alien.height*1.5);
            alien.on('mouseover', function(event){
                alien.tint = 0x00ffff;
            });
            alien.on('mouseout', function(event){
                alien.tint = 0xffffff;
            });

            
            alien.on('mousedown',function (e){
              //alien.tint = 0x00ffff;
              if (coinFlip(0.5)){ //toss coin to see which side will win, L or R
                leftProb = 0.3;
                rightProb = 0.7;
              }
              else{
                leftProb = 0.7;
                rightProb = 0.3;
              }
              chosenAlienID = alien.id;
              testBinStartTimer = performance.now();
              state = trial_init;
            });
            alien.on('touchstart',function (e){
              alien.tint = 0x00ffff;
              if (coinFlip(0.5)){ //toss coin to see which side will win, L or R
                leftProb = 0.3;
                rightProb = 0.7;
              }
              else{
                leftProb = 0.7;
                rightProb = 0.3;
              }
              chosenAlienID = alien.id;
              testBinStartTimer = performance.now();
              state = trial_init;
            });

            alien.on('touchend',function (e){
              alien.tint = 0xffffff;
            });
      aliens.push(alien);
      gameScene.addChild(alien);
      }
      state = play; 

    };    
}


function transition(){
  lightspeed = new PIXI.extras.MovieClip( LIGHTSPEED_FRAMES.map( PIXI.Texture.fromImage ) );
  lightspeed.anchor.x = 0.5;
  lightspeed.anchor.y = 0;
  lightspeed.loop = false;
  lightspeed.animationSpeed = 0.3; 
  lightspeed.position.x = hero.x;
  lightspeed.position.y = 0; 
  lightspeed.height = gameScene.height; 
  //lightspeed.width =gameScene.width;
  gameScene.addChild(lightspeed);
  state = nextLevel;
}


//CHECK TO SEE IF YOU HAVE A MECHTURK SURVEY READY


/* Helper functions */
function onQuitDown() {
    //end  phase
    gameScene.visible = 0;
    flashStage.visible = 0;
    gameOverScene.visible = 1;
    message.text = "Thank you!";
    button.interactive = false;
    button.buttonMode = false;
    button.visible = false;
    state = sendData;
}


function onButtonDown() {
    //start new phase
    this.isdown = true;
    this.texture = textureButtonDown;
    this.alpha = 1;
    whatPhase = whatPhase + 1;

    trialCounter = 0;
    totalScore = 0;
  //scoreMessage.text = totalScore.toString();
  //  startTime = performance.now() //reset startTimer for next phase
  //  prevDuration = 0;
    state = play;
}

function onButtonUp() {
    this.isdown = false;
    if (this.isOver) {
        this.texture = textureButtonOver;
    }
    else {
        this.texture = textureButton;
    }
}

function onButtonOver() {
    this.isOver = true;
    if (this.isdown) {
        return;
    }
    this.texture = textureButtonOver;
}

function onButtonOut() {
    this.isOver = false;
    if (this.isdown) {
        return;
    }
    this.texture = textureButton;
}

//sound
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

var displaycode = 0;
function end() {
  //gameScene.visible = false;
  //gameOverScene.visible = true;

    gameOverScene.visible = true;
    gameScene.visible = false;
    flashStage.visible = false;
    coin.visible = 0;
    coin2.visible = 0;

    //reset JSON string
    score = '"score":[';
    reward = '"rw":[';
    numflashleft = '"lflash":[';
    numflashright = '"rflash":['; 
    reactiontime = '"rt":[';
    choicetime = '"ct":[';
    choice = '"choice":[';
    flashtime = '"ft":[';
    leftBinRecord = '"lbin":[';
    rightBinRecord = '"rbin":[';
    if (displaycode == 0){
      var codetxt = String(user.toUpperCase())
      swal({title: "This is your code for MechTurk Survey",
        text: codetxt,
        width: '200px',});
      displaycode = 1;
    }
}

function contain(sprite, container) {
  let collision = undefined;
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }
  return collision;
}
function hitTestRectangle(r1, r2) {
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  hit = false;
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      hit = true;
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }
  return hit;
};
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

function addExplosionFrames() {
    // Add loading zeros to numbers below 10
    var pad = ( n ) => { return n > 9 ? n : '0' + n; };
    var i, url;

    // Rather than passing the result arround, we'll simple expose the array
    // of frame urls as a global
    for( var i = 1; i < 24; i++ ) {
      url = '../starwars/images/explosion/explosion_frame_' + pad( i ) + '.png';
      EXPLOSION_FRAMES.push( url );
    }
  }



function addLightSpeedFrames() {
    // Add loading zeros to numbers below 10
    var pad = ( n ) => { return n > 9 ? n : '0' + n; };
    var i, url;

    // Rather than passing the result arround, we'll simple expose the array
    // of frame urls as a global
    for( var i = 1; i < 23; i++ ) {
      url = '../starwars/images/lightspeed/light-speed-' + String(i) + '.png';
      LIGHTSPEED_FRAMES.push( url );
    }
  }




function getHC(){
      var params = 'lim=1';
      //var url =  'http://127.0.0.1:3000/eviaco'; //
      var url = 'https://coindm.herokuapp.com/eviaco';
      var xhr = createCORSRequest('GET', url + "?" + params);
      if (!xhr) {
         throw new Error('CORS not supported');
      }
      // xhr.open("POST", myUrl, true);
      //xhr.setRequestHeader('X-PINGOTHER', 'pingpong');
      xhr.onload = function() {
       var text = xhr.responseText;
       var obj = JSON.parse(text);
      // console.log(obj);
       console.log(obj.msg[0].hc);
       //targetScore.text = obj.msg[0].hc.toString();
       //targetScore.visible = 1;
      }
      xhr.send(null);
      state = play;
    }

function getCohort(){
      var params = 'lim=1';
      // var url =  'http://127.0.0.1:3000/eviaco';
      var url = 'https://coindm.herokuapp.com/eviaco';

      var xhr = createCORSRequest('GET', url + "?" + params);
      if (!xhr) {
           throw new Error('CORS not supported');
      }
      // xhr.open("POST", myUrl, true);
       //xhr.setRequestHeader('X-PINGOTHER', 'pingpong');
      xhr.onload = function(){ 
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
            //console.log("connected");
            //console.log(xhr.responseText);
            //var text = xhr.responseText;
            //var obj = JSON.parse(text);
            //cohort = (obj.msg.length)%2;
            //if (coinFlip(0.5)){
            //  trainPhase = [1,1,1,1,1,1,1,1,1,1,0]; //10-0
            //  cohort = 0;
            //}
            //else {
            //  trainPhase = [2,1,1,2,1,1,2,2,1,2,0]; //10-0, 9-1
            //  cohort = 1;
            //}

           // state = play;
          }
        }
      }
 
      xhr.send(null);
      state = play;
    }


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}
  

function sendData(){
  //remove ,
    score = score.substring(0,score.length - 1) + ']';
    reward = reward.substring(0,reward.length - 1) + ']';
    numflashleft = numflashleft.substring(0,numflashleft.length - 1) + ']';
    numflashright = numflashright.substring(0,numflashright.length - 1) + ']';
    reactiontime = reactiontime.substring(0,reactiontime.length - 1) + ']';
    //choicetime = choicetime.substring(0,choicetime.length - 1) + ']';
    choice = choice.substring(0,choice.length - 1) + ']';
    leftBinRecord = leftBinRecord.substring(0,leftBinRecord.length - 1) + ']';
    rightBinRecord = rightBinRecord.substring(0,rightBinRecord.length - 1) + ']';
    //flashtime = flashtime.substring(0,flashtime.length - 1) + ']';

  //create json
    var text = '{"username":' + '"' + user  +'"' + ',' +  '"hc":' +  totalScore  + ',' + score + ','  + reward + ',' +numflashleft + ',' + numflashright + ',' + reactiontime + ',' + choice + ',' + leftBinRecord + ',' + rightBinRecord + '}';

    var jsondata = JSON.parse(text);
    //console.log(jsondata);
    var data = JSON.stringify(jsondata);
    var url = '/eviaco';
    var xhr = createCORSRequest('POST', url);
       if (!xhr) {
         throw new Error('CORS not supported');
       }
    // xhr.open("POST", myUrl, true);
     //xhr.setRequestHeader('X-PINGOTHER', 'pingpong');

     xhr.setRequestHeader('Content-Type', 'application/json');
     
     xhr.onload = function() {
       var text = xhr.responseText;
       //console.log(text);
    //   var title = getTitle(text);
    //   alert('Response from CORS request to ' + url + ': ' + title);
     };

     xhr.onerror = function() {
       alert('Woops, there was an error making the request.');
     };
     xhr.send(data);

//     totalScore = 0;
   //  scoreMessage.text = totalScore.toString(); 

     state = getHighScore;
}

function getHighScore(){

 //get High Score
    var params = 'lim=1';
    var url = '/eviaco';
    var xhr = createCORSRequest('GET', url + "?" + params);
    if (!xhr) {
         throw new Error('CORS not supported');
    }
    // xhr.open("POST", myUrl, true);
     //xhr.setRequestHeader('X-PINGOTHER', 'pingpong');
    xhr.onload = function() {
       var text = xhr.responseText;
       var obj = JSON.parse(text);
      // console.log(obj);
      // console.log(obj.msg[0].hc);
       globalScoreMessage.text = "High Score " + obj.msg[0].hc.toString();
       targetScore.text = obj.msg[0].hc.toString();
       targetScore.visible = 1;
       yourScoreMessage.text = "Your Score " + totalScore.toString();
    //   var title = getTitle(text);
    //   alert('Response from CORS request to ' + url + ': ' + title);
    }
    xhr.send(null);
    state = end;
}