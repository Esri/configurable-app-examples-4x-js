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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper"], function (require, exports, itemUtils_1, domHelper_1) {
    "use strict";
    var CSS = {
        loading: "configurable-application--loading"
    };
    var SceneExample = /** @class */ (function () {
        function SceneExample() {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
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
        SceneExample.prototype.init = function (base) {
            if (!base) {
                console.error("ApplicationBase is not defined");
                return;
            }
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            this.base = base;
            var config = base.config, results = base.results, settings = base.settings;
            var find = config.find, marker = config.marker;
            var webSceneItems = results.webSceneItems;
            var validWebSceneItems = webSceneItems.map(function (response) {
                return response.value;
            });
            var firstItem = validWebSceneItems[0];
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
            validWebSceneItems.forEach(function (item) {
                var viewNode = document.createElement("div");
                viewContainerNode.appendChild(viewNode);
                var container = {
                    container: viewNode
                };
                var viewProperties = __assign({}, defaultViewProperties, container);
                itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies }).then(function (map) {
                    return itemUtils_1.createView(__assign({}, viewProperties, { map: map })).then(function (view) {
                        return itemUtils_1.findQuery(find, view).then(function () { return itemUtils_1.goToMarker(marker, view); });
                    });
                });
            });
            document.body.classList.remove(CSS.loading);
        };
        return SceneExample;
    }());
    return SceneExample;
});
//# sourceMappingURL=Main.js.map