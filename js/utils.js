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
    var h = 0;
    var m = 0;
    var s = 0;
    
    var showTime = function() {
        var d = new Date(Date.now());

        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        
        if (hours == h && minutes == m && seconds == s) {
            return;
        }

        if (hours < 10) {
            hours = '0' + hours;
        }

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        
        h = hours;
        m = minutes;
        s = seconds;

        document.getElementById('clock').innerHTML = hours + ':' + minutes + ':' + seconds;
    }

    window.setInterval(showTime, 100);
}
)();

//

function getPadSpacec(s) {
    var count = 0;
    for (var i = 0; i < s.length; i++) {
        if (s[i] == ' ') {
            count++;
        }
        else {
            break;
        }
    }
    
    return count;
}

function getPaddingString(length) {
    var str = '';
    for (var i = 1; i <= length; i++) {
        str += ' ';
    }
    
    return str;
}

function padCSharp() {
    var inputEl = document.getElementById('cSharpCode');
    var rows = inputEl.value.split('\n');
        
    var padCount = getPadSpacec(rows[0]);
    padding = getPaddingString(padCount);
    
    //
    
    var result = '';
    for (var i = 0; i < rows.length; i++) {
        if (rows[i] == '' && i < (rows.length - 1)) {
            result += padding + rows[i] + '\n';
        }
        else {
            result += rows[i] + (i < (rows.length - 1) ? '\n' : '');
        }
    }
    
    inputEl.value = result;
}

function commentCSharp() {
    var inputEl = document.getElementById('cSharpCode');
    var rows = inputEl.value.split('\n');
        
    var padCount = getPadSpacec(rows[0]);
    padding = getPaddingString(padCount);
    
    //
    
    var re = new RegExp('^' + padding, 'g');
    var replacement = padding + '// ';
    
    var result = '';
    for (var i = 0; i < rows.length; i++) {
        result += rows[i].replace(re, replacement) + (i < (rows.length - 1) ? '\n' : '');
    }
    
    inputEl.value = result;
}

//

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
    clearEmptyStrings(rows);

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

function clearEmptyStrings(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '') {
            arr.splice(i, 1);
            i--;
        }
    }
}

function statisticCumulative() {
    var input = document.getElementById('data');
    var rows = input.value.split('\n');
    clearEmptyStrings(rows);

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
    clearEmptyStrings(rows);

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
    clearEmptyStrings(rows);

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
    clearEmptyStrings(rows);

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

function convertNumbers() {
    var base = 0;
    if (document.getElementById('o2').checked) {
        base = 2;
    }
    else if (document.getElementById('o8').checked) {
        base = 8;
    }
    else if (document.getElementById('o10').checked) {
        base = 10;
    }
    else if (document.getElementById('o16').checked) {
        base = 16;
    }
    
    if (base == 0) {
        return;
    }
    
    var baseResult = 0;
    var prefix = '';
    if (document.getElementById('r2').checked) {
        baseResult = 2;
    }
    else if (document.getElementById('r8').checked) {
        baseResult = 8;
    }
    else if (document.getElementById('r10').checked) {
        baseResult = 10;
    }
    else if (document.getElementById('r16').checked) {
        baseResult = 16;
        prefix = '0x';
    }
    
    if (baseResult == 0) {
        return;
    }
    
    console.log(base + ' -> ' + baseResult);
    
    var str = document.getElementById('inputNumbers').value;
    var numbers = str.split('\n');
    clearEmptyStrings(numbers);
    
    var resultStr = '';
    var padding = parseInt(document.getElementById('padding').value);
    
    for (var i = 0; i < numbers.length; i++) {
        resultStr += prefix + pad(parseInt(numbers[i], base).toString(baseResult), padding) + '\n';
    }
    
    document.getElementById('convertedNumbers').value = resultStr;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function Moment() {
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;

    this.subtractDates = function(d1, d2) {    
        var result = d2 > d1 ? '-' : '';
        
        var diff = Math.abs(d1 - d2);
        
        var days = Math.floor(diff / day);
        diff -= days * day;
        
        var hours = Math.floor(diff / hour);
        diff -= hours * hour;
        
        var minutes = Math.floor(diff / minute);
        diff -= minutes * minute;
        
        var seconds = Math.floor(diff / second);
        
        result += (days > 0 ? days + ' day(s) ' : '')
                + (hours < 10 ? '0' : '') + hours + ':'
                + (minutes < 10 ? '0' : '') + minutes + ':'
                + (seconds < 10 ? '0' : '') + seconds;
        
        return result;
    };

    // "hh:mm[:ss][ DD.MM[.YYYY]]"
    this.parseTime = function(dtString) {
        var hh, mm, ss, DD, MM, YYYY;
        
        var parts = dtString.split(' ');
        
        var timeParts = parts[0].split(':');
        if (timeParts.length == 1) {
            throw 'Invalid time';
        }
        
        hh = timeParts[0];
        mm = timeParts[1];
        ss = timeParts.length == 3 ? timeParts[2] : 0;
        
        if (parts.length == 2) {
            var dateParts = parts[1].split('.');
            DD = parseInt(dateParts[0]);
            MM = parseInt(dateParts[1]) - 1;
            YYYY = dateParts.length == 3 ? parseInt(dateParts[2]) - 1 : new Date().getFullYear();
        }
        else {
            var d = new Date();
            YYYY = d.getFullYear();
            MM = d.getMonth();
            DD = d.getDate();
        }
        
        return new Date(YYYY, MM, DD, hh, mm, ss);
    }
    
    return this;
}

// Time before.
(function() {
    var intervalId = -1;
    
    var timeBeforeEl = document.getElementById('timeBefore');
    var timeBeforeClockEl = document.getElementById('timeBeforeClock');

    var moment = new Moment();    
    
    function showTimeBefore(dt) {
        var now = Date.now();
        
        var str = moment.subtractDates(dt, now);

        timeBeforeClockEl.innerHTML = str;
    }
    
    timeBeforeEl.addEventListener('keydown', function(event) {
        if (event.code == 'Enter' || event.code == 'NumpadEnter') {
            try {
                var t = moment.parseTime(timeBeforeEl.value);
                
                clearInterval(intervalId);
                
                intervalId = setInterval(function() {
                    showTimeBefore(t);
                }, 1000);
            }
            catch (e) {
                console.log('Wrong input: ' + e);
            }
        }
    });
})();