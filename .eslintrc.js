module.exports = {
	"env": {
		"node": true,
		"commonjs": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"rules": {
       
    "no-unused-vars":2,
    "no-console": 0,
    "linebreak-style": 0,
    "semi": ["error", "always"],
    "comma-dangle": 2, // disallow or enforce trailing commas
    "no-cond-assign": 2, // disallow assignment in conditional expressions
    "no-constant-condition": 2, // disallow use of constant expressions in conditions
    "no-control-regex": 2, // disallow control characters in regular expressions
    "no-debugger": 2, // disallow use of debugger
    "no-dupe-args": 2, // disallow duplicate arguments in functions
    "no-dupe-keys": 2, // disallow duplicate keys when creating object literals
    "no-duplicate-case": 2, // disallow a duplicate case label.
    "no-empty": 2, // disallow empty statements
    "no-ex-assign": 2, // disallow assigning to the exception in a catch block
    "no-extra-boolean-cast": 2, // disallow double-negation boolean casts in a boolean context
    "no-extra-parens": 0, // disallow unnecessary parentheses (off by default)
    "no-extra-semi": 2, // disallow unnecessary semicolons
    "no-func-assign": 2, // disallow overwriting functions written as function declarations
    "no-inner-declarations": 2, // disallow function or variable declarations in nested blocks
    "no-invalid-regexp": 2, // disallow invalid regular expression strings in the RegExp constructor
    "no-irregular-whitespace": 2, // disallow irregular whitespace outside of strings and comments
    "no-negated-in-lhs": 2, // disallow negation of the left operand of an in expression
    "no-obj-calls": 2, // disallow the use of object properties of the global object (Math and JSON) as functions
    "no-regex-spaces": 2, // disallow multiple spaces in a regular expression literal
    "no-sparse-arrays": 2, // disallow sparse arrays
    "no-unreachable": 2, // disallow unreachable statements after a return, throw, continue, or break statement
    "use-isnan": 2, // disallow comparisons with the value NaN
    "valid-jsdoc": 2, // Ensure JSDoc comments are valid (off by default)
    "valid-typeof": 2, // Ensure that the results of typeof are compared against a valid string
    "block-scoped-var": 0, // treat var statements as if they were block scoped (off by default). 0: deep destructuring is not compatible https://github.com/eslint/eslint/issues/1863
    "complexity": 0, // specify the maximum cyclomatic complexity allowed in a program (off by default)
    "consistent-return": 0, // require return statements to either always or never specify values
    "curly": 0, // specify curly brace conventions for all control statements
    "default-case": 2, // require default case in switch statements (off by default)
    "guard-for-in": 2, // make sure for-in loops have an if statement (off by default)
    "no-alert": 2, // disallow the use of alert, confirm, and prompt
    "no-caller": 2, // disallow use of arguments.caller or arguments.callee
    "no-div-regex": 2, // disallow division operators explicitly at beginning of regular expression (off by default)
    "no-else-return": 0, // disallow else after a return in an if (off by default)
    "no-eq-null": 0, // disallow comparisons to null without a type-checking operator (off by default)
    "no-eval": 2, // disallow use of eval()
    "no-extra-bind": 2, // disallow unnecessary function binding
    "no-fallthrough": 2, // disallow fallthrough of case statements
    "no-floating-decimal": 2, // disallow the use of leading or trailing decimal points in numeric literals (off by default)
    "no-implied-eval": 2, // disallow use of eval()-like methods
    "no-iterator": 2, // disallow usage of __iterator__ property
    "no-labels": 2, // disallow use of labeled statements
    "no-lone-blocks": 2, // disallow unnecessary nested blocks
    "no-loop-func": 2, // disallow creation of functions within loops
    "no-multi-spaces": 0, // disallow use of multiple spaces
    "no-multi-str": 2, // disallow use of multiline strings
    "no-native-reassign": 2, // disallow reassignments of native objects
    "no-new": 2, // disallow use of new operator when not part of the assignment or comparison
    "no-new-func": 2, // disallow use of new operator for Function object
    "no-new-wrappers": 2, // disallows creating new instances of String,Number, and Boolean
    "no-octal": 2, // disallow use of octal literals
    "no-octal-escape": 2, // disallow use of octal escape sequences in string literals, such as var foo = "Copyright \251";
    "no-process-env": 0, // disallow use of process.env (off by default)
    "no-proto": 2, // disallow usage of __proto__ property
    "no-redeclare": 0, // disallow declaring the same variable more then once
    "no-return-assign": 2, // disallow use of assignment in return statement
    "no-script-url": 2, // disallow use of javascript: urls.
    "no-self-compare": 2, // disallow comparisons where both sides are exactly the same (off by default)
    "no-sequences": 2, // disallow use of comma operator
    "no-throw-literal": 2, // restrict what can be thrown as an exception (off by default)
    "no-unused-expressions": 2, // disallow usage of expressions in statement position
    "no-void": 2, // disallow use of void operator (off by default)
    "no-warning-comments": [0, {
        "terms": ["todo", "fixme"],
        "location": "start"
    }], // disallow usage of configurable warning terms in comments": 2, // e.g. TODO or FIXME (off by default)
    "no-with": 2, // disallow use of the with statement
    "radix": 0, // require use of the second argument for parseInt() (off by default)
    "wrap-iife": 2, // require immediate function invocation to be wrapped in parentheses (off by default)
    "yoda": 2, // require or disallow Yoda conditions
    "strict": 0, // controls location of Use Strict Directives. 0: required by `babel-eslint`
    "no-catch-shadow": 2, // disallow the catch clause parameter name being the same as a variable in the outer scope (off by default in the node environment)
    "no-delete-var": 2, // disallow deletion of variables
    "no-label-var": 2, // disallow labels that share a name with a variable
    "no-undef": 2, // disallow use of undeclared variables unless mentioned in a /*global */ block
    "no-undef-init": 2, // disallow use of undefined when initializing variables
    "no-undefined": 0 // disallow use of undefined variable (off by default)
}
};
