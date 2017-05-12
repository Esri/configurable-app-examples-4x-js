(function () {
    var _a = window.location, pathname = _a.pathname, search = _a.search;
    var packagePath = pathname.substring(0, pathname.lastIndexOf("/"));
    var localeUrlParamRegex = /locale=([\w-]+)/;
    var dojoLocale = search.match(localeUrlParamRegex) ?
        RegExp.$1 :
        undefined;
    var config = {
        async: true,
        locale: dojoLocale,
        packages: [{
                name: "Application",
                location: packagePath + "/app",
                main: "Main"
            },
            {
                name: "ApplicationBase",
                location: packagePath + "/../ApplicationBase",
                main: "ApplicationBase"
            },
            {
                name: "config",
                location: packagePath + "/config"
            }]
    };
    window["dojoConfig"] = config;
})();
//# sourceMappingURL=dojo.js.map