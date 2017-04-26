"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TSLint = require("tslint");
var child_process_1 = require("child_process");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var gitIndexFiles = this.ensureGitIndexFiles();
        var tsRe = /\.ts$/;
        var filename = sourceFile.fileName;
        if (tsRe.test(filename)) {
            var jsfilename = filename.replace(tsRe, ".js");
            if (gitIndexFiles[jsfilename]) {
                return [
                    new TSLint.RuleFailure(sourceFile, 0, 0, "Javascript file generated from typescript file should not be checked in", "no-checked-in-generated-files")
                ];
            }
        }
        return [];
    };
    Rule.prototype.ensureGitIndexFiles = function () {
        var _this = this;
        if (this.gitIndexFiles) {
            return this.gitIndexFiles;
        }
        this.gitIndexFiles = {};
        var git = child_process_1.spawnSync("git", ["ls-files", "--cached"]);
        String(git.stdout).split("\n").forEach(function (filename) {
            _this.gitIndexFiles[filename.trim()] = true;
        });
        return this.gitIndexFiles;
    };
    return Rule;
}(TSLint.Rules.AbstractRule));
exports.Rule = Rule;
