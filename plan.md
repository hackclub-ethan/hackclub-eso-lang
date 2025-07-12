# Plan

Plan for the syntax of the lang.

I need the following features:
- Variables
- Numerical and Boolean Operators
- Functions/methods (with aguments)
- Error handeling (ex: try, catch)

## Varibles

When refrencing varibles there will be no undeclared. `undifined` will be returned instead of erroring.

The only data types that can be used are:
- Numbers
- Booleans
- Strings

The format to declare and use them are

```text
propose varName = "some val"
```

## Operators

This will be the same as Javascript. `+` for plus, `&&` for and, etc

## Functions

Format will be:

```text
ysws nameHERE(args...) {
    CODE;
};
```

## Error handleing

It will be a try catch block

```text
propose {
    CODE;
} proposalRejected (e) {
    CODE;
}
```

## Logging

Have some sort of a print function. The syntax will be:
```text
sendMessage("Some str");
```