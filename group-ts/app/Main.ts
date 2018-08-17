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

import ApplicationBase = require("ApplicationBase/ApplicationBase");

import i18n = require("dojo/i18n!./nls/resources");

const CSS = {
  loading: "configurable-application--loading"
};

class GroupExample {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  public init(base: ApplicationBase): void {
    const { results } = base;
    const groupInfos = results.groupInfos[0];
    const groupItems = results.groupItems[0];

    const groupInfoResults = groupInfos.value && groupInfos.value.results;
    const groupItemsResults = groupItems.value && groupItems.value.results;
    const groupInfo = groupItemsResults && groupInfoResults[0];

    if (
      !groupInfos ||
      !groupItems ||
      !groupInfoResults ||
      !groupItemsResults ||
      !groupInfo
    ) {
      return;
    }
    const html = `<h1>${groupInfo.title}</h1><ol>
      ${groupItemsResults.map(item => `<li>${item.title}</li>`).join("")}</ol>`;

    const groupNode = document.getElementById("groupContainer");
    groupNode.innerHTML = html;

    document.body.classList.remove(CSS.loading);
  }
}

export = GroupExample;
