let board ;
let score = 0;
let rows = 4;
let columns = 4;
// This variables will be used to assure that the player will be congratulated, only one time, after reaching 2048, 4096, 8192.
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;


let startX = 0;
let startY = 0;

function setGame(){
	board = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	        
    ]; //Goal , we will use this backend board to create our frontend board.
	for(let r = 0; r < rows; r++){
		for (let c= 0; c < columns; c++){
			// create and design a tile

			let tile = document.createElement("div");
			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}
	setTwo();
	setTwo();
}
// updateTile () - updates the appearance of the tile (that should have tile number annd background color)
function updateTile(tile,num){
	tile.innerText = "";
	tile.classList.value = "";
	tile.classList.add("tile");
	// updateTile() uses our prepared styles in style.css
	if (num > 0){
		tile.innerText = num.toString();
		if (num <= 4096){
			tile.classList.add("x" + num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}

}
window.onload = function(){
	setGame();
}

function handleSlide(event){
	let userInput = event.code; //event.code - is the pressed key in our keyboard.

	if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){
		event.preventDefault();
		console.log(event.code); // prevents the default behaviour in our browser, whn pressing arrow keys (default behavior to prevent: whenever pressing arrow keys, the whole game also joins in sliding)
		if (event.code == "ArrowLeft"){
			slideLeft();
		}
		else if(event.code == "ArrowRight"){
			slideRight();
		}
		else if(event.code == "ArrowUp"){
			slideUp();
		}
		else if(event.code == "ArrowDown"){
			slideDown();
		}
		setTwo();
		
	}
	checkWin();
	if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart");
		restartGame();
		alert("Click any arrow key to restart");
	}
	document.getElementById("score").innerText = score
}
document.addEventListener("keydown", handleSlide)

function slideLeft(){
	console.log("Hi! Slide Left!")
	for (let r = 0; r < rows; r++){
		let row = board[r] 
		let originalRow = row.slice();
		row = slide(row); // used to merge tiles
		board[r] = row;
		 //added

		for(let c = 0 ; c < columns ; c++){
			// this code is to retrieve our tile element 
			let tile = document.getElementById(r.toString() + "-" + c.toString())
			let num = board[r][c];
			//Animation Code
			if(originalRow[c] !== num && num!==0){
				tile.style.animation = "slide-from-right 0.3s";
				setTimeout(()=> {
					tile.style.animation = ""
				}, 300);
			}
			//updates the appearance of the tile
			updateTile(tile, num);


		}
	}
}

function slideRight(){
	console.log("Hi! Slide Right")
	for (let r = 0; r < rows; r++){
		let row = board[r];
		let originalRow = row.slice();
		row.reverse();
		row = slide(row); // used to merge tiles
		row.reverse();
		board[r] = row;

		for(let c = 0 ; c < columns ; c++){
			// this code is to retrieve our tile element 
			let tile = document.getElementById(r.toString() + "-" + c.toString())
			let num = board[r][c];
			if(originalRow[c] !== num && num!==0){
				tile.style.animation = "slide-from-left 0.3s";
				setTimeout(()=> {
					tile.style.animation = ""
				}, 300);
			}
			//updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}
function slideUp(){
	console.log("Hi! Slide Up!");
	for (let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		let originalCol = col.slice();
		col = slide(col); // used to merge tiles

		let changeIndices = [];
		for (let r=0; r<rows; r++){
			if (originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}
		
		for(let r = 0 ; r < rows ; r++){
			// this code is to retrieve our tile element 
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			if (changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}
			//updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

function slideDown(){
	console.log("Hi! Slide Down!");
	for (let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		let originalCol = col.slice();
		col.reverse();
		col = slide(col); // used to merge tiles
		col.reverse();
		let changeIndices = [];
		for (let r=0; r<rows; r++){
			if (originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}

		for(let r = 0 ; r < rows ; r++){
			// this code is to retrieve our tile element 
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			if (changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}
			//updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}
// slide function merges the same adjacent tile
// Core function
function slide(row){
	row = filterZero(row);
	for (let i = 0; i<row.length - 1; i++){
		if (row[i] == row[i+1]){
			row[i] *= 2; // 4 2
			row[i+1] = 0; // 4 0
			score += row[i];
		}
	}
	//adds the zeroes back
	while (row.length<columns){
		row.push(0);
	}
	return row;
}
// .filter - removes the zero
function filterZero(row){
	return row.filter(num => num != 0);
}


// checks if the gameboard still have 0 values
function hasEmptyTile(){

	//loop
	for(let r=0; r<rows;r++){
		for(let c=0; c<columns; c++){
			if (board[r][c]==0){
				return true;
			}
		}
	}
	return false;
}

function setTwo(){
	if (hasEmptyTile() == false){
		return; // I will do nothing
	}

	// the codes below are the codes to be executed once the above condition is not satisfied.
	let found = false;
	while(!found){
		// this is to generate a random row and column to generate a random 2.
		let r= Math.floor(Math.random()* rows);
		let c= Math.floor(Math.random()* columns);
		console.log(r);
		console.log(c);
		// if the random tile is an empty tile, the program will make the tile have a value of 2.
		if (board[r][c] == 0){
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}

function checkWin(){
	for(let r = 0; r < rows; r++){
		for (let c= 0; c < columns; c++){
			if (board[r][c] == 2048 & is2048Exist == false){
				alert("YOU JUST WON! Congrats for reaching new milestone: 2048");
				is2048Exist = true;
			}
			else if (board[r][c] == 4096 & is4096Exist == false){
				alert("YOU JUST WON! Congrats for reaching new milestone: 4096");
				is4096Exist = true;
			}
			else if (board[r][c] == 8192 & is8192Exist == false){
				alert("YOU JUST WON! Congrats for reaching new milestone: 8192");
				is8192Exist = true;
			}
		}	
	}
}

function hasLost(){
	for(let r = 0; r < rows; r++){
		for (let c= 0; c < columns; c++){

			// if there is an empty tile, the player has not yet lost the game
			if (board[r][c]==0){
				return false;
			}
			const currentTile = board[r][c];
			if (
				// checks the current tile if it has possible merge in its upper tile
				r>0 && board[r-1][c] === currentTile ||
				// checks the current tile if it has possible merge in its lower tile
				r < rows - 1 && board[r+1][c] === currentTile ||
				// checks the current tile if it has possible merge in its left tile
				c > 0 && board [r][c-1] === currentTile || 
				// checks the current tile if it has possible merge in its right tile
				c < columns - 1 && board[r][c+1] == currentTile){
				return false;
			}
		}
	}
	return true;
}
function restartGame(){
	for (let r = 0; r < rows; r++){
		for (let c = 0; c < columns ; c++){
			board[r][c] = 0;
		}
	}
	score = 0;
	setTwo();
}



document.addEventListener('touchstart', (event) => {
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
})

document.addEventListener('touchend',(event) => {
	if(!event.target.className.includes("tile")){
		return;
	}
	let diffX = startX - event.changedTouches[0].clientX;
	let diffY = startY - event.changedTouches[0].clientY;
	if (Math.abs(diffX) > Math.abs(diffY)){
		if (diffX > 0){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{
		if (diffY > 0){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}
	}
	document.getElementById("score").innerText = score;
	checkWin();
	if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart");
		restartGame();
		alert("Click to restart");
	}
});

document.addEventListener('touchmove',(e) =>{
	if (!e.target.className.includes("tile")){
		return;
	}
	e.preventDefault();
}, {passive: false}); // Use passive : false, to make preventDefault() work
