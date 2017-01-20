//
// ** Encoding functions
//

// http://stackoverflow.com/questions/2696481/encoding-conversation-utf-8-to-1251-in-javascript
//
var DMap = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 1027: 129, 8225: 135, 1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 1028: 170, 160: 160, 1040: 192, 1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182, 183: 183, 8221: 148, 187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 1060: 212, 1030: 178, 1061: 213, 1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223, 1072: 224, 8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 1076: 228, 1077: 229, 8211: 150, 1078: 230, 1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237, 1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246, 1054: 206, 1095: 247, 1096: 248, 8249: 139, 1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147, 1101: 253, 8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190 };

function UnicodeToWin1251(s) {
    var L = [];
    for (var i = 0; i < s.length; i++) {
        var ord = s.charCodeAt(i);
        if (!(ord in DMap)) {
            throw "Character " + s.charAt(i) + " isn't supported by win1251!"
        }
        L.push(String.fromCharCode(DMap[ord]));
    }
    return L.join('');
}

// https://www.opennet.ru/tips/915_utf8_unicode_javascript_java_koi8r.shtml
//
var koi2utf = { 163: 1105, 179: 1025, 192: 1102, 193: 1072, 194: 1073, 195: 1094, 196: 1076, 197: 1077, 198: 1092, 199: 1075, 200: 1093, 201: 1080, 202: 1081, 203: 1082, 204: 1083, 205: 1084, 206: 1085, 207: 1086, 208: 1087, 209: 1103, 210: 1088, 211: 1089, 212: 1090, 213: 1091, 214: 1078, 215: 1074, 216: 1100, 217: 1099, 218: 1079, 219: 1096, 220: 1101, 221: 1097, 222: 1095, 223: 1098 };

function koi2unicode (str) {
    if (str == null) {
        return null;
    }
    var result = "";
    var o_code = "";
    var i_code = "";
    for (var I=0; I < str.length; I++) {
        i_code = str.charCodeAt(I);

        if (koi2utf[i_code] != null){
            o_code = koi2utf[i_code];
        } else if (i_code > 223 && koi2utf[i_code - 32] != null){
            o_code = koi2utf[i_code - 32] - 32;
        } else {
            o_code = i_code;
        }
        result = result + String.fromCharCode(o_code);
    }

    return result;
}

function win2unicode (str) {
    if (str == null){
        return null;
    }
    var result = "";
    var o_code = "";
    var i_code = "";
    for (var I=0; I < str.length; I++) {
        i_code = str.charCodeAt(I);

        if (i_code == 184){
            o_code = 1105;
        } else if (i_code == 168){
            o_code = 1025;
        } else if (i_code > 191 && i_code < 256){
            o_code = i_code + 848;
        } else {
            o_code = i_code;
        }
        result = result + String.fromCharCode(o_code);
    }

    return result;
}

// http://stackoverflow.com/questions/16914085/how-to-convert-utf-8-string-to-urlencoded-win1251-in-javascript
// var DMap = {0: 0,... for using in the next function is the same as in the code above
//
function unicodeToWin1251_UrlEncoded(s) {
    var L = [];
    for (var i = 0; i < s.length; i++) {
        var ord = s.charCodeAt(i);
        if (!(ord in DMap)) {
            throw "Character " + s.charAt(i) + " isn't supported by win1251!";
        }
        L.push('%'+DMap[ord].toString(16));
    }
    return L.join('').toUpperCase();
}


//
// ** <textarea> functions
//

// http://stackoverflow.com/questions/9185630/find-out-the-line-row-number-of-the-cursor-in-a-textarea
function getSelectionStartLine(textarea) {
    return textarea.value.substr(0, textarea.selectionStart).split("\n").length;
}

// By analogy to getSelectionStartLine
function getSelectionEndLine(textarea) {
    return textarea.value.substr(0, textarea.selectionEnd).split("\n").length;
}

function selectTextareaLine (textarea, lineNum) {
    lineNum--; // array starts at 0
    var lines = textarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = textarea.value.length;
    for (var x = 0; x < lines.length; x++) {
        if (x == lineNum) {
            break;
        }
        startPos += (lines[x].length + 1);
    }

    var endPos = lines[lineNum].length + startPos;

    // Chrome / Firefox
    if (typeof(textarea.selectionStart) != "undefined") {
        textarea.focus();
        textarea.selectionStart = startPos;
        textarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        textarea.focus();
        textarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}

function getLinesInTextarea(textarea) {
    return textarea.value.split('\n').length;
}


//
// ** Cookies functions
// http://www.w3schools.com/js/js_cookies.asp
//
// Do not forget about cookies symbols - replace ';' to some string before saving and restore it while retrieving
//

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    
    return "";
}


//
// ** DOM functions
//

// http://stackoverflow.com/questions/4793604/how-to-do-insert-after-in-javascript-without-using-a-library
//
function insertAfter(newNode, referenceNode) {
    if (referenceNode.nextSibling) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    else {
        referenceNode.parentNode.appendChild(newNode);
    }
}
