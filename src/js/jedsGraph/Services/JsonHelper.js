function JsonHelper() {

    this.Contains = function(subsetJson, supersetJson) {
        if (typeof subsetJson !== typeof supersetJson)
            return false;

        switch (typeof subsetJson) {
            case "object":
                for (var key in subsetJson)
                    return recursivelyMatchJson(subsetJson[key], supersetJson[key])
            case "array":
                for (var i = 0; i < subsetJson; i++)
                    return recursivelyMatchJson(subsetJson[i], supersetJson[i])
            default:
                return subsetJson === supersetJson;
        }
        return true;
    }

}