# Error handleing

Hack club eso lang has error handleing similer to "try catch" statments in other languages. In this lang they are only 1 line and can only have 1 statment for the code to execute and what to execute if the first errors.

Here is the format that it is used for. "Try code" is the code that will be ran, the "catch code" is what will be ran if the "try code" errors.

```text
proposal(tryCode, catchCode)
```

Here is an example of it where a function is called with the wrong number of args

```text
ysws func() {
    sendMessage("This is a function")
}

proposal(func("Hello"), sendMessage("The function call errored"))
```