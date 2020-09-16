//    This project is libre, and licenced under the terms of the
//    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE, version 3.1,
//    as published by dtf on July 2019. See the COPYING file or
//    https://ph.dtf.wtf/w/wtfpl/#version-3-1 for more details.

var terminal = {
    isEnabled : false,

    enable : function(stage) {        
        if (stage == 0) {
            this.isEnabled = true;
            openBoxAnimation(0, 20, 3, 23, 94, ' ', ["TERMINAL", null, null], null, ["function", this.enable, 1]);
        }
        else if (stage == 1) {
            display.drawText(21, 4, ["Terminal functionality is coming soon!", null, null], null);
            display.blit();
        }
    }
}