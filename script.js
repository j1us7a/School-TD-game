
let canvas = document.getElementById("main");
let ctx = canvas.getContext("2d");

let tickSpeed = 16; // ~60fps

//Enemy spawning
let enemyTimer = 1000;

function spawnMob() {
    mobs.push({x: path[0].x - 10, y: path[0].y - 10, w:20, h:20, vx:0, vy:0, hp:1, order:0, v:1});
}
//Turn on game
let gameOn = 0;

function startGame() {
    if (gameOn == 0) {
        //Start movement
        setInterval(mobMovement, tickSpeed);
        gameOn = 1;

        //Spawn mobs
        setInterval(spawnMob, enemyTimer);
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
                mobs.splice(i,i+1)
                console.log("mob " + i + " reached the end");
                
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

//Placing
function selectTower1() {
    if (tower1Selected == false) {
        tower1Selected = true;
        document.getElementById("tower1Button").textContent = "Deselect Tower 1";
    }
    else {
        tower1Selected = false;
        document.getElementById("tower1Button").textContent = "Select Tower 1";
    }
}

//declare towers
let towers = [];
let tower1Selected = false;
let tower1r = 100;

document.addEventListener("click", function(e) {
    if (tower1Selected == true && mouse.x < 800 && mouse.y < 500) {
        towers.push({x: Math.round((mouse.x - 10) / 40) * 40, y: Math.round((mouse.y - 10) / 40) * 40, w: 30, h: 30, dmg: 1, hasKill: false, r:100});
    }
})

//tower dmg
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
                    mobs.splice(j, j+1);
                    console.log("mob " + j + " died");
                }
            }
        }
        towers[i].hasKill = false;
    }
}
setInterval(towerDmg, dmgCycle);

/*
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
                    mobs.splice(j, j+1);
                    console.log("mob " + j + " died");
                }
            }
        }
        towers[i].hasKill = false;
    }
}
setInterval(towerDmg, dmgCycle);
*/

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

    requestAnimationFrame(mainloop);
}
mainloop();