function makeDiamond(seed) {
    makeDiamondArray();

    console.log("working with "+blocks);

    console.log("Creating new section with seed "+seed);
    mt = new MersenneTwister(seed); //https://github.com/pigulla/mersennetwister

    //Set initial corner values and then alternate the diamond and square steps until done.
    diamondArray[0][0] = (mt.real()-mt.real())*magnitude;
    diamondArray[0][blocks] = (mt.real()-mt.real())*magnitude;
    diamondArray[blocks][0] = (mt.real()-mt.real())*magnitude;
    diamondArray[blocks][blocks] = (mt.real()-mt.real())*magnitude;

    for(var part = blocks; part > 1; part /= 2){ //>=2
        magnitude /= 2;
        for(var x = 0; x < blocks; x += part){
            for(var y = 0; y < blocks; y += part){
                diamondStep(x, y, part);
                //printArray("Diamond");
                squareStep(x, y, part);
                //printArray("Square");
            }
        }
    }
    //printArray("Done");
}

function diamondStep(x, y, part){
    diamondArray[x+part/2][y+part/2] = (diamondArray[x][y] + diamondArray[x+part][y] + diamondArray[x][y+part] + diamondArray[x+part][y+part])/4 + (mt.real()-mt.real())*magnitude;
}

function squareStep(x, y, part){
    diamondArray[x+part/2][y] = (diamondArray[x+part/2][y+part/2] + diamondArray[x][y] + diamondArray[x+part][y])/3 + (mt.real()-mt.real())*magnitude; //left
    diamondArray[x+part/2][y+part] = (diamondArray[x+part/2][y+part/2] + diamondArray[x][y+part] + diamondArray[x+part][y+part])/3 + (mt.real()-mt.real())*magnitude; //right
    diamondArray[x][y+part/2] = (diamondArray[x+part/2][y+part/2] + diamondArray[x][y] + diamondArray[x][y+part])/3 + (mt.real()-mt.real())*magnitude; //top
    diamondArray[x+part][y+part/2] = (diamondArray[x+part/2][y+part/2] + diamondArray[x+part][y] + diamondArray[x+part][y+part])/3 + (mt.real()-mt.real())*magnitude; //bottom
}

function makeDiamondArray(){
    //Create an empty diamond-square array
    diamondArray = new Array();
    for(var i = 0; i < blocks+1; i++){
        diamondArray[i] = [];
        for(var j = 0; j < blocks+1; j++){
            diamondArray[i][j] = -1;
        }
    }
}

function printArray(step){
    console.log("- - - - - - - - - "+step+" - - - - - - - - -")
    console.log("----------------------------------------------");
    for(var i = 0; i < blocks+1; i++){
        var row = "";
        for(var j = 0; j < blocks+1; j++){
            if(diamondArray[i][j] == -1){
                //row += "   ";
                row += Math.floor(diamondArray[i][j])+" ";
            }
            else{
                //row += " * ";
                row += Math.floor(diamondArray[i][j])+" ";
            }
        }
        console.log(row+"            "+i);
    }
    console.log("----------------------------------------------");
}


//makeDiamond();