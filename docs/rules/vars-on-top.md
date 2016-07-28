# Modified vars-on-top to exclude `for` loops (vars-on-top)

This is a modified `vars-on-top` rule which excludes all `for` statements by default.


## Rule Details

The following patterns are not warnings:

```js
for (var i = 0; i < 10; i++) {
	alert(i);
}
```

```js
for (var el in obj) {
	alert(obj[el]);
}
```

### Options

You can configure which type of `for` statement should be excluded in your `.eslintrc`.

```json
{
	"rules": {
		"m99coder/vars-on-top": [2, {"forStatement": true, "forInStatement": false, "forOfStatement": false}]	
	}
}
```
