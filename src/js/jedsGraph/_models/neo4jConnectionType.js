function neo4jConnectionType(name, url, username, password) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.server = url;
    this.userToken = window.btoa(username + ':' + password);
}