define(["require", "exports", "dojo/text!config/ApplicationBase.json", "dojo/text!config/application.json", "ApplicationBase", "Application"], function (require, exports, applicationBaseConfig, applicationConfig, ApplicationBase, Application) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new ApplicationBase({
        config: applicationConfig,
        settings: applicationBaseConfig
    }).load().then(function (ApplicationBase) {
        new Application().init(ApplicationBase);
    });
});
//# sourceMappingURL=init.js.map