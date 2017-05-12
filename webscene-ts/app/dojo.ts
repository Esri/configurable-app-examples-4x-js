(() => {
  const { pathname, search } = window.location;
  const packagePath = pathname.substring(0, pathname.lastIndexOf("/"));
  const localeUrlParamRegex = /locale=([\w-]+)/;
  const dojoLocale = search.match(localeUrlParamRegex) ?
    RegExp.$1 :
    undefined;

  const config = {
    async: true,
    locale: dojoLocale,
    packages: [{
      name: "Application",
      location: `${packagePath}/app`,
      main: "Main"
    },
    {
      name: "ApplicationBase",
      location: `${packagePath}/../ApplicationBase`,
      main: "ApplicationBase"
    },
    {
      name: "config",
      location: `${packagePath}/config`
    }]
  };

  window["dojoConfig"] = config;
})();
