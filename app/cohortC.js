//This is a cohort where 200 trials are full task, no training trials
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
        width: 512,
        height: 512,
        antialiasing: true,
        transparent: false,
        resolution: 1
      }
   );
    var baseWidth = Math.floor(window.innerWidth);
    app.view.style.position = 'relative';
    app.view.style.left = Math.floor((baseWidth-512)/2)+'px';
    app.view.style.top = '0px'    
    document.body.appendChild(app.view);
    var flashStage = new PIXI.Container();

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
      .add("images/treasureHunter.json")
      .add("images/coin.png")
      .add("images/close.png")
      .add("images/dungeon2.png")
      .load(setup);
    let state, explorer, treasure, blobs, chimes, exit, player, dungeon,
    door, healthBar, message,scoreMessage, codeMessage, gameScene, gameOverScene, enemies, id;    //Define any variables used in more than one function

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
    var firstPick = 1;
    //probality of which side being the right choice
    var leftProb;
    var rightProb;
    var lbin;
    var rbin;


    var trainBinStartTimer = 0;
    var testBinStartTimer = 0;
    var leftBin = [];
    var rightBin = [];

    var endofBinTime = 0;
    //phase
    //train
    var trainPhase;
    var whatPhase = 2;
    var trialCounter;

    //data to send through json
    var cohort; //what training are u gonna get
    var user;
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
    var highscore;
    ////////////////////////////

    //button
    var left,right,up,down;
    var decide = 0;

    //sound
    var goodsound;
    var badsound;
    //The `setup` function will run when the loader has finished loading the image
    function setup() {
      user = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
      //prompt("Please enter your name", "Name");
      //console.log(user);
      //if (user == null || user == "") {
      //txt = "User cancelled the prompt.";
      //} else {
      //txt = "Hello " + user + "! How are you today?";
      //}
      var answer = 0;
      swal("Have you played or seen this game before?", {
        dangerMode: true,
        closeOnClickOutside: false,
      buttons: {
        No: {
            text: "No, I have not!",
            value: "no",
          },
        cancel: "Yes, I have",
        }
    })
    .then((value) => {
      switch (value) {
        case "no":
          answer = 0;
          user = user + '_' + answer
            swal("Awesome!", "Enjoy the game!", "success");
            break; 
        default:
          answer = 1;
          user = user + '_' + answer
            swal("Wow thanks for playing again. Have fun!");
        }
    });
      
      
      goodsound = new sound('coin.mp3');
      badsound = new sound('boo.mp3');

      trialCounter = 0;
      app.stage.addChild(flashStage);
      //Create the cat sprite and add it to the stage
      coin = new PIXI.Sprite(PIXI.loader.resources["images/coin.png"].texture);
      coin2 = new PIXI.Sprite(PIXI.loader.resources["images/coin.png"].texture);
      flashStage.addChild(coin);
      flashStage.addChild(coin2);
      //After everything is set up, start Smoothie by calling its `start`
      //method.
      coin.visible = 0;
      coin2.visible = 0;
      coin.x = 50;
      coin.y = 150;
      coin2.x = 300;
      coin2.y = 150;
      ///////////////////////////////////////
      gameScene = new Container();
      app.stage.addChild(gameScene);
      id = resources["images/treasureHunter.json"].textures;

      dungeon = new Sprite(id["dungeon.png"]);
      displacementSprite =  new PIXI.Sprite(PIXI.loader.resources["images/dungeon2.png"].texture);
      displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
      //displacementFilter.scale.set(1e4 + Math.random()*100);
      //displacementSprite.scale.set(0.4 + 0.6*Math.random());
    // add filter to container & stage (for waves effect on hover)
      gameScene.addChild(displacementSprite);
      //gameScene.filters = [displacementFilter];
      gameScene.addChild(dungeon);
       
       for (i = 0; i < 2; i++){
       doors[i] = new Sprite(id["door.png"]);
       if (i%2 == 0){
           doors[i].position.set(gameScene.width/2 - 80, 120);
       }
       else{
           doors[i].position.set(gameScene.width/2 + 80,120);
       }
       gameScene.addChild(doors[i]);
       }
      
      //Explorer
      explorer = new Sprite(id["explorer.png"]);
      explorer.x = gameScene.width/2;
      explorer.y = gameScene.height / 2 - explorer.height / 2 - 80;
      explorer.vx = 0;
      explorer.vy = 0;
      gameScene.addChild(explorer);
      
      //Treasure
      treasure = new Sprite(id["treasure.png"]);
      treasure.x = gameScene.width/2;
      treasure.y = gameScene.height / 2 - treasure.height - 120;
      gameScene.addChild(treasure);
      
      flashStage.visible = false;
      
                             
    //
      let scorestyle = new TextStyle({
        fontFamily: "Futura",
        fontSize: 30,
        fill: "white"
        });
       scoreMessage = new Text("0", scorestyle);
       scoreMessage.x = app.stage.width/2;
       scoreMessage.y = app.stage.height  - 470;
       gameScene.addChild(scoreMessage);
      let scorestyle2 = new TextStyle({
        fontFamily: "Futura",
        fontSize: 30,
        fill: "red"
        });
       targetScore = new Text("High Score", scorestyle2);
       targetScore.x = app.stage.width/2;
       targetScore.y = app.stage.height  - 90;
       gameScene.addChild(targetScore);
       targetScore.visible = 1;
      //Create Play Button
      // create some textures from an image path
      //quitButton = new PIXI.Sprite(PIXI.loader.resources["images/close.png"].texture);
      //quitButton.buttonMode = true;

     // quitButton.anchor.set(0.5);
     // quitButton.x = 100;
     // quitButton.y = 480;

          // make the button interactive...
     // quitButton.interactive = false;
     // quitButton.buttonMode = false;
     // quitButton.visible = 0

     // quitButton
              // Mouse & touch events are normalized into
              // the pointer* events for handling different
              // button events.
       //       .on('pointerdown', onQuitDown);

              // Use mouse-only events
              // .on('mousedown', onButtonDown)
              // .on('mouseup', onButtonUp)
              // .on('mouseupoutside', onButtonUp)
              // .on('mouseover', onButtonOver)
              // .on('mouseout', onButtonOut)

              // Use touch-only events
              // .on('touchstart', onButtonDown)
              // .on('touchend', onButtonUp)
              // .on('touchendoutside', onButtonUp)

          // add it to the stage
     // gameScene.addChild(quitButton);


     //Create the health bar
      healthBar = new Container();
      healthBar.position.set(app.stage.width/2 - 80, 20)
      gameScene.addChild(healthBar);

      //Create the black background rectangle
      let innerBar = new Graphics();
      innerBar.beginFill(0x000000);
      innerBar.drawRect(0, 0, 200, 8);
      innerBar.endFill();
      healthBar.addChild(innerBar);

      //Create the front red rectangle
      let outerBar = new Graphics();
      outerBar.beginFill(0xFF3300);
      outerBar.drawRect(0, 0, 200, 8);
      outerBar.endFill();
      healthBar.addChild(outerBar);

      healthBar.outer = outerBar;
      healthBar.outer.width = 0;

    //Create the `gameOver` scene
      gameOverScene = new Container();
      app.stage.addChild(gameOverScene);

      //Create Play Button
      // create some textures from an image path
      textureButton = PIXI.Texture.fromImage('https://dl.dropboxusercontent.com/s/mi2cibdajml8qj9/arrow_wait.png?dl=0');
      textureButtonDown = PIXI.Texture.fromImage('https://dl.dropboxusercontent.com/s/m0x11c91wazehyp/arrow_error.png?dl=0');
      textureButtonOver = PIXI.Texture.fromImage('https://dl.dropboxusercontent.com/s/1kuhddt8p9tr0k8/arrow_wait.png?dl=0');

      button = new PIXI.Sprite(textureButton);
      button.buttonMode = true;

      button.anchor.set(0.5);
      button.x = 250;
      button.y = 200;

          // make the button interactive...
      button.interactive = true;
      button.buttonMode = true;

      button
              // Mouse & touch events are normalized into
              // the pointer* events for handling different
              // button events.
              .on('pointerdown', onButtonDown)
              .on('pointerup', onButtonUp)
              .on('pointerupoutside', onButtonUp)
              .on('pointerover', onButtonOver)
              .on('pointerout', onButtonOut);

              // Use mouse-only events
              // .on('mousedown', onButtonDown)
              // .on('mouseup', onButtonUp)
              // .on('mouseupoutside', onButtonUp)
              // .on('mouseover', onButtonOver)
              // .on('mouseout', onButtonOut)

              // Use touch-only events
              // .on('touchstart', onButtonDown)
              // .on('touchend', onButtonUp)
              // .on('touchendoutside', onButtonUp)

          // add it to the stage
      gameOverScene.addChild(button);


       globalScoreMessage = new Text("High Score", scorestyle);
       globalScoreMessage.x = app.stage.width/3;
       globalScoreMessage.y = app.stage.height  - 100;
       gameOverScene.addChild(globalScoreMessage);

       yourScoreMessage = new Text("Your Score", scorestyle);
       yourScoreMessage.x = app.stage.width/3;
       yourScoreMessage.y = app.stage.height  - 150;
       gameOverScene.addChild(yourScoreMessage);
      // let blurs = new PIXI.filters.BlurFilter();

      // blurs.blur = 0;
      // TweenLite.to(blurs, 1.5, {blur:10, onComplete:blurin, ease: Power2.easeIn});
      // var blurin = function(){
      //   TweenLite.to(blurs, 1, {blur:0});
      // }
     // gameOverScene.addChild(button)
      //Make the `gameOver` scene invisible when the game first starts
      gameOverScene.visible = false;

      //Create the text sprite and add it to the `gameOver` scene
      let style = new TextStyle({
        fontFamily: "Futura",
        fontSize: 30,
        fill: "white"
      });
      
      
      message = new Text("The End!", style);
      message.x = 180;
      message.y = app.stage.height / 2 - 50;

      codeMessage = new Text("Code", style);
      codeMessage.x = 20;
      codeMessage.y = app.stage.height / 2 + 10 ;
      gameOverScene.addChild(message);

      gameOverScene.addChild(codeMessage);



      ///Control
      //Capture the keyboard arrow keys
      left = keyboard(37);
      up = keyboard(38);
      right = keyboard(39);
      down = keyboard(40);
       //Left arrow key `press` method
       left.press = function() {

         //Change the explorer's velocity when the key is pressed
         explorer.vx = -5;
         explorer.vy = 0;
       };

       //Left arrow key `release` method
       left.release = function() {

         //If the left arrow has been released, and the right arrow isn't down,
         //and the explorer isn't moving vertically:
         //Stop the explorer
         if (!right.isDown && explorer.vy === 0) {
           explorer.vx = 0;
         }
       };

       //Up
       up.press = function() {
         explorer.vy = -5;
         explorer.vx = 0;
       };
       up.release = function() {
         if (!down.isDown && explorer.vx === 0) {
           explorer.vy = 0;
         }
       };

       //Right
       right.press = function() {
         explorer.vx = 5;
         explorer.vy = 0;
       };
       right.release = function() {
         if (!left.isDown && explorer.vy === 0) {
           explorer.vx = 0;
         }
       };

       //Down
       down.press = function() {
         explorer.vy = 5;
         explorer.vx = 0;
       };
       down.release = function() {
         if (!up.isDown && explorer.vx === 0) {
           explorer.vy = 0;
         }
       };
      trainPhase = [1,1,1,1,1,1,1,1,1,1,0]; //10-0
      state = getHC;
      //state = getCohort;
      smoothie.start();
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
      // console.log(obj.msg[0].hc);
       targetScore.text = obj.msg[0].hc.toString();
       targetScore.visible = 1;
      }
      xhr.send(null);
      state = getCohort;
    }

    function getCohort(){
      var params = 'lim=1';
      //var url =  'http://127.0.0.1:3000/eviaco';
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
            if (coinFlip(0.5)){
              trainPhase = [1,1,1,1,1,1,1,1,1,1,0]; //10-0
              cohort = 0;
            }
            else {
              trainPhase = [2,1,1,2,1,1,2,2,1,2,0]; //10-0, 9-1
              cohort = 1;
            }

           // state = play;
          }
        }
      }
 
      xhr.send(null);
      state = play;
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
    

    var RT = 0; //reaction 
    var DT = 0; //decision
    var ST = 0; //start



    function coinFlip(prob) {
          return(Math.random() < prob) ? 1 : 0;
     }

    function gameLoop(delta){
     //Update the current game state:
     state(delta);
    }

    //play loop
    function play(delta){
        gameScene.visible= true;
        gameScene.alpha = 1;
        flashStage.visible = false;
        gameOverScene.visible = false;

        //use the explorer's velocity to make it move
        explorer.x += explorer.vx;
        explorer.y += explorer.vy;
        
        //Contain the explorer inside the area of the dungeon
        contain(explorer, {x: 28, y: 10, width: 488, height: 480});
         //contain(explorer, stage);
         
         //Set `explorerHit` to `false` before checking for a collision
        let explorerHit = false;

        if (hitTestRectangle(explorer, treasure)) {
          //If the treasure is touching the explorer, center it over the explorer
          treasure.x = explorer.x + 8;
          treasure.y = explorer.y + 8;
          if (firstPick){  //BEGIN FLASH STATE
              ST = performance.now(); //FIRST TIME TOUCH THE TREASURE
              if (whatPhase == 1){ //if deterministic training phase
              //50-50 chance of it being either left or right for training
                  leftProb = coinFlip(0.5);
                  rightProb = 1 - leftProb;

                  var num_a;
                  var num_b;
                  //number of flash on each side
                  switch(trainPhase[trialCounter]) {
                      case 1: //a vs b
                        // code block
                        num_a = 0;
                        num_b = 10;
                        break;
                      case 2: //a vs b
                        // code block
                        num_a = 1;
                        num_b = 9;
                        break;
                      case 3: //a vs b
                        // code block
                        num_a = 2;
                        num_b = 8;
                        break;
                  }
                  //pick 1 bins where u flash one side, and not the other
                  var bin1 = []; //1 random bin index
                  while(bin1.length < num_a){
                    var r = Math.floor(Math.random() * 10) + 1;
                    if(bin1.indexOf(r) === -1) bin1.push(r); //if value of r does not exist in bin, then we add it to the array!
                  }
                  //console.log(bin1)
                  var bin2 = []; //9 random bin
                  while(bin2.length < num_b){ //this makes it so that it has to fill the bin with all different bin number?
                    var r = Math.floor(Math.random() * 10) + 1;
                    if(bin2.indexOf(r) === -1) bin2.push(r);
                  }
                  //console.log(bin2)
                  if (leftProb > rightProb){
                    lbin = bin2;
                    rbin = bin1;
                    //lbin > rbin
                  }
                  else{
                    lbin = bin1;
                    rbin = bin2; 
                    //lbin < rbin
                  }
                  //start timer to see when flashes happen
                  trainBinStartTimer = performance.now();
                  state = train_flash;
              }
              else {
                    //Probabilistic Testing phase
                  if (coinFlip(0.75)){
                  //TRULY RANDOM
                      if (coinFlip(0.5)){ //toss coin to see which side will win, L or R
                        leftProb = 0.3;
                        rightProb = 0.7;
                      }
                      else{
                        leftProb = 0.7;
                        rightProb = 0.3;
                      }
                      //the probability of each side stay the same
                      testBinStartTimer = performance.now();
                      state = test_flash;
                  }
                  else{ //pre-selected
                      leftProb = coinFlip(0.5);
                      rightProb = 1 - leftProb;

                      var num_a;
                      var num_b;

                      //number of flash on each side
                      if (coinFlip(0.95)){
                        num_a = Math.floor(Math.random() * 9); //0 to 9 flashes
                        var f_diff = Math.floor(Math.random() * 2) + 1; //diff of 1,2,3 
                        num_b = num_a + f_diff; //add a + that diff
                      }
                      else{
                        if (coinFlip(0.5)){ //the extreme 9vs 9, 10vs 10, 0vs 1, 1 vs 0, 0 vs 0
                          var preset = [10,9,8,7];
                          num_a = preset[Math.floor(Math.random() * preset.length)];
                          num_b = preset[Math.floor(Math.random() * preset.length)];
                        }
                        else{
                          var preset = [0,1,2,3]; //add 3 if run again
                          num_a = preset[Math.floor(Math.random() * preset.length)];
                          num_b = preset[Math.floor(Math.random() * preset.length)];
                        }
                        
                      }

                  
                      //pick 1 bins where u flash 
                      var bin1 = []; //1 random bin index
                      while(bin1.length < num_a){
                          var r = Math.floor(Math.random() * 10) + 1;
                          if(bin1.indexOf(r) === -1) bin1.push(r); //if r is not in bin1 already, add r to bin 1
                          //console.log(bin1);
                      }
                  
                      var bin2 = []; //9 random bin
                      while(bin2.length < num_b){
                          var r = Math.floor(Math.random() * 10) + 1;
                          if(bin2.indexOf(r) === -1) bin2.push(r);
                         // console.log(bin2);
                      }

                      if (leftProb > rightProb){
                          lbin = bin2;
                          rbin = bin1;
                          //lbin > rbin
                        }
                      else{
                          lbin = bin1;
                          rbin = bin2; 
                    //lbin < rbin
                        }
                      trainBinStartTimer = performance.now();
                      state = train_flash; //flashes preselected 
                  }
              }
              
              firstPick = 0; //no longer first pick
              decide = 0; //not yet decide
          }
          else { //DECISION STATE
            if ((left.isDown || right.isDown || up.isDown || down.isDown) && (decide == 0)){
              //any key press at all...
                RT  = performance.now() - endofBinTime; //reaction time
              // console.log("decide");
                decide = 1;
            }
          }
        }
        
        if (hitTestRectangle(treasure, doors[0])) { //left door
            went_right = 0;
            DT = performance.now() - ST; //decision time
            if (chosenDoor == 0){
                    state = rightchoice;
            }
            else if (chosenDoor == 1) {
                    state = wrongchoice;
            }
            else {
                    state = rightchoice;
            }

        }
        if (hitTestRectangle(treasure,doors[1])) { //right door
            went_right = 1;
            DT = performance.now() - ST; //decision time

            if (chosenDoor == 1){
                    state = rightchoice;
            }
            else if (chosenDoor == 0) {
                    state = wrongchoice;
            }
            else {
                    state = rightchoice;
            }
        }
        //////////////////////////comment out the training phase//////////////////////////
        //if (whatPhase == 1){
        //  if (trialCounter == (trainPhase.length - 1)){
        //    whatPhase = 2;
        //  }
        //}
        //else {
          ///////cohort c uncomment to get rule change
          //if (trialCounter <= 100){
          //  rule = 0; //first rule: more flashes win
          //}
          //else{
          //  rule = 1; //rule switch
          //}
          if (trialCounter == 200){ //200 total
            gameScene.visible = 0;
            flashStage.visible = 0;
            gameOverScene.visible = 1;
            message.text = "Thank you!";
            codeMessage.text = "Your Code is " + user.toUpperCase();


            button.interactive = false;
            button.buttonMode = false;
            button.visible = false;
            state = sendData; //ends it all
          }
        //}
  }

  //training trial
  function train_flash(delta){
    gameScene.visible = true;
    gameScene.alpha = 0.5;
    flashStage.visible = true;
    gameOverScene.visible = false;
     //Use any physics or game logic code here
    coin.x = 110;
    coin.y = 150;
    coin2.x = 310;
    coin2.y = 150;
  //flash logic
    if (binCount % 1 == 0){ //every x bins we have 1 flash
      if (inBin){ //what to do in this bin
        if (lflash == 0){
          if(lbin.includes(binCount+1)){
            coin.visible = 1;
            lflash = 1;
            LeftFlash = LeftFlash + 1;
            leftBin.push(performance.now()-trainBinStartTimer);
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
          if(rbin.includes(binCount+1)){
            coin2.visible = 1;
            rflash = 1;
            RightFlash = RightFlash + 1;
            rightBin.push(performance.now()-trainBinStartTimer);
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
    }

  // count frame
    if (frameCount > 13){ // 13 frames total, so a bin is 20*13 = 260ms
        inBin = 0; //next bin
        binCount = binCount + 1;
        frameCount = 0;
        lflash = 0;
        rflash = 0;
        //console.log(binCount);
      }
    else {
        inBin = 1; //in the same bin
        frameCount = frameCount + 1;
      }
     
    if (binCount > 9){ //10 bin 13*260ms = 3s ish
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
              chosenDoor = 1;
            }
        }
        else if (LeftFlash < RightFlash){
          if (rule == 0){
              chosenDoor = 1;
          }
          else{
            chosenDoor = 0;
          }
        }
        else { //equal 
          chosenDoor = 2;
        }
        //LeftFlash = 0;
       // RightFlash = 0;
        state = play;
        coin.visible = 0;
        coin2.visible = 0;
        //console.log(leftBin);
        //console.log(rightBin);
        leftBinRecord = leftBinRecord + '{"array":' + JSON.stringify(leftBin) + '},';
        rightBinRecord = rightBinRecord + '{"array":' + JSON.stringify(rightBin) + '},'; 
        //empty the bin timer
        leftBin = [];
        rightBin = [];
        endofBinTime = performance.now();
    var FT = (endofBinTime - ST);
    flashtime = flashtime + '{"iter":' + FT + '},';
        //console.log(rightBinRecord);
      }
  }


  //Test trial
  function test_flash(delta) {
    gameScene.visible = true;
    gameScene.alpha = 0.5;
    flashStage.visible = true;
    gameOverScene.visible = false;

     //Use any physics or game logic code here
    coin.x = 110;
    coin.y = 150;
    coin2.x = 310;
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
            rightBin.push(performance.now() - testBinStartTimer);
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
     
    if (binCount > 9){ //10 bin 13*260ms = 3s ish
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
      state = play;
      coin.visible = 0;
      coin2.visible = 0;
      leftBinRecord = leftBinRecord + '{"array":' + JSON.stringify(leftBin) + '},';
      rightBinRecord = rightBinRecord + '{"array":' + JSON.stringify(rightBin) + '},'; 
    //console.log(leftBinRecord);
      //console.log(rightBinRecord);
      //reset the bin timer
      leftBin = [];
      rightBin = [];
      endofBinTime = performance.now();
    var FT = (endofBinTime - ST);
    flashtime = flashtime + '{"iter":' + FT + '},';
    }
    //You can change Smoothie's `fps` at any time, like this:
    //smoothie.fps = 1; //basically changing duration of flash
    //You can turn interpolation (animation smoothing) on or off at any
    //time using Smoothie's `interpolate` Boolean property, like this:
    //smoothie.interpolate = false;
  }


function wrongchoice(delta) {
    healthBar.outer.width += 1;
    decide = 0; //reset first decision
    firstPick = 1; //reset first hit

    
    explorer.x = gameScene.width/2;
    explorer.y = gameScene.height / 2 - explorer.height / 2 - 80;

    treasure.x = gameScene.width/2;
    treasure.y = gameScene.height / 2 - treasure.height - 120;
    trialCounter = trialCounter + 1;

    score = score + '{"iter":0},';

    numflashleft = numflashleft + '{"iter":' + LeftFlash + '},';
    numflashright = numflashright + '{"iter":' + RightFlash + '},';
    reactiontime = reactiontime + '{"iter":' + RT + '},';
    choicetime = choicetime + '{"iter":' + DT + '},';
    
    choice = choice + '{"iter":' + went_right + '},';

    //////////////unCOMMENT to CHANGE CONDITION
    //////////////////////////////////REAL REWARD instead of Probabilistic reward//////////////////////
    //if ((LeftFlash == 10 & RightFlash == 0) || (LeftFlash == 0 & RightFlash == 10) || (LeftFlash == 9 & RightFlash == 1) || (LeftFlash == 1 & RightFlash == 9)){
    //totalScore = totalScore;
    //reward = reward + '{"iter":0},';
    //}
    
  //////////////unCOMMENT to CHANGE CONDITION: random feedback
   // 
    if (coinFlip(0.5)){ //50% percent
        totalScore = totalScore;
        reward = reward + '{"iter":0},';
    }
    else { //50% prob reward correctly
        totalScore = totalScore + 100*(trialCounter+1);
        reward = reward + '{"iter":1},';
        goodsound.play();
    }
   // 
    scoreMessage.text = totalScore.toString();
    //reset
    LeftFlash = 0;
    RightFlash = 0;

    state = transition;
}

function rightchoice(delta) {
    healthBar.outer.width += 1;
    decide = 0; //reset first decision

    firstPick = 1; //reset first hit
    
    explorer.x = gameScene.width/2;
    explorer.y = gameScene.height / 2 - explorer.height / 2 - 80;
    treasure.x = gameScene.width/2;
    treasure.y = gameScene.height / 2 - treasure.height - 120;


  //////////////unCOMMENT to CHANGE CONDITION
    //if ((LeftFlash == 10 & RightFlash == 0) || (LeftFlash == 0 & RightFlash == 10) || (LeftFlash == 9 & RightFlash == 1) || (LeftFlash == 1 & RightFlash == 9)){
    //totalScore = totalScore + 100*(trialCounter+1);
    //reward = reward + '{"iter":1},';
    //goodsound.play();
    //}
    // else { //50% prob reward correctly
    if(coinFlip(0.5)){
        totalScore = totalScore;
        reward = reward + '{"iter":0},';
    }
    else {
        totalScore = totalScore +100*(trialCounter+1);
        reward = reward + '{"iter":1},';
        goodsound.play();
    }
   //}
    

    scoreMessage.text = totalScore.toString();
    trialCounter = trialCounter + 1;

    score = score + '{"iter":1},';
    numflashleft = numflashleft + '{"iter":' + LeftFlash + '},';
    numflashright = numflashright + '{"iter":' + RightFlash + '},';
    reactiontime = reactiontime + '{"iter":' + RT + '},';
    choicetime = choicetime + '{"iter":' + DT + '},';

    choice = choice + '{"iter":' + went_right + '},';
    //reset
    LeftFlash = 0;
    RightFlash = 0;

    state = transition;
}

function transition(){
  const that = this;
  let tl = new TimelineMax({onComplete:function() {that.animated = true;}});
  tl.to(displacementFilter.scale,1,{x:1,y:1}); 
  displacementFilter.scale.set(50);
  //displacementSprite.scale.set(10); 
  gameScene.filters = [displacementFilter];
  state = play;
}


function sendData(){
  //remove ,
    score = score.substring(0,score.length - 1) + ']';
    reward = reward.substring(0,reward.length - 1) + ']';
    numflashleft = numflashleft.substring(0,numflashleft.length - 1) + ']';
    numflashright = numflashright.substring(0,numflashright.length - 1) + ']';
    reactiontime = reactiontime.substring(0,reactiontime.length - 1) + ']';
    choicetime = choicetime.substring(0,choicetime.length - 1) + ']';
    choice = choice.substring(0,choice.length - 1) + ']';
    leftBinRecord = leftBinRecord.substring(0,leftBinRecord.length - 1) + ']';
    rightBinRecord = rightBinRecord.substring(0,rightBinRecord.length - 1) + ']';
    flashtime = flashtime.substring(0,flashtime.length - 1) + ']';

  //create json
    var text = '{"username":' + '"' + user + '_cohort' + cohort.toString() +'"' + ',' +  '"hc":' +  totalScore  + ',' + score + ','  + reward + ',' +numflashleft + ',' + numflashright + ',' + reactiontime + ',' + choice + ',' + choicetime + ',' + leftBinRecord + ',' + rightBinRecord + ',' + flashtime + '}';

    var jsondata = JSON.parse(text);
    //console.log(jsondata);
    var data = JSON.stringify(jsondata);
    var url = 'https://coindm.herokuapp.com/eviaco';
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
     scoreMessage.text = totalScore.toString(); 

     state = getHighScore;
}

function getHighScore(){

 //get High Score
    var params = 'lim=1';
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
var displaycode = 0;                        
function end(){
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
    scoreMessage.text = totalScore.toString();
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

function contain(sprite, container) {

    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }

    //Return the `collision` value
    return collision;
  }

  //The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {

        //There's definitely a collision happening
        hit = true;
      } else {

        //There's no collision on the y axis
        hit = false;
      }
    } else {

      //There's no collision on the x axis
      hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
  };


  //The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //The `keyboard` helper function
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
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
  
