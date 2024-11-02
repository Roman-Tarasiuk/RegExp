var logProcessor = {
    userInput: '',
    appliedStylesEl: null,
    colorsObj: null,
    colorClasses: [],

    loadFile: function (event) {
        var inputElement = document.getElementById('userInput');
        inputElement.value = 'Loading...';

        var file = event.target.files[0];

        var that = this;
        
        var reader = new FileReader();
        reader.onload = function (event) {
            // inputElement.value = event.target.result;
            inputElement.value = 'Loaded.';
            that.showLogs(event.target.result);
            that.applyStyles();
        };

        reader.readAsText(file);
    },

    addStyles: function() {
        var userColorsEl = document.getElementById('userColors');
        var colorsStr = userColorsEl.value;
        
        this.colorsObj = eval(colorsStr);
        this.colorClasses = [];
        
        var css = '';
        for (var i = 0; i < this.colorsObj.length; i++) {
            css += this.colorsObj[i].selector + this.colorsObj[i].style;
            this.colorClasses.push(this.colorsObj[i].selector.replace('.', ''));
        }
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        this.appliedStylesEl = style;
        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    },

    showLogs: function(userInput, formatObject) {
        var coloredEl = document.getElementById('colored');

        var rows = userInput.split('\n');

        for (var i = 0; i < rows.length; i++) {
            let s = document.createElement('div');
            s.classList.add('c');
            s.innerText = rows[i];
            coloredEl.appendChild(s);
        }
    },

    applyStyles: function() {
        if (this.appliedStylesEl != null) {
            document.head.removeChild(this.appliedStylesEl);
        }

        this.clearColorStyles();
        this.addStyles();

        var colored = document.querySelectorAll('.c');
        for (var i = 0; i < colored.length; i++) {
            for (var j = 0; j < this.colorsObj.length; j++) {
                if (this.colorsObj[j].re != undefined &&  typeof(this.colorsObj[j].re) != 'string') {
                    this.colorsObj[j].re.lastIndex = 0;
                    if (this.colorsObj[j].re.test(colored[i].innerText)) {
                        colored[i].classList.add(this.colorClasses[j]);
                    }
                }
            }
            if (colored[i].classList.length == 1) {
                colored[i].classList.add('unparsed');
            }
        }

        this.testStyles();
    },

    clearColorStyles: function() {
        var colored = document.querySelectorAll('.c');
        for (var i = 0; i < colored.length; i++) {
            for (var j = 0; j < this.colorClasses.length; j++) {
                colored[i].classList.remove(this.colorClasses[j]);
            }
        }
    },

    testStyles: function() {
        var testColorsEl = document.getElementById('testColors');
        
        for (var i = testColorsEl.children.length - 1; i >= 0; i--) {
            testColorsEl.removeChild(testColorsEl.children[i]);
        }
        
        for (var i = 0; i < this.colorsObj.length; i++) {
            let test = document.createElement('div');
            test.classList.add('test');
            test.classList.add('c');
            test.classList.add(this.colorClasses[i]);
            test.innerText = this.colorsObj[i].re != undefined ? this.colorsObj[i].re : '* undefined *';
            testColorsEl.appendChild(test);
        }
    }
}