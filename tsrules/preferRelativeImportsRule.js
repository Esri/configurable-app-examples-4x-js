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
var ts = require("typescript");
var path = require("path");
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
        return this.applyWithWalker(new PreferRelativeImportsWalker(sourceFile, configurationPath, this.getOptions()));
    };
    return Rule;
}(TSLint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var PreferRelativeImportsWalker = (function (_super) {
    __extends(PreferRelativeImportsWalker, _super);
    function PreferRelativeImportsWalker(file, configurationPath, options) {
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
        _this.importRoot = _this.pathRoot(_this.absImportPath);
        return _this;
    }
    PreferRelativeImportsWalker.prototype.pathRoot = function (p) {
        var dirName = path.dirname(p);
        return dirName === "." ? p : this.pathRoot(dirName);
    };
    PreferRelativeImportsWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        node.amdDependencies.forEach(function (amdDependency) {
            _this.verifyRelativeImport(null, amdDependency.path);
        });
        _super.prototype.visitSourceFile.call(this, node);
    };
    PreferRelativeImportsWalker.prototype.visitImportEqualsDeclaration = function (node) {
        if (node.moduleReference.kind !== ts.SyntaxKind.ExternalModuleReference) {
            return;
        }
        var moduleReference = node.moduleReference;
        if (moduleReference.expression.kind === ts.SyntaxKind.StringLiteral) {
            var literal = moduleReference.expression;
            this.verifyRelativeImport(literal, literal.text);
        }
    };
    PreferRelativeImportsWalker.prototype.visitImportDeclaration = function (node) {
        if (node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
            var literal = node.moduleSpecifier;
            this.verifyRelativeImport(literal, literal.text);
        }
    };
    PreferRelativeImportsWalker.prototype.verifyRelativeImport = function (node, modulePath) {
        if (modulePath[0] === ".") {
            return;
        }
        if (this.pathRoot(modulePath) === this.importRoot) {
            var relPath = path.relative(path.join(this.basePath, this.absImportPath), path.join(this.basePath, modulePath));
            if (relPath[0] !== ".") {
                relPath = "./" + relPath;
            }
            if (isWindows) {
                relPath = relPath.replace(/\\/g, "/");
            }
            if (node) {
                var replacement = new TSLint.Replacement(node.getStart(), node.getWidth(), "\"" + relPath + "\"");
                this.addFailureAtNode(node, "prefer relative ('" + relPath + "') over absolute import", replacement);
            }
            else {
                this.addFailureFromStartToEnd(0, 0, "prefer relative ('" + relPath + "') over absolute import");
            }
        }
    };
    return PreferRelativeImportsWalker;
}(TSLint.RuleWalker));
