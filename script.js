
let canvas = document.getElementById("main");
let ctx = canvas.getContext("2d");

let tickSpeed = 16; // ~60fps

//VARIABLES FOR HTML STATS
let kills = 0;
let towerCount = 0;

//Enemy spawning
let enemyTimer = 2000;

function spawnMob() {
    mobs.push({x:path[0].x - 10, y:path[0].y - 10, w:20, h:20, vx:0, vy:0, hp:1, order:0, v:1, dmg:1});
}
//Turn on game
let gameOn = false;

function startGame() {
    if (gameOn == false) {
        setInterval(mobMovement, tickSpeed);
        setInterval(spawnMob, enemyTimer);
        setInterval(towerDmg, dmgCycle);

        gameOn = true;
    }
}

//Canvas variables
let bgColor = "seagreen";
let mobColor = "red";


//ENEMY CREATION AND MOVEMENT
//Enemy path
let path = [
    {x:-50, y:50, vx:1, vy:0},
    {x:100, y:50, vx:0, vy:1},
    {x:100, y:300, vx:1, vy:0},
    {x:200, y:300, vx:0, vy:1},
    {x:200, y:400, vx:1, vy:0},
    {x:300, y:400, vx:0, vy:-1},
    {x:300, y:200, vx:-1, vy:0},
    {x:200, y:200, vx:0, vy:-1},
    {x:200, y:100, vx:1, vy:0},
    {x:500, y:100, vx:0, vy:1},
    {x:500, y:550, vx:0, vy:0},
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
                document.getElementById("hpBarColor").style.width = hp + "%";
                document.getElementById("hpNum").innerHTML = "HP: " + hp;
            }
            else {
                //change path to next point
                mobs[i].order += 1;
            }
        }
    }
}
//TOWERPLACING
//declare mouse
let mouse = {x:0, y:0, down: false,}

//mousePos
document.addEventListener("mousemove", function(e) {
    //get canvas offset
    let rect = canvas.getBoundingClientRect();
    //overwrite pos
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
})
//Money
let money = 10;

//Placing
function selectTower1() {
    if (tower1Selected == false && money >= 10) {
        tower1Selected = true;
        money -= 10;
        document.getElementById("moneyCount").innerHTML = "$: " + money;
        document.getElementById("tower1Button").innerHTML = "Deselect Tower 1";
    }
    else {
        tower1Selected = false;
        document.getElementById("tower1Button").innerHTML = "$10 Tower 1";
    }
}

//declare towers
let towers = [];
let tower1Selected = false;
let tower1r = 100;

document.addEventListener("click", function(e) {
    if (tower1Selected == true && mouse.x < 800 && mouse.y < 500) {
        towers.push({x: Math.round((mouse.x - 10) / 40) * 40, y: Math.round((mouse.y - 10) / 40) * 40, w: 30, h: 30, dmg: 1, hasKill: false, r:100});
        towerCount = towers.length;
        document.getElementById("towerCount").innerHTML = "Towers: " + towerCount;
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
                    document.getElementById("killCount").innerHTML = "Kills: " + kills;
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
    for (let i = 0;i < path.length;i++) {
        ctx.fillStyle = "black";
        ctx.lineTo(path[i].x, path[i].y);
        ctx.lineWidth = 20;
        ctx.stroke();
    }

    //Mob painting
    for (let i=0; i < mobs.length; i++) {
        ctx.fillStyle = mobColor;
        ctx.fillRect(mobs[i].x, mobs[i].y, mobs[i].w, mobs[i].h);
    }

    //tower painting
    for (let i=0; i < towers.length; i++) {
        ctx.fillStyle = "#0000aa";
        ctx.fillRect(towers[i].x, towers[i].y, towers[i].w, towers[i].h);
    }

    //mob selection highlight
    if (tower1Selected == true) {
        ctx.fillStyle = "#0000ff44";
        ctx.fillRect(Math.round((mouse.x - 10) / 40) * 40, Math.round((mouse.y - 10) / 40) * 40, 30, 30)

        ctx.beginPath();
        ctx.arc(Math.round((mouse.x - 10) / 40) * 40 + 15, Math.round((mouse.y - 10) / 40) * 40 + 15, tower1r, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff44";
        ctx.fill();
        ctx.stroke;
    }

    //Too expencive
    if (money < 10) {
        document.getElementById("tower1Button").style.backgroundColor = "#ff0000";
    }
    else {
        
        document.getElementById("tower1Button").style.backgroundColor = "#ffffff";
    }

    requestAnimationFrame(mainloop);
}
mainloop();