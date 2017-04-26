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
var path = require("path");
var fs = require("fs");
var isWindows = (process.platform === "win32");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var configurationPath = TSLint.Configuration.findConfigurationPath(null, sourceFile.fileName);
        if (!configurationPath) {
            return [];
        }
        return this.applyWithWalker(new NoUnexistingAMDDependencyWalker(sourceFile, configurationPath, this.getOptions()));
    };
    return Rule;
}(TSLint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var NoUnexistingAMDDependencyWalker = (function (_super) {
    __extends(NoUnexistingAMDDependencyWalker, _super);
    function NoUnexistingAMDDependencyWalker(file, configurationPath, options) {
        var _this = _super.call(this, file, options) || this;
        _this.configurationPath = configurationPath;
        var opts = _this.getOptions()[0];
        var configBase = path.dirname(_this.configurationPath);
        if (opts && opts.base) {
            _this.basePath = path.normalize(path.join(configBase, opts.base));
        }
        else {
            _this.basePath = configBase;
        }
        _this.absImportPath = path.relative(_this.basePath, path.dirname(file.fileName));
        return _this;
    }
    NoUnexistingAMDDependencyWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        node.amdDependencies.forEach(function (amdDependency) {
            _this.verifyAMDDependency(amdDependency.path);
        });
        _super.prototype.visitSourceFile.call(this, node);
    };
    NoUnexistingAMDDependencyWalker.prototype.verifyAMDDependency = function (importPath) {
        importPath = this.resolveImportPath(importPath);
        if (importPath === "") {
            return;
        }
        if (fs.existsSync(importPath) || this.isGeneratedTypeScript(importPath)) {
            return;
        }
        this.addFailureFromStartToEnd(0, 0, "file '" + importPath + "' not found");
    };
    NoUnexistingAMDDependencyWalker.prototype.resolveImportPath = function (importPath) {
        // Support dojo/text! and dojo/i18n! plugins
        importPath = importPath.replace(/^dojo\/(i18n|text)!/, "");
        // Ignore other dojo plugins
        if (importPath.indexOf("!") !== -1) {
            return "";
        }
        if (importPath[0] === ".") {
            importPath = path.join(this.absImportPath, importPath);
        }
        if (!this.isAbsolute(importPath)) {
            importPath = path.join(this.basePath, importPath);
        }
        if (!/\.[a-z0-9_-]+$/i.test(importPath)) {
            importPath += ".js";
        }
        return path.normalize(importPath);
    };
    NoUnexistingAMDDependencyWalker.prototype.isAbsolute = function (p) {
        if (path.isAbsolute) {
            return path.isAbsolute(p);
        }
        else {
            if (isWindows) {
                // Taken more or less from nodejs sources
                return /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)/.test(p);
            }
            else {
                return p[0] === "/";
            }
        }
    };
    NoUnexistingAMDDependencyWalker.prototype.isGeneratedTypeScript = function (path) {
        var jsFileRE = /\.js$/;
        if (!jsFileRE.test(path)) {
            return false;
        }
        var tsPath = path.replace(jsFileRE, ".ts");
        var tsxPath = path.replace(jsFileRE, ".tsx");
        return fs.existsSync(tsPath) || fs.existsSync(tsxPath);
    };
    return NoUnexistingAMDDependencyWalker;
}(TSLint.RuleWalker));
