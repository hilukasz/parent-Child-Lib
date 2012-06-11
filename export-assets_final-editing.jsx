
// links to classes and methods file
// @include lukaszLibrary.jsx;

var doc = app.activeDocument,
    pageItems = doc.layers.getByName("parent").pageItems,
    CSV = new CSVFile("Sass vars"),
    inputFolder = Folder.selectDialog(),
    canvasWidthHeight = [doc.width, doc.height, "", "", "", "Window"],
    symbolPattern = "[child] ", // child but parent of symbols
    allParentsOfSymbols = getArrayOfItemsWithNameUnder(symbolPattern, pageItems),
    iCount =  doc.symbolItems.length,
    dateTime = getTodaysDate(),
    dest = undefined,
    dest,
    win;

CSV.append(["width", "height", "top", "left", "name", "parent container", "type", "color", "text size(px)", "alignment", "font name", "font style", "date/time exported"]);
CSV.append(canvasWidthHeight);

//for each "div" inside of the parent
for ( var i = 0; i < allParentsOfSymbols.length; i++ ) {
    var currentContainer = allParentsOfSymbols[i],
        passedSymbolsWithInfo = [];

    // loop through all the symbols to check if it is in the div    
    for(var j = 0; j < doc.symbolItems.length; j++){
        var currentSymbol = new MySymbol(j);
        if(currentSymbol.isIn(currentContainer)) {
            var currentContainerTopLeft = [Math.abs(currentContainer.top), currentContainer.left],
                symbolRelativeToParent = currentSymbol.getPosition(currentContainerTopLeft[0], currentContainerTopLeft[1]),
                currentSymbolName = makeWebsafe(currentSymbol.name);
            var symbolInfo = [currentSymbol.getWidthHeight(), symbolRelativeToParent, currentSymbolName+".png", makeWebsafe(currentContainer.name.replace(symbolPattern, "")), "image", "","","","","",getTodaysDate()+"\n"];
            CSV.append(symbolInfo);
        }
    }
    
}


//export text position and attributes

function getAllTextItems(){
    var doc = app.activeDocument;
    for(var j = 0; j < doc.textFrames.length; j++){
         var currentTextItem = doc.textFrames[j],
             font = currentTextItem.textRange.characterAttributes.textFont.name,
             style = currentTextItem.textRange.characterAttributes.textFont,
             alignment = currentTextItem.paragraphs[0].paragraphAttributes.justification,
             fontSize= currentTextItem.textRange.characterAttributes.size,
             contents = currentTextItem.contents,
             myColor = Math.round(app.activeDocument.textFrames[j].textRange.characterAttributes.fillColor.red)+" "+Math.round(app.activeDocument.textFrames[j].textRange.characterAttributes.fillColor.green)+" "+Math.round(app.activeDocument.textFrames[j].textRange.characterAttributes.fillColor.blue),           
             just = app.activeDocument.textFrames[0].paragraphs[0].paragraphAttributes.justification,
             alignment = alignment.toString(),
             
             alignment = alignment.replace('Justification.','');
            
        //temporarly render text to get position, then remove
        
        var temporaryText = currentTextItem.duplicate().createOutline(),
            left = Math.round(temporaryText.visibleBounds[0]),
            top =Math.abs(Math.round(temporaryText.visibleBounds[1])),
            right =Math.round(temporaryText.visibleBounds[2]),
            bottom = Math.abs(Math.round(temporaryText.visibleBounds[3]));
        temporaryText.remove();
        
        // loop through all pageItem containers 
        for(var i = 0; i < allParentsOfSymbols.length; i++){
            var container = allParentsOfSymbols[i],
                containerVB = container.visibleBounds,
                containerLeft = containerVB[0],
                containerTop = Math.abs(Math.round(containerVB[1])),
                containerRight = containerVB[2],
                containerBottom = Math.abs(Math.round(containerVB[3]));

            if(textIsIn(currentTextItem, container)) {
                var relativeBottom = containerTop-bottom;
                if(alignment == "LEFT") { var leftCenterRight = left-containerLeft; }
                if(alignment == "CENTER") { 
                    var width = right-left,
                        textCenter = width/2+left,
                        leftCenterRight = textCenter-containerLeft; 
                }
                if(alignment == "RIGHT") { var leftCenterRight = containerRight-right; }
                print("container bottom: "+containerBottom+", bottom : "+bottom+", ="+relativeBottom);
                CSV.append(["null","null", Math.abs(relativeBottom), leftCenterRight, contents, makeWebsafe(container.name.replace(symbolPattern, "")),  "text", myColor , fontSize, alignment,font, style, getTodaysDate()+"\n"]);
            }
            print("========end loop======= :");
        }
        
    }
}getAllTextItems();

exportSymbolasPNG();

doc = null,
    pageItems = null,
    CSV = null,
    inputFolder = null,
    canvasWidthHeight = null,
    parentPattern = null, // parent = if has more than one div inside it
    allParents = null,
    symbolPattern = null, // child but parent of symbols
    allParentsOfSymbols = null,
    iCount =  null,
    dateTime = null,
    dest = null,
    win = null;