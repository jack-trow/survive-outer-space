// Background = Pavement
// Obstacles = Enemy Racecars
// Copter = Your Car
// Bot/Top Terrain = Crowd

var DELAY = 40;
var SPEED = 5;
var MAX_DY = 12;

var OBSTACLE_WIDTH = 30;
var OBSTACLE_HEIGHT = 200;

var TERRAIN_WIDTH = 50; 
var MIN_TERRAIN_HEIGHT = 20;
var MAX_TERRAIN_HEIGHT = 50;

var NUM_OBSTACLES = 1;

var copter;
var dy = 0;
var clicking = false;

var DUST_RADIUS = 3;
var DUST_BUFFER = 10;

var POINTS_PER_ROUND = 5;
var points = 0;
var score; // text on the screen

var pointsHighScore = 0;
var highScore; // text on screen

var level; // text on the screen
var levelNum = 1;

var text;
var pointsText;

var obstacles = [];
var top_terrain = [];
var bottom_terrain = [];
var dust = [];

function start() {
    setup();
    setTimer(game, DELAY);
    mouseDownMethod(onMouseDown);
    mouseUpMethod(onMouseUp);
}

function setup() {
    setBackgroundColor(Color.black);
    copter = new WebImage(ImageLibrary.Objects.helicopter);
    copter.setSize(50,25);
    copter.setPosition(getWidth()/3,getHeight()/2);
    copter.setColor(Color.blue);
    add(copter);
    
    addObstacles();
    addTerrain();
    
    score = new Text("");
    score.setColor(Color.white);
    score.setPosition(10,30);
    add(score);
    
    highScore = new Text("");
    highScore.setColor(Color.white);
    highScore.setPosition(90, 30);
    add(highScore);
    
    level = new Text("");
    level.setColor(Color.red);
    level.setPosition(300,30);
    add(level);
}

function updateScore() {
    points += POINTS_PER_ROUND;
    score.setText(points);
}

function updateHighScore() {
    if(points > pointsHighScore) {
        pointsHighScore = points;
    }
    highScore.setText("High Score: " + pointsHighScore);
}

function game() {
    updateScore();
    updateHighScore();
    updateLevel();
    if(hitWall()) {
        lose();
        return;
    }
    var collider = getCollider();
    if(collider != null && collider != copter) {
        lose();
        return;
    }
    if(clicking) {
        dy -= 1;
        if(dy < -MAX_DY) {
            dy = -MAX_DY;
        }
    } else {
        dy += 1;
        if(dy > MAX_DY) {
            dy = MAX_DY;
        }
    }
    copter.move(0,dy);
    moveObstacle();
    moveTerrain();
    moveDust();
    addDust();
}

function updateLevel() {
    if(points > -1) { level.setText("Level " + levelNum);}
    if(points == 1000) { SPEED++;levelNum++; }
    if(points == 2000) { SPEED++;levelNum++; }
    if(points == 3000) { SPEED++;levelNum++; }
    if(points == 4000) { SPEED++;levelNum++; }
    if(points == 5000) { SPEED++;levelNum++; }
    if(points == 6000) { SPEED++;levelNum++; }
    if(points == 7000) { SPEED++;levelNum++; }
    if(points == 8000) { SPEED++;levelNum++; }
}

function onMouseDown(e) {
    clicking = true;
}

function onMouseUp(e) {
    clicking = false;
}

function addObstacles() {
    for(var i = 0; i < NUM_OBSTACLES; i++) {
        var obstacle = new Rectangle(OBSTACLE_WIDTH,OBSTACLE_HEIGHT);
        obstacle.setColor(Color.gray);
        obstacle.setPosition(getWidth() + i * (getWidth()/NUM_OBSTACLES),Randomizer.nextInt(0, getHeight() - OBSTACLE_HEIGHT));
        obstacles.push(obstacle);
        add(obstacle);
    }
}

function moveObstacle() {
    for(var i = 0; i < obstacles.length; i++) {
        var obstacle = obstacles[i];
        obstacle.move(-SPEED, 0)
        if(obstacle.getX() < 0) {
            obstacle.setPosition(getWidth(),Randomizer.nextInt(0, getHeight() - OBSTACLE_HEIGHT));
        }
    }
}

function hitWall() {
    var hit_top = copter.getY() < 0;
    var hit_bottom = copter.getY() + copter.getHeight() > getHeight();
    return hit_top || hit_bottom;
}

function lose() {
    stopTimer(game);
    text = new Text("You Lose!");
    text.setColor(Color.red);
    text.setPosition(getWidth()/2 - text.getWidth()/2,getHeight()/2-150);
    add(text);
    
    pointsText = new Text("Score: " + points);
    pointsText.setColor(Color.white);
    pointsText.setPosition(getWidth()/2 - pointsText.getWidth()/2,getHeight()/2+50);
    add(pointsText);
    
    highScore.setPosition(getWidth()/2 - highScore.getWidth()/2,getHeight()/2-50);
    
    document.body.onkeyup = function(e) {
        if(e.code == "Space") {
            reset();
        }
    }
}

function getCollider() {
    var topLeft = getElementAt(copter.getX()-1,copter.getY()-1);
    if(topLeft != null) {
        return topLeft;
    }
    
    var topRight = getElementAt(copter.getX()+copter.getWidth()+1,copter.getY()-1);
    if(topRight != null) {
        return topRight;
    }
    
    var bottomLeft = getElementAt(copter.getX()-1,copter.getY()+copter.getHeight()+1);
    if(bottomLeft != null) {
        return bottomLeft;
    }
    
    var bottomRight = getElementAt(copter.getX()+copter.getWidth()+1,copter.getY()+copter.getHeight()+1);
    if(bottomRight != null) {
        return bottomRight;
    }
    
    return null;
}

function addTerrain() {
    for(var i = 0; i <= getWidth() / TERRAIN_WIDTH; i++) {
        var height = Randomizer.nextInt(MIN_TERRAIN_HEIGHT,MAX_TERRAIN_HEIGHT);
        var terrain = new Rectangle(TERRAIN_WIDTH, height);
        terrain.setPosition(TERRAIN_WIDTH * i,0);
        terrain.setColor(Color.gray);
        top_terrain.push(terrain);
        add(terrain);
        
        height = Randomizer.nextInt(MIN_TERRAIN_HEIGHT,MAX_TERRAIN_HEIGHT);
        var bottomTerrain = new Rectangle(TERRAIN_WIDTH, height);
        bottomTerrain.setPosition(TERRAIN_WIDTH * i,getHeight()-bottomTerrain.getHeight());
        bottomTerrain.setColor(Color.gray);
        bottom_terrain.push(bottomTerrain);
        add(bottomTerrain);
    }
}

function moveTerrain() {
    for(var i = 0; i < top_terrain.length; i++) {
        var obj = top_terrain[i];
        obj.move(-5,0);
        if(obj.getX() < -obj.getWidth()) {
            obj.setPosition(getWidth(),0);
        }
    }
    
    for(var i = 0; i < bottom_terrain.length; i++) {
        var obj = bottom_terrain[i];
        obj.move(-5,0);
        if(obj.getX() < -obj.getWidth()) {
            obj.setPosition(getWidth(),getHeight()-obj.getHeight());
        }
    }
}

function addDust() {
    var d = new Circle(DUST_RADIUS);
    d.setColor("#cccccc");
    d.setPosition(copter.getX() - d.getWidth(), copter.getY() + DUST_BUFFER);
    dust.push(d);
    add(d);
}

function moveDust() {
    for(var i = 0; i < dust.length; i++) {
        var d = dust[i];
        d.move(-SPEED,0);
        d.setRadius(d.getRadius() - 0.1);
        if(d.getX() < 0) {
            remove(d);
            dust.remove(i);
            i--;
        }
    }
}

function reset() {
    SPEED = 5;
    remove(copter);
    
    clicking = false;
    
    points = 0;

    levelNum = 0;
    text.setText("");
    highScore.setText("");
    
    pointsText.setText("");
    score.setText("");
    
    for(var i = 0; i < dust.length; i++) {
        remove(dust[i]);
    }
    for(var i = 0; i < obstacles.length; i++) {
        remove(obstacles[i]);
    }
    for(var i = 0; i < bottom_terrain.length; i++) {
        remove(bottom_terrain[i]);
    }
    for(var i = 0; i < top_terrain.length; i++) {
        remove(top_terrain[i]);
    }
    
    setup();
    setTimer(game, DELAY);
}
