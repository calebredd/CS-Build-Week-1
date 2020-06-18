//Setting up cache arrays for quick turnarounds
let indexCache=[];
let cache1 = [0];
let cache2 = [0];
let genCounter = 0;
let checkFace = 0;
//Initial square size setup of GO Board
let rowSize = 25;
let colSize = 25;
let intervalSpeed = 500;
let indexCount = 1;
function initialize(){
    indexCount = 1;
    indexCache=[];
    cache1 = [0];
    cache2 = [0];
    $('#goBoard').empty();
    for(let i=0; i<rowSize; i++){
        $('#goBoard').append('<tr id="row'+i+'"></tr>');
        for(let j=0; j<colSize; j++){
            $('#row'+i).append('<td id="row'+i+'column'+j+'" data-index="'+indexCount+'" data-row="'+i+'" data-column="'+j+'" class="row'+i+' column'+j+'"></tr>');
            let tl = ( j != 0 && i != 0) ? indexCount-colSize-1 : 0;
            let tm = ( i != 0) ? indexCount-colSize : 0;
            let tr = ( j != colSize-1 && i != 0) ? indexCount-colSize+1 : 0;
            let ml = ( j != 0 ) ? indexCount-1 : 0;
            let mr = ( j != colSize-1 ) ? indexCount+1 : 0;
            let bl = ( j != 0 && i != rowSize-1) ? indexCount+colSize-1 : 0;
            let bm = ( i != rowSize-1 ) ? indexCount+colSize : 0;
            let br = ( j != colSize-1 && i != rowSize-1) ? indexCount+colSize+1 : 0;
            indexCache[indexCount]={'tl':tl, 'tm':tm, 'tr':tr, 'ml':ml, 'mr':mr, 'bl':bl, 'bm':bm, 'br':br};
            //console.log(indexCount);
            //console.log(indexCache[indexCount]);
            indexCount++;
        }
    }
}
initialize();

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
    let sum = 1;
    genCounter++;
    $('#genCount')[0].textContent= genCounter;
    if(checkFace > 0 && genCounter == 60){
        $(this).css('background-color', 'black');
    }
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
                if(checkFace > 0 && genCounter == 60){
                    $(this).css('background-color', 'black');
                }
				cache2[index] = 0;
			}else if(	cache1[index] == 0 && neighbors == 3 ){
				$(this).css('background-color', '#C0C0C0');
                if(checkFace > 0 && genCounter == 60){
                    $(this).css('background-color', 'red');
                }
				cache2[index] = 1;
			}else{
				cache2[index] = cache1[index];
			}
		});
        sum = cache2.reduce(function (a,b){
            return a+b;
        }, 0);
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
                if(checkFace > 0 && genCounter == 60){
                    $(this).css('background-color', 'black');
                }
				cache1[index] = 0;
			}else if( cache2[index] == 0 && neighbors == 3 ){
                $(this).css('background-color', '#C0C0C0');
                if(checkFace > 0 && genCounter == 60){
                    $(this).css('background-color', 'red');
                }
				cache1[index] = 1;
			}else{
				cache1[index] = cache2[index];
			}
		});
        sum = cache1.reduce(function (a,b){
            return a+b;
        }, 0);
		cache2=[0];
	}
    if(sum == 0){
        stop(); 
        $('#warning')[0].textContent = "ALL LIFE HAS CEASED TO EXIST";
        $('#warning').toggle();
    };
    if(checkFace > 0){
        if(genCounter == 1){
            $('#goBoard')[0].style.transform='rotate(-90deg)';
        }
        if(genCounter == 60){
            pause();
            $('#goBoard')[0].style.marginBottom = "100px";
            $('#warning')[0].textContent = "I SEE YOU!";
            $('#warning').toggle();
            setTimeout(function(){start()}, 3000);
        }
        if(genCounter == 68){
            $('#goBoard')[0].style.transform='rotate(-90deg)';
            $('#goBoard')[0].style.marginBottom = "100px";
            $('#warning')[0].textContent = "BOO!";
            $('#warning').toggle();
        }
        if(genCounter == 90){
            $('#goBoard')[0].style.transform='rotate(0deg)';
            $('#goBoard')[0].style.marginBottom = "10px";
            $('#warning').hide();
            stop();
            intervalSpeed = 500;
            checkFace = 0;
        }
    }
}

//Buttons and presets to maniuplate GO Board
let intervals = [];
function start(){
    $('#warning').hide();
	let startVar = setInterval(function(){
		main();
	}, intervalSpeed);
	intervals.push(startVar);
	$('#play').hide();
	$('#pause').show();
}
function stop(){
	intervals.forEach(clearInterval);
	randomBlank();
    genCounter=0;
    $('#genCount')[0].textContent= genCounter;
	$('#pause').hide();
	$('#play').show();

}
function pause(){
	intervals.forEach(clearInterval);
	$('#pause').hide();
	$('#play').show();
}
function next(){
    $('#warning').hide();
	main();
}
function blinker(){
	cache1=[0];
	cache2=[0];
    genCounter=0;
    $('#genCount')[0].textContent= genCounter;
	$('#goBoard tr td').each(function(index){
		index = index+1;
		middle = Math.floor(colSize*rowSize/2);
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
    genCounter=0;
    $('#genCount')[0].textContent= genCounter;
}
function gliderGun(){
	console.log('Glider Gun was clicked');
    genCounter=0;
    $('#genCount')[0].textContent= genCounter;
}
function checkerboard(){
//Checkerboard look, it's the small wins that count!
	cache1=[0];
	cache2=[0];
    genCounter=0;
    $('#genCount')[0].textContent= genCounter;
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
function update(){
    stop();
    rowSize = Number($('#height')[0].value);
    colSize = Number($('#width')[0].value);
    intervalSpeed = Number($('#speed')[0].value*1000);
    initialize();
    stop();
}
function mrSmiles(){
    checkFace = 1;
    stop();
    rowSize = 24;
    colSize = 24;
    intervalSpeed = 50;
    $('#height')[0].value = 24;
    $('#width')[0].value = 24;
    $('#speed')[0].value = .5;
    initialize();
    stop();
    checkerboard();
    start();

}
