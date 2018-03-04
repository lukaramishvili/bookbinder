
import invertColor from '../../node_modules/invert-color/lib/invert';

export default {
    padZero(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    },
    hexFromRGB(r,g,b){
        if(typeof(r) === "object"){
            return "#" + this.padZero(r.r) + this.padZero(r.g) + this.padZero(r.b);
        } else {
            return "#" + this.padZero(r) + this.padZero(g) + this.padZero(b);
        }
    },
    rgbFromHex(hex){
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        // pad each with zeros and return
        return { r, g, b };
    },
    invertRGB(r, g, b, bw) {
        return invertColor({ r, g, b }, bw);
    },
    invertHex(hex, bw) {
        return invertColor(hex, bw);
    },
    componentRandom(){
        return Math.round(Math.random()*255);
    },
    componentsRandom(){
        let rc = this.componentRandom;
        return { r: rc(), g: rc(), b: rc(), };
    },
    rgbRandom() {
        let rgbs = this.componentsRandom();
        return `rgb(${rgbs.r},${rgbs.g},${rgbs.b})`;
    },
    hexRandom() {
        return this.hexFromRGB(this.componentsRandom());
    },
    invert(color, bw){
        return invertColor(color, bw);
    },
}
