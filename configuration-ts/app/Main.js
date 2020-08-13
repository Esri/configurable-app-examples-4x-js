/*
  Copyright 2017 Esri

  Licensed under the Apache License, Version 2.0 (the "License");

  you may not use this file except in compliance with the License.

  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software

  distributed under the License is distributed on an "AS IS" BASIS,

  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

  See the License for the specific language governing permissions and

  limitations under the License.​
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper", "esri/core/watchUtils", "esri/core/Accessor", "esri/core/accessorSupport/decorators", "ApplicationBase/support/widgetConfigUtils/basemapToggle"], function (require, exports, itemUtils_1, domHelper_1, watchUtils_1, Accessor, decorators_1, basemapToggle_1) {
    "use strict";
    var CSS = {
        loading: "configurable-application--loading"
    };
    /**
     * Accessor-based class used to define configuration properties
    */
    var ConfigSetting = /** @class */ (function (_super) {
        __extends(ConfigSetting, _super);
        function ConfigSetting(args) {
            return _super.call(this, args) || this;
        }
        __decorate([
            decorators_1.property()
        ], ConfigSetting.prototype, "basemapToggle", void 0);
        __decorate([
            decorators_1.property()
        ], ConfigSetting.prototype, "basemapTogglePosition", void 0);
        __decorate([
            decorators_1.property()
        ], ConfigSetting.prototype, "basemapSelector", void 0);
        __decorate([
            decorators_1.property()
        ], ConfigSetting.prototype, "nextBasemap", void 0);
        ConfigSetting = __decorate([
            decorators_1.subclass("configSettings")
        ], ConfigSetting);
        return ConfigSetting;
    }(Accessor));
    var ConfigurationExample = /** @class */ (function () {
        function ConfigurationExample() {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            this._configurationSettings = new ConfigSetting({
                basemapToggle: true,
                basemapTogglePosition: "top-right",
                basemapSelector: "50974f77fe6940c5b251c9bcb5367d2b",
                nextBasemap: null
            });
            //----------------------------------
            //  ApplicationBase
            //----------------------------------
            this.base = null;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        ConfigurationExample.prototype.init = function (base) {
            var _this = this;
            if (!base) {
                console.error("ApplicationBase is not defined");
                return;
            }
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            this.base = base;
            var config = base.config, results = base.results, settings = base.settings;
            var find = config.find, marker = config.marker;
            var webMapItems = results.webMapItems;
            var validWebMapItems = webMapItems.map(function (response) {
                return response.value;
            });
            var firstItem = validWebMapItems[0];
            if (!firstItem) {
                console.error("Could not load an item to display");
                return;
            }
            config.title = !config.title ? itemUtils_1.getItemTitle(firstItem) : "";
            domHelper_1.setPageTitle(config.title);
            var portalItem = this.base.results.applicationItem
                .value;
            var appProxies = portalItem && portalItem.applicationProxies
                ? portalItem.applicationProxies
                : null;
            var viewContainerNode = document.getElementById("viewContainer");
            var defaultViewProperties = itemUtils_1.getConfigViewProperties(config);
            validWebMapItems.forEach(function (item) {
                var viewNode = document.createElement("div");
                viewContainerNode.appendChild(viewNode);
                var container = {
                    container: viewNode
                };
                var viewProperties = __assign(__assign({}, defaultViewProperties), container);
                itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies }).then(function (map) {
                    return itemUtils_1.createView(__assign(__assign({}, viewProperties), { map: map })).then(function (view) {
                        itemUtils_1.findQuery(find, view).then(function () { return itemUtils_1.goToMarker(marker, view); });
                        var widgetProps = {
                            view: view,
                            config: _this._configurationSettings,
                            portal: _this.base.portal
                        };
                        _this._initPropertyWatchers(widgetProps);
                        _this._setupConfiguationChangesPanel(view);
                    });
                });
            });
            document.body.classList.remove(CSS.loading);
        };
        ConfigurationExample.prototype._initPropertyWatchers = function (widgetProps) {
            var _this = this;
            watchUtils_1.init(this._configurationSettings, "basemapToggle, basemapTogglePosition, basemapSelector, nextBasemap", function (newValue, oldValue, propertyName) {
                widgetProps.propertyName = propertyName;
                basemapToggle_1.addBasemapToggle(widgetProps).then(function (basemapToggle) {
                    _this.basemapToggle = basemapToggle;
                });
            });
        };
        ConfigurationExample.prototype._setupConfiguationChangesPanel = function (view) {
            var _this = this;
            var changePanel = document.createElement("div");
            changePanel.style.backgroundColor = "white";
            this._createButton(changePanel, "Toggle On/Off", (function () {
                _this._configurationSettings.set("basemapToggle", !_this._configurationSettings.basemapToggle);
            }));
            this._createButton(changePanel, "Toggle Position", (function () {
                _this._configurationSettings.set("basemapTogglePosition", _this._configurationSettings.basemapTogglePosition === "top-left" ? "top-right" : "top-left");
            }));
            this._createButton(changePanel, "Toggle Alternate Basemap", (function () {
                _this._configurationSettings.set("basemapSelector", _this._configurationSettings.basemapSelector === "6b556fa231a74a2e8d50be9533352cf3" ? "50974f77fe6940c5b251c9bcb5367d2b" : "6b556fa231a74a2e8d50be9533352cf3");
            }));
            view.ui.add(changePanel, "top-left");
        };
        ConfigurationExample.prototype._createButton = function (parentDOM, btnText, clickFunc) {
            var btnDiv = document.createElement("div");
            var btn = document.createElement("button");
            btn.textContent = btnText;
            btn.onclick = clickFunc;
            btn.classList.add("toggleButton");
            btnDiv.appendChild(btn);
            parentDOM.appendChild(btnDiv);
        };
        return ConfigurationExample;
    }());
    return ConfigurationExample;
});
//# sourceMappingURL=Main.js.map