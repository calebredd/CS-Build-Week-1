//Setting up cache arrays for quick turnarounds
let indexCache=[];
let cache1 = [0];
let cache2 = [0];
//Initial square size setup of GO Board
let size= 25;
let indexCount = 1;
for(let i=0; i<size; i++){
	$('#goBoard').append('<tr id="row'+i+'"></tr>');
	for(let j=0; j<size; j++){
		$('#row'+i).append('<td id="row'+i+'column'+j+'" data-index="'+indexCount+'" data-row="'+i+'" data-column="'+j+'" class="row'+i+' column'+j+'"></tr>');
		let tl = ( j != 0 && i != 0) ? indexCount-size-1 : 0;
		let tm = ( i != 0) ? indexCount-size : 0;
		let tr = ( j != size-1 && i != 0) ? indexCount-size+1 : 0;
		let ml = ( j != 0 ) ? indexCount-1 : 0;
		let mr = ( j != size-1 ) ? indexCount+1 : 0;
		let bl = ( j != 0 && i != size-1) ? indexCount+size-1 : 0;
		let bm = ( i != size-1 ) ? indexCount+size : 0;
		let br = ( j != size-1 && i != size-1) ? indexCount+size+1 : 0;
		indexCache[indexCount]={'tl':tl, 'tm':tm, 'tr':tr, 'ml':ml, 'mr':mr, 'bl':bl, 'bm':bm, 'br':br};
		//console.log(indexCount);
		//console.log(indexCache[indexCount]);
		indexCount++;
	}
}

//Randomly establish the board
function random(){
	cache2=[0];
	cache1=[0];
	$('#goBoard tr td').each(function(index){
		index = index + 1
		$(this).css('background-color', '#FFF');
		if( Math.random() < 0.5){
			$(this).css('background-color', '#C0C0C0');
			cache1[index]=1;
		}else{
			cache1[index]=0;
		}
	});
	//console.log(cache1);
}
function randomBlank(){
	cache2=[0];
	cache1=[0];
	$('#goBoard tr td').each(function(index){
		index = index + 1
		$(this).css('background-color', '#FFF');
		if( Math.random() < 0.5){
			cache1[index]=1;
		}else{
			cache1[index]=0;
		}
	});
	//console.log(cache1);
}
random();

//Main evaluation
function main(){
	//console.log('cache1 : '+cache1.length+ ' cache2 : '+cache2.length);
	if (cache1.length>1){
		$('#goBoard tr td').each(function(index){
			index = index + 1;
			let neighbors = 
				 cache1[indexCache[index]['tl'] ]
				+cache1[indexCache[index]['tm'] ] 
				+cache1[indexCache[index]['tr'] ] 
				+cache1[indexCache[index]['ml'] ]
				+cache1[indexCache[index]['mr'] ]
				+cache1[indexCache[index]['bl'] ]
				+cache1[indexCache[index]['bm'] ]
				+cache1[indexCache[index]['br'] ];
			//console.log(index+' : '+neighbors);
			if(	cache1[index] == 1 && (neighbors < 2 || neighbors > 3) ){
				$(this).css('background-color', '#FFF');
				cache2[index] = 0;
			}else if(	cache1[index] == 0 && neighbors == 3 ){
				$(this).css('background-color', '#C0C0C0');
				cache2[index] = 1;
			}else{
				cache2[index] = cache1[index];
			}
		});
		cache1=[0];
	}else {
		$('#goBoard tr td').each(function(index){
			index = index + 1;
			let neighbors = 
				 cache2[indexCache[index]['tl'] ]
				+cache2[indexCache[index]['tm'] ] 
				+cache2[indexCache[index]['tr'] ] 
				+cache2[indexCache[index]['ml'] ]
				+cache2[indexCache[index]['mr'] ]
				+cache2[indexCache[index]['bl'] ]
				+cache2[indexCache[index]['bm'] ]
				+cache2[indexCache[index]['br'] ];
			//console.log(index+' : '+neighbors);
			if(	cache2[index] == 1 && (neighbors < 2 || neighbors > 3) ){
				$(this).css('background-color', '#FFF');
				cache1[index] = 0;
			}else if( cache2[index] == 0 && neighbors == 3 ){
				$(this).css('background-color', '#C0C0C0');
				cache1[index] = 1;
			}else{
				cache1[index] = cache2[index];
			}
		});
		cache2=[0];
	}
}

//Buttons and presets to maniuplate GO Board
let intervals = [];
function start(){
	let startVar = setInterval(function(){
		main();
	}, 100);
	intervals.push(startVar);
	$('#play').hide();
	$('#pause').show();
}
function stop(){
	intervals.forEach(clearInterval);
	randomBlank();
	$('#pause').hide();
	$('#play').show();

}
function pause(){
	intervals.forEach(clearInterval);
	$('#pause').hide();
	$('#play').show();
}
function next(){
	main();
}
function blinker(){
	cache1=[0];
	cache2=[0];
	$('#goBoard tr td').each(function(index){
		index = index+1;
		middle = Math.floor(size*size/2);
		if( index >= middle-1 && index <= middle+1){
			$(this).css('background-color', '#C0C0C0');
			cache1[index] = 1;
		}else{
			$(this).css('background-color', '#FFF');
			cache1[index] = 0;
		}
	});
}
function glider(){
	console.log('Glider was clicked');
}
function gliderGun(){
	console.log('Glider Gun was clicked');
}
function checkerboard(){
//Checkerboard look, it's the small wins that count!
	cache1=[0];
	cache2=[0];
	$('#goBoard tr td').each(function(index){
		index = index+1;
		if(index%2 < 1){
			$(this).css('background-color', '#C0C0C0');
			cache1[index] = 1;
		}else{
			$(this).css('background-color', '#FFF');
			cache1[index] = 0;
		}
	});
}
