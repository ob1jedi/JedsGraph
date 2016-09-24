

//Link model
function linkDataType(fromNodeId, toNodeId, linkId, name, sourceConfig) {
    this.linkType = 'data';
    //this.source; //...neo4jConnectionType
    this.fromNodeID = fromNodeId;
    this.toNodeID = toNodeId ? toNodeId : -1;
    this.id = linkId ? linkId : -1;
    this.color = currentTheme.linkColor;
    this.thickness = 1;
    this.name = name ? name : '';
    this.displayLabel = '';
    this.properties = [];
    this.UI = new linkUiElementsType();
    this.checked = false; //...flag which indicates if the link is checked.
    this.displayingData = false; //...flag which indicates if the link label is currently displayingData.
    this.config = {}
    this.sourceConfig = currentTheme.sourceConfig;
    //this.config.linkDisplayBody = {};
    this.config.linkDisplayValues = {};

    if (sourceConfig) {
        this.color = sourceConfig.displaySettings.linkColor
    }
    return this;
}
