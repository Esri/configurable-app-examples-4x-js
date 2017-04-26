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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new CheckReadOnlyWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(TSLint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var CheckReadOnlyWalker = (function (_super) {
    __extends(CheckReadOnlyWalker, _super);
    function CheckReadOnlyWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._needsSetter = [];
        _this._setters = [];
        return _this;
    }
    CheckReadOnlyWalker.prototype.walk = function (node) {
        var _this = this;
        _super.prototype.walk.call(this, node);
        this._needsSetter.forEach(function (decl) {
            if (_this._setters.indexOf(decl.name.text) === -1) {
                _this.addFailureAt(decl.getStart(), decl.getWidth(), "Defines a getter that accesses the private store, but does not define a setter. This marks the property as read-only in typescript which it likely is not.");
            }
        });
    };
    CheckReadOnlyWalker.prototype.isEsriAccessorReadOnly = function (node) {
        if (!node.decorators) {
            return false;
        }
        return node.decorators.some(function (decorator) {
            var expr = decorator.expression;
            if (!expr.expression || expr.expression.text !== "property" || !expr.arguments) {
                return false;
            }
            var arg = expr.arguments[0];
            if (!arg || !arg.properties) {
                return false;
            }
            return arg.properties.some(function (property) {
                return property.name.text === "readOnly" && property.initializer.kind === ts.SyntaxKind.TrueKeyword;
            });
        });
    };
    CheckReadOnlyWalker.prototype.visitGetAccessor = function (node) {
        if ((!node.modifiers || !node.modifiers.some(function (modifier) { return modifier.kind === ts.SyntaxKind.ReadonlyKeyword; })) && !this.isEsriAccessorReadOnly(node)) {
            var subwalk = new PrivateGetWalker(node.name.text);
            subwalk.walk(node);
            if (subwalk.hasPrivateGet) {
                this._needsSetter.push(node);
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitGetAccessor.call(this, node);
    };
    CheckReadOnlyWalker.prototype.visitSetAccessor = function (node) {
        this._setters.push(node.name.text);
        _super.prototype.visitSetAccessor.call(this, node);
    };
    return CheckReadOnlyWalker;
}(TSLint.RuleWalker));
var PrivateGetWalker = (function (_super) {
    __extends(PrivateGetWalker, _super);
    function PrivateGetWalker(propertyName) {
        var _this = _super.call(this) || this;
        _this.hasPrivateGet = false;
        _this.propertyName = propertyName;
        return _this;
    }
    PrivateGetWalker.prototype.visitCallExpression = function (node) {
        if (!node.expression || node.expression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
            _super.prototype.visitCallExpression.call(this, node);
            return;
        }
        var expr = node.expression;
        var name = expr.name;
        if (expr.expression &&
            expr.expression.kind === ts.SyntaxKind.ThisKeyword &&
            name &&
            name.text === "_get" &&
            node.arguments.length === 1 &&
            node.arguments[0].text === this.propertyName) {
            this.hasPrivateGet = true;
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return PrivateGetWalker;
}(TSLint.SyntaxWalker));
