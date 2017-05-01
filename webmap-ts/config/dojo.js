var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
dojoConfig = {
  async: true,
  packages: [{
      name: "Application",
      location: package_path + "/app",
      main: "main"
    },
    {
      name: "ApplicationBase",
      location: package_path + "/../ApplicationBase",
      main: "ApplicationBase"
    },
    {
      name: "config",
      location: package_path + "/config"
    }
  ]
};
if (location.search.match(/locale=([\w-]+)/)) {
  dojoConfig.locale = RegExp.$1;
}
