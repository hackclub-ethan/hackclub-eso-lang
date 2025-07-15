# Variables

You can store a bunch of diffrent kinds of data using variables. They can store the following kinds of data:
- Strings
- Booleans
- Numbers

All varibles (including function aguments) are global and can be acess anywhere in the program and there is no scope. 

Variables are declared with the following format

```text
propose nameHere = "Some val"
```

Strings do need to be surounded by double quotes(`"`)

Values do not need to be expliclitly typed, instead they can be from another variable, function (return value) or calculated. For example:

```text
propose num1 = 5
propose num2 = num1 * 2
sendMessage(num2)
```
That would output 10.