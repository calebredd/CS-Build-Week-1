//Setting up cache arrays for quick turnarounds
let indexCache=[];
let cache1 = [0];
let cache2 = [0];
let genCounter = 0;
let checkFace = 0;
let color1 = '#a5c4fd';
let color2 = '#a0f3d7';
let playing = 0;
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
    $('#goBoard').css('background-color',color2);
    for(let i=0; i<rowSize; i++){
        $('#goBoard').append('<tr id="row'+i+'"></tr>');
        for(let j=0; j<colSize; j++){
            $('#row'+i).append('<td id="row'+i+'column'+j+'" onclick="kill('+indexCount+')" data-index="'+indexCount+'" data-row="'+i+'" data-column="'+j+'" class="row'+i+' column'+j+'"></tr>');
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

function kill(cellNum){
    if(!playing){
        let hexColor='#';
        $('#warning').hide();
        let rgbColor = $('td[data-index="'+cellNum+'"]').css('background-color');
        let regex = /([0-9])\w+/g;
        let found = rgbColor.match(regex);
        found.forEach(function(hex){
            hex = Number(hex).toString(16);
            if (hex.length<2){
                hex = "0"+hex;
            }
            hexColor += hex;
        });
        if(hexColor == color1){
            $('td[data-index="'+cellNum+'"]').css('background-color', color2);
            cache1[cellNum]=1;
            cache2[cellNum]=1;
        }else{
            $('td[data-index="'+cellNum+'"]').css('background-color', color1);
            cache1[cellNum]=0;
            cache2[cellNum]=0;
        }
    }
}
//Randomly establish the board
function random(){
	cache2=[0];
	cache1=[0];
	$('#goBoard tr td').each(function(index){
		index = index + 1
		$(this).css('background-color', color1);
		if( Math.random() < 0.5){
			$(this).css('background-color', color2);
			cache1[index]=1;
		}else{
			cache1[index]=0;
		}
	});
	//console.log(cache1);
}
function blank(){
	cache2=[0];
	cache1=[0];
	$('#goBoard tr td').each(function(index){
		index = index + 1
		$(this).css('background-color', color1);
			cache1[index]=0;
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
				$(this).css('background-color', color1);
                if(checkFace > 0 && genCounter == 60){
                    $(this).css('background-color', 'black');
                }
				cache2[index] = 0;
			}else if(	cache1[index] == 0 && neighbors == 3 ){
				$(this).css('background-color', color2);
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
				$(this).css('background-color', color1);
                if(checkFace > 0 && genCounter == 60){
                    $(this).css('background-color', 'black');
                }
				cache1[index] = 0;
			}else if( cache2[index] == 0 && neighbors == 3 ){
                $(this).css('background-color', color2);
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
    if(checkFace){
        if(genCounter == 1){
            $('#goBoard')[0].style.transform='rotate(-90deg)';
        }
        if(genCounter == 60){
            pause();
            $('#goBoard')[0].style.marginBottom = "100px";
            $('#warning')[0].textContent = "WHY SO SERIOUS?";
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
            $('#speed')[0].value = .5;
            checkFace = 0;
        }
    }
}

//Buttons and presets to maniuplate GO Board
let intervals = [];
function start(){
    playing = 1;
    $('#warning').hide();
	let startVar = setInterval(function(){
		main();
	}, intervalSpeed);
	intervals.push(startVar);
	$('#play').hide();
	$('#pause').show();
}
function stop(){
    playing = 0;
	intervals.forEach(clearInterval);
	blank();
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
    stop();
    checkFace = 0;
	cache1=[0];
	cache2=[0];
    genCounter=0;
    rowSize = 52;
    colSize = 52;
    $('#height')[0].value = 52;
    $('#width')[0].value = 52;
    initialize();
    $('#genCount')[0].textContent= genCounter;
    let middleArr = [];
    middleArr[0] = Math.floor( colSize*rowSize/4  + colSize/4 );
    middleArr[1] = Math.floor( colSize*rowSize/4  + 3*colSize/4 );
    middleArr[2] = Math.floor( 3*colSize*rowSize/4  + 3*colSize/4 );
    middleArr[3] = Math.floor( 3*colSize*rowSize/4  + colSize/4 );
	$('#goBoard tr td').each(function(index){
		index = index+1;
        $(this).css('background-color', color1);
        cache1[index] = 0;
	});
	$('#goBoard tr td').each(function(index){
		index = index+1;
        let sub = $(this);
        middleArr.forEach(function(middle){
            if( index >= middle-1 && index <= middle+1){
                sub.css('background-color', color2);
                cache1[index] = 1;
            }
        });
	});
    start();
}
function beehive(){
    stop();
    checkFace = 0;
	cache1=[0];
	cache2=[0];
    genCounter=0;
    rowSize = 52;
    colSize = 52;
    $('#height')[0].value = 52;
    $('#width')[0].value = 52;
    initialize();
    $('#genCount')[0].textContent= genCounter;
    let middleArr = [];
    middleArr[0] = Math.floor( colSize*rowSize/4  + colSize/4 );
    middleArr[1] = Math.floor( colSize*rowSize/4  + 3*colSize/4 );
    middleArr[2] = Math.floor( 3*colSize*rowSize/4  + 3*colSize/4 );
    middleArr[3] = Math.floor( 3*colSize*rowSize/4  + colSize/4 );
	$('#goBoard tr td').each(function(index){
		index = index+1;
        $(this).css('background-color', color1);
        cache1[index] = 0;
	});
	$('#goBoard tr td').each(function(index){
		index = index+1;
        let sub = $(this);
        middleArr.forEach(function(middle){
            if( index >= middle-1 && index <= middle+2){
                sub.css('background-color', color2);
                cache1[index] = 1;
            }
        });
	});
    start();
}
function glider(){
    stop();
    checkFace = 0;
    genCounter=0;
    $('#genCount')[0].textContent= genCounter;
	cache1=[0];
	cache2=[0];
    rowSize = 52;
    colSize = 52;
    $('#height')[0].value = 52;
    $('#width')[0].value = 52;
    initialize();
    let middleArr = [];
    middleArr[0] = Math.floor( colSize*rowSize/4  + colSize/4 );
    middleArr[1] = Math.floor( colSize*rowSize/4  + 3*colSize/4 );
    middleArr[2] = Math.floor( 3*colSize*rowSize/4  + 3*colSize/4 );
    middleArr[3] = Math.floor( 3*colSize*rowSize/4  + colSize/4 );
	$('#goBoard tr td').each(function(index){
		index = index+1;
        $(this).css('background-color', color1);
        cache1[index] = 0;
	});
	$('#goBoard tr td').each(function(index){
		index = index+1;
        let sub = $(this);
        middleArr.forEach(function(middle){
            if( index >= middle-1 && index <= middle+1){
                sub.css('background-color', color2);
                cache1[index] = 1;
            }else if( index == middle-colSize+1 || index == middle-colSize*2){
                sub.css('background-color', color2);
                cache1[index] = 1;
            }
        });
	});
    start();
}
function gliderGun(){
    stop();
    checkFace = 0;
    genCounter=0;
    $('#genCount')[0].textContent= genCounter;
	cache1=[0];
	cache2=[0];
    rowSize = 80;
    colSize = 80;
    $('#height')[0].value = 80;
    $('#width')[0].value = 80;
    initialize();
    let middleArr = [];
    middleArr[0] = Math.floor( colSize*rowSize/20  + colSize/6 );
    middleArr[1] = middleArr[0]+colSize*11 ;
    middleArr[2] = middleArr[1]+colSize*10-2;
    middleArr[3] = middleArr[2]+colSize*9+2;
    middleArr[4] = middleArr[3]+colSize*4-2;
    
    middleArr.push(middleArr[0]+1);
    middleArr.push(middleArr[0]+colSize);
    middleArr.push(middleArr[0]+colSize+1);

    middleArr.push(middleArr[1]+1);
    middleArr.push(middleArr[1]+2);
    middleArr.push(middleArr[1]+colSize-1);
    middleArr.push(middleArr[1]+colSize+3);
    middleArr.push(middleArr[1]+colSize*2-2);
    middleArr.push(middleArr[1]+colSize*2+4);
    middleArr.push(middleArr[1]+colSize*3-1);
    middleArr.push(middleArr[1]+colSize*3+3);
    middleArr.push(middleArr[1]+colSize*4);
    middleArr.push(middleArr[1]+colSize*4+1);
    middleArr.push(middleArr[1]+colSize*4+2);
    middleArr.push(middleArr[1]+colSize*5);
    middleArr.push(middleArr[1]+colSize*5+1);
    middleArr.push(middleArr[1]+colSize*5+2);

    middleArr.push(middleArr[2]+1);
    middleArr.push(middleArr[2]+2);
    middleArr.push(middleArr[2]+colSize-1);
    middleArr.push(middleArr[2]+colSize);
    middleArr.push(middleArr[2]+colSize+2);
    middleArr.push(middleArr[2]+colSize+3);
    middleArr.push(middleArr[2]+colSize*2-1);
    middleArr.push(middleArr[2]+colSize*2);
    middleArr.push(middleArr[2]+colSize*2+2);
    middleArr.push(middleArr[2]+colSize*2+3);
    middleArr.push(middleArr[2]+colSize*3-1);
    middleArr.push(middleArr[2]+colSize*3);
    middleArr.push(middleArr[2]+colSize*3+1);
    middleArr.push(middleArr[2]+colSize*3+2);
    middleArr.push(middleArr[2]+colSize*3+3);
    middleArr.push(middleArr[2]+colSize*4-2);
    middleArr.push(middleArr[2]+colSize*4-1);
    middleArr.push(middleArr[2]+colSize*4+3);
    middleArr.push(middleArr[2]+colSize*4+4);

    middleArr.push(middleArr[3]+1);

    middleArr.push(middleArr[4]+1);
    middleArr.push(middleArr[4]+colSize);
    middleArr.push(middleArr[4]+colSize+1);


	$('#goBoard tr td').each(function(index){
		index = index+1;
        if( middleArr.includes(index) ){
            $(this).css('background-color', color2);
            cache1[index] = 1;
        }else{
            $(this).css('background-color', color1);
            cache1[index] = 0;
        }
	});
    start();
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
			$(this).css('background-color', color2);
			cache1[index] = 1;
		}else{
			$(this).css('background-color', color1);
			cache1[index] = 0;
		}
	});
}
function update(){
    stop();
    rowSize = Number($('#height')[0].value);
    colSize = Number($('#width')[0].value);
    intervalSpeed = Number($('#speed')[0].value*1000);
    color1 = $('#color1')[0].value;
    color2 = $('#color2')[0].value;
    initialize();
    stop();
}
function updateSpeed(){
    pause();
    intervalSpeed = Number($('#speed')[0].value*1000);
    start();
}
function mrSmiles(){
    checkFace = 1;
    stop();
    rowSize = 24;
    colSize = 24;
    intervalSpeed = 100;
    $('#height')[0].value = 24;
    $('#width')[0].value = 24;
    $('#speed')[0].value = .1;
    initialize();
    stop();
    checkerboard();
    start();

}
function spaceInvasion(){
    stop();
    rowSize = 21;
    colSize = 21;
    $('#height')[0].value = 21;
    $('#width')[0].value = 21;
    initialize();
    stop();
    checkerboard();
    start();

}
