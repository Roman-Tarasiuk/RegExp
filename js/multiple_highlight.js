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
    var wordWrapCtrl = document.getElementById('wordWrap');
    var infoCtrl = document.getElementById('info');


    helperObject.userInput = function() {
        var input = inputCtrl.value;
        input = replaceAngleBrackets(input);
        
        infoCtrl.innerText = '';

        resultCtrl.innerHTML = input;
    }

    helperObject.parameters = function() {
        document.querySelector('#container-txt').style.width = widthCtrl.value;
    }

    helperObject.clearInput = function() {
        inputCtrl.value = "";
        resultCtrl.innerHTML = "";
        
        infoCtrl.innerText = '';

        inputCtrl.focus();
    }

    function replaceAngleBrackets(input) {
        input = input.replace(/</g, '&lt')
                .replace(/>/g, '&gt');

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
        
        txt = replaceAngleBrackets(txt)
                .replace(/\?/g, '\\?')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)');

        var replaceRe;
        try {
            // Group.
            replaceRe = new RegExp('(' + txt + ')', 'gi');
        }
        catch {
            return;
        }

        var wrapStart = '<span class="selection-processed">';
        var wrapEnd = '</span>';
        var tmp = replaceAngleBrackets(inputCtrl.value);
        var resultTxt = tmp.replace(replaceRe, wrapStart + '$1' + wrapEnd);
        
        if (resultTxt.length != tmp.length) {
            var matchesCount = (resultTxt.length - tmp.length) / (wrapStart.length + wrapEnd.length);
            infoCtrl.innerText = matchesCount + ' match(es) found';
        }

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
    
    helperObject.wordWrap = function() {
        if (wordWrapCtrl.checked) {
            resultCtrl.classList.remove('p-pre');
        }
        else {
            resultCtrl.classList.add('p-pre');
        }
    }

})(helperObject || (helperObject = {}));