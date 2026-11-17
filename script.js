
let canvas = document.getElementById("main");
let ctx = canvas.getContext("2d");

let tickSpeed = 16;

//VARIABLES FOR HTML STATS
let kills = 0;
let towerCount = 0;

//Enemy spawning
let round = 0;
let roundDelaySeconds = 60;
let enemyTimer = 2000;

//Turn on game
let gameOn = false;

function startGame() {
    if (gameOn == false) {
        setInterval(mobMovement, tickSpeed);
        setInterval(spawnMob, enemyTimer);
        setInterval(towerDmg, dmgCycle);
        setInterval(changeRound, roundDelaySeconds * 1000)
        
        gameOn = true;
    }
}

//Rounds
function changeRound() {
    round += 1;
}

//Canvas variables
let bgColor = "seagreen";


//ENEMY CREATION AND MOVEMENT
function spawnMob() {
    if (round == 0) {
        mobs.push({x:path[0].x - 10, y:path[0].y - 10, w:20, h:20, vx:0, vy:0, hp:1, order:0, v:1, dmg:1, color: "red"});
    }
    
    if (round == 1) {
        enemyTimer = 4000;
        mobs.push({x:path[0].x - 10, y:path[0].y - 10, w:20, h:20, vx:0, vy:0, hp:3, order:0, v:0.5, dmg:5, color: "orange"});
    }
    
    if (round >= 2) {
        enemyTimer = 3000;
        mobs.push({x:path[0].x - 10, y:path[0].y - 10, w:20, h:20, vx:0, vy:0, hp:3, order:0, v:0.5, dmg:5, color: "orange"});
        mobs.push({x:path[0].x - 10, y:path[0].y - 10, w:20, h:20, vx:0, vy:0, hp:1, order:0, v:1, dmg:1, color: "red"});
    }
}

//Enemy path
let path = [
    {x:-30, y:75, vx:1, vy:0},
    {x:135, y:75, vx:0, vy:1},
    {x:135, y:375, vx:1, vy:0},
    {x:255, y:375, vx:0, vy:1},
    {x:255, y:465, vx:1, vy:0},
    {x:375, y:465, vx:0, vy:-1},
    {x:375, y:255, vx:-1, vy:0},
    {x:255, y:255, vx:0, vy:-1},
    {x:255, y:135, vx:1, vy:0},
    {x:555, y:135, vx:0, vy:1},
    {x:555, y:630, vx:0, vy:0},
]

//Enemy array
let mobs = [];

let hp = 100;

//Mob movements
function mobMovement() {
    for(let i=0; i < mobs.length; i++) {
        mobs[i].vx = path[mobs[i].order].vx;
        mobs[i].x += mobs[i].vx * mobs[i].v;

        mobs[i].vy = path[mobs[i].order].vy;
        mobs[i].y += mobs[i].vy * mobs[i].v;

        //if at path a move to path b
        if(mobs[i].x + mobs[i].w/2 == path[mobs[i].order+1].x && mobs[i].y + mobs[i].h/2 == path[mobs[i].order+1].y) {
            if(mobs[i].order == path.length - 2) {
                //remove mob when at finish
                mobs.splice(i,1);
                //remove hp
                hp -= mobs[i].dmg;
            }
            else {
                //change path to next point
                mobs[i].order += 1;
            }
        }
    }
}
//TOWERPLACING
//Mouse Position
let mouse = {x:0, y:0, down: false,}

let towerMouseX = 0;
let towerMouseY = 0;
document.addEventListener("mousemove", function(e) {
    //get canvas offset
    let rect = canvas.getBoundingClientRect();
    //overwrite pos
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    towerMouseX = Math.round((mouse.x - 15) / 30) * 30 + 15;
    towerMouseY = Math.round((mouse.y - 15) / 30) * 30 + 15;
})


//Placing
let towers = [];
let tower1Selected = false;
let tower1r = 100;

let canPlace = true;
function checkHitbox() {
    canPlace = true;
    for (let i = 1; i < path.length; i++) {
        if (path[i-1].vx > 0 || path[i-1].vy > 0) {
            if (towerMouseX + 15 >= path[i -1].x - 10 
            && towerMouseX - 15 <= path[i].x + 10
            && towerMouseY + 15 >= path[i -1].y - 10
            && towerMouseY - 15 <= path[i].y + 10) {
                canPlace = false;
            }
        }
        if (path[i-1].vx < 0 || path[i-1].vy < 0) {
            if (towerMouseX - 15 <= path[i -1].x + 10 
            && towerMouseX + 15>= path[i].x - 10
            && towerMouseY - 15<= path[i -1].y + 10
            && towerMouseY + 15>= path[i].y - 10) {
                canPlace = false;
            }
        }
    }
    for (let i = 0; i < towers.length; i++) {
        if (towerMouseX == towers[i].x && towerMouseY == towers[i].y) {
            canPlace = false;
        }
    }
}

let radiusPlaceColor = "#ffffff44";

function towerHighlight() {
    ctx.beginPath();
    ctx.arc(towerMouseX, towerMouseY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#0000ff44";
    ctx.fill();
    ctx.stroke;

    if (canPlace == false) {
        radiusPlaceColor = "#ff000044";
    }
    if (canPlace == true) {
        radiusPlaceColor = "#ffffff44";
    }

    ctx.beginPath();
    ctx.arc(towerMouseX, towerMouseY, tower1r, 0, 2 * Math.PI);
    ctx.fillStyle = radiusPlaceColor;
    ctx.fill();
    ctx.stroke;
}

function selectTower1() {
    if (tower1Selected == false) {
        tower1Selected = true;
        document.getElementById('tower1Button').innerHTML = "Deselect Tower 1";
    }
    else {
        tower1Selected = false;
        document.getElementById('tower1Button').innerHTML = "$10 Tower 1";
    }
}

let money = 15;

document.addEventListener("click", function(e) {
    if (tower1Selected == true && mouse.x < canvas.width && mouse.y < canvas.height && money >= 10 && canPlace == true) {
        money -= 10;
        towers.push({x: towerMouseX, y: towerMouseY, w: 30, dmg: 1, hasKill: false, r:100});
        towerCount = towers.length;
        document.getElementById('towerCount').innerHTML = "Towers: " + towerCount;
    }
})

//Tower dmg
let dmgCycle = 3000;

function towerDmg() {
    for (let i = 0; i < towers.length; i++){
        for (let j = 0; j < mobs.length; j++){
            x = towers[i].x - mobs[j].x;
            y = towers[i].y - mobs[j].y;
            hyp = Math.hypot(x,y);

            if (hyp < towers[i].r && !towers[i].hasKill) {
                towers[i].hasKill = true;
                mobs[j].hp -= towers[i].dmg; 
                
                if (mobs[j].hp <= 0) {
                    mobs.splice(j, 1);
                    kills += 1;
                    money += 1;
                    document.getElementById('killCount').innerHTML = "Kills: " + kills;
                }
            }
        }
        towers[i].hasKill = false;
    }
}

//MAINLOOP
function mainloop() {
    //Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //path stuff
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 0; i < path.length; i++) {
        ctx.fillStyle = "black";
        ctx.lineTo(path[i].x, path[i].y);
        ctx.lineWidth = 20;
        ctx.stroke();
    }

    //Mob painting
    for (let i=0; i < mobs.length; i++) {
        ctx.fillStyle = mobs[i].color;
        ctx.fillRect(mobs[i].x, mobs[i].y, mobs[i].w, mobs[i].h);
    }

    //tower painting
    for (let i=0; i < towers.length; i++) {
        ctx.beginPath();
        ctx.arc(towers[i].x, towers[i].y, towers[i].w / 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#0000aa";
        ctx.fill();
        ctx.stroke;
    }

    //mob selection highlight
    if (tower1Selected == true) {
        towerHighlight();
        checkHitbox();
    }

    //Too expencive
    if (money < 10) {
        document.getElementById('tower1Button').style.backgroundColor = "#ff0000";
    }
    else {
        
        document.getElementById('tower1Button').style.backgroundColor = "#ffffff";
    }

    //Update text
    if (hp <= 0) {
        document.getElementById('hpBarColor').style.width = 0;
        hp = 0;
    }
    else {
        document.getElementById('hpBarColor').style.width = hp + "%";
    }
    document.getElementById('moneyCount').innerHTML = "$: " + money;
    document.getElementById('hpNum').innerHTML = "HP: " + hp;
    document.getElementById('roundCount').innerHTML = "Round: " + round;
    
    requestAnimationFrame(mainloop);
}
mainloop();