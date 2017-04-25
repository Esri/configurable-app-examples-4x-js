define(["require", "exports", "dojo/i18n!Application/nls/resources.js"], function (require, exports, i18n) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="dojo/i18n!Application/nls/resources.js" name="i18n" />
    var CSS = {
        loading: "configurable-application--loading"
    };
    var GroupExample = (function () {
        function GroupExample() {
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
        GroupExample.prototype.init = function (base) {
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
            document.body.classList.remove(CSS.loading);
        };
        return GroupExample;
    }());
    exports.default = GroupExample;
});
//# sourceMappingURL=Application.js.map