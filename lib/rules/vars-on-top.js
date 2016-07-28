'use strict';

module.exports = function(context) {

	var errorMessage = 'All \'var\' declarations must be at the top of the function scope.';

	var options = {
		forStatement: true,
		forInStatement: true,
		forOfStatement: true
	};

	if (context.options.length > 0) {
		if (typeof context.options[0].forStatement !== 'undefined') {
			options.forStatement = context.options[0].forStatement;
		}
		if (typeof context.options[0].forInStatement !== 'undefined') {
			options.forInStatement = context.options[0].forInStatement;
		}
		if (typeof context.options[0].forOfStatement !== 'undefined') {
			options.forOfStatement = context.options[0].forOfStatement;
		}
	}

	//--------------------------------------------------------------------------
	// Helpers
	//--------------------------------------------------------------------------

	/**
	 * @param {ASTNode} node - any node
	 * @returns {boolean} whether the given node structurally represents a directive
	 */
	function looksLikeDirective(node) {
		return node.type === 'ExpressionStatement' &&
			node.expression.type === 'Literal' && typeof node.expression.value === 'string';
	}

	/**
	 * Check to see if its a ES6 import declaration
	 * @param {ASTNode} node - any node
	 * @returns {boolean} whether the given node represents a import declaration
	 */
	function looksLikeImport(node) {
		return node.type === 'ImportDeclaration' || node.type === 'ImportSpecifier' ||
			node.type === 'ImportDefaultSpecifier' || node.type === 'ImportNamespaceSpecifier';
	}

	/**
	 * Checks whether a given node is a variable declaration or not.
	 *
	 * @param {ASTNode} node - any node
	 * @returns {boolean} `true` if the node is a variable declaration.
	 */
	function isVariableDeclaration(node) {
		return (
			node.type === 'VariableDeclaration' ||
			(
				node.type === 'ExportNamedDeclaration' &&
				node.declaration &&
				node.declaration.type === 'VariableDeclaration'
			)
		);
	}

	/**
	 * Checks whether this variable is on top of the block body
	 * @param {ASTNode} node - The node to check
	 * @param {ASTNode[]} statements - collection of ASTNodes for the parent node block
	 * @returns {boolean} True if var is on top otherwise false
	 */
	function isVarOnTop(node, statements) {
		var i = 0,
			l = statements.length;

		// skip over directives
		for (; i < l; ++i) {
			if (!looksLikeDirective(statements[i]) && !looksLikeImport(statements[i])) {
				break;
			}
		}

		for (; i < l; ++i) {
			if (!isVariableDeclaration(statements[i])) {
				return false;
			}
			if (statements[i] === node) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Checks whether variable is on top at the global level
	 * @param {ASTNode} node - The node to check
	 * @param {ASTNode} parent - Parent of the node
	 * @returns {void}
	 */
	function globalVarCheck(node, parent) {
		if (!isVarOnTop(node, parent.body)) {
			context.report(node, errorMessage);
		}
	}

	/**
	 * Checks whether variable is on top at functional block scope level
	 * @param {ASTNode} node - The node to check
	 * @param {ASTNode} parent - Parent of the node
	 * @param {ASTNode} grandParent - Parent of the node's parent
	 * @returns {void}
	 */
	function blockScopeVarCheck(node, parent, grandParent) {
		if (!(/Function/.test(grandParent.type) &&
			parent.type === 'BlockStatement' &&
			isVarOnTop(node, parent.body))) {
			context.report(node, errorMessage);
		}
	}

	/**
	 * Checks whether or not a given node is a for loop.
	 * Taken from https://github.com/eslint/eslint/blob/master/lib/rules/init-declarations.js
	 * @param {ASTNode} block - A node to check.
	 * @returns {boolean} `true` when the node is a for loop.
	 */
	function isForLoop(block) {
		return (options.forInStatement && block.type === 'ForInStatement') ||
			(options.forOfStatement && block.type === 'ForOfStatement') ||
			(options.forStatement && block.type === 'ForStatement');
	}

	//--------------------------------------------------------------------------
	// Public API
	//--------------------------------------------------------------------------

	return {
		VariableDeclaration: function(node) {
			var ancestors = context.getAncestors();
			var parent = ancestors.pop();
			var grandParent = ancestors.pop();

			// check variable is `var` type and not `let` or `const`
			// and not inside of a white-listed for statement
			if (node.kind === 'var' && !isForLoop(parent)) {

				if (parent.type === 'ExportNamedDeclaration') {
					node = parent;
					parent = grandParent;
					grandParent = ancestors.pop();
				}

				// That means its a global variable
				if (parent.type === 'Program') {
					globalVarCheck(node, parent);
				} else {
					blockScopeVarCheck(node, parent, grandParent);
				}
			}
		}
	};

};

module.exports.schema = [
	{
		'type': 'object',
		'properties': {
			'forStatement': {
				'type': 'boolean'
			},
			'forInStatement': {
				'type': 'boolean'
			},
			'forOfStatement': {
				'type': 'boolean'
			}
		},
		'additionalProperties': false,
		'default': {
			'forStatement': true,
			'forInStatement': true,
			'forOfStatement': true
		}
	}
];
