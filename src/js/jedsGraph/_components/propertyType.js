function propertyType(key, value) {
    this.key = key;
    this.value = value;
    this.datatype = getType(value);
    //console.log(key + ': ' + this.datatype + ' = ' + value);
    return this;
}

