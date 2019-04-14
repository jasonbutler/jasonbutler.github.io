//constructor
var HudSprite = function (game,callBack, callBackCTX) {
    console.log("HudSprite::__");
    Phaser.Sprite.call(this, game, null);
    this.game = game;
    this.game.add.existing(this);
    this.x = 0;
    this.y = this.game.height;
    this.anchor.y = 1;
    this.callbackSignal = new Phaser.Signal();
    this.callbackSignal.add(callBack, callBackCTX);


    var bg = this.game.spadd.image(0,0,"hud.png");
    bg.anchor.y = 1;
    this.addChild(bg);       

    var meterBG = new SPG.Util.Display.debugSprite(this.game, 306, -50, 350, 34, "#333333"); 
    this.addChild(meterBG);   
    this.goodMeter = new SPG.Util.Display.debugSprite(this.game, 306, -50, 350, 34, this.game.data.raw.colors.green);
    this.goodMeter.scale.x = 0;
    this.addChild(this.goodMeter);
    this.badMeter = new SPG.Util.Display.debugSprite(this.game, 656, -50, 350, 34, this.game.data.raw.colors.red);
    this.badMeter.anchor.x = 1;
    this.badMeter.scale.x = 0;
    this.addChild(this.badMeter);
    this.meter = this.game.spadd.image(303, -53,"gauge.png");
    this.addChild(this.meter);

    var potionMask = this.game.add.graphics(400,-78);
    potionMask.beginFill(0x000000,1);
    potionMask.drawRect(0,0,160,20);
    potionMask.endFill();
    this.addChild(potionMask);

    this.potionMeter = [];
    for(i = 0;i < 4;i++){
        var bott = this.game.spadd.image(420 + (40*i), -85, "whitePotion.png");
        bott.tint = 0x494F4D;
        bott.anchor.setTo(0.5);
        bott.scale.setTo(0.5);
        this.addChild(bott);
        
        var iconbg = new SPG.Util.Display.MakePanelImg(this.game,  30, 30,15, "#494F4D",420 + (40*i), -75);
        iconbg.anchor.setTo(0.5);
        this.addChild(iconbg);

        var icon = new SPG.Util.Display.MakePanelImg(this.game,  24, 24,12, "#FFFFFF",420 + (40*i), -75);
        icon.anchor.setTo(0.5);
        this.addChild(icon);
        icon.mask = potionMask;

        this.potionMeter.push(icon);

    }

    this.heartMeter = this.game.spadd.image(130,-56,"hearts.png");
    this.addChild(this.heartMeter);

    this.scoreText = this.game.add.text(820, -54,this.gameScore, {font:"36px hwt-artz", fill: "#ffffff"});
    this.addChild(this.scoreText);
    //this.scale.setTo(1)

};


//create object
HudSprite.prototype = Object.create(Phaser.Sprite.prototype);
HudSprite.prototype.constructor = HudSprite;

HudSprite.prototype.update = function () {
    this.scoreText.text = this.game.tracking.save.currentScore;
};

HudSprite.prototype.addData = function (goodData) {
    if(goodData){
        this.goodMeter.scale.x += 0.025;
        if(this.goodMeter.scale.x > 1){this.goodMeter.scale.x = 1;}
    }else{
        this.badMeter.scale.x += 0.025;
        if(this.badMeter.scale.x > 1){this.badMeter.scale.x = 1;}
    }

    if(this.goodMeter.scale.x + this.badMeter.scale.x >= 1){
        console.log("fullMeter!!");
        this.callbackSignal.dispatch(this.goodMeter.scale.x);    
    }
};

HudSprite.prototype.addPickup = function (idRef) {

    var phial = this.potionMeter[idRef];
    var cols = this.game.data.raw.ui.cols;
    phial.tint = cols[idRef];


    //show pickup
    var potionRing = this.game.add.graphics(phial.x,phial.y);
    potionRing.lineStyle(10,phial.tint,1);
    potionRing.drawCircle(0,0,100,100);
    this.addChild(potionRing);
    potionRing.scale.setTo(0.2);
    var growT = this.game.add.tween(potionRing.scale).to( { x:1.5,y:1.5 }, 1000, Phaser.Easing.Quadratic.Out, true);
    this.game.add.tween(potionRing).to( { alpha:0 }, 700, Phaser.Easing.Quadratic.Out, true,200);
    growT.onComplete.add(function(){potionRing.destroy();},this)
    



};

HudSprite.prototype.loseLife = function () {
    this.heartMeter.frame++;
};







//constructor
var IconButton = function (game, x, y, key,  callback, callbackContext, circular, onIcon, offIcon) {

    var radius = (circular)?30:game.data.get("ui.uiRadius")

    console.log(key)

    if (!game.cache.checkKey(Phaser.Cache.IMAGE, key)) {

        if(key === null){
            key = "default"
        }

        bmd = game.add.bitmapData(180, 55 * 4);
        bmd = SPG.Util.Display.RoundedRect(bmd, 0, 0, 60, 60, radius, game.data.get("colors.uiPrimary"));
        bmd = SPG.Util.Display.RoundedRect(bmd, 60, 0, 60, 60, radius, game.data.get("colors.uiHover"));
        bmd = SPG.Util.Display.RoundedRect(bmd, 120, 0, 60, 60, radius, game.data.get("colors.uiDown"));
        bmd = SPG.Util.Display.RoundedRect(bmd, 180, 0, 60, 60, radius, game.data.get("colors.uiDisabled"));
        
        game.cache.addSpriteSheet(key, "", bmd.canvas, 60, 60);
    }
    

    Phaser.Button.call(this, game, x, y, key, callback, callbackContext, 1, 0, 2, 0);
    this.input.useHandCursor = true;

    this.anchor.setTo(0.5);

    this.onIcon = "";
    this.offIcon = "";
    this.isAction = false;

    switch(key){
        case "home":
            this.onIcon = "\uf015";
            this.offIcon = "\uf015";
            this.isAction = true;
        break;
        case "pause":
            this.onIcon = "\uf04c";
            this.offIcon = "\uf04c";
        break;
        case "sound":
            this.onIcon = "\uf028";
            this.offIcon = "\uf026";
        break;
        case "music":
            this.onIcon = "\uf001";
            this.offIcon = "\uf001";
        break;
        case "info":
            this.onIcon = "\uf129";
            this.offIcon = "\uf129";
            this.isAction = true;
        break;
        case "help":
            this.onIcon = "\uf128";
            this.offIcon = "\uf128";
            this.isAction = true;
        break;
        case "close":
            this.onIcon = "\uf00d";
            this.offIcon = "\uf00d";
            this.isAction = true;
        break;
        case "restart":
            this.onIcon = "\uf0e2";
            this.offIcon = "\uf0e2";
            this.isAction = true;            
        break;
        default:
            this.onIcon =  onIcon;
            this.offIcon = offIcon;
        break;
    }
    this.label = new Phaser.Text(game, 00, 3, this.onIcon, game.data.get("fonts.iconFont"));

    //puts the label in the center of the button
    this.label.anchor.setTo(0.5);
    //this.label.smoothed = false; // removes any halfpixel smoothing on image.

    this.addChild(this.label);

    //set the text
    this.setLabel(this.onIcon);
    // this.buttonClickSound = game.add.audio('click1');


    //add listeners for animation handling
    this.events.onInputOver.add(this.hover, this);
    this.events.onInputOut.add(this.out, this);
    this.events.onInputDown.add(this.down, this);
    this.events.onInputUp.add(this.up, this);

    //init sounds

    //reset button hover styles
    this.out(this);

    //adds button to game
    game.add.existing(this);
};

//creat object
IconButton.prototype = Object.create(Phaser.Button.prototype);
IconButton.prototype.constructor = IconButton;

//properties
IconButton.prototype.label = null;
IconButton.prototype.positionY = null;
IconButton.prototype.style = null;
IconButton.prototype.hoverStyle = null;
//IconButton.prototype.buttonClickSound = null;

//custom event listeners
IconButton.prototype.up = function (button) {
    // this.label.setStyle(this.hoverStyle);
 };

IconButton.prototype.hover = function (button) {
    //this.label.setStyle(this.hoverStyle);
};
IconButton.prototype.out = function (button) {
    //this.label.setStyle(this.style);
};

IconButton.prototype.down = function (button) {
    this.game.audio.playSound("click", 0.2);
    if(!this.isAction){this.toggle();}
    
};

IconButton.prototype.toggle = function (button) {

    if(this.isOn){

        this.label.alpha = (this.offIcon === this.onIcon)?.4:1;
        this.setLabel(this.offIcon)
        this.isOn = false;
        
    }else{
        this.label.alpha = 1;
        this.setLabel(this.onIcon)
        this.isOn = true;
    }
 };



//custom functions
IconButton.prototype.setLabel = function (newLabel) {

    this.label.setText(newLabel);
};

//disable/enable with this toggler function
IconButton.prototype.setState = function (isEnabled) { 

    this.inputEnabled = isEnabled;
    this.frame = (isEnabled)? 1 : 3;
    this.label.alpha = (isEnabled)? 1 : .5;

};
//constructor
var LabelButton = function (game, x, y, key, label, callback,
    callbackContext, overFrame, outFrame, downFrame, upFrame, style, gameButton) {
    if (!game.cache.checkKey(Phaser.Cache.IMAGE, key)) {

        switch (key) {
            case "light":
                bmd = game.add.bitmapData(180, 55 * 3); //#F2F1F1 !important #ffffff 
                bmd = SPG.Util.Display.RoundedRect(bmd, 0, 0, 180, 55, 5, "#F2F1F1");

                bmd = SPG.Util.Display.RoundedRect(bmd, 0, 55, 180, 55, 5, "#ffffff");

                bmd = SPG.Util.Display.RoundedRect(bmd, 0, 110, 180, 55, 5, "#ffffff");

                this.style = game.data.get("fonts.lightButton");
                this.hoverStyle = game.data.get("fonts.lightButtonHover");
                break;
            default:
                //lets create a blank sprite
                bmd = game.add.bitmapData(180, 55 * 3);
                bmd = SPG.Util.Display.RoundedRect(bmd, 0, 0, 180, 55, 5, game.data.get("colors.uiPrimary"));

                bmd = SPG.Util.Display.RoundedRect(bmd, 0, 55, 180, 55, 5, game.data.get("colors.uiHover"));

                bmd = SPG.Util.Display.RoundedRect(bmd, 0, 110, 180, 55, 5, game.data.get("colors.uiHover"));
                this.style = game.data.get("fonts.button");
                this.hoverStyle = game.data.get("fonts.buttonHover");
                //this.game.add.sprite(0,0,"buttonSrpite.png")
                //game.cache.addSpriteSheet(key,'', bmd.canvas,174,62);

                break;
        }
        game.cache.addSpriteSheet(key, "", bmd.canvas, 174, 62);
    } else {
        switch (key) {
            case "light":
                this.style = game.data.get("fonts.lightButton");
                this.hoverStyle = game.data.get("fonts.lightButtonHover");
                break;
            default:
                this.style = game.data.get("fonts.buttonHover");
                this.hoverStyle = game.data.get("fonts.buttonHover");

                break;

        }
    }

    Phaser.Button.call(this, game, x, y, key, callback,
        callbackContext, overFrame, outFrame, downFrame,upFrame);

    // game.debugLog(this.game.data.get("textContent")[3]);


    this.anchor.setTo(0.5);
    this.label = new Phaser.Text(game, 0, 0, label, this.style);

    //puts the label in the center of the button
    this.label.anchor.setTo(0.5);
    //this.label.smoothed = false; // removes any halfpixel smoothing on image.

    this.addChild(this.label);

    //set the text
    this.setLabel(label);
    // this.buttonClickSound = game.add.audio('click1');


    //add listeners for animation handling
    this.events.onInputOver.add(this.over, this);
    this.events.onInputOut.add(this.out, this);
    this.events.onInputDown.add(this.down, this);
    this.events.onInputUp.add(this.up, this);

    //init sounds

    //reset button hover styles
    this.out(this);

    //adds button to game
    game.add.existing(this);
};

//creat object
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;

//properties
LabelButton.prototype.label = null;
LabelButton.prototype.positionY = null;
LabelButton.prototype.style = null;
LabelButton.prototype.hoverStyle = null;
//LabelButton.prototype.buttonClickSound = null;

//custom event listeners
LabelButton.prototype.over = function (button) {
    this.label.setStyle(this.hoverStyle);
};
LabelButton.prototype.out = function (button) {
    this.label.setStyle(this.style);
};

LabelButton.prototype.down = function (button) {
    this.game.audio.playSound("click", 0.2);
};

LabelButton.prototype.up = function (button) {
    this.label.setStyle(this.hoverStyle);
};

//custom functions
LabelButton.prototype.setLabel = function (newLabel) {

    this.label.setText(newLabel);

    while (this.label.width > this.width - 10) {
        this.label.fontSize--;
    }

    this.style.fontSize = this.label.fontSize;
    this.hoverStyle.fontSize = this.label.fontSize;


};
//constructor
var RadialTimerSprite = function (game, x, y, timerlength, colour, callBack, callBackCTX, warningColour,linewidth, radius) {
    console.log("RadialTimerSprite::__");
    Phaser.Sprite.call(this, game, null);
    this.game = game;
    this.game.add.existing(this);
    this.x = x;
    this.y = y;
    this.timerLength = timerlength;
    this.currentTime = 0;
    this.countDownTime = timerlength;
    this.ringColour = colour;
    this.linewidth = (linewidth)?linewidth:16;
    this.radius = (radius)?radius:18;
    this.showWarning = (warningColour)?true:false;
    this.warningColour = (this.showWarning)?warningColour:null;
    this.timerScaleValue = 1;

    this.callbackSignal = new Phaser.Signal();
    this.callbackSignal.add(callBack, callBackCTX);

    this.levelTimerBg = game.add.graphics(0,0);
    this.levelTimerBg.lineStyle(this.linewidth, 0xdad9d9);
    this.levelTimerBg.arc(0, 0, this.radius, this.game.math.degToRad(0), this.game.math.degToRad(365),false);

    this.levelTimerDisplay = game.add.graphics(0,0);
    this.levelTimerDisplay.lineStyle(this.linewidth, this.ringColour);
    this.levelTimerDisplay.arc(0, 0, this.radius, this.game.math.degToRad(0), this.game.math.degToRad(360),false);
    this.levelTimerDisplay.endFill();
    
    this.addChild(this.levelTimerBg);
    this.addChild(this.levelTimerDisplay);   
    this.angle = -90;
    //this.scale.setTo(1)

};


//create object
RadialTimerSprite.prototype = Object.create(Phaser.Sprite.prototype);
RadialTimerSprite.prototype.constructor = RadialTimerSprite;


RadialTimerSprite.prototype.startTimer = function () {
    this.levelTimer = this.game.time.create();
    this.levelTimer.loop(100,this.updateCountdownTimer,this);
    this.levelTimer.start();
};

RadialTimerSprite.prototype.stopTimer = function () {
    this.levelTimer.stop(false);
};

RadialTimerSprite.prototype.resumeTimer = function () {
    console.log("RESTART TIMER");
    this.levelTimer.start();
};

RadialTimerSprite.prototype.imposeTimePenalty = function (penalty) {
    this.currentTime += penalty;
};

RadialTimerSprite.prototype.resetTimer = function () {
    this.levelTimerDisplay.lineStyle(this.linewidth, this.ringColour);
    this.levelTimerDisplay.arc(0, 0, this.radius, this.game.math.degToRad(0), this.game.math.degToRad(360),false);
    this.levelTimerDisplay.endFill();
    this.currentTime = 0;
    this.countDownTime = this.timerLength;
    this.timerScaleValue = 1;
};

RadialTimerSprite.prototype.updateCountdownTimer = function () {
    this.currentTime += 0.1;
    this.countDownTime = (this.timerLength - this.currentTime).toFixed();
    this.timerScaleValue = (this.timerLength - this.currentTime)/this.timerLength;

    if(this.currentTime >= this.timerLength){
        this.levelTimer.stop();
        this.levelTimerDisplay.clear();
        this.countDownTime = this.timerScaleValue = 0;
        this.timesUp();
    }else{
        //console.log("tick",this.timerLength)
        var newVal = 360 * this.timerScaleValue;
        var col = (this.timerLength - this.currentTime <= 10 && this.showWarning)?this.warningColour:this.ringColour;
        this.levelTimerDisplay.clear();
        this.levelTimerDisplay.lineStyle(this.linewidth, col);
        this.levelTimerDisplay.arc(0, 0, this.radius, this.game.math.degToRad(0), this.game.math.degToRad(newVal),false);
        this.levelTimerDisplay.endFill();
       
    }
};

RadialTimerSprite.prototype.timesUp = function () {
    this.callbackSignal.dispatch();
    //this.destroy();
};








//constructor
var SettingsComponent = function (game, callBack, callBackCTX, callBack_2) {

    console.log("SettingsComponent::__");
    console.log(callBack);

    Phaser.Group.call(this, game, null);
    this.game = game;
    this.game.add.existing(this);
    this.gameJSON = this.game.data.get("settingsPageData");
    console.log(this.gameJSON);
    this.gameData = this.game.tracking.save;
    this.musicOn = this.gameData.musicOn;
    this.sfxOn = this.gameData.sfxOn;
    this.indexOffset = 0;

    this.callbackSignal = new Phaser.Signal();
    this.callbackSignal.add(callBack, callBackCTX);

    if (callBack_2) {
        this.callbackSignal_2 = new Phaser.Signal();
        this.callbackSignal_2.add(callBack_2, callBackCTX);
    } 

    this.settingsPanel = this.game.add.group();
    this.add(this.settingsPanel);

    var bgCover = SPG.Util.Display.MakePanelImg(this.game, this.game.width + 2, this.game.height + 2, 0, "#000000", -1, -1);
    bgCover.alpha = 0.9;

    bgCover.inputEnabled = true;
    this.settingsPanel.add(bgCover);

    this.createDisplay();
    this.game.audio.playSound("smallButton", 0.4);

};

//creat object
SettingsComponent.prototype = Object.create(Phaser.Group.prototype);
SettingsComponent.prototype.constructor = SettingsComponent;

SettingsComponent.prototype.createDisplay = function () {
    console.log("SettingsComponent::createDisplay");
    this.buttonGroup = this.game.add.group();
    this.settingsPanel.add(this.buttonGroup);

    this.closeButton = new IconButton(this.game, this.game.width-50, 50, "close", this.closeSettings, this, true);
    this.buttonGroup.add(this.closeButton);

    var title = this.game.add.text(this.game.world.centerX, 110, this.gameJSON.title, this.game.data.get("fonts.h2"));
    title.fill = "#FFFFFF";
    title.anchor.x = .5;
    this.settingsPanel.add(title);

    var xpos = [this.game.world.centerX - 60, this.game.world.centerX + 60, this.game.world.centerX - 60, this.game.world.centerX + 60,this.game.world.centerX - 60, this.game.world.centerX + 60,];
    var ypos = [210, 210, 320, 320, 430, 430];

    for (var i = this.indexOffset; i < 6; i++) {

        var button = new IconButton(this.game, xpos[i], ypos[i], this.gameJSON.buttons[i].icon, this.buttonHandler, this, true);
        button.refNum = i;

        if (i === 2) {
            button.isOn = (this.sfxOn) ? true : false;
        } else if (i === 3) {
            button.isOn = (this.musicOn) ? true : false;
        }

        var label = this.game.add.text(0, 45, this.gameJSON.buttons[i].label, this.game.data.get("fonts.levelNumber"));
        label.fill = "#FFFFFF";
        label.fontSize = 16;
        label.anchor.setTo(0.5);
        button.addChild(label);

        button.inputEnabled = true;
        button.events.onInputDown.add(this.buttonHandler, this);

        this.buttonGroup.add(button);
    }

    this.game.add.tween(this.settingsPanel).from({
        alpha: 0
    }, 300, Phaser.Easing.Quadratic.Out, true);

};


SettingsComponent.prototype.closeSettings = function () {

    this.callbackSignal.dispatch();
    this.destroy();

};

SettingsComponent.prototype.buttonHandler = function (button) {
    this.game.audio.playSound("smallButton", 0.4);

    switch (button.refNum) {
        case 0:
            this.showHome();
            break;
        case 1:
            this.restartLevel();
            break;
        case 2:
            this.toggleSound(button);
            break;
        case 3:
            this.toggleMusic(button);
            break;
        case 4:
            this.showTandC();
            break;
        case 5:
            this.showHelp();
            break;
    }
};

SettingsComponent.prototype.showHome = function () {
    this.game.popup.launch("two_button_popup", this.closePopup, this, this.returnToMenu);
};

SettingsComponent.prototype.restartLevel = function () {    
    this.callbackSignal_2.dispatch();
    this.destroy();
    
};

SettingsComponent.prototype.returnToMenu = function () {
    this.game.audio.stopMusic();      
    this.game.navigateToStateByName("DebugState");
    this.destroy();
};

SettingsComponent.prototype.toggleSound = function (button) {

    this.sfxOn = (!this.sfxOn) ? true : false;

    if (!this.sfxOn) {
        this.game.audio.stopAllSounds();
    }

    this.gameData.sfxOn = this.sfxOn;
    this.game.tracking.saveData();
    this.game.audio.playSound("smallButton", 0.4);
};

SettingsComponent.prototype.toggleMusic = function (button) {
    this.musicOn = (!this.musicOn) ? true : false;

    if (!this.musicOn) {
        this.game.audio.stopMusic();
    } else {
        this.game.audio.restartMusic();
    }

    this.gameData.musicOn = this.musicOn;
    this.game.tracking.saveData();
};

SettingsComponent.prototype.showHelp = function () {
    this.buttonGroup.setAll("inputEnabled", false);
    this.game.popup.launch("test_popup", this.closePopup, this);
};

SettingsComponent.prototype.showTandC = function () {
    this.buttonGroup.setAll("inputEnabled", false);
    this.game.popup.launch("test_popup", this.closePopup, this);
};

SettingsComponent.prototype.closePopup = function () {
    this.buttonGroup.setAll("inputEnabled", true);

};
//constructor
var SliderComponent = function (game, x, y, length, handleSize, numSteps, isVertical, isRounded, context) {
    console.log("SliderComponent::__");
    Phaser.Sprite.call(this, game, null);
    this.game = game;
    this.game.add.existing(this);
    this.x = x;
    this.y = y;

    var trackSize = handleSize/2;
    var trackPadding = trackSize/2;

    //set end of track to be rounded or not
    var radius = (isRounded)?trackPadding:0;

    //set bounds of draggable handle
    var bgCover = SPG.Util.Display.MakePanelImg(this.game, length, handleSize, 0, this.game.data.get("colors.uiPrimary"), -trackSize, -trackSize);
    bgCover.alpha = 0.1;
    this.addChild(bgCover);

    //create track sat at offset to account for half width of handle at each end
    this.sliderTrack = SPG.Util.Display.MakePanelImg(this.game, length - handleSize, trackSize, radius, this.game.data.get("colors.uiHover"), 0, -trackPadding);
    this.addChild(this.sliderTrack);

    //create handle at size specifiied in handleSize
    this.handleSprite = SPG.Util.Display.MakePanelImg(this.game, handleSize,handleSize, trackSize, this.game.data.get("colors.uiPrimary"), 0, 0);
    this.handleSprite.inputEnabled = true;
    this.handleSprite.input.enableDrag();
    this.handleSprite.input.boundsRect = bgCover;
    this.handleSprite.anchor.setTo(.5);
    this.addChild(this.handleSprite);

    //TODO set steps on track if required (currently breaks - goes off the end)
    // if(numSteps > 0){
    //     var gridscale = length / numSteps;
    //     this.handleSprite.input.enableSnap(gridscale,handleSize, true);
    // }
    
    
    
};

//creat object
SliderComponent.prototype = Object.create(Phaser.Sprite.prototype);
SliderComponent.prototype.constructor = SliderComponent;

//properties
SliderComponent.prototype.label = null;
SliderComponent.prototype.positionY = null;
SliderComponent.prototype.style = null;
SliderComponent.prototype.hoverStyle = null;
//SliderComponent.prototype.buttonClickSound = null;



//constructor
var TextButton = function (game, x, y, key, label,  callback,
    callbackContext, style) {

    
    if (!game.cache.checkKey(Phaser.Cache.IMAGE, key)) {

        
              //lets create a blank sprite
        bmd = game.add.bitmapData(200, 60 * 4);
        bmd = SPG.Util.Display.RoundedRect(bmd, 0, 0, 200, 60, game.data.get("ui.uiRadius"), game.data.get("colors.uiWhite"));
        bmd = SPG.Util.Display.RoundedRect(bmd, 0, 60, 200, 60, game.data.get("ui.uiRadius"), game.data.get("colors.uiHover"));
        bmd = SPG.Util.Display.RoundedRect(bmd, 0, 120, 200, 60, game.data.get("ui.uiRadius"), game.data.get("colors.uiWhite"));
        bmd = SPG.Util.Display.RoundedRect(bmd, 0, 180, 200, 60, game.data.get("ui.uiRadius"), game.data.get("colors.uiWhite"));
        this.style = game.data.get("fonts.button");
        this.hoverStyle = game.data.get("fonts.buttonHover");
        
        game.cache.addSpriteSheet(key, "", bmd.canvas, 200, 60);
    } else {
        switch (key) {
            case "black":
                this.style = { font: "24px hwt-artz", fill: "#333333", align: "center" };
                this.hoverStyle = { font: "24px hwt-artz", fill: "#333333", align: "center" };
                break;
            default:
                this.style  = { font: "24px hwt-artz", fill: "#ffffff", align: "center" };
                this.hoverStyle = { font: "24px hwt-artz", fill: "#ffffff", align: "center" };

                break;

        }
    }

    Phaser.Button.call(this, game, x, y, key, callback,
        callbackContext, 1, 0, 2, 0);
    this.input.useHandCursor = true;

    // game.debugLog(this.game.data.get("textContent")[3]);


    this.anchor.setTo(0.5);
    var buttLbl = SPG.Util.Display.spaceOutText(label);
    this.label = new Phaser.Text(game, 0, 3, buttLbl, this.style);

    //puts the label in the center of the button
    this.label.anchor.setTo(0.5);
    //this.label.smoothed = false; // removes any halfpixel smoothing on image.

    this.addChild(this.label);

    //set the text
    this.setLabel(label);
    // this.buttonClickSound = game.add.audio('click1');


    //add listeners for animation handling
    this.events.onInputOver.add(this.over, this);
    this.events.onInputOut.add(this.out, this);
    this.events.onInputDown.add(this.down, this);
    this.events.onInputUp.add(this.up, this);

    //init sounds

    //reset button hover styles
    this.out(this);

    //adds button to game
    game.add.existing(this);
};

//creat object
TextButton.prototype = Object.create(Phaser.Button.prototype);
TextButton.prototype.constructor = TextButton;

//properties
TextButton.prototype.label = null;
TextButton.prototype.positionY = null;
TextButton.prototype.style = null;
TextButton.prototype.hoverStyle = null;
//TextButton.prototype.buttonClickSound = null;

//custom event listeners
TextButton.prototype.over = function (button) {
    //this.label.setStyle(this.hoverStyle);
};
TextButton.prototype.out = function (button) {
    //this.label.setStyle(this.style);
};

TextButton.prototype.down = function (button) {
    this.game.audio.playSound("click", 0.2);
};

TextButton.prototype.up = function (button) {
    //this.label.setStyle(this.hoverStyle);
};

//custom functions
TextButton.prototype.setLabel = function (newLabel) {

    this.label.setText(newLabel);

    while (this.label.width > this.width - 10) {
        this.label.fontSize--;
    }

    this.style.fontSize = this.label.fontSize;
    this.hoverStyle.fontSize = this.label.fontSize;
};

//disable/enable with this toggler function
TextButton.prototype.setState = function (isEnabled) { 

    this.inputEnabled = isEnabled;
    this.frame = (isEnabled)? 1 : 3;
    this.label.alpha = (isEnabled)? 1 : 0.5;

};
var SPG = SPG || {};
SPG.DataController = {};

SPG.DataController = function (game) {

	this.game = game; //save reference to the game
	this.raw = new SPG.DefaultGameSettings();
	this.vars = [];
	this.save = JSON.parse(JSON.stringify(this.raw.game_model));

	this.vars["onMobile"] = (game.device.desktop) ? false : true;


	/* some cleaning up of the data model */






	if ($("html").hasClass("non-latin")) {
		for (var font in this.raw.fonts) {
			this.raw.fonts[font].font = "Arial";
		}

	}


	return this;

};

SPG.DataController.prototype = {};
SPG.DataController.prototype.constructor = SPG.DataController;

SPG.DataController.prototype.get = function (key, clone) {
	shouldClone = clone || true;


	obb = this.raw;

	if (key !== undefined) {
		parts = key.split(".");
		for (var i = 0; i < parts.length; i++) {
			obb = obb[parts[i]];

			if (obb === undefined) {
				var errObj = parts.length = i;
				//console.warn("game.data.get, tried to request key of: " + key + " but failed at getting: " + errObj.join("."));
				return "";
			}
		};
	}


	if (obb === undefined) {
		console.warn("game.data.get, key of: " + key + " is not set");
		return "";
	}

	return (shouldClone) ? JSON.parse(JSON.stringify(obb)) : obb;


};

SPG.DataController.prototype.onload = function () {

};


SPG.DataController.prototype.set = function (key, value) {

};

SPG.DataController.prototype.setVar = function (key, value) {
	return this.vars[key] = value;
};
SPG.DataController.prototype.getVar = function (key) {
	return this.vars[key];
};

SPG.DataController.prototype.format = function (stringIn) {
	var string = stringIn;
	//console.log("INITIAL POPUP STRING: "+string)
	for (var key in this.vars) {
		//search for each game varible in string
		var found = 0;

		while (found != -1) {
			if (this.vars.hasOwnProperty(key)) {
				found = string.indexOf("$" + key + "$");
				if (found != -1) {
					string = string.replace("$" + key + "$", this.vars[key]);
				}
			}
		}
	}
	return string;
};



SPG.DataController.prototype.raw = null;
SPG.DataController.vars = null;
var SPG = SPG || {};
SPG.HTMLPopupController = {};

//draw a rounded corner rectangle
SPG.HTMLPopupController = function(game){

	this.game = game; //save reference to the game
    this.templates = {};
    this.clickEvent = (this.game.device.desktop)? "click" : "touchstart" ;
	

   //this.game.scale.onSizeChange.add(this.resize);
   this.game.scale.onFullScreenChange.add(this.resize);
  $(window).on( "resize", function(){
    setTimeout(this.resize,100);
  }.bind(this));

   return this;


   

};

SPG.HTMLPopupController.prototype = {};
SPG.HTMLPopupController.prototype.constructor = SPG.HTMLPopupController;

SPG.HTMLPopupController.prototype.launch = function(popupRef,callback,callbackContext,callback_2){


  console.log("POPUP LAUNCHED: ", popupRef, callback);
  // if(callback){
  //   callback.call(callbackContext);
  // }

  // return;

	this.game.popupLaunched = true;
  this.twoButtonPopup = false;

  if(callback !== undefined){
    this.callback = callback;
     this.callbackCTX = callbackContext;
    } else {
      this.callback = null;
    }

  if(callback_2){
      this.callback_2 = callback_2;
      this.callbackCTX = callbackContext;
      this.twoButtonPopup = true;

  } else {
      this.callback_2 = null;
  }

    popups = this.game.data.get("htmlpopups");
    console.log(popups);

   for (var i = 0; i < popups.length; i++){
    if(popups[i].id == popupRef){
        this.data = popups[i];
        console.log(this.data);
        break;
      }
   }

   template = Handlebars.compile($("#popup-template").html());



   /*
  {
  id: string,
  buttonLabel:string,
  pages : Array --
      [
      {
        title: string
        body: html
        pageStyle: string
        image: string (filepath from assets\images\ including file extension)
        icon:   string (filepath from assets\images\ including file extension)
        backgroundImage:  string (filepath from assets\images\ including file extension)
        backgroundColor: string (Hexcode including hash e.g. "#ff0000")
        video: string (filepath from assets\video\ including file extension)
      }
      ]
  }
   */

   //do we need pages?
   if(this.data.pages.length > 1){
      this.currentPage = 0;
      this.totalPages = this.data.pages.length;
      this.data.showPageNavigation = true;


   }


   this.data.twoButtonPopup = this.twoButtonPopup;


   if((!this.game.device.desktop)){
        this.data.mobile = true;
   }


   //process pages
   for (var i = 0; i < this.data.pages.length; i++) {

      //add any classes
      p = this.data.pages[i];
      p.class = "template-"+p.pageStyle;


      //add any inline styles
      if(p.backgroundColor || p.backgroundImage){
        p.style = "background: ";
        p.style = (p.backgroundColor)? p.style+p.backgroundColor+" ": p.style;
        p.style = (p.backgroundImage)? p.style+ "url('assets/images/"+p.backgroundImage+"')": p.style;
        p.style = p.style+ ";";

      }


      if(p.title !== undefined && p.title.indexOf("$" !== -1)){
        p.title = this.game.data.format(p.title);
        //p.title.
      }

      if(p.body !== undefined && p.body.indexOf("$" !== -1)){
        p.body = this.game.data.format(p.body);
        //p.title.
      }


      if(p.vidUrl !== undefined){
        SPG.Util.ShowHTML5Video(this.game,"assets/video/"+p.vidUrl,0,0,this.game.width,this.game.height, this.closeVideo, this, p.title, p.body, "assets/video/"+p.poster, "assets/video/transcripts/"+p.subsUrl);

        console.log("assets/video/transcripts/"+p.subsUrl);
        return;
      }

      this.game.audio.playSound("popupOpen",0.1);

    

   }





   //create template
   var html = template(this.data);
   $("body").append(html);

   this.resize();

   //setup the close button callback
   $(".closeButton").html(this.data.pages[this.data.pages.length - 1].button);
   $(".closeButton").on(this.clickEvent, $.proxy(this.closePopup, this));
   if(this.twoButtonPopup){$(".closeButton").addClass("leftButton");}
   $(".altButton").html(this.data.pages[this.data.pages.length - 1].altButton);
   $(".altButton").on(this.clickEvent, $.proxy(this.closePopupAlt, this));





   if(this.data.pages.length > 1){

     //setup next and pre button finctionallity
     $(".overlay-wrapper .nextButton").on(this.clickEvent, $.proxy(this.nextPage, this));
     $(".overlay-wrapper .prevButton").on(this.clickEvent, $.proxy(this.prevPage, this));
    
    //setup pip click functionalllity
     $(".pagePip").on(this.clickEvent, $.proxy(this.pipClick, this));


     //mobile specific navigation.
     if((!this.game.device.desktop)){
      var hammertime = new Hammer($(".pages")[0]);
      hammertime.on("swiperight", $.proxy(this.prevPage, this));
      hammertime.on("swipeleft", $.proxy(this.nextPage, this));
    }
  }

  //show the popup   
   $(".popup").addClass("show");

};

SPG.HTMLPopupController.prototype.resize = function() {
  console.log("resize");
   //lets get the phaser canvas size and scale our popup accordingly
   w = $("canvas")[0].style.width;
   wn = w.substring(0, w.length - 2);

   h = $("canvas")[0].style.height;
   hn = h.substring(0, h.length - 2);

   var widthr =parseInt(wn) / this.game.width;
   var heightr =parseInt(hn) / this.game.height;

   //get the best fit.
   zoom = Math.min(widthr,heightr);


   if(document.fullscreen || document.webkitIsFullScreen){
     console.log("is fullscreen");
       $(".overlay-wrapper").css({"transform": "scale(" + zoom + ")","top": "inherit","left": "auto", "margin-top" : (-1 * zoom * $("canvas")[0].height)});
   } else {
       $(".overlay-wrapper").css({"transform": "scale(" + zoom + ")","top": $("canvas")[0].style.marginTop,"left": $("canvas")[0].style.marginLeft});

   }

   //set the scale and top / left offset based on the phasers scaleManger.
   
};

SPG.HTMLPopupController.prototype.closeVideo = function() {
    this.game.popupLaunched = false;
    if(this.callback != null){
       this.callback.call(this.callbackCTX);
     }

};
SPG.HTMLPopupController.prototype.closePopup = function() {
  $(".overlay-wrapper .nextButton").addClass("hidden");
  $(".overlay-wrapper .prevButton").addClass("hidden");

  $(".closeButton").off(this.clickEvent, $.proxy(this.closePopup, this));
  $(".altButton").off(this.clickEvent, $.proxy(this.closePopupAlt, this));

  //$('.overlay-wrapper .closeButton').removeClass("show");
  this.game.popupLaunched = false;

  $(".popup").removeClass("show");
  setTimeout($.proxy(function() {
    $(".overlay-wrapper").remove();
    if(this.callback != null){
       this.callback.call(this.callbackCTX);
     }
  },this), 500);
 this.game.audio.playSound("click", 0.4);

};

SPG.HTMLPopupController.prototype.closePopupAlt = function() {
  this.game.popupLaunched = false;
  $(".closeButton").off(this.clickEvent, $.proxy(this.closePopup, this));
  $(".altButton").off(this.clickEvent, $.proxy(this.closePopupAlt, this));

  $(".popup").removeClass("show");

  setTimeout($.proxy(function() {
    $(".overlay-wrapper").remove();
    if(this.callback_2 != null){
      this.callback_2.call(this.callbackCTX);
    }
  },this), 500);

  this.game.audio.playSound("click", 0.6);
};

SPG.HTMLPopupController.prototype.nextPage = function() {
  if(this.currentPage >= this.totalPages-1){ return; }
  this.currentPage ++;
  this.navigateToPage();
};

SPG.HTMLPopupController.prototype.prevPage = function() {
  if(this.currentPage <= 0){ return; }

  this.currentPage --;
    this.navigateToPage();

};

SPG.HTMLPopupController.prototype.navigateToPage = function(page) {

  if(page !== undefined){
    this.currentPage = parseInt(page);
  }
  //show the desired page
  $(".popup .pages .page").removeClass("active");
  $(".popup .pages .page:nth-child("+(this.currentPage+1)+")").addClass("active");
  this.game.audio.playSound("smallButton",.3);

    //show / hide next button / close button
    if(this.currentPage < this.totalPages-1){
      $(".overlay-wrapper .nextButton").removeClass("hidden");
      //show close button
      $(".closeButton").removeClass("show");
      if(this.twoButtonPopup){$(".altButton").removeClass("show");}
      $(".navigation ul").addClass("show");

    } else {
      $(".overlay-wrapper .nextButton").addClass("hidden");
      //hide close button
      $(".closeButton").addClass("show");
      if(this.twoButtonPopup){$(".altButton").addClass("show");}
      $(".navigation ul").removeClass("show");


    }

    //show prev button
    if(this.currentPage == 0){
    $(".overlay-wrapper .prevButton").addClass("hidden");

    } else {
    $(".overlay-wrapper .prevButton").removeClass("hidden");

    }


  this.updatePips();

};
SPG.HTMLPopupController.prototype.updatePips = function() {
    $(".pagePip").removeClass("active");
    $(".pagePip[data-page='"+this.currentPage+"']").addClass("active");
};


SPG.HTMLPopupController.prototype.pipClick = function(ref){
  this.navigateToPage($(ref.currentTarget).attr("data-page"));

  //console.log();
};

SPG.HTMLPopupController.prototype.showVideoPopup = function(popRef){

};

SPG.HTMLPopupController.prototype.killPopup = function(){
    if(this.popUP != null){

    }        
};

SPG.HTMLPopupController.prototype.killBg = function(){
	this.bg.destroy();
    this.bg = null;
	
};

SPG.HTMLPopupController.prototype.callback = null;
SPG.HTMLPopupController.prototype.callback_2 = null;
SPG.HTMLPopupController.prototype.callbackCTX = null;
SPG.HTMLPopupController.prototype.data = null;
SPG.HTMLPopupController.prototype.currentPage = null;
SPG.HTMLPopupController.prototype.totalPages = null;
SPG.HTMLPopupController.prototype.templates = null;
SPG.HTMLPopupController.prototype.popUP = null;
SPG.HTMLPopupController.prototype.popupLaunched = null;
SPG.HTMLPopupController.prototype.game =null;
SPG.HTMLPopupController.prototype.bg = null;
SPG.HTMLPopupController.prototype.currentPopupType = null;

var SPG = SPG || {};
SPG.SoundController = {};

//draw a rounded corner rectangle
SPG.SoundController = function (game) {

	this.game = game; //save reference to the game
	this.playingSounds = [];

	return this;

};

SPG.SoundController.prototype = {};
SPG.SoundController.prototype.constructor = SPG.SoundController;


SPG.SoundController.prototype.playSound = function (id, vol, loop) {
	//console.log("play sound:" + id);
	// console.log(this.playingSounds)
	if (!this.game.tracking.save.sfxOn) {
		return;
	}

	// for (var i = this.playingSounds.length - 1; i >= 0; i--) {
	// 	// console.log(this.playingSounds[i].key);
	// 	if(this.playingSounds[i].key == id){

	// 		console.log("sound already playing")
	// 		//this.playingSounds[i].play();
	// 		//return;
	// 	}
	// }

	loop = loop || false;
	vol = vol || this.sfxVolume;

	var sound = this.game.add.audio(id);
	sound.onStop.add(this.endSoundPlayback, this);
	sound.volume = vol;


	this.playingSounds.push(sound);


	if (loop) {
		sound.loopFull();
	} else {
		sound.play();
		//console.log("sound playing? : " + sound.isPlaying)
	}
	return sound;

};

SPG.SoundController.prototype.playMusic = function (id, vol, loop) {



	
	if (this.currentMusic && this.currentMusic.key === id && this.game.tracking.save.musicOn) {
		console.log("music: ", this.currentMusic, ", key: ", this.currentMusic.key, ", music on: ", this.game.tracking.save.musicOn);
		console.log("Previous volume: " + this.previousVolume);
		this.currentMusic.volume = this.previousVolume;
	}




	console.log("PLAY MUSIC CALLED", id, vol);
	console.log(this.currentMusic);

	if (this.currentMusic) {
		this.currentMusic.stop();
		this.currentMusic.destroy();
		this.currentMusic = null;
	}

	loop = loop || false;

	if (vol === undefined) {
		vol = this.musicVolume;
	}

	this.previousVolume = vol;
	
	if (!this.game.tracking.save.musicOn) {
		
		vol = 0;
	}

	var music = this.game.add.audio(id);
	this.currentMusic = music;
	music.volume = vol;

	if (loop) {
		music.loopFull();
	} else {
		music.play();
	}



};

SPG.SoundController.prototype.stopMusic = function () {
	if (this.currentMusic) {
		this.currentMusic.volume = 0;
	}
};
SPG.SoundController.prototype.restartMusic = function () {
	console.log("RESTART MUSIC", this.currentMusic, this.previousVolume);
	if (this.currentMusic) {
		this.currentMusic.volume = this.previousVolume;
	}
};


SPG.SoundController.prototype.setSoundVolume = function (vol) {
	console.log("soundController::setSoundVolume: " + vol);


};

SPG.SoundController.prototype.setMusicVolume = function (vol) {
	console.log("soundController::setMusicVolume: " + vol);

};

SPG.SoundController.prototype.stopAllSounds = function () {


	console.log("soundController::stopAllSounds: ");
	try {
		for (var i = this.playingSounds.length - 1; i >= 0; i--) {
			this.playingSounds[i].stop();
			this.playingSounds.splice(i, 1);
		}
	} catch (e) {
		console.log("error in sound controller" + e);
	}

};

SPG.SoundController.prototype.endSoundPlayback = function (sound) {

	for (var i = this.playingSounds.length - 1; i >= 0; i--) {
		if (sound.key == this.playingSounds[i].key) {
			//remove the sound for all playing sounds
			//console.log("finsished playing sound:"+sound.key);
			this.playingSounds.splice(i, 1);
		}

	};

	//console.log("soundController::endSoundCallback: ", sound);

};

SPG.SoundController.prototype.musicVolume = 0.5;
SPG.SoundController.prototype.sfxVolume = 1;



SPG.SoundController.prototype.playingSounds = null;
SPG.SoundController.prototype.currentMusic = null;

SPG.SoundController.prototype.game = null;
SPG.SpongeFactory = function (game) {

    Phaser.GameObjectFactory.call(this, game);
    console.log("booting sponge factory");
    
};


SPG.SpongeFactory.prototype = Object.create(Phaser.GameObjectFactory.prototype);

SPG.SpongeFactory.prototype.constructor = SPG.SpongeFactory;

SPG.SpongeFactory.prototype.image = function(x,y,asset){


    if(this.getAtlas(asset) !== false){
        //adding image from atlas
        return Phaser.GameObjectFactory.prototype.image.call(this,x,y,this.getAtlas(asset),asset);
    } else if(this.game.cache.checkKey(Phaser.Cache.IMAGE, asset)){
        //add from image
        return Phaser.GameObjectFactory.prototype.image.call(this,x,y,asset);
    } else {
        //not found.
        console.log("assets: "+asset+" not found in cache");
        return false;    
    }

};



SPG.SpongeFactory.prototype.sprite = function(x,y,asset){
    if(this.getAtlas(asset) !== false){
        //add sprite from atlas
        return Phaser.GameObjectFactory.prototype.sprite.call(this,x,y,this.getAtlas(asset),asset);
    } else if(this.game.cache.checkKey(Phaser.Cache.IMAGE, asset)){
        //add it from standalone image
        return Phaser.GameObjectFactory.prototype.sprite.call(this,x,y,asset);
    } else {
        //cannot be found.
        console.log("assets: "+asset+" not found in cache");
        return false;
    }

};


SPG.SpongeFactory.prototype.getAtlas = function(key){
    keys = this.game.cache.getKeys();
    for (var i = 0; i < keys.length; i++) {
        if(this.game.cache.getFrameByName(keys[i], key) !== null){
            return keys[i];
        }
    }
    return false;
};


var SPG = SPG || {};
SPG.StateAnimation = {};


//simple function to animate out objects, items are bounced out the top (faded on gamestate), then the next state is loaded
SPG.StateAnimation.Out = function(game, nextState, instant){

    if(instant){
        game.state.start("preloadState",true,false,nextState);
    }

    if(typeof easing === "undefined"){
        easing = this.DefaultEaseOut;

    } 

    if(typeof toProperties === "undefined"){
        toProperties = {alpha:0};

    }

    wiper = game.add.graphics(0,0);
    wiper.beginFill(SPG.Util.Math.hextocolor(game.data.get("colors").stage)); //stage color
    wiper.drawRect(0,0,game.world.width,game.world.height);
    wiper.endFill();
    tween = game.add.tween(wiper).from({alpha:0},300, easing, true);

        //  for (var i = game.world.children.length - 1; i >= 0; i--) {
        //     tween = game.add.tween(game.world.children[i]).to(toProperties,500, easing, true);
        // }

    //call next state after 1 second
    game.time.events.add(300, function(){
        game.state.start("preloadState",true,false,nextState);
        //game.state.start(nextState, true);
        tween = game.add.tween(wiper).to({alpha:0},300, easing, true);
        tween.onComplete.add(function(){wiper.clear();}, this);
    }, this);
};


//animate in on all game object (simple fade used for in)
SPG.StateAnimation.In = function(game, easing, toProperties){

    if(typeof easing === "undefined"){
        easing = this.DefaultEaseIn;
    }

     if(typeof toProperties === "undefined"){
        toProperties = {alpha:1};
    }

    for (var i = game.world.children.length - 1; i >= 0; i--) {
        if(game.world.children[i].alpha > 0.2){
            game.world.children[i].alpha = 0;
            tween = game.add.tween(game.world.children[i]).to(toProperties,300, easing, true);
        }
    }
};

SPG.StateAnimation.DefaultEaseOut = Phaser.Easing.Linear.None;
SPG.StateAnimation.DefaultEaseIn = Phaser.Easing.Linear.None;
var SPG = SPG || {};
SPG.TrackingController = {};

SPG.TrackingController = function(game,saveModel, adapt){

	this.game = game;
	this.save = saveModel;

	// work out tracking mode
	if(adapt !== null){
		this.mode = "ADAPT";
		this.adaptModel = adapt.model;
		this.adaptView = adapt;
	} else if(this.checkForScorm()){
		this.mode = "SCORM";
	} else {
		this.mode = "OFFLINESTORAGE";
	}

	console.log("user tracking set-up with: "+ this.mode);

	this.restoreData();
};


SPG.TrackingController.prototype = {};
SPG.TrackingController.prototype.constructor = SPG.TrackingController;


SPG.TrackingController.prototype.game = null;
SPG.TrackingController.prototype.mode = null;
SPG.TrackingController.prototype.adaptView = null;
SPG.TrackingController.prototype.adaptModel = null;
SPG.TrackingController.prototype.scorm = null;
SPG.TrackingController.prototype.save = null;



SPG.TrackingController.prototype.complete = function(score) {


	console.warn("Module being marked as complete, with score", score);

	if(this.mode === "ADAPT"){
		adaptStore = new Array(1);
		adaptStore[0] = "I have Been completed";
		this.adaptModel.set("_userAnswer", adaptStore);
		this.adaptView.closeGame();
		return;
	}

	if(this.mode === "SCORM"){

		if(score){
			try{
				this.scorm.set("cmi.core.score.raw", score);
			} catch(e){ console.warn("error reporting cmi.core.score.raw");}

			try{			
				this.scorm.set("cmi.score.scaled", score/100);
			} catch(e){ console.warn("error reporting cmi.score.scaled");}
			

			console.warn("setting scorm score, congratulations!", score );
		}

		try {
		this.scorm.set("cmi.core.lesson_status", "passed");
	} catch(e){ console.warn("error reporting cmi.core.lesson_status");}


		try {
		this.scorm.set("cmi.completion_status", "completed");
	} catch(e){ console.warn("error reporting cmi.completion_status");}


	SPG.Util.Data.track("passed", score);

	try {
		this.scorm.save();
	} catch(e){ console.warn("error saving scorm data");}

		return;
	}
	
	console.log("game complete but not connected to any tracking system");
	
};


SPG.TrackingController.prototype.checkForScorm = function(){
	//do we have access to pipworks? and can we connect to scorm
	
	if(window.pipwerks){
		this.scorm = pipwerks.SCORM;
		if(this.scorm.init()){
			console.log("Connected to SCORM");
			return true;
		}
	}
	return false;
};



SPG.TrackingController.prototype.restoreData = function(){

	var loadedModel;
	switch(this.mode){

		case "SCORM":
			var scormraw = this.scorm.get("cmi.suspend_data");
			if(scormraw === undefined || scormraw === ""){
				loadedModel = undefined;
			} else {
				loadedModel = JSON.parse(scormraw);				
			}		
		break;

		case "OFFLINESTORAGE":
			var offlineraw = localStorage.getItem(this.save.saveID);
			if(offlineraw === undefined || offlineraw === ""){
				loadedModel = undefined;
			} else {
				loadedModel = JSON.parse(offlineraw);			
			}	
			
		break;

		default:
			console.log("unknown tracking system");
			return false;
			break;
	};


	//check our loaded data is for te correct version
	if(loadedModel  === null || loadedModel  === undefined ||  loadedModel.version != this.save.version || !this.save.saveEnabled)
	 	{
	 		
	 		console.log("re-creating save data.");
			this.saveData();	    
		
		}else{
		
			this.save = loadedModel;
		
		}

		console.log(loadedModel);
};



SPG.TrackingController.prototype.saveData = function(){

	var localData = JSON.stringify(this.save);
	console.log("SAVE DATA CALLED");

	if(this.mode === "OFFLINESTORAGE"){
		//not scorm use local stoage
    	localStorage.setItem(this.save.saveID, localData);
    	console.log("OFFLINE SUSPEND DATA UPDATED");
	} else if (this.mode === "SCORM") {
		//is scorm use that shit
		 this.scorm.set("cmi.suspend_data", localData);  
		 console.log("SCORM SUSPEND DATA UPDATED");
		 this.scorm.save();
	} 
	//checks for completion?
	console.log("SAVE DATA DONE? ", localData);
       
};

SPG.TrackingController.prototype.getComplete = function () {
		if(this.adaptModel == null){
			this.debugLog("not connected to adapt, so can not get completed value");
			return false;
 		}

 		if (this.adaptModel.get("_isVisible")) {
          return this.adaptModel.get("_isComplete");
        } else {
          return false;
        }

};


// a helper function to set the Adapt component if the game to complete.
SPG.TrackingController.prototype.setComplete = function() {
	this.debugLog("setting game as complete");

	if(this.adaptModel == null){
		this.debugLog("adapt model not set, skipping complete function");
		return;
	}
	// thins functionallity was taken from the AdaptModel.js class, so it may need to be updated here in the future.
    if (this.adaptModel.get("_isVisible")) {
        this.adaptModel.set("_isComplete", true);
        this.adaptModel.set("_isInteractionComplete", true);
    }
};

SPG.TrackingController.prototype.focusAdapt = function() {
	console.log("focus adapt");
};

SPG.TrackingController.prototype.setQuestionBank = function(){
	var allQs = [];
    for(var i = 0;i < this.game.data.raw.questionData.length;i++){
        allQs.push(i);
    }

    for(var j = 0;j < this.save.totalLevels;j++){
        var randomSelection = this.game.rnd.integerInRange(0,allQs.length-1);
        //console.log(allQs);
        this.save.questionBank.push(allQs[randomSelection]);
        allQs.splice(randomSelection,1);
        //console.log(this.game.tracking.save.questionBank);
    }
	
};

SPG.TrackingController.prototype.clearDataModel = function(){
	//do we have access to pipworks? and can we connect to scorm
	this.save.currentScore = 0;
	this.save.currentLevel = 0;
	this.save.correctAnswers = 0,
    this.save.totalLevels = this.game.data.raw.maximumQs;
    this.save.gameLevel = 0;
    this.save.questionBank = [];
	this.save.goodDataCollected = [];	
};
var SPG = SPG || {};

SPG.DefaultGameSettings = {};
SPG.DefaultGameSettings = function () {};

SPG.DefaultGameSettings.prototype = {

	//settings that are re
	game: {
		consoleIntroText: "_______ - SORTED!", // this is what is shown in the console when the game is loaded. leave blank for no message.
		consoleDisclaimer: "", // this is what is shown in the console when the game is loaded. leave blank for no message.
		developmentMode: true, //in development mode console logs are shown and other development features are enabled, when off DRM features will be enabled.
		allowLargerThanGameSize: true // should allow the game to be larger than that of its designed siz
	},


	colors: {
		stage: "#4f4bb3",
		green: "#bcc43d",
		red: "#E5405A",
		skyBlue: "#a9dddb",
		loadBG: "#4f4bb3",
		uiPrimary: "#ED3A58",
		uiBlack: "#000000",
		uiWhite: "#FFFFFF",
		uiHover: "#999999",
		uiDown: "#990000",
		uiDisabled: "#666666",
		redTint:0xED3A58,
		greenTint:0xbcc43d,
		blueTint:0xA8DDDA
	},

	ui:{
		uiRadius: 30,
		cols:[0xeb3b58,0xffcc00,0x0066ff,0x33cc33]
	},

	states: [
		
		
		{
			id: "BadcoreGameState",
			atlases: [],
			audio: [],
			spritesheets: [],
			inAnimation: "default",
			outAnimation: "default"
		},
		{
			id: "DebugState",
			atlases: [],
			audio: [],
			spritesheets: [],
			inAnimation: "default",
			outAnimation: "default"
		},
		{
			id: "TemplateState",
			atlases: [],
			audio: [],
			spritesheets: [],
			inAnimation: "default",
			outAnimation: "default"
		},
		
		


	],

	fonts: {
		h1: {
			font: "alergiaBlack",
			fontSize: 46,
			fill: "#ffffff",
			align: "left",
			fontWeight: "700",
			wordWrap: true,
			wordWrapWidth: 360
		},
		h2: {
			font: "alergiaBlack",
			fontSize: 36,
			fill: "#ffffff",
			align: "left",
			fontWeight: "700",
			wordWrap: true,
			wordWrapWidth: 360
		},
		h3: {
			font: "alergiaBlack",
			fontSize: 30,
			fill: "#0066CB",
			align: "left",
			fontWeight: "700",
			wordWrap: true,
			wordWrapWidth: 360
		},
		h3Hack: {
			font: "Arial",
			fontSize: 32,
			fill: "#990000",
			align: "center",
			fontWeight: "400",
			wordWrap: true,
			wordWrapWidth: 440
		},
		h3HackGreen: {
			font: "Arial",
			fontSize: 32,
			fill: "#009900",
			align: "center",
			fontWeight: "700",
			wordWrap: true,
			wordWrapWidth: 440
		},
		quizTitle: {
			font: "Arial",
			fontSize: 28,
			fill: "#FFFFFF",
			align: "center",
			fontWeight: "700",
			wordWrap: true,
			wordWrapWidth: 800
		},
		quizQuestion: {
			font: "Arial",
			fontSize: 20,
			fill: "#525252",
			align: "center",
			fontWeight: "400",
			wordWrap: true,
			wordWrapWidth: 820
		},
		quizAnswer: {
			font: "Arial",
			fontSize: 18,
			fill: "#FFFFFF",
			align: "center",
			wordWrap: true,
			wordWrapWidth: 440
		},
		quizFeedback: {
			font: "Arial",
			fontSize: 22,
			fill: "#000000",
			align: "center",
			fontWeight: "400",
			wordWrap: true,
			wordWrapWidth: 700
		},
		h4: {
			font: "alergiaBlack",
			fontSize: 24,
			fill: "#ffffff",
			align: "center",
			fontWeight: "700",
			wordWrap: true,
			wordWrapWidth: 360
		},
		button: {
			font: "alergiaBlack",
			fontSize: 16,
			fill: "#000000",
			align: "center",
			fontWeight: "400"
		},
		buttonHover: {
			font: "alergiaBlack",
			fontSize: 16,
			fill: "#FFFFFF",
			align: "left",
			fontWeight: "400"
		},
		lightButton: {
			font: "alergiaBlack",
			fontSize: 16,
			fill: "#007cb0",
			align: "center",
			fontWeight: "400"
		},
		lightButtonHover: {
			font: "alergiaBlack",
			fontSize: 16,
			fill: "#007cb0",
			align: "left",
			fontWeight: "400"
		},
		DebugText: {
			font: "Arial",
			fontSize: 12,
			fill: "#fff",
			align: "left",
			fontWeight: "400"
		},
		body: {
			font: "Arial",
			fontSize: 18,
			fill: "#FFFFFF",
			align: "left",
			fontWeight: "500"
		},
		bodyBold: {
			font: "alergiaBlack",
			fontSize: 18,
			fill: "#FFFFFF",
			align: "left",
			fontWeight: "700"
		},
		regText: {
			font: "Arial",
			fontSize: 14,
			fill: "#353184",
			align: "center",
			fontWeight: "700",
			wordWrap: true,
			wordWrapWidth: 360
		},

		iconFont: {
			font: "fontawesome",
			fontSize: 40,
			fill: "#FFFFFF",
			align: "center",
			fontWeight: 400

		}
	},


	//game model can be any object but this is what we want to store in offlinedata / scorm suspend data,
	//so only store infomation that can change (and minimal other, for data that wont change use custom data objects like the example_object below.).
	game_model: {
		saveID: "mcgd_SaveData", // this is used to determine the reference when saving to offline storage.
		version: "0.3", //used to tell if the game model susspend data should be cleared / updated..
		saveEnabled: true, //if true this means that the games save model will always be re-initilised on page / game load.
		musicOn: true,
		sfxOn: true,
		playerType: 0,
		questionBank: [],
		currentScore: 0,
		correctAnswers: 0,
		goodDataCollected:[],
		currentLevel: 0,
		totalLevels: 12,
		gameLevel: 0,
		potions:[0,0,0,0],
		scrollScore:0
	}, // end game model.

	//these assets are availble throughout the game , for assets that are used only in specific state, please add the to the states object at the top of this class.
	assets: {
		audio: {
			types: ["m4a", "ogg", "mp3" ], //the types of audio files to load, this also dictates this load order.
			assets: ["click", "correct_answer", "error", "positive"] //filename without extension - this will be generated from the above types.
		},
		atlases: [], // this means the png will be atlas0.png and the json file will be atlas0.json
		spritesheets: [
			{
				file: "hearts.png",
				frameWidth: 120,
				frameHeight: 40,
				totalFrames: 4,
				isPersistent: true
			},
			
		],
		images: ["particle.png", "frog.png","nextButton.png","resbg.png","incorrect-fbtext.png","correct-fbtext.png","qboard.png","submitBtn.png","pickWoman.png","pickMan.png","pickWiz.png","splashlogo.png","whitePotion.png","rightTree.png","leftTree.png",//"mockup.png" TODO- move these into an atlas.

		], //these files will be loaded and the keys set to the actual filenames, this is to speed up the atlasing processes.
		videos: [
			//"sponge-video.mp4"
			//"guyshout.mp4"
		],
		tilesets: [
			//"testTiles.json"
		]


	} // end assets


};
var SPG = SPG || {};

// 	                            
// 	                            
// 	  #### ##  ## #### #######  
// 	   ##  ### ##  ##    ###    
// 	   ##  ######  ##    ###    
// 	   ##  ## ###  ##    ###    
// 	  #### ##  ## ####   ###    
// 	  


/**
 * Represents a Sponge version of a phaser game, this includes extra tools like utils, data and tracking tools .
 * @constructor
 * @param {number} width - designed width of the game.
 * @param {number} height - designed height of the game.
 * @param {number} renderer - The rendering type for this game, see Phaser.AUTO, Phaser.CANVAS, Phaser.WEBGL.
 * @param {string} parent - this dom elelements container's ID value.
 * @param {object} adaptModel - if loaded from adapt, this will be the _gameSetting found in the component's JSON.
 */
SPG.SPGame = function (width, height, renderer, parent, adaptModel) {

	//just convert undefined to null.
	this.adaptModel = adaptModel || null;


	// call our constuctor for phaser.
	// null is the starting state - we handle this ourselves
	// false loads the phaser game in an opaque mode
	// true enables antialiasing.

	Phaser.Game.call(this, width, height, renderer, parent, null, false, true);

	// this.stats = new Stats();
	// document.body.appendChild(this.stats.dom);

	//lets get our data controller loaded as quickly as possible as this contains setting to related to how the game loads.
	this.data = new SPG.DataController(this);

	var introText = this.data.get("game.consoleIntroText");
	//console log a little intro (TODO - taylor to client, this could also act as another DRM deterrant.)

	try {
		var colour_args = [
			"%c %c %c %c " + introText + " %c %c %c ",
			"font-size: 12px; background: #5b55d1;",
			"font-size: 15px; background: #4f4aba;",
			"font-size: 17px; background: #4540a5;",
			"color: #FFF; font-size: 18px; background: #353184;",
			"font-size: 17px; background: #4540a5;",
			"font-size: 15px; background: #4f4aba;",
			"font-size: 12px; background: #5b55d1;"
		];

		console.log.apply(console, colour_args);

		//if the console doesnt support AJ style S
	} catch (e) {
		if (window.console.info) {
			console.info(introText);
		} else {
			console.log(introText);
		}
	}

	console.log(this.data.get("game.consoleDisclaimer"));

	//let load to see if we are running in development mode.
	this.developmentMode = this.data.get("game.developmentMode");

	// if not just don't show any of our logs, in future please use warns or errors for vital logging that will be needed in production version.
	if (!this.developmentMode) {
		console.log = function () {
			return;
		};

		window.addEventListener("error", function (e) {
			SPG.Util.Data.track("JSError", e.message + " " + e.filename + " " + e.lineno);
		}.bind(this));


	} else if (!this.device.desktop) {
		//alert errors for mobile devices.
		this.mobile = true;
		console.error = function () {
			alert(JSON.stringify(arguments));
		};
	}

	//add boot state this state is allways required.
	this.state.add("bootState", eval("SPG.bootState")); //TODO: please drop these evals.
	this.state.add("preloadState", eval("SPG.preloadState"));

	//add custom states
	var addedStates = [];
	for (var i = this.data.raw.states.length - 1; i >= 0; i--) {
		//only add the state if its not been added currently
		if (addedStates.indexOf(this.data.raw.states[i]) == -1) {
			// find the class name
			this.state.add(this.data.raw.states[i].id, eval("SPG." + this.data.raw.states[i].id));
			//add it to the states
			addedStates.push(this.data.raw.states[i].id);
		}

	}

	//boot up the game - boot state handles preloading, so we always want to run this
	this.state.start("bootState");

	this.state.onStateChange.add(this.stateChange, this);
	// $("body").on("contextmenu", "canvas", function(e){ return false; });
};




//extend the Phaser game class and set constructor
SPG.SPGame.prototype = Object.create(Phaser.Game.prototype);
SPG.SPGame.prototype.constructor = SPG.SPGame;

// 	 #####   ####  ##  ## ####### ######   ####  ##      ##      ####### ######   ######  
// 	##   ## ##  ## ### ##   ###   ##   ## ##  ## ##      ##      ##      ##   ## ##       
// 	##      ##  ## ######   ###   ######  ##  ## ##      ##      #####   ######   #####   
// 	##   ## ##  ## ## ###   ###   ## ##   ##  ## ##      ##      ##      ## ##        ##  
// 	 #####   ####  ##  ##   ###   ##  ##   ####  ####### ####### ####### ##  ##  ######   


SPG.SPGame.prototype.audio = null;
SPG.SPGame.prototype.popup = null;
SPG.SPGame.prototype.data = null;
SPG.SPGame.prototype.tracking = null;
SPG.SPGame.prototype.spadd = null;

// 	                                                                                                                     
// 	######  ##   ##     ###  ###### ####### ######     ####  ##  ## ####### ######  ###### #### ######  #######  ######  
// 	##   ## ##   ##    #### ##      ##      ##   ##   ##  ## ##  ## ##      ##   ## ##   ## ##  ##   ## ##      ##       
// 	######  #######   ## ##  #####  #####   ######    ##  ## ##  ## #####   ######  ######  ##  ##   ## #####    #####   
// 	##      ##   ##  ##  ##      ## ##      ## ##     ##  ##  ####  ##      ## ##   ## ##   ##  ##   ## ##           ##  
// 	##      ##   ## ## #### ######  ####### ##  ##     ####    ##   ####### ##  ##  ##  ## #### ######  ####### ######   
// 	                                                                                                                     

//boot is when the game first loads
SPG.SPGame.prototype.boot = function () {

	//initilise any controllers
	this.audio = new SPG.SoundController(this);
	this.tracking = new SPG.TrackingController(this, this.data.save, this.adaptModel);

	//boot phaser
	Phaser.Game.prototype.boot.call(this);

	//our popup controller.
	this.popup = new SPG.HTMLPopupController(this);

	//add our sponge factory.
	this.spadd = new SPG.SpongeFactory(this);

};

// SPG.SPGame.prototype.log = function(message, ) //TODO custom logo function.

//update is called every frame
SPG.SPGame.prototype.update = function (dt) {

	// this.stats.begin();
	Phaser.Game.prototype.update.call(this, dt);
	// this.stats.end();


	if (this.developmentMode && this.input.keyboard.isDown(Phaser.KeyCode.S) && this.input.keyboard.isDown(Phaser.KeyCode.P)) {
		this.navigateToStateByName("DebugState");
	}

};


// 	                                                                                                       
// 	 ###### #######   ### ####### #######  ####### ##  ## ##  ##  ##### ####### #### ####  ##  ##  ######  
// 	##        ###    ####   ###   ##       ##      ##  ## ### ## ##   ##  ###    ## ##  ## ### ## ##       
// 	 #####    ###   ## ##   ###   #####    #####   ##  ## ###### ##       ###    ## ##  ## ######  #####   
// 	     ##   ###  ##  ##   ###   ##       ##      ##  ## ## ### ##   ##  ###    ## ##  ## ## ###      ##  
// 	######    ### ## ####   ###   #######  ##       ####  ##  ##  #####   ###   #### ####  ##  ## ######   
// 


SPG.SPGame.prototype.stateChange = function () {

};
//this is a function that will step to the next state (actually jjust launches the first as we projects are a lot less linear.), 
SPG.SPGame.prototype.nextState = function () {
	if (this.tracking.mode === "ADAPT") {
		var targetState = this.tracking.adaptModel.get("_startState");
		if (targetState !== undefined) {
			console.log("LOADING SPECIFIC STATE FROM ADAPT: " + targetState);
			SPG.StateAnimation.Out(this, targetState);
			return;
		}
	}

	SPG.StateAnimation.Out(this, this.data.raw.states[0].id);
};


//navigates to a specific state by name - this is used quite a bit so will leave this here.
SPG.SPGame.prototype.navigateToStateByName = function (stateName, instant) {
	var inst = instant || false;
	SPG.Util.Data.track("stateChangeTo", stateName);
	SPG.StateAnimation.Out(this, stateName, inst);
};

//restarts the game
SPG.SPGame.prototype.restartGame = function () {
	this.nextState();
};


//ends game and notifiys adapt
SPG.SPGame.prototype.endGame = function () {
	this.tracking.endGame();
};

// 	######  ####### ######  ##  ##  ######  
// 	##   ## ##      ##   ## ##  ## ##       
// 	##   ## #####   ######  ##  ## ## ###   
// 	##   ## ##      ##   ## ##  ## ##   ##  
// 	######  ####### ######   ####   #####   
// 	                                        
SPG.SPGame.prototype.developmentMode = true;



SPG.SPGame.prototype.debugKeyRelease = function () {
	console.log("DEBUG STATE");
	this.navigateToStateByName("DebugState");
};
// template state
var SPG = SPG || {};

SPG.BadcoreGameState = function (){
    Phaser.State.call(this);
};
    
SPG.BadcoreGameState.prototype = Object.create(Phaser.State.prototype);
SPG.BadcoreGameState.prototype.constructor = SPG.BadcoreGameState;

SPG.BadcoreGameState.prototype.preload = function(){
	//preload here
	
	//how to load an image (and check it exisits first)
	//if(!this.game.cache.checkKey(Phaser.Cache.IMAGE,key)){
	//this.game.load.image(key,url);
	//}

};

SPG.BadcoreGameState.prototype.shutdown = function(){
    //called at end of state (switching away) this is where you should destroy all the object you have initilised.
    //this.somthing.destroy(); this.somthing = null;   

    //remove stuff form cache.
    //this.game.cache.removeImage(key);
    
    

};

SPG.BadcoreGameState.prototype.showSettings = function(){
};

SPG.BadcoreGameState.prototype.closeSettings = function(){
    this.pauseBtn.inputEnabled = true;
}


SPG.BadcoreGameState.prototype.init = function(){
    //called at game init

};

SPG.BadcoreGameState.prototype.create = function(){
    //called at start of state (after preload)
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 200;
    this.game.stage.backgroundColor = 0x000000;
    this.waveCount = 0;
    this.bombsAway = false;

    this.counterNum = this.game.add.text(this.game.width/2,this.game.height - 100,this.waveCount);
    this.counterNum.align = "center";
    this.counterNum.fontSize = 400;
    this.counterNum.stroke = "#FFFFFF";
    this.counterNum.strokeThickness = 3;
    //this.counterNum.alpha = 0.3;
    this.counterNum.anchor.setTo(0.5);

    this.bullets = this.game.add.group();

    this.dotCount = 3;
    this.dotsGroup = this.game.add.group();
    for(var i = 0;i < 3;i++){
        var dot = this.game.add.graphics(this.game.width/2 + 180 + (32*i),this.game.height - 20)
        dot.beginFill(0xFFFFFF,1)
        dot.drawCircle(0,0,30);
        this.dotsGroup.addChild(dot);

    }

    for(var i = 0;i < 20;i++){
        var frog = this.game.spadd.sprite(0, 0, "frog.png");
        this.game.physics.arcade.enable(frog);
        frog.anchor.setTo(0.5)
        frog.body.bounce.setTo(1);
        frog.body.collideWorldBounds = true;
        frog.body.setCircle(12,0,0);
        this.bullets.add(frog);
        var frogCircle = this.game.add.graphics(0,0)
        frogCircle.beginFill(0xFFFFFF,1)
        frogCircle.drawCircle(0,0,30);
        frog.addChild(frogCircle);
        frog.kill();
    }

    
    
    this.triggerZone = this.game.add.graphics(0,480);
    this.triggerZone.beginFill(0xFFFFFF,0.5);
    this.triggerZone.drawRect(0,0,this.game.width,120);
    this.triggerZone.endFill();
    this.triggerZone.inputEnabled = true;
    this.triggerZone.events.onInputDown.add(this.fireFrog,this);

    

    this.counterNumText = this.game.add.text(this.game.width/2,60,"TAP HERE TO FIRE");
    this.counterNumText.anchor.setTo(0.5);
    this.counterNumText.align = "center";
    this.triggerZone.addChild(this.counterNumText);

    this.goals = this.game.add.group();
    for(i = 0;i<3;i++){
        var goal = this.game.add.sprite(150 + (120*i),70, "particle.png");
        this.game.physics.arcade.enable(goal);
        goal.body.immovable = true;
        goal.body.setCircle(60,-60,-60);
        goal.body.allowGravity = false;
        goal.anchor.setTo(0.5);
        
        var goalRing = this.game.add.graphics(0,0)
        goalRing.lineStyle(3,0xffffff,1);
        goalRing.beginFill(0x000000,0)
        goalRing.drawCircle(0,0,120);
        goalRing.isSelected = false;
        goal.addChild(goalRing);

        var goalCircle = this.game.add.graphics(0,0)
        goalCircle.beginFill(0xFFFFFF,1)
        goalCircle.drawCircle(0,0,120);
        goal.addChild(goalCircle);
        goal.indicator = goalCircle;
        goal.indicator.alpha = 0;

        this.goals.add(goal);

    }

    this.blocks = this.game.add.group();

   

    this.floor = this.game.spadd.sprite(this.game.width/2, this.game.height - 10, "submitBtn.png");
    this.game.physics.arcade.enable(this.floor);
    this.floor.body.immovable = true;
    this.floor.body.allowGravity = false;
    this.floor.anchor.setTo(0.5,0);
    this.floor.width = this.game.width;
    this.floor.alpha = 0;

    this.cannon = SPG.Util.Display.debugSprite(this.game, this.game.width/2, this.game.height-20, 160, 60, "#ffffff");
    this.cannon.anchor.setTo(0.5);

    this.restartBtn = new TextButton(this.game,this.game.width/2,640,"button","REPLAY",this.restartGame,this);
    this.restartBtn.kill();
};

SPG.BadcoreGameState.prototype.fireFrog = function(){
    var bullet = this.bullets.getFirstDead();
    if(bullet === null || this.bombsAway){return;}
    bullet.shotOut = false;
    this.bombsAway = true;
    bullet.revive();
    bullet.reset(this.game.width/2, this.game.height-30)
    this.game.physics.arcade.moveToPointer(bullet, 120, this.game.input.activePointer, 500);
    this.game.time.events.add(450,function(){bullet.shotOut = true},this);
};

SPG.BadcoreGameState.prototype.killFrog = function(obj1, obj2){
    console.log("kill the frog");
    if(obj2.shotOut){
        obj2.kill();
        this.dotsGroup.getFirstAlive().kill();
        this.dotCount--;
        this.bombsAway = false;

        if(this.dotCount === 0){
            this.counterNumText.text = "GAME OVER\nSCORE: "+this.waveCount;
            this.triggerZone.inputEnabled = false;
            this.restartBtn.revive();
            
        }
    }
    //

};

SPG.BadcoreGameState.prototype.checkGoal = function(frog,goal){
    frog.kill();
    this.bombsAway = false;
    if(!goal.isSelected){
        goal.isSelected = true;
        goal.indicator.alpha = 1;
    //
        if(this.checkAllFilled()){
            this.nextWave();
        };
    }else{
        goal.isSelected = false;
    }

    goal.indicator.alpha = (goal.isSelected)? 1 : 0;
    //

};

SPG.BadcoreGameState.prototype.checkAllFilled = function(obj1, obj2){
   var dun = 0;
   this.goals.forEach(function(item){
       if(item.isSelected){
           dun++;
       }

   },this)

   
   allDone = (dun === 3)?true:false;
   console.log("Alldone",allDone)
   return allDone;

};

SPG.BadcoreGameState.prototype.nextWave = function(){
    this.goals.forEach(function(item){
        item.isSelected = false;
        this.game.add.tween(item.indicator).to({alpha:0},800,Phaser.Easing.Quadratic.Out,true);
        
 
    },this)

    //create a block
    var xpos = this.game.rnd.integerInRange(0,this.game.width)
    var ypos = this.game.rnd.integerInRange(180,380);
    var block = SPG.Util.Display.debugSprite(this.game, xpos, ypos, 60, 30, "#ffffff");
    this.game.physics.arcade.enable(block);

    var mortar = this.game.add.graphics(0,0)
    mortar.lineStyle(3,0x000000,1)
    mortar.drawRect(-30,-15,60,30);
    block.addChild(mortar);

    
    block.body.immovable = true;
    block.body.allowGravity = false;
    block.beenHit = false;
    block.anchor.setTo(0.5);
    this.blocks.add(block);

    this.waveCount++;
    this.dotsGroup.forEach(function(item){item.revive();},this);
    this.dotCount = 3;
};

SPG.BadcoreGameState.prototype.checkBlock = function(frog,block){
    if(block.beenHit){
        block.destroy();
    }else{
        block.alpha = 0.5;
        block.beenHit = true;
    }
    
};

SPG.BadcoreGameState.prototype.restartGame = function(){
    this.blocks.removeAll();
    this.goals.forEach(function(item){
        item.isSelected = false;
        this.game.add.tween(item.indicator).to({alpha:0},800,Phaser.Easing.Quadratic.Out,true);
    },this)
    this.dotsGroup.forEach(function(item){item.revive();},this);
    this.restartBtn.kill();
    this.waveCount = 0;
    this.counterNumText.text = "TAP HERE TO FIRE";
    this.triggerZone.inputEnabled = true;
};

SPG.BadcoreGameState.prototype.nextState = function(){
    this.game.navigateToStateByName("DebugState");
};

SPG.BadcoreGameState.prototype.update = function() {

    //update function called every frame
    this.cannon.rotation = game.physics.arcade.angleToPointer(this.cannon);
    this.game.physics.arcade.collide(this.bullets, this.floor,this.killFrog,null,this);
    this.game.physics.arcade.collide(this.bullets, this.blocks, this.checkBlock,null,this);
    this.game.physics.arcade.overlap(this.bullets, this.goals,this.checkGoal,null,this);
    this.counterNum.text = this.waveCount;
};

SPG.BadcoreGameState.prototype.render = function() {


    //    this.goals.forEach(function(item){
    //     this.game.debug.body(item);
    //    },this) 


}
// Boot this - loads assets & disaplys loading bar.
var SPG = SPG || {};

SPG.bootState = function (game) {};

SPG.bootState.prototype = Object.create(Phaser.State.prototype);
SPG.bootState.prototype.constructor = SPG.bootState;

SPG.bootState.prototype.text = null;
SPG.bootState.prototype.titleText = null;
SPG.bootState.prototype.debug = null;
SPG.bootState.prototype.loadingbar = null;
SPG.bootState.prototype.loadingbarfill = null;
SPG.bootState.prototype.viewPortCorrect = true;
SPG.bootState.prototype.phaserFullScreen = true;
SPG.bootState.prototype.assetsLoaded = false;
SPG.bootState.prototype.gameRef = null;
SPG.bootState.prototype.stateRef = null;

SPG.bootState.prototype.init = function () {

    this.gameRef = this.game;
    this.stateRef = this;

    //set background color
    this.game.stage.backgroundColor = this.game.data.get("colors.loadBG");


    //setup scaling properties
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.maxWidth = 540;
    this.game.scale.maxHeight = 960;


    if (!this.game.data.get("game.allowLargerThanGameSize")) {
        this.game.scale.maxWidth = 1080;
        this.game.scale.maxHeight = 1920;

    }
    ////console.log(this.game.scale)

    this.game.scale.pageAlignVertically = true;
    this.game.scale.pageAlignHorizontally = true;

    //focus adapt to game wrapper
    this.game.tracking.focusAdapt(this.game.AdaptComponentID);

};



SPG.bootState.prototype.toggleFullscreen = function (ref) {
    // this.game.debugLog('toggle fullscreen');
    if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen();
    } else {
        this.game.scale.startFullScreen(false);

        if (this.game.scale.isFullScreen) {
            // this.stateRef.removeFullScreenButton();
        } else {
            this.debugLog("cant start fullscreen");
        }

    }
};



SPG.bootState.prototype.preload = function () {
    this.game.scale.compatibility.scrollTo = false;
    this.game.input.touch.preventDefault = true;

    this.game.load.image("spinner", "assets/images/loading-circle.png");

};

SPG.bootState.prototype.create = function () {
    this.spinner = game.add.sprite(this.game.world.centerX, this.game.world.centerY, "spinner");
    this.spinner.anchor.setTo(.5);

    // this.logo = game.add.sprite(this.game.world.centerX, 300, "loadlogo");
    // this.logo.anchor.setTo(.5);

    this.regtext = this.game.add.text(this.game.world.centerX, this.game.height - 30, "Lumbersexual af kogi fingerstache, pabst keytar photo booth taiyaki flexitarian vice. Listicle marfa ramps brunch selfies chambray, vice helvetica brooklyn kale chips photo booth bitters prism.", this.game.data.get("fonts.regText")); //TODO add what client this version is registered to here
    this.regtext.fontWeight = "normal";
    this.regtext.anchor.setTo(0.5, 1);



    //listener for when all out assets are loaded
    this.game.load.onLoadComplete.addOnce(this.loadComplete, this);

    this.loadAssets();
    this.game.load.start();
};

SPG.bootState.prototype.loadAssets = function () {


    // Fix CORS issues with the loader and allow for unlimited parallel downloads.
    this.game.load.crossOrigin = "anonymous";
    this.game.load.maxParallelDownloads = Infinity;



    //SPG.Util.MergeObjectRecursive(this.game.data.raw, this.game.cache.getJSON('gamedata'));
    this.game.load.text("gamecontentraw", "assets/content.json");

    var filePrefix = "assets/";

    //load any atlas
    prefix = (this.game.tracking.mode !== "ADAPT") ? "assets/spritesheets/" : "assets/";
    for (var i = this.game.data.get("assets").atlases.length - 1; i >= 0; i--) {
        var atlas = this.game.data.get("assets").atlases[i];
        this.game.load.atlasJSONArray(atlas, prefix + atlas + ".png", prefix + atlas + ".json");
    }

    prefix = (this.game.tracking.mode !== "ADAPT") ? "assets/spritesheets/" : "assets/";
    //load any spritesheets
    for (var i = this.game.data.get("assets").spritesheets.length - 1; i >= 0; i--) {
        var spritesheet = this.game.data.get("assets").spritesheets[i];

        if (!spritesheet.isPersistent) {
            continue;
        }


        if (spritesheet.totalFrames !== undefined) {
            this.game.load.spritesheet(spritesheet.file, prefix + spritesheet.file, spritesheet.frameWidth, spritesheet.frameHeight, spritesheet.totalFrames);
        } else {
            this.game.load.spritesheet(spritesheet.file, prefix + spritesheet.file, spritesheet.frameWidth, spritesheet.frameHeight);
        }
    }

    prefix = (this.game.tracking.mode !== "ADAPT") ? "assets/images/" : "assets/";
    //load any sprite images
    for (var i = this.game.data.get("assets").images.length - 1; i >= 0; i--) {
        var image = this.game.data.get("assets").images[i];
        this.game.load.image(image, prefix + image);
    }


    prefix = (this.game.tracking.mode !== "ADAPT") ? "assets/audio/" : "assets/";
    //load any sounds
    for (var i = 0; i < this.game.data.get("assets").audio.assets.length; i++) {
        var sound = this.game.data.get("assets").audio.assets[i];

        var filePaths = [];
        for (var j = 0; j < this.game.data.get("assets").audio.types.length; j++) {
            filePaths.push(prefix + sound + "." + this.game.data.get("assets").audio.types[j]);
        }

        this.game.load.audio(sound, filePaths, true);
    }

    prefix = (this.game.tracking.mode !== "ADAPT") ? "assets/video/" : "assets/";
    //load any sounds
    for (var i = this.game.data.get("assets").videos.length - 1; i >= 0; i--) {
        var video = this.game.data.get("assets").videos[i];
        this.game.load.video(video, [prefix + video]);
    }

};

SPG.bootState.prototype.loadComplete = function () {


    var jsonload = this.game.cache.getText("gamecontentraw");
    jsonload = jsonload.replace(/__/gi, "");

    SPG.Util.Data.MergeObjectRecursive(this.game.data.raw, JSON.parse(jsonload)); //merge then merge in our content (as translations **should** take priority)

    //call back to do the data functionallity
    this.game.data.onload();

    if (this.game.data.get("game").developmentMode) {
        this.readyToPlay();

    } else {
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.readyToPlay, this);
    }
};

SPG.bootState.prototype.update = function () {
    this.spinner.angle += 2;
};

SPG.bootState.prototype.readyToPlay = function () {

    this.assetsLoaded = true;
    // this.loadingbarfillBG.destroy();
    // this.loadingbarfill.destroy();
    // this.loadingBarSurround.destroy();
    //this.text.destroy();
    this.spinner.destroy();
    //this.logo.destroy();
    this.regtext.destroy();


    console.log("Game Content", this.game.data.get());

    this.startGame();



};
SPG.bootState.prototype.startGame = function () {
    if (this.game.data.get("game").developmentMode) {
        this.game.nextState();
        return;
    }


    d = this.game.data.get("allowedDomains");


    for (var i = 0; i < d.length; i++) {

        var regex = new RegExp(SPG.Util.Math.d(d[i]).replace(/\*/g, "[^ ]*"));

        if (regex.test(window.location.hostname)) {
            this.game.nextState();
            return;
        }

        if (SPG.Util.Math.d(d[i]) === window.location.hostname) {
            this.game.nextState();
            return;
        }

    }
    console.warn("this version of the game is not registered to work on this domain: ", window.location.hostname);
    this.error = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "This game is not registered to run on this domain, please contact your supplier for support", this.game.data.get("fonts.h1"));

    this.error.fontWeight = "normal";
    this.error.anchor.setTo(0.5, 0.5);


};
// Debug state
var SPG = SPG || {};

SPG.DebugState = function(game) {};

SPG.DebugState.prototype = Object.create(Phaser.State.prototype);
SPG.DebugState.prototype.constructor = SPG.bootState;


SPG.DebugState.prototype.text =  null;
SPG.DebugState.prototype.highscores = null;
SPG.DebugState.prototype.game = null;
SPG.DebugState.prototype.debugKey = null;

SPG.DebugState.prototype.create = function(){

    this.game.stage.backgroundColor = this.game.data.get("colors").loadBG;


    this.text = this.game.add.text(5,5, "");

    this.text.font = "alergiaThin";
    this.text.fontSize = 12;
    this.text.autoRound = true;
    this.text.style.fill ="#fff";
    this.text.wordWrap = true;
    this.text.wordWrapWidth = this.game.width - 200;

    this.text.text += "Cookies Enabled: " + navigator.cookieEnabled;
    this.text.text += "\nUser-agent: " + navigator.userAgent;

    //this.game.spadd.image(this.game.width,0,"logo.png").anchor.setTo(1,0);



    var states = this.game.data.get("states");

   for (var i =0; i < states.length; i++) {
    if(states[i].id == "DebugState"){
        continue;
        // states[i].id = "Close Game";
    }
            posY = (i%9)*65; //space it 40 pixels apart verticlally
            posX = Math.floor(i/9)* 200; // space it 100 pixel part horrozontally
            btn = new TextButton(this.game, 100+posX, 50+posY, "button", states[i].id, this.debugNavigateToState, this);
            //btn.setState(false)

   };

    i = states.length;
    posY = (i%9)*60; //space it 40 pixels apart verticlally
    posX = Math.floor(i/9)* 200; // space it 100 pixel part horrozontally

    //list all popups avaliblie
    var popups = this.game.data.get("htmlpopups");

    for (var i = popups.length - 1; i >= 0; i--) {
        t = this.game.add.text(this.game.width-10 - Math.floor(i/60)* 100 ,  (i%60)*12, popups[i].id, this.game.data.get("fonts.DebugText") );
        t.anchor.setTo(1,0);
        t.inputEnabled = true;
        t.events.onInputUp.add(this.testPopup, this);
       
    }



};

SPG.DebugState.prototype.debugNavigateToState = function(button){

    if(button.label.text == "Close Game"){
        this.game.tracking.complete();
    } else {
    
        this.game.navigateToStateByName(button.label.text);
    }
};

SPG.DebugState.prototype.testPopup = function(popup){
    console.log(popup);
    if(popup.text === "confirmation"){
        console.log("!!!confirmation!");
       this.game.popup.launch(popup.text,this.testCallback, this, this.testCallback);

    } else {
       this.game.popup.launch(popup.text,this.testCallback, this);

    }
};

SPG.DebugState.prototype.fullscreen = function(){
    if (window.screenfull && screenfull.enabled) {
        screenfull.request();
    }
};

SPG.DebugState.prototype.testCallback = function(){
    console.log("popup closed callback");
};


SPG.DebugState.prototype.nextState = function(){
    // trying fullscreen mode
    //this.game.endGame();
   
};

SPG.DebugState.prototype.update = function(dt) {

};

// template state
var SPG = SPG || {};

SPG.LevelTransitionState = function () {
    Phaser.State.call(this);
};

SPG.LevelTransitionState.prototype = Object.create(Phaser.State.prototype);
SPG.LevelTransitionState.prototype.constructor = SPG.LevelTransitionState;

SPG.LevelTransitionState.prototype.preload = function () {
    //preload here

    //how to load an image (and check it exisits first)
    //if(!this.game.cache.checkKey(Phaser.Cache.IMAGE,key)){
    //this.game.load.image(key,url);
    //}

};

SPG.LevelTransitionState.prototype.shutdown = function () {
    //called at end of state (switching away) this is where you should destroy all the object you have initilised.
    //this.somthing.destroy(); this.somthing = null;   

    //remove stuff form cache.
    //this.game.cache.removeImage(key);



};


SPG.LevelTransitionState.prototype.init = function () {
    //called at game init
    this.gameJSON = this.game.data.get("levelSelectData");
    this.gameData = this.game.tracking.save;
    this.currentLevel = this.gameData.currentLevel;
    console.log("TRANSITION STATE:CURRENTLEVEL", this.currentLevel);
    this.previousLevel = (this.currentLevel === "training") ? "training" : this.currentLevel - 1;
    if (this.previousLevel < 0) {
        this.previousLevel = 0;
    };
    this.liftMoving = false;
    this.transDelay = 2000;

};

SPG.LevelTransitionState.prototype.create = function () {
    //called at start of state (after preload)
    this.sceneBG = this.game.spadd.image(0, 0, "levelselect_bgAlt.png");

    if (this.game.tracking.save.sfxOn) {
        this.liftHum = this.game.audio.playSound("liftMove", .4, true);
        this.liftHum.pause();
        // this.game.audio.playSound("liftDoors",.7)

    }

    this.liftLightNum = this.currentLevel;

    logo = this.game.spadd.image(this.game.width / 2, 20, "sorted_logo.png");
    logo.anchor.setTo(0.5, 0);

    this.baseLights = this.game.add.group();
    this.buttLights = this.game.add.group();
    this.buttList = [];

    this.levels = ["B", "G", "1", "2", "3"];
    this.levelIntros = ["level1_intro", "level2_intro", "level3_intro", "level4_intro", "level5_intro"];
    var lockPos = [650, 560, 464, 366, 269];
    var buttPos = [614, 522, 424, 326, 228];

    this.trainingButt = SPG.Util.Display.debugSprite(this.game, 82, 524, 96, 80, "#333333");
    this.trainingButt.alpha = 0;

    for (var i = 0; i < 5; i++) {
        var levelButt = SPG.Util.Display.debugSprite(this.game, this.game.width / 2 + 10, 615 - (98 * i), this.game.width / 2, 90, "#00000");
        levelButt.inputEnabled = true;
        levelButt.alpha = 0;
        levelButt.idNum = i;
        this.buttList.push(levelButt);

        var baseButt = this.game.add.text(400, buttPos[i], this.levels[i], this.game.data.get("fonts.levelNumber"));
        baseButt.anchor.x = .5;
        baseButt.fill = "#5536AF";
        this.baseLights.add(baseButt);

        var lightButt = this.game.add.text(400, buttPos[i], this.levels[i], this.game.data.get("fonts.levelNumber"));
        lightButt.fill = "#FAFA4E";
        lightButt.anchor.x = .5;
        lightButt.alpha = 0;
        this.buttLights.add(lightButt);

        if (i > this.gameData.levelProgress) {
            var lock = this.game.spadd.image(374, lockPos[i], "lock.png");
            lock.anchor.x = .5;

        }

        if (i < 4) {
            var starSprite = this.game.spadd.sprite(328, buttPos[i] + 3, "scoreStars.png");
            starSprite.frame = this.gameData.levelScores[i];
        } else {
            if (!this.gameData.topFloorUnlocked) {
                this.game.spadd.image(335, 232, "tenStar.png");
            } else {
                var starSprite = this.game.spadd.sprite(328, buttPos[i] + 3, "scoreStars.png");
                starSprite.frame = this.gameData.levelScores[i];
            }
        }
    }

    var trainLabel = this.game.add.text(94, 522, this.gameJSON.trainLabel, game.data.get("fonts.levelNumber"));
    trainLabel.fill = "#5536AF";
    trainLabel.fontSize = 17;

    this.sceneSelector = this.game.spadd.image(374, 0, this.gameJSON.lift);
    this.sceneSelector.anchor.x = .5;

    var liftMask = this.game.add.graphics(0, 0);
    liftMask.beginFill(0x000000);
    liftMask.drawRect(0, 620, this.game.width, 100);
    liftMask.drawRect(this.game.width / 2, 222, this.game.width / 2, 500);
    liftMask.endFill();

    this.sceneSelector.mask = liftMask;

    //this.previousLevel = "training"
    // this.previousLevel = 0;
    // this.currentLevel = 4;

    if (this.previousLevel != "training") {
        this.sceneSelector.y = this.buttList[this.previousLevel].y += 5;
        this.buttLights.getChildAt(this.previousLevel).alpha = 1;
        this.game.time.events.add(1400, this.moveToLevel, this);

    } else {
        this.sceneSelector.x = 156;
        this.sceneSelector.y = this.trainingButt.y;
        this.leaveTraining();
    }



    this.blackout = this.game.add.graphics(0, 0);
    this.blackout.beginFill(0x000000);
    this.blackout.drawRect(0, 0, this.game.width, this.game.height);
    this.blackout.endFill();
    this.blackout.alpha = 0;

    this.liftContents = this.game.add.group();
    this.doorLeft = this.game.spadd.image(0, 0, "left_door.png");

    this.doorRight = this.game.spadd.image(this.game.width / 2, 0, "right_door.png");

    this.liftSurround = this.game.spadd.image(0, 0, "lift_frame.png");
    this.liftButts = this.game.add.group();

    this.levelDisplay = this.game.add.text(34, 195, "", this.game.data.get("fonts.levelNumber"));
    this.levelDisplay.anchor.setTo(.5);
    this.levelDisplay.fill = "#F0E891";
    this.liftButts.add(this.levelDisplay);

    this.bgItems = this.game.add.group();

    this.bg = this.game.spadd.image(0, 0, "lift_G.png");
    this.bgItems.add(this.bg);

    this.liftContents.addMultiple([this.bgItems, this.doorLeft, this.doorRight, this.liftSurround, this.liftButts]);

    if (this.gameData.topFloorUnlocked && !this.gameData.hasSeenAnim) {
        this.starEmitter = game.add.emitter(364, 280, 80);
        this.starEmitter.makeParticles("starParticle.png");
        this.starEmitter.gravity = 50;
        this.starEmitter.setAlpha(0.01, 1);
        this.starEmitter.start(true, 3000, null, 30);
        this.gameData.hasSeenAnim = true;
        this.game.tracking.saveData();
    }

    var wipeMask = this.game.add.graphics(this.game.width / 2, this.game.height / 2);
    wipeMask.beginFill(0x000000, 1);
    wipeMask.drawCircle(0, 0, 1000);
    wipeMask.scale.setTo(0);
    this.liftContents.mask = wipeMask;

    this.wipeTween = this.game.add.tween(wipeMask.scale).to({
        x: 1,
        y: 1
    }, 400, Phaser.Easing.Quadratic.Out, false);

    this.game.audio.playMusic("sorted", 0.3, true);

};

SPG.LevelTransitionState.prototype.leaveTraining = function () {
    this.game.tracking.save.inTraining = false;
    this.game.tracking.save.currentLevel = this.currentLevel = 0;
    var targetFloor = this.buttList[this.currentLevel];
    this.game.add.tween(this.sceneSelector).to({
        y: targetFloor.y + 5
    }, 1000, Phaser.Easing.Quadratic.Out, true);
    var mover = this.game.add.tween(this.sceneSelector).to({
        x: 374
    }, 2000, Phaser.Easing.Quadratic.Out, true, 1500);
    this.liftMoving = true;
    console.log("SAVE NEW LEVEL NOW LEAVING TRAINING");
    this.game.tracking.saveData();
    mover.onComplete.add(this.showTransitionAnimation, this);
    if (this.liftHum) {
        this.liftHum.play();
    };
};

SPG.LevelTransitionState.prototype.backToTraining = function () {};

SPG.LevelTransitionState.prototype.moveToLevel = function () {
    console.log("doors closing");

    var targetFloor = this.buttList[this.currentLevel];

    //CHECK NEEDS TO HAPPEN TO SEE IF TOP FLOOR IS UNLOCKED! 
    //SHOULD HAPPEN BEFORE WE COME TO THIS STATE



    var diff = (targetFloor.y > this.sceneSelector.y) ? targetFloor.y - this.sceneSelector.y : this.sceneSelector.y - targetFloor.y;
    //console.log(diff)

    this.liftMoving = true;

    var moveLift = this.game.add.tween(this.sceneSelector).to({
        y: targetFloor.y + 5
    }, 10 * diff, Phaser.Easing.Quadratic.Out, true);
    moveLift.onComplete.add(this.showTransitionAnimation, this);
    if (this.liftHum) {
        this.liftHum.play();
    };
};

SPG.LevelTransitionState.prototype.showFloor = function () {
    this.game.add.tween(this.doorLeft).to({
        x: -200
    }, 1000, Phaser.Easing.Quadratic.Out, true, 800);
    this.game.add.tween(this.doorRight).to({
        x: 407
    }, 1000, Phaser.Easing.Quadratic.Out, true, 800);
    this.game.time.events.add(this.transDelay, this.nextState, this);
    this.game.audio.playSound("liftDoors", .3);
    this.game.audio.playSound("liftBell", .4);
};

SPG.LevelTransitionState.prototype.showTransitionAnimation = function () {
    //show animation component to view opening of lift doors
    console.log("doors opening, level:", this.currentLevel);
    this.game.audio.stopAllSounds();
    bg_images = ["lift_B.png", "lift_G.png", "lift_1.png", "lift_2.png", "lift_3.png"];
    var backgroundPNG = (this.currentLevel === "training") ? "lift_G.png" : bg_images[this.currentLevel];
    this.bg.frameName = backgroundPNG;
    var btween = this.game.add.tween(this.blackout).to({
        alpha: 1
    }, 500, Phaser.Easing.Quadratic.Out, true);
    btween.onComplete.add(function () {
        this.wipeTween.start();        
        this.game.audio.stopMusic();
        this.game.audio.stopAllSounds();
        this.showFloor();
    }, this);
    
    this.levelDisplay.text = (this.currentLevel === "training") ? "G" : this.levels[this.currentLevel];

    for (i = 0; i < 5; i++) {
        var imgRef = (i === this.currentLevel) ? "lift_btn_lit.png" : "lift_btn_off.png";
        var doorButt = this.game.spadd.image(32, 460 - (50 * i), imgRef);
        doorButt.anchor.setTo(.5);

        var baseButt = this.game.add.text(0, 0, this.levels[i], this.game.data.get("fonts.levelNumber"));
        baseButt.anchor.setTo(.5);
        var buttCol = (i === this.currentLevel) ? "#666666" : "#F0E891";
        baseButt.fill = "#4E566D";
        doorButt.addChild(baseButt);

        this.liftButts.add(doorButt);
    }

    switch (this.currentLevel) {
        case 3:
            this.hipsters = this.game.spadd.sprite(100, 185, "hipsters.png");
            this.hipsters.animations.add("show").play(20, true);
            this.bgItems.add(this.hipsters);
            this.game.time.events.add(1500, function () {
                this.game.audio.playSound("hipsters", 0.2);
            }, this);
            this.transDelay = 4000;
            break;
        case 4:
            this.segway = this.game.spadd.sprite(500, 260, "segway.png");
            this.segway.animations.add("show").play(20, true);
            this.bgItems.add(this.segway);
            this.game.add.tween(this.segway).to({
                x: -100
            }, 3000, Phaser.Easing.Quadratic.None, true, 1000);
            this.game.time.events.add(250, function () {
                this.game.audio.playSound("segway", 0.2);
            }, this);
            this.game.time.events.add(1500, function () {
                this.game.audio.playSound("segwayManOption1", 0.2);
            }, this);
            this.transDelay = 5000;
            break;
        default:

            break;
    }

    this.liftMoving = false;
    //this.nextState();
};

SPG.LevelTransitionState.prototype.showLevelLight = function () {
    if (!this.liftMoving) {
        return;
    };
    for (i = 0; i < this.buttList.length; i++) {
        this.buttLights.getChildAt(i).alpha = 0;
        if ((this.buttList[i].getBounds().contains(this.sceneSelector.x, this.sceneSelector.y))) {
            this.buttLights.getChildAt(i).alpha = 1;
            this.liftLightNum = i;

        }
    }
};

SPG.LevelTransitionState.prototype.nextState = function () {



    //var canMoveTo = (totalStars > 9)?"SortedFinalGameState":"levelSelectState";
    var destanalation = (this.currentLevel === 4) ? "SortedFinalGameState" : "SortedGameState";

    this.game.navigateToStateByName(destanalation);
};


SPG.LevelTransitionState.prototype.update = function () {
    //update function called every frame
    this.showLevelLight();

};
// template state
var SPG = SPG || {};


/**
 * a state the is used between main states to handle the loading and unloading of assets required for the next state.
 * @constructor
 * @param {object} game - The main phaser game object.
 */

SPG.preloadState = function (game) {
    this.game = game;
};


SPG.preloadState.prototype = {
    game: null,
    nextState: null,
    isLoading: false,

    preload: function () {

        this.game.audio.stopAllSounds();

        this.game.stage.backgroundColor = this.game.data.get("colors.loadBG");

        this.destroyNonPersistantAtlases();
        this.destroyNonPersistantSounds();
        this.destroyNonPersistantSpriteSheets();


        if (this.doesStateHaveAtlases(this.nextState) || this.doesStateHaveSounds(this.nextState) || this.doesStateHaveSpriteSheets(this.nextState)) { //assetsToLoad

            console.log("PreloadState::StuffToLoad");


            // //listener for when all out assets are loaded
            this.game.load.onLoadComplete.addOnce(this.loadState, this);

            this.loadAtlasesForState(this.nextState);
            this.loadSoundsForState(this.nextState);
            this.loadSpriteSheetsForState(this.nextState);


            if (!this.isLoading) {

                this.game.load.onLoadComplete.remove(this.loadState, this);

            } else {

                this.spinner = game.spadd.sprite(this.game.world.centerX, 300, "loading-circle.png");
                this.spinner.anchor.setTo(.5);

                // this.logo = game.add.sprite(this.game.world.centerX, 300, "loadlogo");
                // this.logo.anchor.setTo(.5);

                //this.spinner.alpha = this.logo.alpha = 0;

            }

        } else {
            //jump straight in.
            this.loadState();
        }

    },

    destroy: function () {},

    init: function (nextState) {
        console.log("PreloadState::init-->" + nextState, this.game.data.get("game_model.currentLevel"));
        this.nextState = nextState;
        this.isLoading = false;
    },

    create: function () {

    },

    destroyNonPersistantAtlases: function () {

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            if (this.game.data.get("states")[i].id === this.nextState) {
                var stateSettings = this.game.data.get("states")[i];
                break;
            }
        }

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            for (var j = 0; j < this.game.data.get("states")[i].atlases; j++) {

                atlas = this.game.data.get("states")[i].atlases[j];

                //if this atlas isn't required
                if (stateSettings.atlases.indexOf(atlas) < 0) {

                    //and exists in cache
                    if (this.game.cache.checkKey(Phaser.Cache.IMAGE, atlas)) {
                        console.log("PreloadState::removeAtlas-->" + this.game.data.get("states")[i].atlases[j]);
                        this.game.cache.removeImage(this.game.data.get("states")[i].atlases[j]);
                    }
                }
            }
        }
    },

    destroyNonPersistantSounds: function () {

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            if (this.game.data.get("states")[i].id === this.nextState) {
                var stateSettings = this.game.data.get("states")[i];
                break;
            }
        }

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            for (var j = 0; j < this.game.data.get("states")[i].sounds; j++) {

                var sound = this.game.data.get("states")[i].sounds[j];
                //check its not required in the next state
                if (stateSettings.sounds.indexOf(sound) < 0) {
                    //and exists in cache
                    if (this.game.cache.checkKey(Phaser.Cache.SOUND, sound)) {

                        console.log("PreloadState::removeAudio-->" + sound);
                        this.game.cache.removeAudio(sound);

                    }
                }
            }
        }

    },

    destroyNonPersistantSpriteSheets: function () {

        var SSList = this.game.data.get("assets.spritesheets");

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            if (this.game.data.get("states")[i].id === this.nextState) {
                var stateSettings = this.game.data.get("states")[i];
                break;
            }
        }


        for (var i = 0; i < SSList.length; i++) {
            var ss = SSList[i];

            //if spritesheet is not persistent and isn't required in next state
            if (!ss.isPersistent && stateSettings.spritesheets.indexOf(ss.file) < 0) {

                //and exists in cache
                if (this.game.cache.checkKey(Phaser.Cache.IMAGE, ss.file)) {
                    console.log("PreloadState::removeSpriteSheet-->" + ss.file);
                    this.game.cache.removeImage(ss.file);
                }
            }
        }
    },



    doesStateHaveAtlases: function (state) {

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            if (this.game.data.get("states")[i].id == state && this.game.data.get("states")[i].atlases !== undefined && this.game.data.get("states")[i].atlases.length > 0) {
                return true;
            }
        }

        return false;


    },

    doesStateHaveSounds: function (state) {
        for (var i = 0; i < this.game.data.get("states").length; i++) {

            if (this.game.data.get("states")[i].id == state && this.game.data.get("states")[i].audio !== undefined && this.game.data.get("states")[i].audio.length > 0) {
                return true;
            }
        }

        return false;


    },

    doesStateHaveSpriteSheets: function (state) {

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            if (this.game.data.get("states")[i].id == state && this.game.data.get("states")[i].spritesheets !== undefined && this.game.data.get("states")[i].spritesheets.length > 0) {
                return true;
            }
        }

        return false;

    },
    loadAtlasesForState: function (state) {
        prefix = (this.game.tracking.mode !== "ADAPT") ? "assets/spritesheets/" : "assets/";
        var preloadingRequired = false;

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            if (this.game.data.get("states")[i].id == state && this.game.data.get("states")[i].atlases !== undefined && this.game.data.get("states")[i].atlases.length > 0) {

                for (var j = 0; j < this.game.data.get("states")[i].atlases.length; j++) {

                    var id = this.game.data.get("states")[i].atlases[j];


                    if (true) {
                        // if (!this.game.cache.checkKey(Phaser.Cache.IMAGE, id)) { //TODO check if already in cache.

                        this.isLoading = true;
                        console.log("PreloadState::LOADAtlas: " + id);
                        this.game.load.atlasJSONArray(id, prefix + id + ".png", prefix + id + ".json");

                    }

                }

            }

        }

    },


    loadSpriteSheetsForState: function (state) {
        prefix = (this.game.tracking.mode !== "ADAPT") ? "assets/spritesheets/" : "assets/";
        var preloadingRequired = false;

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            if (this.game.data.get("states")[i].id == state && this.game.data.get("states")[i].spritesheets !== undefined && this.game.data.get("states")[i].spritesheets.length > 0) {
                preloadingRequired = true;
                for (var j = 0; j < this.game.data.get("states")[i].spritesheets.length; j++) {
                    var id = this.game.data.get("states")[i].spritesheets[j];
                    console.log("PreloadState::LOADSS: " + id);

                    //get the spritesheet details for the load.
                    var spritesheet = undefined;
                    for (var k = 0; k < this.game.data.get("assets.spritesheets").length; k++) {
                        if (this.game.data.get("assets.spritesheets")[k].file === id) {
                            spritesheet = this.game.data.get("assets.spritesheets")[k];
                        }
                    }




                    if (true) {
                        // if (!this.game.cache.checkKey(Phaser.Cache.IMAGE, spritesheet)) { //if the sprite sheet isn't in cache already
                        this.isLoading = true;
                        //if we have total frames lets supply if not we will let phaser handle this.

                        console.log("LOAD SS:  "+ JSON.stringify(spritesheet));

                        if (spritesheet !== undefined && spritesheet.totalFrames !== undefined) {
                            console.log("loading with total frames");
                            this.game.load.spritesheet(spritesheet.file, prefix + spritesheet.file, spritesheet.frameWidth, spritesheet.frameHeight, spritesheet.totalFrames);
                        } else if (spritesheet !== undefined) {
                            this.game.load.spritesheet(spritesheet.file, prefix + spritesheet.file, spritesheet.frameWidth, spritesheet.frameHeight);
                        }
                    }
                }
            }
        }
    },

    
    loadSoundsForState: function (state) {
        prefix = (this.game.tracking.mode !== "ADAPT") ? "assets/audio/" : "assets/";

        for (var i = 0; i < this.game.data.get("states").length; i++) {
            if (this.game.data.get("states")[i].id == state && this.game.data.get("states")[i].audio !== undefined && this.game.data.get("states")[i].audio.length > 0) {

                for (var j = 0; j < this.game.data.get("states")[i].audio.length; j++) {

                    //id
                    var id = this.game.data.get("states")[i].audio[j];

                    //check its not already in cache.
                    if (true) {
                        // if (!this.game.cache.checkKey(Phaser.Cache.SOUND, id)) { //if this sound is not in cache.
                        this.isLoading = true;
                        console.log("PreloadState::LOADAudio: " + id);
                        this.game.load.audio(id, [prefix + id + ".mp3", prefix + id + ".ogg", prefix + id + ".acc", prefix + id + ".wav"]);

                    }
                }

            }

        }
    },

    loadState: function () {
        this.game.state.start(this.nextState, true);

    },



    loadUpdate: function (dt) {
        //update function called every frame
        if(this.spinner){
            this.spinner.angle += 2;
            this.spinner.alpha = this.logo.alpha = Math.min(1, this.logo.alpha + 0.05);
        }
        

    }
};
// template state
var SPG = SPG || {};

SPG.TemplateState = function (){
    Phaser.State.call(this);
};
    
SPG.TemplateState.prototype = Object.create(Phaser.State.prototype);
SPG.TemplateState.prototype.constructor = SPG.TemplateState;

SPG.TemplateState.prototype.preload = function(){
	//preload here
	
	//how to load an image (and check it exisits first)
	//if(!this.game.cache.checkKey(Phaser.Cache.IMAGE,key)){
	//this.game.load.image(key,url);
	//}

};

SPG.TemplateState.prototype.shutdown = function(){
    //called at end of state (switching away) this is where you should destroy all the object you have initilised.
    //this.somthing.destroy(); this.somthing = null;   

    //remove stuff form cache.
    //this.game.cache.removeImage(key);
    
    

};

SPG.TemplateState.prototype.showSettings = function(){
    this.pauseBtn.inputEnabled = false;
    var settings = new SettingsComponent(this.game, this.closeSettings, this,this.closeSettings);
};

SPG.TemplateState.prototype.closeSettings = function(){
    this.pauseBtn.inputEnabled = true;
}


SPG.TemplateState.prototype.init = function(){
    //called at game init

};

SPG.TemplateState.prototype.create = function(){
    //called at start of state (after preload)
    this.pauseBtn = new IconButton(this.game, this.game.width-50, 50, "pause", this.showSettings, this, true);

    this.slider = new SliderComponent(this.game,50,200,500,20,8,false,true,this)
};

SPG.TemplateState.prototype.nextState = function(){
    this.game.navigateToStateByName("DebugState");
};

SPG.TemplateState.prototype.update = function() {

    //update function called every frame
    //

};
var SPG = SPG || {};
SPG.Util = {
  Data: {},
  Math: {},
  Display: {}
};

//======================================
//                                      
//  ####      ###    ######    ###    
//  ##  ##   ## ##     ##     ## ##   
//  ##  ##  ##   ##    ##    ##   ##  
//  ##  ##  #######    ##    #######  
//  ####    ##   ##    ##    ##   ##  
//                                      
//======================================


//merges two objects properties together, this will prioritise the second objects properties to the first.
SPG.Util.Data.MergeObjectRecursive = function (obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (obj2[p].constructor == Object) {
        obj1[p] = SPG.Util.MergeObjectRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }
  return obj1;
};



SPG.Util.Data.track = function (action, label) {

  if (typeof gtag === "function") {
    console.log("sending to google analytics", action, label);
    gtag("event", action, {
      "event_label": label
    });
  } else {
    console.log("not connected to tracking,", action, label);
  }

};


//==========================================
//                                          
//  ###    ###    ###    ######  ##   ##  
//  ## #  # ##   ## ##     ##    ##   ##  
//  ##  ##  ##  ##   ##    ##    #######  
//  ##      ##  #######    ##    ##   ##  
//  ##      ##  ##   ##    ##    ##   ##  
//                                          
//==========================================

SPG.Util.Math.hextocolor = function (hex) {
  h = hex.substring(1);
  return parseInt(h, 16);

};

SPG.Util.Math.d = function (s) {
  for (var i = 0; i < s.length; i++) {
    char = parseInt(s[i]);
    if (!isNaN(char)) {
      if (char === 0) {
        char = 9;
      } else {
        char--;
      }
      s = s.substr(0, i) + char + s.substr(i + 1);
    }

  }
  return atob(s);
};



SPG.Util.Math.checkOverlap = function (spriteA, spriteB) {
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  return Phaser.Rectangle.intersects(boundsA, boundsB);

};

SPG.Util.shuffle = function(array) {
  var counter = array.length;

   // While there are elements in the array
   while (counter > 0) {
       // Pick a random index
       var index = Math.floor(Math.random() * counter);

       // Decrease counter by 1
       counter--;

       // And swap the last element with it
       var temp = array[counter];
       array[counter] = array[index];
       array[index] = temp;
   }

   return array;

};


//==========================================================
//                                                          
//  ####    ##   ####  #####   ##        ###    ##    ##  
//  ##  ##  ##  ##     ##  ##  ##       ## ##    ##  ##   
//  ##  ##  ##   ###   #####   ##      ##   ##    ####    
//  ##  ##  ##     ##  ##      ##      #######     ##     
//  ####    ##  ####   ##      ######  ##   ##     ##     
//                                                          
//==========================================================


SPG.Util.Display.moveAnchor = function (obj, anchor) {
  //reposition
  obj.x = obj.x + (anchor.x - obj.anchor.x) * obj.width;
  obj.y = obj.y + (anchor.y - obj.anchor.y) * obj.height;

  //set anchor
  obj.anchor.setTo(anchor.x, anchor.y);
};

SPG.Util.Display.addScaleOnOver = function (game, obj, hasSound) {

  if (obj.anchor.x != 0.5 || obj.anchor.y != 0.5) {
    SPG.Util.moveAnchor(obj, new Phaser.Point(0.5, 0.5));

  }

  obj.scale.setTo(0.9);
  obj.inputEnabled = true;
  obj.events.onInputOver.add(function () {
    if (hasSound) {
      game.soundController.playSound("ui-feedback");
    }
    game.add.tween(this.scale).to({
      x: 1,
      y: 1
    }, 100, undefined, true);
  }, obj);
  obj.events.onInputOut.add(function () {
    game.add.tween(this.scale).to({
      x: 0.9,
      y: 0.9
    }, 100, undefined, true);
  }, obj);

};



SPG.Util.Display.defuzzText = function (textObj) {

  //make sure position is a round number
  textObj.x = Math.round(textObj.x);
  textObj.y = Math.round(textObj.y);

  //make sure the anchor is not making the text postion subpixels.
  textObj.anchor.x = Math.round(textObj.width * textObj.anchor.x) / textObj.width;
  textObj.anchor.y = Math.round(textObj.height * textObj.anchor.x) / textObj.height;
};



//draw a rounded corner rectangle
SPG.Util.Display.RoundedRect = function (bmd, x, y, w, h, r, color) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  bmd.ctx.beginPath();
  bmd.ctx.moveTo(x + r, y);
  bmd.ctx.arcTo(x + w, y, x + w, y + h, r);
  bmd.ctx.arcTo(x + w, y + h, x, y + h, r);
  bmd.ctx.arcTo(x, y + h, x, y, r);
  bmd.ctx.arcTo(x, y, x + w, y, r);
  bmd.ctx.closePath();
  bmd.ctx.fillStyle = color;
  bmd.ctx.fill();
  return bmd;
};

SPG.Util.Display.MakePanel = function (game, w, h, r, color) {
  bmd = game.add.bitmapData(w, h);
  return SPG.Util.Display.RoundedRect(bmd, 0, 0, w, h, r, color);

};

SPG.Util.Display.MakePanelImg = function (game, w, h, r, color, x, y) {

  return game.add.image((x || 1), (y || 1), SPG.Util.Display.MakePanel(game, w, h, r, color));
};


SPG.Util.Display.MakeCircle = function (game, r, color) {
  bmd = game.add.bitmapData(r * 2, r * 2);

};

SPG.Util.Display.RoundedRectOutline = function (bmd, x, y, w, h, r, color, sw) {

  bmd.ctx.imageSmoothingEnabled = false;
  var strokeWidth = sw || 3;

  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;

  bmd.ctx.beginPath();
  bmd.ctx.moveTo(x + r, y);
  bmd.ctx.arcTo(x + w, y, x + w, y + h, r);
  bmd.ctx.arcTo(x + w, y + h, x, y + h, r);
  bmd.ctx.arcTo(x, y + h, x, y, r);
  bmd.ctx.arcTo(x, y, x + w, y, r);
  bmd.ctx.closePath();
  bmd.ctx.lineWidth = strokeWidth;
  bmd.ctx.strokeStyle = color;
  bmd.ctx.stroke();
  return bmd;
};

SPG.Util.Display.debugSprite = function (game, x, y, w, h, color) {
  //just gerneates a coloured box.
  var bmd = game.add.bitmapData(w, h);

  bmd.ctx.beginPath();
  bmd.ctx.rect(0, 0, w, h);
  bmd.ctx.fillStyle = color;

  bmd.ctx.fill();

  // use the bitmap data as the texture for the sprite
  var sprite = game.add.sprite(x, y, bmd);

  return sprite;
};

SPG.Util.Display.spaceOutText = function (inString) {

  var charCopy = '';
  for (var c = 0; c < inString.length; c++) {	
      charCopy += inString.charAt(c) + ' ';
  };

  return charCopy;
};
function initAudio() {
    // Sometimes audioContext.sampleRate is 48000 and not compatible with
    // unspecified devices.  Reinitializing seems to do the trick.
    window["PhaserGlobal"] = { audioContext: new window["webkitAudioContext"]() };
    window["PhaserGlobal"]["audioContext"].close();
    window["PhaserGlobal"] = { audioContext: new window["webkitAudioContext"]() };
    console.log("Reinitialized audio sample rate at ", window["PhaserGlobal"]["audioContext"].sampleRate);
  }

$( document ).ready(function() {
	 var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	if(iOS){
            // $("body").append("<span>ON iOS</span>");
		    // window.PhaserGlobal = { disableWebAudio: true }; //fixes web audio issues on iOS
	}
    // get dimensions of the window considering retina displaysvar w = window.innerWidth * window.devicePixelRatio,    h = window.innerHeight * window.devicePixelRatio;// simply pass them invar game = new Phaser.Game(w, h, Phaser.AUTO, 'gameContainer');
	window.game = new SPG.SPGame(540,960, Phaser.AUTO,null,null); //this should be all we need to start the game, to configure please see DefaultGameSettings.js
});

//# sourceMappingURL=game.js.map