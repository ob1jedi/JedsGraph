function neoLabelType(setName, setColor, setColorRGB, setSourceConfig) {
    this.data = {};
    this.data.sourceConfig = setSourceConfig;
    this.instanceCount = 0;
    this.name = setName;
    this.color = setColor;
    this.colorRGB = setColorRGB;
    return this;
}
