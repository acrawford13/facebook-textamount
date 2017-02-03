var originalUnit = preferences.rulerUnits
preferences.rulerUnits = Units.PIXELS

var document = activeDocument;
var allLayers = [];
var allLayers = collectAllLayers(document, allLayers);

function collectAllLayers (document, allLayers){
    for (var m = 0; m < document.layers.length; m++){
        var theLayer = document.layers[m];
        if (theLayer.typename === "ArtLayer"){
            allLayers.push(theLayer);
        }else{
            collectAllLayers(theLayer, allLayers);
        }
    }
    return allLayers;
}

for(var r = 0;r<allLayers.length;r++){
    var currentLayer = allLayers[i];
    if(currentLayer.name == "FB-TextAmount-Overlay"){
        currentLayer.remove();
    }
}

var heightInterval = document.height/5;
var widthInterval = document.width/5;


for(var i=0;i<6;i++){
    document.guides.add (Direction.HORIZONTAL,heightInterval*i)
    document.guides.add (Direction.VERTICAL,widthInterval*i)
}

var layers = allLayers.length;
var textlayers = [];

var textLayers = [];
var shapeSet = document.layerSets.add();
shapeSet.name = "FB-TextAmount-TEMP";
var immno = allLayers.length;

for(var i=0;i<immno;i++){
    if(allLayers[i].kind==LayerKind.TEXT){
        textLayers.push(allLayers[i]);
    }
}

var textNo=[[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false]]

var boxCount = 0;

for(var i=0;i<textLayers.length;i++){
    var shape = textLayers[i].duplicate(shapeSet);
    shape.textItem.convertToShape();
    var thisShape = [];
    for(var z=0;z<4;z+=2){
        thisShape.push([Math.floor(Math.min(1199,shape.bounds[z])/widthInterval),Math.floor(Math.min(627,shape.bounds[z+1])/heightInterval)]);
    }
        for(var x=0;x<5;x++){
            for(var y=0;y<5;y++){
                if(x>=thisShape[0][0]&&x<=thisShape[1][0]&&y>=thisShape[0][1]&&y<=thisShape[1][1]){
                    if(textNo[x][y]==false){textNo[x][y]=true; boxCount++}
                }
            }
        }
}

var overlay = document.artLayers.add();
overlay.name="FB-TextAmount-Overlay"


var overlayColor = new SolidColor;
overlayColor.rgb.hexValue='e03232';

for(var a=0;a<5;a++){
    for(var b=0;b<5;b++){
        if(textNo[a][b]==true){
            document.selection.select([[a*widthInterval,b*heightInterval],
                                                                  [a*widthInterval,(b+1)*heightInterval],
                                                                  [(a+1)*widthInterval,(b+1)*heightInterval],
                                                                  [(a+1)*widthInterval,b*heightInterval]]);
            document.selection.fill(overlayColor);
        }
    }
}


overlay.opacity = 80;

shapeSet.remove();

app.preferences.rulerUnits = originalUnit

alert(boxCount/25*100 + '% text coverage');