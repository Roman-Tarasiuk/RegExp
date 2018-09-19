window.onload = function() {
    var item1 = document.getElementById('item1');
    openTab(item1, 'tabAddresses');
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

(function() {
    var width = $('#request').width();
    // To Do: Hardcoded '33' and '8' - need to be computed automatically
    //$('#txtInput').width(width - $('#comment').width() - $('#btnClean').width() - 36);
    $('#result').width(width - 8);
})();

//if (isInternetExplorer()) {
    //$('#txtResult').resizable();
//}

function decode() {
    var address = document.getElementById('txtInput').value;
    var addressPattern = /url=http.*&usg=/;
    var tmp = addressPattern.exec(address);

    var isGoogleAddress;
    if(tmp == null) {
        tmp = address;
        isGoogleAddress = false;
    }
    else {
        tmp = tmp.toString();
        isGoogleAddress = true;
    }

    //
    // http://meyerweb.com/eric/tools/dencoder/
    //
    //tmp = decodeURIComponent(tmp.replace(/\+/g,  ' '));
    tmp = decodeURIComponent(tmp);

    if(isGoogleAddress) {
        // It's need to decode twice, I do not know why.
        tmp = decodeURIComponent(tmp.slice(4, tmp.length - 5));
    }

    if(tmp.indexOf('%') > 0) {
        tmp = '%%%' + tmp;
    }

    document.getElementById('txtResult').value = tmp;
}

function simpleEncode() {
    var origin = document.getElementById('txtInput');
    var result = document.getElementById('txtResult');

    result.value = encodeURIComponent(origin.value);
}

function simpleDecode() {
    var origin = document.getElementById('txtInput');
    var result = document.getElementById('txtResult');

    result.value = decodeURIComponent(origin.value);
}

function encodeSpaces() {
    var originElement = document.getElementById('txtInput');
    var resultElement = document.getElementById('txtResult');

    var re = / /g;

    resultElement.value = originElement.value.replace(re, '%20');
}

function nowIs() {
    var d = new Date(Date.now());

    var month = d.getMonth() + 1;
    if (month.toString().length == 1) {
        month = '0' + month;
    }

    var date = d.getDate();
    if (date.toString().length == 1) {
        date = '0' + date;
    }

    var hours = d.getHours();
    if (hours.toString().length == 1) {
        hours = '0' + hours;
    }

    var minutes = d.getMinutes();
    if (minutes.toString().length == 1) {
        minutes = '0' + minutes;
    }

    var seconds = d.getSeconds();
    if (seconds.toString().length == 1) {
        seconds = '0' + seconds;
    }

    var s = '';
    s += d.getFullYear() + '-' + month + '-' + date + '--' + hours + '-' + minutes + '-' + seconds;

    document.getElementById('dateTimeNow').innerHTML = s;
};

nowIs();

(function() {
    var showTime = function() {
        var d = new Date(Date.now());

        var hours = d.getHours();
        if (hours < 10) {
            hours = '0' + hours;
        }

        var minutes = d.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        var seconds = d.getSeconds();
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        document.getElementById('clock').innerHTML = hours + ':' + minutes + ':' + seconds;
    }

    window.setInterval(showTime, 100);
}
)();

function checkUncommentedSQL() {
    function isSpaceOrComment(str) {
        var index = 0;
        while (index < str.length) {
            if ((str[index] == ' ') || (str[index] == '\t')) {
                index++;
            }
            else {
                break;
            }
        }

        if (index == str.length) {
            return true;
        }

        if (str[index] == '-') {
            if ((index < str.length - 1) && (str[index + 1] == '-')) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    var rows = document.getElementById('sqlCode').value.split('\n');

    var uncommentedFound = false;
    for (var i = 0; i < rows.length; i++) {
        if (!isSpaceOrComment(rows[i])) {
            uncommentedFound = true;
            break;
        }
    }

    if (uncommentedFound) {
        alert('Found uncommented line: ' + (i + 1));
    }
    else {
        alert('No uncommented lines found.');
    }
}

function argumentSQL() {
    // --:: $T1 TM_ACC_TMP2_TRM
    // --:: $C1 POST_DATE
    // --:: $C2 STATUS
    // select distinct T1.$C1 from $T1 T1
    //     where T1.$C2 is not null

    var argStr = '--::';

    var sqlCtrl = document.getElementById('sqlCode');

    var rows = sqlCtrl.value.split('\n');
    var replacements = [];
    var resultStr = '';

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].startsWith(argStr)) {
            var arg = getArg(rows[i]);
            if (arg != null) {
                replacements.push(arg);
            }
            resultStr += rows[i] + '\n';
        }
        else {
            resultStr += processArg(rows[i]) + '\n';
        }
    }

    sqlCtrl.value = resultStr;

    function getArg(str) {
        str = str.substring(argStr.length);
        str = str.trimLeft();

        var spaceIndex = str.indexOf(' ');

        var result;
        if (spaceIndex > 0) {
            result = {
                name: str.substring(0, spaceIndex),
                value: str.substring(spaceIndex + 1)
            };
        }
        else {
            result = null;
        }

        return result;
    }

    function processArg(str) {
        for (var i = 0; i < replacements.length; i++) {
            str = str.replaceAll(replacements[i].name, replacements[i].value);
        }

        return str;
    }
}

function removeCommentsSQL()
{
    var sqlCtrl = document.getElementById('sqlCode');
    
    var str = sqlCtrl.value;
    
    str = str.replace(/--.*/g, '');
    
    sqlCtrl.value = str;
}

function swapQuotes() {
    var symbols = ['±'];

    var replacement = null;

    var code = document.getElementById('code');

    var text;

    if (code.selectionStart < code.selectionEnd) {
        text = code.value.substring(code.selectionStart, code.selectionEnd);
    }
    else {
        text = code.value;
    }

    for (var i = 0; i < symbols.length; i++) {
        if (text.indexOf(symbols[i]) == -1) {
            replacement = symbols[i];
            break;
        }
    }

    if (replacement != null) {
        text = text.replace(/\"/g, replacement);
        text = text.replace(/\'/g, '"');
        text = text.replace(new RegExp(replacement, 'g'), "'");

        if (code.selectionStart < code.selectionEnd) {
            code.value =
                code.value.substring(0, code.selectionStart)
                + text
                + code.value.substring(code.selectionEnd);
        }
        else {
            code.value = text;
        }
    }
    else {
        code.value = 'Bad replacement symbols set.';
    }
}

function clearInput(id) {
    var data = document.getElementById(id);
    data.focus();
    data.value = '';
}

function statistic() {
    var input = document.getElementById('data');
    var rows = input.value.split('\n');

    var stat = getStatistic(rows);

    var resultStr = '';
    for (var p in stat) {
        resultStr += p + '\t' + stat[p] + '\n';
    }

    input.value = resultStr;
}

function getStatistic(rows) {
    var result = {};

    for (var i = 0; i < rows.length; i++) {
        if (rows[i] in result) {
            result[rows[i]]++;
        }
        else {
            result[rows[i]] = 1;
        }
    }

    return result;
}

function statisticCumulative() {
    var input = document.getElementById('data');
    var rows = input.value.split('\n');

    var stat = getStatistic(rows);

    var resultStr = '';
    var tmp = {};

    for (var i = 0; i < rows.length; i++) {
        if (rows[i] in tmp) {
            tmp[rows[i]]++;
        }
        else {
            tmp[rows[i]] = 1;
        }

        resultStr += rows[i] + '\t' + tmp[rows[i]] + '/' + stat[rows[i]] + '\n';
    }

    input.value = resultStr;
}

function statisticCategoryCount() {
// rows' format: subject \t category
    var input = document.getElementById('data');
    var rows = input.value.split('\n');

    var stat = {};
    var tmp = [];

    for (var i = 0; i < rows.length; i++) {
        var rowSplitted = rows[i].split('\t');
        var subj = rowSplitted[0];
        var cat = rowSplitted[1];
        if (subj in stat) {
            if (!(cat in stat[subj])) {
                stat[subj][cat] = null;
                // The next two forms are equal.
                //stat[subj].count++;
                stat[subj]["count"]++;
            }
        }
        else {
            stat[subj] = {[cat]: null, count: 1};
        }

        tmp.push(subj);
        tmp.push(cat);
    }

    var resultStr = '';
    for (var i = 0; i < rows.length; i++) {
        resultStr += tmp[i * 2] + '\t' + tmp[i * 2 + 1] + '\t' + stat[tmp[i * 2]].count + '\n';
    }

    input.value = resultStr;
}

function statisticCategoriesList() {
// rows' format: subject \t category
    var input = document.getElementById('data');
    var rows = input.value.split('\n');

    var stat = {};
    var tmp = [];

    for (var i = 0; i < rows.length; i++) {
        var rowSplitted = rows[i].split('\t');
        var subj = rowSplitted[0];
        var cat = rowSplitted[1];
        if (subj in stat) {
            if (!(cat in stat[subj])) {
                stat[subj][cat] = null;
                // The next two forms are equal.
                //stat[subj].count++;
                stat[subj]["count"]++;
            }
        }
        else {
            stat[subj] = {[cat]: null, count: 1};
        }

        tmp.push(subj);
        tmp.push(cat);
    }

    var resultStr = '';
    for (var s in stat) {
        var tmpStr = s + '\t';
        for (var c in stat[s]) {
            if (c != 'count') {
                tmpStr += c + ', ';
            }
        }
        if (tmpStr.endsWith(', ')) {
            tmpStr = tmpStr.substring(0, tmpStr.length - 2);
        }

        resultStr += tmpStr + '\n';
    }

    input.value = resultStr;
}

function unique() {
    var input = document.getElementById('data');
    var rows = input.value.split('\n');

    var stat = getStatistic(rows);

    var areUnique = true;
    for (var p in stat) {
        if (stat[p] > 1) {
            areUnique = false;
            break;
        }
    }

    if (areUnique) {
        alert('Rows are unique.');
    }
    else {
        alert('Rows are NOT unique.');
    }
}

function showHelp(obj) {
    var helpElement = document.getElementById('help');

    help.value =  obj.getAttribute('data-title');
}

function hideHelp() {
    var helpElement = document.getElementById('help');

    help.value = '';
}
