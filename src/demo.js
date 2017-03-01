/*global Phaser*/

var game = new Phaser.Game(600, 400, Phaser.AUTO, 'TutContainer', { preload: preload, create: create, update:update });
var dX=0;
var dY=0;
var upKey;
var downKey;
var leftKey;
var rightKey;
var levelData=
[[1,1,1,1,1,1],
[1,0,0,0,0,1],
[1,0,1,0,0,1],
[1,0,0,2,0,1],
[1,0,0,0,0,1],
[1,1,1,1,1,1]];
var tileWidth=50;
var borderOffset = new Phaser.Point(250,50);
var wallGraphicHeight=98;
var floorGraphicWidth=103;
var floorGraphicHeight=53;
var heroGraphicWidth=41;
var heroGraphicHeight=62;
var wallHeight=wallGraphicHeight-floorGraphicHeight; 
var heroHeight=(floorGraphicHeight/2)+(heroGraphicHeight-floorGraphicHeight);
var heroWidth= (floorGraphicWidth/2)-(heroGraphicWidth/2);
var facing='south';
var sorcerer;
var bmpText;
var normText;

function preload() {
    game.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
    game.load.image('greenTile', 'assets/green_tile.png');
    game.load.image('redTile', 'assets/red_tile.png');
    game.load.image('floor', 'assets/floor.png');
    game.load.image('wall', 'assets/block.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.atlasJSONArray('hero', 'assets/hero_8_4_41_62.png', 'assets/hero_8_4_41_62.json');
}

function create() {
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    game.stage.backgroundColor = '#cccccc';
    createLevel();
    bmpText = game.add.bitmapText(10, 10, 'font', 'Isometric Tutorial', 18);
    normText=game.add.text(10,360,"hi");
}

function update(){
    if (game.input.activePointer.isDown)
    {
        findTappedTile(game.input.activePointer.position);
    }
    
    if (upKey.isDown)
    {
        dY = -1;
    }
    else if (downKey.isDown)
    {
        dY = 1;
    }
    else
    {
        dY = 0;
    }
    if (rightKey.isDown)
    {
        dX = 1;
        if (dY == 0)
        {
            facing = "east";
        }
        else if (dY==1)
        {
            facing = "southeast";
            dX = dY=0.5;
        }
        else
        {
            facing = "northeast";
            dX=0.5;
            dY=-0.5;
        }
    }
    else if (leftKey.isDown)
    {
        dX = -1;
        if (dY == 0)
        {
            facing = "west";
        }
        else if (dY==1)
        {
            facing = "southwest";
            dY=0.5;
            dX=-0.5;
        }
        else
        {
            facing = "northwest";
            dX = dY=-0.5;
        }
    }
    else
    {
        dX = 0;
        if (dY == 0)
        {
            //facing="west";
        }
        else if (dY==1)
        {
            facing = "south";
        }
        else
        {
            facing = "north";
        }
    }
    if (dY == 0 && dX == 0)
    {
        sorcerer.animations.stop();
        sorcerer.animations.currentAnim.frame=0;
    }else{
        if(sorcerer.animations.currentAnim!=facing){
            sorcerer.animations.play(facing);
        }
    }
}

function createLevel(){
    var tileType=0;
    for (var i = 0; i < levelData.length; i++)
    {
        for (var j = 0; j < levelData[0].length; j++)
        {
            tileType=levelData[i][j];
            placeTileIso(tileType,i,j);
            if(tileType==2){
                addHeroIso(i,j);
            }
        }
        
    }
}
function addHeroIso(i,j){
    var isoPt= new Phaser.Point();
    var cartPt=new Phaser.Point();
    cartPt.x=j*tileWidth;
    cartPt.y=i*tileWidth;
    isoPt=cartesianToIsometric(cartPt);
    // sprite
    sorcerer = game.add.sprite(isoPt.x+borderOffset.x+heroWidth, isoPt.y+borderOffset.y-heroHeight, 'hero', '1.png');
   
    // animation
    sorcerer.animations.add('southeast', ['1.png','2.png','3.png','4.png'], 6, true);
    sorcerer.animations.add('south', ['5.png','6.png','7.png','8.png'], 6, true);
    sorcerer.animations.add('southwest', ['9.png','10.png','11.png','12.png'], 6, true);
    sorcerer.animations.add('west', ['13.png','14.png','15.png','16.png'], 6, true);
    sorcerer.animations.add('northwest', ['17.png','18.png','19.png','20.png'], 6, true);
    sorcerer.animations.add('north', ['21.png','22.png','23.png','24.png'], 6, true);
    sorcerer.animations.add('northeast', ['25.png','26.png','27.png','28.png'], 6, true);
    sorcerer.animations.add('east', ['29.png','30.png','31.png','32.png'], 6, true);
}
function placeTile(tileType,i,j){
    var tile='greenTile';
    if(tileType==1){
        tile='redTile';
    }
    game.add.sprite(j * tileWidth, i * tileWidth, tile);
}
function placeTileIso(tileType,i,j){
    var isoPt= new Phaser.Point();
    var cartPt=new Phaser.Point();
    cartPt.x=j*tileWidth;
    cartPt.y=i*tileWidth;
    isoPt=cartesianToIsometric(cartPt);
    var tile='floor';
    if(tileType==1){
        tile='wall';
        game.add.sprite(isoPt.x+borderOffset.x, isoPt.y+borderOffset.y-wallHeight, tile);
    }else{
        game.add.sprite(isoPt.x+borderOffset.x, isoPt.y+borderOffset.y, tile);
    }
}
function findTappedTile(tapPt){
    var isoPt=new Phaser.Point();
    isoPt.x=tapPt.x-borderOffset.x-(floorGraphicWidth/2);
    isoPt.y=tapPt.y-borderOffset.y-(floorGraphicHeight/2);
    var cartPt=getTileCoordinates(isometricToCartesian(isoPt),tileWidth);
    normText.text=cartPt.x +':'+cartPt.y;
}

function cartesianToIsometric(cartPt){
    var tempPt=new Phaser.Point();
    tempPt.x=cartPt.x-cartPt.y;
    tempPt.y=(cartPt.x+cartPt.y)/2;
    return tempPt;
}
function isometricToCartesian(isoPt){
    var tempPt=new Phaser.Point();
    tempPt.x=(2*isoPt.y+isoPt.x)/2;
    tempPt.y=(2*isoPt.y-isoPt.x)/2;
    return tempPt;
}
function getTileCoordinates(cartPt, tileHeight){
    var tempPt=new Phaser.Point();
    tempPt.x=Math.floor(cartPt.x/tileHeight);
    tempPt.y=Math.floor(cartPt.y/tileHeight);
    return(tempPt);
}
function getCartesianFromTileCoordinates(tilePt, tileHeight){
    var tempPt=new Phaser.Point();
    tempPt.x=tilePt.x*tileHeight;
    tempPt.y=tilePt.y*tileHeight;
    return(tempPt);
}
