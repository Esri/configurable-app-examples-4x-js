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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper", "esri/core/watchUtils", "esri/core/Accessor", "esri/core/accessorSupport/decorators", "ApplicationBase/support/widgetConfigUtils/basemapToggle", "esri/widgets/BasemapToggle"], function (require, exports, itemUtils_1, domHelper_1, watchUtils_1, Accessor, decorators_1, basemapToggle_1, BasemapToggle) {
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
            var view = widgetProps.view;
            watchUtils_1.init(this._configurationSettings, "basemapToggle, basemapTogglePosition, basemapSelector, nextBasemap", function (newValue, oldValue, propertyName) { return __awaiter(_this, void 0, void 0, function () {
                var _a, basemapToggle, basemapTogglePosition, _b, originalBasemap, nextBasemap;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this._configurationSettings, basemapToggle = _a.basemapToggle, basemapTogglePosition = _a.basemapTogglePosition;
                            return [4 /*yield*/, basemapToggle_1.getBasemaps(widgetProps)];
                        case 1:
                            _b = _c.sent(), originalBasemap = _b.originalBasemap, nextBasemap = _b.nextBasemap;
                            // Decide what to do based on the property that changed
                            switch (propertyName) {
                                case "basemapToggle":
                                    if (basemapToggle) {
                                        this.basemapToggle = new BasemapToggle({ view: view, nextBasemap: nextBasemap });
                                        view.ui.add(this.basemapToggle, basemapTogglePosition);
                                    }
                                    else {
                                        basemapToggle_1.resetBasemapsInToggle(this.basemapToggle, originalBasemap, nextBasemap);
                                        view.ui.remove(this.basemapToggle);
                                        this.basemapToggle.destroy();
                                    }
                                    break;
                                case "basemapTogglePosition":
                                    view.ui.move(this.basemapToggle, basemapTogglePosition);
                                    break;
                                case "basemapSelector":
                                    basemapToggle_1.resetBasemapsInToggle(this.basemapToggle, originalBasemap, nextBasemap);
                                    break;
                                case "nextBasemap":
                                    basemapToggle_1.resetBasemapsInToggle(this.basemapToggle, originalBasemap, nextBasemap);
                                    break;
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
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