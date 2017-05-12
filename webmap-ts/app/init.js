require([
    "dojo/text!config/applicationBase.json",
    "dojo/text!config/application.json",
    "ApplicationBase",
    "Application"
], function (applicationBaseConfig, applicationConfig, ApplicationBase, Main) {
    new ApplicationBase({
        config: applicationConfig,
        settings: applicationBaseConfig
    }).load().then(function (applicationBase) {
        new Main().init(applicationBase);
    });
});
//# sourceMappingURL=init.js.map