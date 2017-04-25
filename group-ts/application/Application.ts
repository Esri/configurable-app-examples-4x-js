/// <amd-dependency path="dojo/i18n!Application/nls/resources.js" name="i18n" />
declare const i18n: any;

import ApplicationBase from "ApplicationBase/ApplicationBase";

const CSS = {
  loading: "configurable-application--loading"
}

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

    document.body.classList.remove(CSS.loading);
  }

}

export default GroupExample;
