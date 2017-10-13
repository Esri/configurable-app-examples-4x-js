define(["require", "exports", "dojo/text!config/applicationBase.json", "dojo/text!config/application.json", "ApplicationBase/ApplicationBase", "./Main"], function (require, exports, applicationBaseConfig, applicationConfig, ApplicationBase, Application) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = new Application();
    new ApplicationBase({
        config: applicationConfig,
        settings: applicationBaseConfig
    }).load().then(function (base) { return Main.init(base); });
});
//# sourceMappingURL=init.js.map