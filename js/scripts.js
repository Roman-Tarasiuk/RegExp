// Does not work.
//function compare2() {
//    var str1 = document.getElementById('str1').value;
//    var str2 = document.getElementById('str2').value;
//
//    // Swap strings to str1 be shorter than str2.
//    var swap = false;
//    if (str1.length > str2.length) {
//        var tmp = str1;
//        str1 = str2;
//        str2 = tmp;
//        swap = true;
//    }
//
//    var resultStr1 = '';
//    var resultStr2 = '';
//
//    var p1 = 0,
//        p2 = 0;
//
//    while(true) {
//        var eq = nexEqualSymbol(str1, str2, p1, p2);
//
//        if (eq.p1 == -1) {
//            if (p1 < str1.length) {
//                resultStr1 += '<span class="cmp">' + str1.substr(p1) + '</span>';
//            }
//            if (p2 < str2.length) {
//                resultStr2 += '<span class="cmp">' + str2.substr(p2) + '</span>';
//            }
//            break;
//        }
//
//        if (eq.p1 > p1) {
//            resultStr1 += '<span class="cmp">' + str1.substr(p1, eq.p1 - p1) + '</span>';
//            p1 = eq.p1;
//        }
//        if (eq.p2 > p2) {
//            resultStr2 += '<span class="cmp">' + str2.substr(p2, eq.p2 - p2) + '</span>';
//            p2 = eq.p2;
//        }
//
//        do {
//            resultStr1 += str1[p1++];
//            resultStr2 += str2[p2++];
//        }
//        while (str1[p1] == str2[p2] && p1 < str1.length);
//    }
//
//    if (swap) {
//        var tmp = resultStr1;
//        resultStr1 = resultStr2;
//        resultStr2 = tmp;
//    }
//
//    document.getElementById('cmp2_1').innerHTML = resultStr1;
//    document.getElementById('cmp2_2').innerHTML = resultStr2;
//
//    //
//
//    function nexEqualSymbol(str1, str2, i1, i2) {
//        var result = {
//            p1: -1,
//            p2: -1
//        };
//
//        if (i1 >= str1.length || i2 >= str1.length) {
//            return result;
//        }
//
//        loop1:
//        for (var i = i1; i < str1.length; i++) {
//            for (var j = i2; j < str2.length; j++) {
//                if (str1[i] == str2[j]) {
//                    result = {
//                        p1: i,
//                        p2: j
//                    };
//                    break loop1;
//                }
//            }
//        }
//
//        loop2:
//        for (var j = i2; j < str2.length; j++) {
//            for (var i = i1; i < str1.length; i++) {
//                if (str1[i] == str2[j] && (i + j) < (result.p1 + result.p2)) {
//                    result = {
//                        p1: i,
//                        p2: j
//                    };
//                    break loop2;
//                }
//            }
//        }
//
//        loop3:
//        for (var i = i1 + 1; i < str1.length; i++) {
//            for (var j = i2; j < str2.length; j++) {
//                if (str1[i] == str2[j]) {
//                    result = {
//                        p1: i,
//                        p2: j
//                    };
//                    break loop3;
//                }
//            }
//        }
//
//        loop4:
//        for (var j = i2 + 1; j < str2.length; j++) {
//            for (var i = i1; i < str1.length; i++) {
//                if (str1[i] == str2[j] && (i + j) < (result.p1 + result.p2)) {
//                    result = {
//                        p1: i,
//                        p2: j
//                    };
//                    break loop4;
//                }
//            }
//        }
//
//        return result;
//    }
//}

function compareByWords(s1, s2) {
    var str1 = s1.split(/\s+/g);
    var str2 = s2.split(/\s+/g);

    var p1 = 0,
        p2 = 0;
    
    var swap = false;
    if (str1.length > str2.length) {
        var tmp = str1;
        str1 = str2;
        str2 = tmp;
        swap = true;
    }

    var resultStr1 = '',
        resultStr2 = '',
        diffCount = 0;

    while(p1 < str1.length && p2 < str2.length) {
        var next = nextMatchStr(str1, str2, p1, p2);

        if (next.p1 == -1) {
            if (p1 < (str1.length - 1)) {
                resultStr1 += ' <span class="cmp">' + appendStrings(str1, p1, str1.length - 1) + '</span>';
                diffCount++;
            }
            if (p2 < (str2.length - 1)) {
                resultStr2 += ' <span class="cmp">' + appendStrings(str2, p2, str2.length - 1) + '</span>';
                diffCount++;
            }
            break;
        }

        if (next.p1 > p1 || next.p2 > p2) {
            diffCount++;
        }

        if (next.p1 > p1) {
            resultStr1 += ' <span class="cmp">' + appendStrings(str1, p1, next.p1 - 1) + '</span>';
            p1 = next.p1;
        }
        if (next.p2 > p2) {
            resultStr2 += ' <span class="cmp">' + appendStrings(str2, p2, next.p2 - 1) + '</span>';
            p2 = next.p2;
        }

        do {
            resultStr1 += ' ' + str1[p1++];
            resultStr2 += ' ' + str2[p2++];
        } while (p1 < str1.length && str1[p1] == str2[p2])
    }

    if (swap) {
        var tmp = resultStr1;
        resultStr1 = resultStr2;
        resultStr2 = tmp;
    }

    return {
        resultStr1: resultStr1,
        resultStr2: resultStr2,
        diffCount: diffCount
    };

    //

    function nextMatchStr(str1, str2, p1, p2) {
        var result = {
            p1: -1,
            p2: -1
        }

        loop1:
        for (var i = p1; i < str1.length; i++) {
            for (var j = p2; j < str2.length; j++) {
                if (str1[i] == str2[j]) {
                    result = {
                        p1: i,
                        p2: j
                    };
                    break loop1;
                }
            }
        }

        loop2:
        for (var j = p2; j < str2.length; j++) {
            for (var i = p1; i < str1.length; i++) {
                if (str1[i] == str2[j] && (i + j) < (result.p1 + result.p2)) {
                    result = {
                        p1: i,
                        p2: j
                    };
                    break loop2;
                }
            }
        }

        return result;
    }

    function appendStrings(str1, start, end) {
        var result = '';

        for (var i = start; i <= end; i++) {
            result += str1[i] + (i < end ? ' ' : '');
        }
        
        return result;
    }
}