var inputElement = document.getElementById('input');
var replaceCookiesOrigin = ';';
var replaceCookiesRE = new RegExp(replaceCookiesOrigin, 'g');
var replaceCookiesStr = '###';
var replaceCookiesBackRE = new RegExp(replaceCookiesStr, 'g');
var fileName = '';
var userInputChanged = false;
var input = '';
var rowsMap = {};
var showAutoEl = document.getElementById('showAuto');


String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length; }

window.onload = function() {
    inputElement.focus();
}

function clearData(inp) {
    var input = document.getElementById(inp);
    input.focus();
    input.value = "";
    showInfo('info2', '...');
}

function process() {
    var rePattern = document.getElementById('regexp').value;
    var reFlags = document.getElementById('flags').value;
    var resultsPattern = document.getElementById('resultsPattern').value;

    var RE = new RegExp(rePattern, reFlags);
    
    console.log('RE:');
    console.log(RE);

    if (userInputChanged) {
        input = inputElement.value;
        userInputChanged = false;
    }
    
    mapRows(input);

    var resultsCtrl = document.getElementById('results');

    resultsCtrl.value = '';

    var count = 0;
    var resultsStr = '';

    var match;
    while ((match = RE.exec(input)) != null && (match.index < input.length) && (resultsStr.length <= input.length * 10)) {
        resultsStr += eval(resultsPattern);
        count++;
    }

    if (count == 0) {
        resultsCtrl.value = 'No matches...';
        showInfo('info2', '...');
    }
    else {
        resultsCtrl.value = resultsStr;
        showInfo('info2', '(' + count + ' match(es) found)');
    }
}

function mapRows(input) {
    console.log('** mapRows():')
    
    var rows = input.split('\n');
    rowsMap = {};
    var totalLength = 0;
    
    for (var i = 0; i < rows.length; i++) {
        rowsMap[i] = (totalLength = totalLength + rows[i].length + 1);
    }
}

function getRow(index) {
    if (index < 0) {
        return -1;
    }
    if (index > input.length) {
        return -1;
    }
    
    for (var r in rowsMap) {
        if (rowsMap[r] >= index) {
            return parseInt(r) + 1;
        }
    }
}

function processReplace() {
    var rePattern = document.getElementById('regexp').value;
    var reFlags = document.getElementById('flags').value;
    var resultsPattern = document.getElementById('resultsPattern').value;

    var RE = new RegExp(rePattern, reFlags);

    if (userInputChanged) {
        input = inputElement.value;
        userInputChanged = false;
    }

    var resultsCtrl = document.getElementById('results');

    resultsCtrl.value = '';

    var resultsStr = input.replace(RE, resultsPattern);

    resultsCtrl.value = resultsStr;
}

function saveSet(readFromCookies, ID) {
    if (window.regularExpressionsPluginSetsArray == undefined) {
        window.regularExpressionsPluginSetsArray = [];
    }

    if (!readFromCookies) {
        var id = 'regularExpressionsPluginSets' + window.regularExpressionsPluginSetsArray.length;
    }
    else {
        var id = 'regularExpressionsPluginSets' + ID;
    }

    var radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('id', id);
    radio.setAttribute('name', 'regularExpressionsPluginSets');
    radio.addEventListener('click', window.selectSet = function(event) {
        var index = parseInt(event.target.id.substring('regularExpressionsPluginSets'.length));
        console.log(index + ' set selected');

        document.getElementById('regexp').value = window.regularExpressionsPluginSetsArray[index].re;
        document.getElementById('resultsPattern').value = window.regularExpressionsPluginSetsArray[index].resPatt;
    });

    var label = document.createElement('label');
    label.setAttribute('for', 'regularExpressionsPluginSets' + window.regularExpressionsPluginSetsArray.length);
    label.innerText = (!readFromCookies) ? regularExpressionsPluginSetsArray.length : ID;

    document.getElementById('regularExpressionsPluginSets').appendChild(radio);
    document.getElementById('regularExpressionsPluginSets').appendChild(label);

    if (!readFromCookies) {
        var re = document.getElementById('regexp').value;
        var resPatt = document.getElementById('resultsPattern').value;

        regularExpressionsPluginSetsArray.push({re: re, resPatt: resPatt});

        var cookieStr = JSON.stringify(regularExpressionsPluginSetsArray);
        cookieStr = cookieStr.replace(replaceCookiesRE, replaceCookiesStr);

        setCookie('regularExpressionsPlugin', cookieStr, 1000);
    }
}

function getSetsFromCookies() {
    console.log(' ');

    var cookie = getCookie('regularExpressionsPlugin');

    if (cookie == '') {
        return;
    }

    window.regularExpressionsPluginSetsArray = JSON.parse(cookie.replace(replaceCookiesBackRE, replaceCookiesOrigin));

    for (var i = 0; i < regularExpressionsPluginSetsArray.length; i++) {
        document.getElementById('regexp').value = regularExpressionsPluginSetsArray[i].re;
        document.getElementById('resultsPattern').value = regularExpressionsPluginSetsArray[i].resPatt;
        saveSet(true, i);
    }
}

getSetsFromCookies();

function onChange(event) {
  var file = event.target.files[0];
  fileName = file.name;
  var encoding = document.getElementById('encoding').value;
  
  var reader = new FileReader();
  reader.onload = function(event) {
    //inputElement.value = event.target.result;
    var rRe = /\r/g;
    input = event.target.result.replace(rRe, '');
    userInputChanged = false;
    inputElement.value = '\'' + fileName + '\' is successfully loaded.';
    showInfo('info1', input.length + ' characters / '
        + input.lineCount() + ' row(s)');
    
    if (showAutoEl.checked) {
        inputElement.value = input;
    }
    // input.length
  };

  reader.readAsText(file, encoding);
}

function showInfo(id, text) {
    document.getElementById(id).innerText = text;
}

function showInputInfo() {
    showInfo('info1', inputElement.value.length + ' characters / '
        + inputElement.value.lineCount() + ' row(s)');
}

function inputChanged() {
    console.log('** Input changed.');
    userInputChanged = true;
    showInputInfo();
}

function inputPaste() {
    console.log('** Input pasted.');
    userInputChanged = true;
    showInputInfo();
}

function inputKeyup(ev) {
    if (ev.key == 'ArrowLeft'
        || ev.key == 'ArrowUp'
        || ev.key == 'ArrowRight'
        || ev.key == 'ArrowLeft'
        || ev.key == 'ArrowDown'
        || ev.key == 'Home'
        || ev.key == 'End'
        || ev.key == 'PageUp'
        || ev.key == 'PageDown') {
        return
    }
    console.log('** Input key up.');
    console.log(ev);
    userInputChanged = true;
    showInputInfo();
}
