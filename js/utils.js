window.onload = function() {
    var item1 = document.getElementById('item1');
    openTab(item1, 'tabAddresses');

    colorChange();
    document.getElementById('colorList').value =
        document.getElementById('colorList').value.trim().split(/\n+/gm).reduce((a, c) => a + '\n' + c.trim());
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

        result += ' (' + (days * 24 * 60 + hours * 60 + minutes + (seconds > 0 ? 1 : 0)) + ' minutes)';

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

(function() { // Time functions.
    var h = 0;
    var m = 0;
    var s = 0;

    var now = null;
    var userInput = '';

    var timeBeforeEl = document.getElementById('timeBefore');
    var timeBeforeClockEl = document.getElementById('timeBeforeClock');
    var stopTimeBeforeEl = document.getElementById('stopTimeBefore');
    var toShowTimeBefore = false;

    var before = null;

    var momentObj = new Moment();

    function showTimeBefore(dt) {
        var now = Date.now();

        var str = momentObj.subtractDates(dt, now);

        timeBeforeClockEl.innerHTML = str;
    }

    function toggleState(run) {
        if (run) {
            stopTimeBeforeEl.style.visibility = 'visible';
        }
        else {
            stopTimeBeforeEl.style.visibility = 'hidden';
        }
    }

    stopTimeBeforeEl.addEventListener('click', function() {
        toShowTimeBefore = false;
        timeBeforeClockEl.innerHTML = '';
        toggleState(false);
    });

    var showTime = function() {
        var d = new Date(Date.now());

        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();

        if (hours == h && minutes == m && seconds == s) {
            return;
        }

        h = hours;
        m = minutes;
        s = seconds;

        var timeStr = (hours < 10 ? '0' : '') + hours + ':'
                    + (minutes < 10 ? '0' : '') + minutes + ':'
                    + (seconds < 10 ? '0' : '') + seconds;

        document.getElementById('clock').innerHTML = timeStr;

        if (toShowTimeBefore && before != null) {
            showTimeBefore(before);
        }
    }

    timeBeforeEl.addEventListener('keydown', function(event) {
        if (event.code == 'Enter' || event.code == 'NumpadEnter') {
            try {
                toShowTimeBefore = true;

                before = momentObj.parseTime(timeBeforeEl.value);
                showTimeBefore(before);

                toggleState(true);
            }
            catch (e) {
                console.log('Wrong input: ' + e);
            }
        }
    });

    function customDateTimeFormat(d) {
        return moment(d).format($('#customDTFormat').val());
    }

    function showDateTime(d) {
        var dateTimeStr = '';

        var radioButtons = document.querySelector('[name="dateTimeFormat"]:checked').value;

        switch (radioButtons) {
            case 'userInput':
                dateTimeStr = userInput;
                break;
            case 'default':
                dateTimeStr = (d == null) ? userInput + ' ** Invalid Date' : d.toString();
                break;
            case 'utc':
                dateTimeStr = (d == null) ? userInput + ' ** Invalid Date' : d.toUTCString();
                break;
            case 'locale':
                dateTimeStr = (d == null) ? userInput + ' ** Invalid Date' : d.toLocaleString();
                break;
            case 'localeUA':
                dateTimeStr = (d == null) ? userInput + ' ** Invalid Date' : d.toLocaleString('uk-UA');
                break;
            case 'custom':
                dateTimeStr = (d == null) ? userInput + ' ** Invalid Date' : customDateTimeFormat(d);
                break;
        }

        document.getElementById('dateTime').value = dateTimeStr;
    }

    function nowIs() {
        now = new Date(Date.now());

        var userInputEl = document.getElementById('userInput');
        userInputEl.disabled = true;
        if (userInputEl.checked) {
            document.getElementById('default').checked = true;
        }

        showDateTime(now);
    };

    function parseDate() {
        document.getElementById('userInput').disabled = false;
        var dtEl = document.getElementById('dateTime');
        userInput = dtEl.value;

        var d = null;

        if ($('#custom').prop('checked')) {
            var momentDate = moment(dtEl.value, $('#customDTFormat').val());
            d = momentDate.toDate();
        }
        else {
            var d = new Date(Date.parse(dtEl.value));
        }

        if (d == null || d == 'Invalid Date') {
            now = null;
        }
        else {
            now = d;
        }
        
        showDateTime(now);
    }

    // Run.
    window.setInterval(showTime, 100);
    nowIs();

    document.getElementById('dateTimeNow').addEventListener('click', nowIs);
    document.getElementById('dateTimeParse').addEventListener('click', parseDate);

    $('input[name="dateTimeFormat"]').on('change', () => {
        showDateTime(now);
        if ($('#custom').prop('checked')) {
            $('#customDTFormat').prop('disabled', false);
        }
        else {
            $('#customDTFormat').prop('disabled', true);
        }
    });
})();

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
    var count = 0;
    for (var p in stat) {
        if (stat[p] > 1) {
            areUnique = false;
            break;
        }
        count++;
    }

    if (areUnique) {
        alert(count + ' rows are unique.');
    }
    else {
        alert('Rows are NOT unique.');
    }
}

function uniqueList() {
    var input = document.getElementById('data');
    var rows = input.value.split('\n');
    clearEmptyStrings(rows);

    var stat = getStatistic(rows);

    var result = '';
    for (var p in stat) {
        //console.log(p);
        result += p + '\n'
    }

    input.value = result;
}

function searchInParentheses() {
    var input = document.getElementById('textInParenthesesInput').value;
    var prefix = document.getElementById('inParenthesesPrefix').value;
    var openP = document.getElementById('inParenthesisOpen').value;
    var closeP = document.getElementById('inParenthesisClose').value;
    var splitter = document.getElementById('inParenthesisSplitter').value.replace(/\\n/g, '\n');
    var resultEl = document.getElementById('textInParenthesesResults');
    var withParentheses = document.getElementById('inParenthesisResultWithParenheses').checked;

    if (openP.length != 1 || closeP.length != 1) {
        resultEl.value = 'Parentheses must be of length 1.';
        return;
    }
    else {
        resultEl.value = '';
    }

    var currentPos = 0;
    var result = '';

    do {
        var foundIndex = 0;
        var endOfString = false;

        if (prefix.length != 0) {
            foundIndex = input.indexOf(prefix, currentPos);
        }

        console.log(foundIndex);
        if (foundIndex == -1) {
            break;
        }

        currentPos = prefix.length != 0 ? foundIndex + prefix.length : currentPos;

        var start = -1;
        var end = -1;
        var openCount = 0;

        while (true) {
            if (input[currentPos] == openP) {
                if (openCount == 0) {
                    start = currentPos + 1;
                }
                openCount++;
            }
            else if (input[currentPos] == closeP) {
                openCount--;
                if (openCount == 0) {
                    end = currentPos;
                }
            }

            if (start != -1 && end != -1) {
                result += (withParentheses ? openP : '')
                    + input.substring(start, end)
                    + (withParentheses ? closeP : '')
                    + splitter
                    ;
                currentPos = end + 1;
                break;
            }

            currentPos++;

            if (currentPos == input.length) {
                endOfString = true;
                break;
            }
        }

        if (currentPos == input.length) {
            endOfString = true;
        }

        if (endOfString) {
            break;
        }
    } while (true);

    resultEl.value = result;
}

function convertXMLtoJSON() {
    var xmlEl = document.getElementById('textXML');
    var jsonEl = document.getElementById('textJSON');
    var xml = xmlEl.value;

    var convert = window;

    var result = convert.xml2json(xml, {
        compact: document.getElementById('compact').checked,
        fullTagEmptyElement: document.getElementById('fullTag').checked,
        spaces: 2
    });

    jsonEl.value = result;
}

function convertJSONtoXML() {
    var jsonEl = document.getElementById('textJSON');
    var json = jsonEl.value;

    var convert = window;

    var xml = convert.json2xml(json, {
        compact: document.getElementById('compact').checked,
        fullTagEmptyElement: document.getElementById('fullTag').checked,
        spaces: 2
    });

    jsonEl.value = xml;
}

function obj2array(obj) {
    var result = [];

    for (var p in obj) {
        result.push(obj[p]);
    }

    return result;
}

function sortObject(obj) {
    return obj = Object.keys(obj).sort().reduce(function (result, key) {
        if (typeof(obj[key]) == 'object') {
            if (Array.isArray(obj[key])) {
                result[key] = obj2array(sortObject(obj[key]));
            }
            else {
                result[key] = sortObject(obj[key]);
            }
        }
        else {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

function sortProps() {
    var jsonEl = document.getElementById('textJSON');
    var o = JSON.parse(jsonEl.value);
    o = sortObject(o);
    var json = JSON.stringify(o, null, '  ');

    jsonEl.value = json;
}

function convertJSONtoTable() {
    var jsonEl = document.getElementById('textJSON2');
    var tableEl = document.getElementById('textTable');

    var json = JSON.parse(jsonEl.value); // Array.
    var headers = [];
    var body = [];

    var empty = document.getElementById('tabJSONtoTableEmpty').value;

    for (var i in json) {
        var tmp = json[i];
        for (var j = 0; j < headers.length; j++) {
            if (tmp[headers[j]] == undefined) {
                tmp[headers[j]] = empty;
            }
        }

        body.push(tmp);

        for (var j in json[i]) {
            if (headers.indexOf(j) == -1) {
                headers.push(j);

                for (var k = 0; k < body.length - 1; k++) {
                    body[k][j] = empty;
                }
            }
        }
    }

    var result = '';

    // Headers.
    for (var i = 0; i < headers.length; i++) {
        result += headers[i] + (i < (headers.length - 1) ? '\t' : '');
    }
    result += '\n';

    // Body.
    for (var i = 0; i < body.length; i++) {
        for (var j = 0; j < headers.length; j++) {
            result += body[i][headers[j]] + (j < (headers.length - 1) ? '\t' : '');
        }
        result += '\n';
    }

    tableEl.value = result;
}

//
// The directory in JSON format:
// { "dir/": {"subdir/": {...}}, files: [...]}
//
function getPathsFromJSON() {
    var jsonEl = document.getElementById('textJSON3');
    var resultEl = document.getElementById('textJSONResult3');

    function processObj(json, parent) {
        var tmp = [];
        // Adding directories.
        for (var p in json) {
            if (p != 'files') {
                var subPaths = processObj(json[p], p);
                if (subPaths.length == 0) {
                    tmp.push(p)
                }
                else {
                    for (var s in subPaths) {
                        tmp.push(subPaths[s]);
                    }
                }
            }
        }
        // Adding files after directories.
        var files = json['files'];
        for (var f in files) {
            tmp.push(files[f]);
        }

        var result = [];
        for (var r in tmp) {
            result.push(parent + tmp[r]);
        }

        return result;
    }

    var jsonObj = JSON.parse(jsonEl.value);

    var result = processObj(jsonObj, '/');
    resultEl.value = result.join('\n');
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

function info() {
    var input = document.getElementById('data');
    var message = 'Length: ' + input.value.length
                + ', rows: ' + input.value.lineCount();

    alert(message);
}

(function(){
    var counter = 0;

    var counterEl = document.getElementById('counter');
    var counterUpEl = document.getElementById('counterUp');
    var counterDownEl = document.getElementById('counterDown');
    var counterClearEl = document.getElementById('counterClear');
    var counterInitialValueEl = document.getElementById('counterInitialValue');
    var counterInitEl = document.getElementById('counterInit');

    counterUpEl.addEventListener('click', function() {
        counter++;
        counterEl.innerText = counter;
    });

    counterDownEl.addEventListener('click', function() {
        counter--;
        counterEl.innerText = counter;
    });

    counterClearEl.addEventListener('click', function() {
        counter = 0;
        counterEl.innerText = counter;

        counterUpEl.focus();
    });

    counterInitEl.addEventListener('click', function() {
        counter = parseInt(counterInitialValueEl.value);
        counterEl.innerText = counter;
    });
})();

function colorList() {
    var colors = document.getElementById('colorList').value.trim().split(/\s+/gm);

    for (var i = 0; i < colors.length; i++) {
        var el = document.createElement('div');
        el.setAttribute('class', 'colored-div');
        el.style.backgroundColor = colors[i];

        document.getElementById('coloredContainer').appendChild(el);
    }
}

function clearcolorList() {
    document.getElementById('coloredContainer').innerHTML = '';
}

function rgb(r, g, b){
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function rgbHex(r, g, b){
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

function colorChange() {
    var rB = parseInt(document.getElementById('bacR').value);
    var gB = parseInt(document.getElementById('bacG').value);
    var bB = parseInt(document.getElementById('bacB').value);

    var r = parseInt(document.getElementById('colR').value);
    var g = parseInt(document.getElementById('colG').value);
    var b = parseInt(document.getElementById('colB').value);

    var bakEl = document.getElementById('background');
    bakEl.style.backgroundColor = rgb(rB, gB, bB);
    document.getElementById('bacValue').innerHTML = rgb(rB, gB, bB) + ' ' + rgbHex(rB, gB, bB);

    var sampleEl = document.getElementById('sample');
    sampleEl.style.color = rgb(r, g, b);
    document.getElementById('colValue').innerHTML = rgb(r, g, b) + ' ' + rgbHex(r, g, b);
}
