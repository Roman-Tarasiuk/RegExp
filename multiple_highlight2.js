var helperObject;
(function(helperObject) {

    var mouseDown = false;
    var selectionChanged = false;
    var selectionProcessing = false;
    
    var lastKeyPressTime = null;
    var keyPressProcessed = true;
    var keyPressThreshold = 800; // Milliseconds.

    var inputCtrl = document.getElementById('input');
    var resultCtrl = document.getElementById('result');
    var widthCtrl = document.getElementById('width');


    helperObject.userInput = function() {
        var input = inputCtrl.value;
        input = replaceAngleBrackets(input);

        resultCtrl.innerHTML = input;
    }

    helperObject.parameters = function() {
        document.querySelector('#container-txt').style.width = widthCtrl.value;
    }

    helperObject.clearInput = function() {
        inputCtrl.value = "";
        resultCtrl.innerHTML = "";

        inputCtrl.focus();
    }

    function replaceAngleBrackets(input) {
        input = input.replace(/</g, '&lt');
        input = input.replace(/>/g, '&gt');

        return input;
    }

    document.onselectionchange = function(e) {
        selectionChanged = true;
    };

    helperObject.mouseDown = function() {
        mouseDown = true;
    }

    helperObject.mouseUp = function() {
        mouseDown = false;
    }
    
    setInterval(function() {
        if (!selectionChanged || mouseDown) {
            return;
        }

        if (selectionProcessing) {
            return;
        }

        selectionProcessing = true;

        var selectedText = getSelectedText();
        processSelection(selectedText);

        selectionProcessing = false;
        selectionChanged = false;
    }, 100);

    function processSelection(txt) {
        if (txt == '') {
            return;
        }
        
        txt = replaceAngleBrackets(txt);

        var replaceRe;
        try {
            replaceRe = new RegExp('(' + txt + ')', 'gi');
        }
        catch {
            return;
        }

        var resultTxt = replaceAngleBrackets(inputCtrl.value).replace(replaceRe, '<span class="selection-processed">$1</span>');

        resultCtrl.innerHTML = resultTxt;
    }

    function getSelectedText() {
        var selection = window.getSelection();

        var txt = "";

        var start = selection.anchorOffset;
        var end = selection.focusOffset;
        try {
            txt = selection.anchorNode.textContent.substring(start, end);
        }
        catch {
            return '';
        }
        
        return txt;
    }

    document.body.addEventListener('mousedown', helperObject.mouseDown);
    document.body.addEventListener('mouseup', helperObject.mouseUp);
    
    helperObject.toggleInput = function() {
        var styleCtrl = document.getElementById('userInput').style;
        var toggleBtn = document.getElementById('toggleInput');
        
        if (styleCtrl.display == 'none') {
            styleCtrl.display = '';
            toggleBtn.innerText = 'Hide input';
        }
        else if (styleCtrl.display == ''){
            styleCtrl.display = 'none';
            toggleBtn.innerText = 'Show input';
        }
    }
    
    setInterval(function() {
        if (keyPressProcessed) {
            return;
        }

        if (selectionProcessing) {
            return;
        }
        
        var now = Date.now();
        if ((now - lastKeyPressTime) < keyPressThreshold) {
            return;
        }

        selectionProcessing = true;

        var userFind = document.getElementById('find').value;
        processSelection(userFind);

        selectionProcessing = false;
        keyPressProcessed = true;
    }, 100);
    
    document.getElementById("find").addEventListener('keyup', function(){
        lastKeyPressTime = Date.now();
        keyPressProcessed = false;
    })
})(helperObject || (helperObject = {}));
