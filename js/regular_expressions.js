var inputElement = document.getElementById('input');
var regexpElement = document.getElementById('regexp');
var resetPatternButton = document.getElementById('resetPattern');
var resultsPatternElement = document.getElementById('resultsPattern');
var replaceCookiesOrigin = ';';
var replaceCookiesRE = new RegExp(replaceCookiesOrigin, 'g');
var replaceCookiesStr = '###';
var replaceCookiesBackRE = new RegExp(replaceCookiesStr, 'g');
var fileName = '';
var userInputChanged = false;
var input = '';
var rowsMap = {};
var showAutoEl = document.getElementById('showAuto');
var widthOffset;
var fileNameEl = document.getElementById('fileName');
var defaultPattern = "match[0] + '\\t' + getRow(match.index) + '\\t' + fileName + '\\n'";


String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length; }

window.onload = function() {
    inputElement.focus();
    widthOffset = $(inputElement).width() - $(regexpElement).width();
    resetPattern();
    toggleResetButton();
}

function clearData(inp) {
    var input = document.getElementById(inp);
    input.focus();
    input.value = "";
    showInfo('info2', '...');
}

function process() {
    var rePattern = regexpElement.value;
    var reFlags = document.getElementById('flags').value;
    var resultsPattern = resultsPatternElement.value;

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
    while ((match = RE.exec(input)) != null
      && (match.index < input.length)
      && (resultsStr.length <= input.length * 10)) {
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
    var rePattern = regexpElement.value;
    var reFlags = document.getElementById('flags').value;
    var resultsPattern = resultsPatternElement.value;

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

        regexpElement.value = window.regularExpressionsPluginSetsArray[index].re;
        resultsPatternElement.value = window.regularExpressionsPluginSetsArray[index].resPatt;
    });

    var label = document.createElement('label');
    label.setAttribute('for', 'regularExpressionsPluginSets' + window.regularExpressionsPluginSetsArray.length);
    label.innerText = (!readFromCookies) ? regularExpressionsPluginSetsArray.length : ID;

    document.getElementById('regularExpressionsPluginSets').appendChild(radio);
    document.getElementById('regularExpressionsPluginSets').appendChild(label);

    if (!readFromCookies) {
        var re = regexpElement.value;
        var resPatt = resultsPatternElement.value;

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
        regexpElement.value = regularExpressionsPluginSetsArray[i].re;
        resultsPatternElement.value = regularExpressionsPluginSetsArray[i].resPatt;
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
    
    fileNameEl.innerText = fileName;
    // input.length
  };

  fileNameEl.innerText = '';
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

function optionWidth() {
    var optionChkbox = document.getElementById('optionWidth');
    if (optionChkbox.checked) {
        var newWidth = inputElement.clientWidth - widthOffset - 4;
        
        $(regexpElement).width(newWidth);
        $('#resultsPattern').width(newWidth);
        $('#results').width(inputElement.clientWidth - 4);
    }
    
    $(inputElement).toggleClass('resize-vertical');
    $(regexpElement).toggleClass('resize-vertical');
    $('#resultsPattern').toggleClass('resize-vertical');
    $('#results').toggleClass('resize-vertical');
}

function resetPattern() {
    resultsPatternElement.value = defaultPattern;
    toggleResetButton();
}

// https://codepen.io/mozzi/pen/EgZvjg
$("#resultsPattern").bind("contextmenu", function(event) {
  $(".custom-menu").finish().toggle(100).
  css({
    top: event.pageY + "px",
    left: event.pageX + "px"
  });
});

$(document).bind("mousedown", function(e) {
  if (!$(e.target).parents(".custom-menu").length > 0) {
    $(".custom-menu").hide(100);
  }
});