# eslint plugin m99coder [![Npm version](https://img.shields.io/npm/v/eslint-plugin-m99coder.svg)](https://www.npmjs.com/package/eslint-plugin-m99coder) [![Npm downloads per month](https://img.shields.io/npm/dm/eslint-plugin-m99coder.svg)](https://www.npmjs.com/package/eslint-plugin-m99coder)

> A collection of useful ESLint rules.

[![Build Status](https://img.shields.io/travis/m99coder/eslint-plugin-m99coder/master.svg)](https://travis-ci.org/m99coder/eslint-plugin-m99coder)
[![Test Coverage](https://img.shields.io/coveralls/m99coder/eslint-plugin-m99coder/master.svg)](https://coveralls.io/github/m99coder/eslint-plugin-m99coder)
[![Npm dependencies](https://img.shields.io/david/m99coder/eslint-plugin-m99coder.svg)](https://david-dm.org/m99coder/eslint-plugin-m99coder)
[![devDependency Status](https://img.shields.io/david/dev/m99coder/eslint-plugin-m99coder.svg)](https://david-dm.org/m99coder/eslint-plugin-m99coder#info=devDependencies)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-m99coder`:

```
$ npm install eslint-plugin-m99coder --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-m99coder` globally.

## Usage

Add `m99coder` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "m99coder"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "m99coder/rule-name": 2
    }
}
```

## Supported Rules

* `vars-on-top`





