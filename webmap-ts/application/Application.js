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
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        loading: "configurable-application--loading"
    };
    var MapExample = (function () {
        function MapExample() {
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
        MapExample.prototype.init = function (base) {
            if (!base) {
                console.error("Boilerplate is not defined");
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
            var viewContainerNode = document.getElementById("viewContainer");
            var defaultViewProperties = itemUtils_1.getViewProperties(config);
            validWebMapItems.forEach(function (item) {
                var viewNode = document.createElement("div");
                viewContainerNode.appendChild(viewNode);
                var viewProperties = __assign({ container: viewNode }, defaultViewProperties);
                itemUtils_1.createMap(item)
                    .then(function (map) { return itemUtils_1.setBasemap(map, config)
                    .then(function (map) { return itemUtils_1.createView(map, viewProperties)
                    .then(function (view) { return itemUtils_1.setFindLocation(find, view)
                    .then(function () { return itemUtils_1.setGraphic(marker, view); }); }); }); });
            });
            document.body.classList.remove(CSS.loading);
        };
        return MapExample;
    }());
    exports.default = MapExample;
});
//# sourceMappingURL=Application.js.map