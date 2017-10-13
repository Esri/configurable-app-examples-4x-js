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

define([
  "dojo/_base/declare",
  "ApplicationBase/ApplicationBase",
  "dojo/i18n!./nls/resources"
], function (
  declare,
  ApplicationBase,
  i18n
) {
    return declare(null, {

      constructor: function () {
        this.CSS = {
          loading: "configurable-application--loading"
        };
        this.base = null;
      },

      init: function (base) {
        var results = base.results;
        var groupInfos = results.groupInfos[0];
        var groupItems = results.groupItems[0];
        var groupInfoResults = groupInfos.value && groupInfos.value.results;
        var groupItemsResults = groupItems.value && groupItems.value.results;
        var groupInfo = groupItemsResults && groupInfoResults[0];
        if (!groupInfos || !groupItems || !groupInfoResults || !groupItemsResults || !groupInfo) {
          return;
        }
        var html = "";
        html += "<h1>" + groupInfo.title + "</h1>";
        html += "<ol>";
        groupItemsResults.forEach(function (item) {
          html += "<li>" + item.title + "</li>";
        });
        html += "</ol>";
        var groupNode = document.getElementById("groupContainer");
        groupNode.innerHTML = html;
        document.body.classList.remove(this.CSS.loading);
      }

    });

  });
