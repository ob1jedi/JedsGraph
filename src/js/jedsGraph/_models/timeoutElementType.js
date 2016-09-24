

function timeoutElementType(_element, _duration, functionRemove) {
    this.fnRemove = functionRemove;
    this.duration = _duration; //in seconds
    this.activationPoint = +new Date(); //+new Date()
    this.element = _element; //UI element
}
