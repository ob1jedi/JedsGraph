function themeType(entityRgbRange, graphBackground, entityLabelColor) {
    this.entityRgbRange = (entityRgbRange) ? entityRgbRange : { min: 100, max: 200 };
    /*The 4bit rgb range from which label colors can be automatically generated.*/
    this.graphBackground = (graphBackground) ? graphBackground : '#1a1a1a';
    this.entityLabelColor = (entityLabelColor) ? entityLabelColor : 'white';
    //this.entityShape = (entityShape)?entityShape: 'rect';
    this.opaque = false;
    /*choices: 
		rect (entities are rectangular)
		circle (entities are circles)
	*/
    this.labelSizing = "fontsize";
    /*choices: 
		"hyphenate" (make labels shorter)
		"fontsize" (make the font size smaller)
		"" (no sizing, labels may extend past the boundaries of the node)
	*/
    this.shadow = true;
    this.glow = false;
    this.linkColor = 'red';
    this.rounded = false;
    this.showLabels = true;
}