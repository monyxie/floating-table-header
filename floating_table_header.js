/* 2013-05-27 */
/* usage: floating_header(table_element) */
var floating_header = function(table) {

    if (!this.instances) this.instances = new Array();

    this.exists = function(table) {
        var l = this.instances.length;
        for (var i = 0; i < l; i++) {
            if (this.instances[i].table == table) return true;
        }
        return false;
    };

    this.getkeys = function(obj) {
        var keys = new Array();
        for ( var key in obj ) {
            keys.push(key);
        }
        return keys;
    };

    this.getXY = function( o ) {
        var y = 0;
        var x = 0;
        while( o != null ) {
            y += o.offsetTop;
            x += o.offsetLeft;
            o = o.offsetParent;
        }
        return { "x": x, "y": y };
    };

    this.setheader = function() {
        var win = window.pageYOffset ? window.pageYOffset : 0;
        var cel = document.documentElement ? document.documentElement.scrollTop : 0;
        var body = document.body ? document.body.scrollTop : 0;
        var result = win ? win : 0;
        if ( cel && ( ! result || ( result > cel ))) result = cel;
        var screenpos = body && ( ! result || ( result > body ) ) ? body : result;
        for (var i = 0, l = this.instances.length; i < l; i++) {
            var theady_max = this.getXY(this.instances[i].table_obj.getElementsByTagName('THEAD')[0]).y + this.instances[i].table_obj.offsetHeight - this.instances[i].header_height;
            if ( screenpos > this.instances[i].theady && screenpos < theady_max ) {
                this.instances[i].header.style.top=Math.round(screenpos) + 'px';
                this.instances[i].header.style.left = this.getXY(this.instances[i].table_obj).x + 'px';
                this.instances[i].header.style.display = 'block';
                this.instances[i].header_height = this.instances[i].header.offsetHeight;
            }
            else {
                this.instances[i].header.style.display = 'none';
            }
        }
    };

    this.addclass = function(obj, newclass) {
        if ( obj.classes == null ) {
            obj.classes = new Array();
        }
        obj.classes[newclass] = 1;
        obj.className = this.getkeys(obj.classes).join(' ');
        return true;
    };


    this.build_header = function(instance) {

        instance.table_obj = instance.table_element;
        thead = instance.table_obj.getElementsByTagName('THEAD')[0].cloneNode(1);
        // thead.id = 'copyrow';
        instance.header.style.position='absolute';
        instance.header.style.display='none';
        instance.header.cellPadding = instance.table_obj.cellPadding;
        instance.header.cellSpacing = instance.table_obj.cellSpacing;
        instance.header.appendChild(thead);
        instance.header.style.width = instance.table_obj.offsetWidth;
        var srcths = instance.table_obj.getElementsByTagName('THEAD')[0].getElementsByTagName('*');
        var copyths = thead.getElementsByTagName('*');
        for ( var x = 0; x < copyths.length; x++ ) {
            copyths[x].className = srcths[x].className;
            copyths[x].align = srcths[x].align;
            copyths[x].background = srcths[x].background;
            copyths[x].bgColor = srcths[x].bgColor;
            copyths[x].colSpan = srcths[x].colSpan;
            copyths[x].height = srcths[x].height;
            copyths[x].rowSpan = srcths[x].rowSpan;
            pr = Math.round(srcths[x].style.paddingRight.split('px')[0]);
            pl = Math.round(srcths[x].style.paddingLeft.split('px')[0]);
            bl = ( Math.round(srcths[x].style.borderLeftWidth.split('px')[0]) ) ? Math.round(srcths[x].style.borderLeftWidth.split('px')[0]) : 0;
            br = ( Math.round(srcths[x].style.borderRightWidth.split('px')[0]) ) ? Math.round(srcths[x].style.borderRightWidth.split('px')[0]) : 0;
            pt = Math.round(srcths[x].style.paddingTop.split('px')[0]);
            pb = Math.round(srcths[x].style.paddingBottom.split('px')[0]);
            bt = Math.round(srcths[x].style.borderTopWidth.split('px')[0]);
            bb = Math.round(srcths[x].style.borderBottomWidth.split('px')[0]);
            if ( srcths[x].currentStyle ) {
                for ( var y in srcths[x].currentStyle ) {
                    if ( y == 'font' || y == 'top' ) continue;
                    copyths[x].style[y] = srcths[x].currentStyle[y];
                }
                pr = Math.round(srcths[x].currentStyle.paddingRight.split('px')[0]);
                pl = Math.round(srcths[x].currentStyle.paddingLeft.split('px')[0]);
                bl = ( Math.round(srcths[x].currentStyle.borderLeftWidth.split('px')[0]) ) ? Math.round(srcths[x].currentStyle.borderLeftWidth.split('px')[0]) : 0;
                pt = Math.round(srcths[x].currentStyle.paddingTop.split('px')[0]);
                pb = Math.round(srcths[x].currentStyle.paddingBottom.split('px')[0]);
                bt = Math.round(srcths[x].currentStyle.borderTopWidth.split('px')[0]);
            }
            if ( srcths[x].onclick ) copyths[x].onclick = srcths[x].onclick;
            var width = ( srcths[x].offsetWidth - pr - pl > 0 ) ? srcths[x].offsetWidth - pr - pl : 0;
            copyths[x].style.position = srcths[x].style.position;
            copyths[x].style.top = ( srcths[x].offsetTop - pt - pb > 0 ) ? srcths[x].offsetTop - pt - pb : srcths[x].offsetTop;
            copyths[x].style.top = srcths[x].style.top;
            copyths[x].style.height = srcths[x].offsetHeight;
            copyths[x].style.left = srcths[x].offsetLeft;
            if ( ! copyths[x].currentStyle ) {
                copyths[x].style.width = document.defaultView.getComputedStyle(srcths[x],"").getPropertyValue("width");
            }
            else {
                copyths[x].style.width = srcths[x].offsetWidth - pr - pl; // - bl;
                copyths[x].width = srcths[x].width;
            }
            if ( x == copyths.length - 1 ) {
                instance.header.style.paddingBottom = pb;
                instance.header.style.borderBottom = bb;
            }
        }
        this.addclass(instance.header, 'floating_header');
        // document.body.appendChild(instance.header);
        // append right next to the original table to make original css selectors work
        if (instance.table_obj.nextSibling) {
            instance.table_obj.parentNode.insertBefore(instance.header, instance.table_obj.nextSibling);
        }
        else {
            instance.table_obj.parentNode.appendChild(instance.header);
        }
        instance.theady = this.getXY(instance.table_obj.getElementsByTagName('THEAD')[0]).y;
    };

    if (!table || table.tagName != 'TABLE' || !table.getElementsByTagName('THEAD')[0] || this.exists(table)) return;

    var new_instance = new Object();
    new_instance.table_element = table;
    new_instance.header = document.createElement('table');
    new_instance.header_height = 0;
    new_instance.theady = 0;
    this.build_header(new_instance);
    this.instances.push(new_instance);

    if (!this.listening) {
        window.addEventListener('scroll', this.setheader, false);
        this.listening = true;
    }
};

