window.onload = function() {
    var item1 = document.getElementById('item1');
    openTab(item1, 'tabCompare');
}

var searchValue = '';
var newValue = '';
var newValueLineBreak = ' ';
var replacements = [];

document.getElementById('str1').addEventListener('click', stopPropag, false);
document.getElementById('str2').addEventListener('click', stopPropag, false);
document.getElementById('result').addEventListener('click', stopPropag, false);

function clearInput(el) {
    el.value = '';
    el.focus();
}

function stopPropag(event) {
    event.stopPropagation();
}

function reset() {
    document.getElementById('count').innerHTML = '...';
    document.getElementById('result').value = '';
}

function setWidth() {
    document.getElementById('width').value = parseInt(document.getElementById('result').style.width);
}

function onInputKeyUp(e) {
    var numberElem = document.getElementById('width');
    if(document.activeElement == numberElem) {
        if(e.keyCode == 38 || e.keyCode == 40) {
            setLength(numberElem);
        }
    }
}

function setLength(numberElem) {
    document.getElementById('divresult').style.width = numberElem.value + 'px';
    document.getElementById('divstr1').style.width = numberElem.value + 'px';
    document.getElementById('divstr2').style.width = numberElem.value + 'px';
}

function compare() {
    var str1 = document.getElementById('str1');
    var str2 = document.getElementById('str2');
    var ignoreCase = document.getElementById('ignoreCase');

    var compareResult = null;

    if (str1.value.length >= str2.value.length) {
        compareResult = cmp(str1.value, str2.value, ignoreCase.checked);
    }
    else {
        compareResult = cmp(str2.value, str1.value, ignoreCase.checked);
    }

    document.getElementById('result').value = compareResult.compareStr;
    document.getElementById('count').innerHTML =
        compareResult.diffCount == 0 ? 'Strings are equal.' : 'Differences found: ' + compareResult.diffCount + '.';

    function cmp(str1, str2, ignoreCase) { // str1.length >= str2.length
        if (ignoreCase) {
            str1 = str1.toUpperCase();
            str2 = str2.toUpperCase();
        }

        if (str1 == str2) {
            return {
                compareStr: '',
                diffCount: 0
            };
        }

        var resultStr = new Array(str1.length).fill(' ');
        var diffCount = 0;

        for (var i = 0; i < str1.length; i++) {
            if (i >= str2.length || str2[i] != str1[i]) {
                resultStr[i] = 'x';
                if (i == 0 || resultStr[i - 1] == ' ') {
                    diffCount++;
                }
            }
        }

        return {
            compareStr: resultStr.join(''),
            diffCount: diffCount
        };
    }
}

function compare2() {
    var str1 = document.getElementById('str1').value;
    var str2 = document.getElementById('str2').value;

    var cmp = compareByWords(str1, str2)

    document.getElementById('cmp2_1').innerHTML = cmp.resultStr1;
    document.getElementById('cmp2_2').innerHTML = cmp.resultStr2;
    document.getElementById('count2').innerHTML = 'Differences: ' + cmp.diffCount;
}

function clear2() {
    document.getElementById('cmp2_1').innerHTML = '...';
    document.getElementById('cmp2_2').innerHTML = '...';
    document.getElementById('count2').innerHTML = 'Differences: ...';
}

function removeLineBreaks() {
    var txt = document.getElementById('txt');

    var re = /\n/g;

    var replaceTo = prompt('Enter new value:', newValueLineBreak);

    if (replaceTo == null) {
        return;
    }

    newValueLineBreak = replaceTo;
    replaceTo = replaceTo.replace(/\\n/g, '\n');
    replaceTo = replaceTo.replace(/\\t/g, '\t');

    txt.value = txt.value.replace(re, replaceTo);
    txt.select();
}

function removeSpaces() {
    var txt = document.getElementById('txt');

    var re = / /g;
    var replaceTo = '';

    txt.value = txt.value.replace(re, replaceTo);
    txt.select();
}

function removeAllSpaces() {
    var txt = document.getElementById('txt');

    var re = /\s|\u200A/gm;
    var replaceTo = '';

    txt.value = txt.value.replace(re, replaceTo);
    txt.select();
}

function replaceAll() {
    var txt = document.getElementById('txt');

    var oldVal = document.getElementById('oldValue');
    var newVal = document.getElementById('newValue');

    var searchFor = oldVal.value;
    if (searchFor == null || searchFor == '') {
        return;
    }

    var replaceTo = newVal.value;

    searchValue = searchFor;
    newValue = replaceTo;

    searchFor = searchFor.replace(/\\n/g, '\n');
    searchFor = searchFor.replace(/\\t/g, '\t');
    searchFor = searchFor.replace(/\./g, '\\.');

    replaceTo = replaceTo.replace(/\\n/g, '\n');
    replaceTo = replaceTo.replace(/\\t/g, '\t');

    var re = new RegExp(searchFor, 'g');

    txt.value = txt.value.replace(re, replaceTo);
    txt.select();
}

function addReplacement() {
    var oldVal = document.getElementById('oldValue');
    var newVal = document.getElementById('newValue');
    var select = document.getElementById('replacements');

    var option = document.createElement("option");
    option.text = '\'' + oldVal.value + '\' -> \'' + newVal.value + '\'';

    replacements.push({
        'old' : oldVal.value,
        'new' : newVal.value,
    })

    select.add(option);
}

function removeReplacement() {
    var select = document.getElementById('replacements');

    var i = select.selectedIndex;

    select.remove(i);
    replacements.splice(i, 1);
}

function selectedItemChanged() {
    var oldVal = document.getElementById('oldValue');
    var newVal = document.getElementById('newValue');
    var select = document.getElementById('replacements');

    var i = select.selectedIndex;

    oldVal.value = replacements[i]['old'];
    newVal.value = replacements[i]['new'];
}

function getLength() {
    var txt = document.getElementById('txt');
    var length = document.getElementById('length');

    length.innerText = txt.value.length;
}

function scrollHomeEnd(event) {
    if (event.keyCode == 36) { // Home.
        window.scrollTo(0, 0);
    }
    else if (event.keyCode == 35) { // End.
        var width = $('#width').val();
        window.scrollTo(width, 0);
    }
}

function uniqueChars() {
    var txt = document.getElementById('txt');

    var s = txt.value;

    var unique = [];

    for (var i = 0; i < s.length; i++) {
        if (unique.indexOf(s[i]) == -1) {
            unique.push(s[i]);
        }
    }

    unique.sort();

    var resultStr = '';

    for (var i = 0; i < unique.length; i++) {
        resultStr += unique[i];
    }

    txt.value = resultStr;
}

function sortChars() {
    var txt = document.getElementById('txt');

    var s = txt.value;

    var splitted = s.split('');
    splitted.sort();

    txt.value = splitted.join('');
    txt.select();
}

$(document.body).keydown(scrollHomeEnd);
