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
    var wholeWordCtrl = document.getElementById('wholeWord');
    var caseSensitiveCtrl = document.getElementById('caseSensitive');
    var infoCtrl = document.getElementById('info');
    var findCtrl = document.getElementById('find');
    var findIsActive = false;

    helperObject.txtFocus = function() {
        findIsActive = true;
    }
    
    helperObject.txtBlur = function() {
        findIsActive = false;
    }

    helperObject.userInput = function() {
        var input = inputCtrl.value;
        input = replaceAngleBrackets(input);
        
        infoCtrl.innerText = '...';
        findCtrl.value = '';

        resultCtrl.innerHTML = input;
    }

    helperObject.parameters = function() {
        document.querySelector('#container-txt').style.width = widthCtrl.value;
    }

    helperObject.clearInput = function() {
        inputCtrl.value = '';
        resultCtrl.innerHTML = '';
        
        infoCtrl.innerText = '...';
        findCtrl.value = '';

        inputCtrl.focus();
    }

    function replaceAngleBrackets(input) {
        input = input.replace(/</g, '&lt')
                .replace(/>/g, '&gt');

        return input;
    }
    
    function replaceToAngleBrackets(input) {
        input = input.replace(/&lt/g, '<')
                .replace(/&gt/g, '>');

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
        
        if (findIsActive && keyPressProcessed) {
            return;
        }
        
        var wholeWord = wholeWordCtrl.checked;
        var caseSensitive = caseSensitiveCtrl.checked;
        
        // To do: improve the next regular expression to use \s in [].
        var surrountWholeWord = '([\t \.,\(\)\n])';
        
        txt = replaceAngleBrackets(txt)
                .replace(/\?/g, '\\?')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)')
                .replace(/\\/g, '\\\\');

        var replaceRe;
        try {
            // Group.
            replaceRe = new RegExp(
                (wholeWord ? surrountWholeWord : '')
                + '(' + txt + ')'
                + (wholeWord ? surrountWholeWord : ''), caseSensitive ? 'g' : 'gi');
        }
        catch {
            return;
        }

        var wrapStart = '<span class="selection-processed">';
        var wrapEnd = '</span>';
        var tmp = replaceAngleBrackets(inputCtrl.value);
        var resultTxt = tmp.replace(replaceRe,
            (wholeWord ? '$1' : '')
            + wrapStart
            + (wholeWord ? '$2' : '$1')
            + wrapEnd
            + (wholeWord ? '$3' : ''));
        
        if (resultTxt.length != tmp.length) {
            var matchesCount = (resultTxt.length - tmp.length) / (wrapStart.length + wrapEnd.length);
            infoCtrl.innerText = matchesCount + ' match(es) found';
            
            findCtrl.value = replaceToAngleBrackets(txt);
        }

        resultCtrl.innerHTML = resultTxt;
    }

    function getSelectedText() {
        var selection = window.getSelection();

        var txt = '';

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
        var targets = document.getElementsByClassName('userInput');
        var toggleBtn = document.getElementById('toggleInput');
        
        for (var i = 0; i < targets.length; i++) {
            var styleCtrl = targets[i].style;
            
            if (styleCtrl.display == 'none') {
                styleCtrl.display = '';
                toggleBtn.innerText = 'Hide input';
            }
            else if (styleCtrl.display == ''){
                styleCtrl.display = 'none';
                toggleBtn.innerText = 'Show input';
            }
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

        var userFind = findCtrl.value;
        processSelection(userFind);

        selectionProcessing = false;
        keyPressProcessed = true;
    }, 100);
    
    document.getElementById('find').addEventListener('keyup', function(){
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
