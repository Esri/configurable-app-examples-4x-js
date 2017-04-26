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
var OPTION_1TBS = "1tbs";
var OPTION_ALLMAN = "allman";
var OPTION_STROUSTRUP = "stroustrup";
var BraceStyle;
(function (BraceStyle) {
    BraceStyle[BraceStyle["OneTBS"] = 0] = "OneTBS";
    BraceStyle[BraceStyle["Allman"] = 1] = "Allman";
    BraceStyle[BraceStyle["Stroustrup"] = 2] = "Stroustrup";
})(BraceStyle || (BraceStyle = {}));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var walker = new BraceStyleWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    };
    return Rule;
}(TSLint.Rules.AbstractRule));
Rule.FAILURE_STRING = {
    open: "Opening curly brace does not appear on the same line as controlling statement.",
    openAllman: "Opening curly brace appears on the same line as controlling statement.",
    body: "Statement inside of curly braces should be on next line.",
    close: "Closing curly brace does not appear on the same line as the subsequent block.",
    closeSingle: "Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.",
    closeStroustrupAllman: "Closing curly brace appears on the same line as the subsequent block."
};
exports.Rule = Rule;
var BraceStyleWalker = (function (_super) {
    __extends(BraceStyleWalker, _super);
    function BraceStyleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.allowSingleLine = false;
        if (_this.hasOption(OPTION_1TBS)) {
            _this.braceStyle = BraceStyle.OneTBS;
        }
        else if (_this.hasOption(OPTION_ALLMAN)) {
            _this.braceStyle = BraceStyle.Allman;
        }
        else if (_this.hasOption(OPTION_STROUSTRUP)) {
            _this.braceStyle = BraceStyle.Stroustrup;
        }
        else {
            // what do we do if the user doesn't provide a valid option?
        }
        _this.allowSingleLine = _this.getOptions()[1] && _this.getOptions()[1].allowSingleLine;
        return _this;
    }
    // check that the "catch" keyword is on the correct line.
    // all other checks regarding try/catch statements will be covered in the "visitBlock" callback
    BraceStyleWalker.prototype.visitTryStatement = function (tryStatement) {
        _super.prototype.visitTryStatement.call(this, tryStatement);
        var catchClause = tryStatement.getChildren().filter(function (ch) { return ch.kind === ts.SyntaxKind.CatchClause; }).shift();
        var previousNode = tryStatement.getChildren()[tryStatement.getChildren().indexOf(catchClause) - 1];
        var openingBracketError = this.areOnSameLine(previousNode, catchClause) !== (this.braceStyle === BraceStyle.OneTBS);
        if (this.allowSingleLine && this.getStartPosition(catchClause).line === this.getEndPosition(tryStatement).line) {
            return;
        }
        if (openingBracketError) {
            var failureString = this.braceStyle === BraceStyle.OneTBS ? Rule.FAILURE_STRING.open : Rule.FAILURE_STRING.openAllman;
            this.addFailureAt(catchClause.getStart(), catchClause.getWidth(), failureString);
        }
    };
    // check that the "else" keyword is on the correct line.
    // all other checks regarding if statements will be covered in the "visitBlock" callback
    BraceStyleWalker.prototype.visitIfStatement = function (ifStatement) {
        _super.prototype.visitIfStatement.call(this, ifStatement);
        var elseKeyword = ifStatement.getChildren().filter(function (ch) { return ch.kind === ts.SyntaxKind.ElseKeyword; }).shift();
        if (!elseKeyword) {
            return;
        }
        var previousNode = ifStatement.getChildren()[ifStatement.getChildren().indexOf(elseKeyword) - 1];
        var openingBracketError = this.areOnSameLine(previousNode, elseKeyword) !== (this.braceStyle === BraceStyle.OneTBS);
        if (this.allowSingleLine && this.getStartPosition(elseKeyword).line === this.getEndPosition(ifStatement).line) {
            return;
        }
        // if the if statement doesn't have a "block" element, it means it has no braces, 
        // and when there are no braces, there are no problems
        if (!ifStatement.getChildren().some(function (ch) { return ch.kind === ts.SyntaxKind.Block; })) {
            return;
        }
        if (openingBracketError) {
            var failureString = this.braceStyle === BraceStyle.OneTBS ? Rule.FAILURE_STRING.open : Rule.FAILURE_STRING.openAllman;
            this.addFailureAt(elseKeyword.getStart(), elseKeyword.getWidth(), failureString);
        }
    };
    BraceStyleWalker.prototype.visitBlock = function (block) {
        _super.prototype.visitBlock.call(this, block);
        if (this.allowSingleLine && this.getStartPosition(block).line === this.getEndPosition(block).line) {
            return;
        }
        var blockChildren = block.getChildren();
        var openingCurlyBrace = blockChildren.filter(function (ch) { return ch.kind === ts.SyntaxKind.OpenBraceToken; }).shift();
        var closingCurlyBrace = blockChildren.filter(function (ch) { return ch.kind === ts.SyntaxKind.CloseBraceToken; }).pop();
        var syntaxList = blockChildren.filter(function (ch) { return ch.kind === ts.SyntaxKind.SyntaxList; }).shift();
        var blockPreviousNode = block.parent.getChildren()[block.parent.getChildren().indexOf(block) - 1];
        if (!openingCurlyBrace || !closingCurlyBrace || !syntaxList || !blockPreviousNode) {
            return;
        }
        var openingBracketError = this.areOnSameLine(blockPreviousNode, block) === (this.braceStyle === BraceStyle.Allman);
        if (openingBracketError) {
            var failureString = this.braceStyle === BraceStyle.Allman ? Rule.FAILURE_STRING.openAllman : Rule.FAILURE_STRING.open;
            this.addFailureAt(openingCurlyBrace.getStart(), openingCurlyBrace.getWidth(), failureString);
        }
        if (syntaxList.getChildCount() > 0) {
            var bodyError = this.areOnSameLine(openingCurlyBrace, syntaxList);
            if (bodyError) {
                this.addFailureAt(syntaxList.getStart(), syntaxList.getWidth(), Rule.FAILURE_STRING.body);
            }
            var nodeBeforeClosingBracket = syntaxList.getChildren()[syntaxList.getChildren().length - 1];
            var closingBracketError = this.areOnSameLine(nodeBeforeClosingBracket, closingCurlyBrace);
            if (closingBracketError) {
                this.addFailureAt(closingCurlyBrace.getStart(), closingCurlyBrace.getWidth(), Rule.FAILURE_STRING.closeSingle);
            }
        }
    };
    BraceStyleWalker.prototype.areOnSameLine = function (node, nextNode) {
        return this.getEndPosition(node).line === this.getStartPosition(nextNode).line;
    };
    BraceStyleWalker.prototype.getStartPosition = function (node) {
        return node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
    };
    BraceStyleWalker.prototype.getEndPosition = function (node) {
        return node.getSourceFile().getLineAndCharacterOfPosition(node.getEnd());
    };
    return BraceStyleWalker;
}(TSLint.RuleWalker));
