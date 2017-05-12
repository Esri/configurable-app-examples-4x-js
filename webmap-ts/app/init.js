require([
    "dojo/text!config/applicationBase.json",
    "dojo/text!config/application.json",
    "ApplicationBase",
    "Application"
], function (applicationBaseConfig, applicationConfig, ApplicationBase, Application) {
    var Main = new Application();
    new ApplicationBase({
        config: applicationConfig,
        settings: applicationBaseConfig
    }).load().then(function (base) { return Main.init(base); });
});
//# sourceMappingURL=init.js.map