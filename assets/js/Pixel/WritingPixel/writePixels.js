var cursorIndexPos = 0;
var CharacterLine = [];
var updateCharacter = setInterval(UpdateCharacters, 100);

function getPosAtIndex(index)
{
    var cursorPos = new vector2D(0,0);
    for(var i = 0; i < CharacterLine.length; i++)
    {
        if(i == index) return cursorPos;
        const pixelRepresentation = pixelFonts.glyphs[CharacterLine[i].character];
        cursorPos = new vector2D(cursorPos.x + (pixelRepresentation.pixels[0].length + 1) * CharacterLine[i].fontSize, cursorPos.y);
        if(cursorPos.x > WorldPixel.length)
        {
            cursorPos = new vector2D(0, cursorPos.y + (pixelFonts.lineHeight + 3) * CharacterLine[i].fontSize);
            if(cursorPos.y > WorldPixel[0].length)
                cursorPos = new vector2D(0, 0);
        }
    }
    return cursorPos;
}
function deleteEmptyChar()
{
    for (var i = 0; i < CharacterLine.length; i++) {
        if (!CharacterLine[i].CheckIsAlive())
        {
            CharacterLine[i].destroy();
            CharacterLine.splice(i, 1);
            return true;
        }
    }
    return false;
}
function UpdateCharacters() {
    //var CharacterLineNext = [];
    var haveDeleteSomething = deleteEmptyChar();
    while(haveDeleteSomething)
    {
        haveDeleteSomething = deleteEmptyChar();
    }

    for (var i = 0; i < CharacterLine.length; i++) {
        CharacterLine[i].moveCharacterAt(getPosAtIndex(i));
    }
}

function Write(sentence) {
    for (let i = 0; i < sentence.length; i++) {
        let character = sentence[i];
        var pixelChar = new Character(character, getPosAtIndex(cursorIndexPos), 1);
        CharacterLine.push(pixelChar);
        activePhysicToTheLastCharacter(1000);
    }
}



// Écoute les événements clavier
document.addEventListener('keydown', function(event) {
    const character = event.key
    console.log(character);
    if(character == "Backspace")
    {
        if(CharacterLine.length == 0) return;
        CharacterLine[CharacterLine.length-1].destroy();
        CharacterLine.splice(CharacterLine.length-1);
    }
    var pixelChar = new Character(character, getPosAtIndex(cursorIndexPos), 1);
    CharacterLine.push(pixelChar);
    activePhysicToTheLastCharacter(1000);
});

const activePhysicToTheLastCharacter = retriggerableDelay(function() {
    if(CharacterLine[CharacterLine.length-1])
        CharacterLine[CharacterLine.length-1].activePhysics();
    activePhysicToTheLastCharacter(activePhysicToTheLastCharacter.delay() * 0.95);
}, 1000);


Write('Welcome');