
function Ship(length,start=[],orientation){
    let obj = {};
    obj.coordinates =[];
    if(orientation === "horizontal"){
        for(let i =0; i<length;i++){
            obj.coordinates.push([start[0]+i,start[1]]);
        }
    }
    else if(orientation === "vertical"){ 
        for(let i =0; i<length;i++){
            obj.coordinates.push([start[0],start[1]+i]);
        }
    }

    obj.length = length;
    obj.hits = 0;
    obj.status = "afloat";
    obj.hit = function (){
        if(this.hits != this.length){
        this.hits = this.hits + 1;
        }
        this.isSunk();
    }
    obj.isSunk = function (){
        if(this.hits == this.length){
            this.status="sunk";
        }
        else{
            this.status = "afloat"
        }
    }
    return obj;
}

function Gameboard(){
        let obj = {};
        obj.shipsonboard = 5;
        obj.ships = [Ship(3,[0,0],"horizontal"),Ship(2,[6,8],"vertical"),Ship(3,[5,2],"vertical"),Ship(2,[3,1],"horizontal"),Ship(1,[4,5],"vertical")];
        obj.shots = [];
        obj.Allshipcoordinates = function (){
            let array = [];
            for(let i=0;i<this.shipsonboard;i++){
                
                
                for(let j=0; j<this.ships[i].coordinates.length;j++){
                    array.push(this.ships[i].coordinates[j]);
                }

              
            }
            return array;
        }


        obj.recieveAttack = function (coordinates){
             this.shots.push(coordinates);
             for(let i =0; i<this.shipsonboard; i++){
                 for(let j=0;j<this.ships[i].coordinates.length;j++){
                       if((this.ships[i].coordinates[j][0] === coordinates[0]) && (this.ships[i].coordinates[j][1] === coordinates[1] ) ){
                             this.ships[i].hit();
                             return true;
                       }
                 }
             }
             return false;
        }

        obj.AllSunk = function (){
             count = 0;
             for(let i =0; i<this.shipsonboard; i++){
                 if(this.ships[i].status == "sunk"){
                     count = count + 1;
                 }
             }
             if(count === this.shipsonboard){
                 return true;
             }
             else{
                 return false;
             }
        } 

        return obj;
}
 
function Player() {
        let obj ={};
        obj.playerboard = Gameboard();
        obj.AutoMove = function (){
            let x =Math.floor(Math.random() * 10) + 1;
            let y =Math.floor(Math.random() * 10) + 1;
            return [x,y];
        }
        return obj;
}


function addBlocksToBoard(board){
    let block;
    for(let i=0;i<100;i++){
        block = document.createElement('div');
        block.style.height = "2rem";
        block.style.width = "2rem";
        block.style.border = "#05263B solid 2px"
        block.style['background-color'] = '#6AABD2';
        block.classList.add('gameblock');
        board.appendChild(block);
    }
}

let playerboard = document.querySelector(".board");
let computerboard = document.querySelector(".player2 .board");

addBlocksToBoard(playerboard);
addBlocksToBoard(computerboard);



function populatingplayerboards(player) {
    let coordinatestobemarked = player.playerboard.Allshipcoordinates();
    let blocks = document.querySelectorAll('.gameblock');
    let currentblock = blocks[90];
    currentblock.style['background-color'] = 'black';

    //includes function
    function includes(coordinates){
         for(let i=0;i<coordinatestobemarked.length;i++){
             if(coordinatestobemarked[i][0]===coordinates[0] && coordinatestobemarked[i][1]===coordinates[1]){
                        return true;
             }
         }
         return false;
    }

console.log(includes([4,0]));
    let k;
    for(let j=0;j<10;j++){
        currentblock = blocks[90-j*10];
        k = 90-j*10;
        for(let i=0;i<10;i++){
            currentblock = blocks[k+i];
             if(includes([i,j])){
                 console.log([i,j])
                 currentblock.style['background-color'] = 'black';
             }
        }
    } 
}

function Game() {
    let player1 = Player();
    let computer = Player();
    populatingplayerboards(player1);
    playround(player1,computer);
}

let enemyboardblocks = document.querySelectorAll(".player2 .gameblock");
let playerboardblocks = document.querySelectorAll(".player1 .gameblock");
let infodisplay = document.querySelector("span.display-turn");

function playround(player1,player2) {
    let k;
    let currentblock;
    for(let j=0;j<10;j++){
        for(let i=0;i<10;i++){
            currentblock = enemyboardblocks[(90-j*10)+i];
            currentblock.addEventListener('click',(e)=>{
                   
                   if(player2.playerboard.recieveAttack([i,j]) && (currentblock.style['background-color'] =='rgb(106, 171, 210)')){
                       e.target.style['background-color'] = 'red';
                       if(player2.playerboard.AllSunk()){
                              displaygameover('player');
                       }
                   }                     
                   else if(currentblock.style['background-color'] =='rgb(106, 171, 210)'){
                       e.target.style['background-color'] = 'white';
                       computerattacks(player2,player1);
                   }

            })             
        }
    } 
    
}


function computerattacks(computer,enemy){
                  let move = computer.AutoMove();
                  while(!(playerboardblocks[90-move[1]*10 + move[0]].style['background-color']=='rgb(106, 171, 210)')&&!(playerboardblocks[90-move[1]*10 + move[0]].style['background-color']=='black')){
                      move = computer.AutoMove();
                  }

                  if(enemy.playerboard.recieveAttack(move)){
                    playerboardblocks[90-move[1]*10 + move[0]].style['background-color'] ='red';
                   if(enemy.playerboard.AllSunk()){
                               displaygameover('computer');
                               return 0;
                   }
                   else{
                    computerattacks(computer,enemy);
                     }
                  }
                  else {
                    playerboardblocks[90-move[1]*10 + move[0]].style['background-color'] = 'white';
                  }
                  
}

function displaygameover(player) {
    let string = player;
            infodisplay.textContent = string + `Wins`;
}


let play = document.querySelector('.play');

play.addEventListener('click',()=>{
    Game();
})
