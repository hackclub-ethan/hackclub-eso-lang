# Functions

Functions are a thing in Hackclub eso lang. They are able to take in aguments and return a value. 

They are declared with this format:

```text
ysws nameHere(args...) {
    sendMessage("Code here")

    return "$45 grant"
}
```

The return value can be any data type that is a think in Hackclub Eso Lang.

This is a function to add 2 values together:

```text
ysws add(num1, num2) {
    propose sum = num1 + num2
    return sum
}

sendMessage(add(1 ,2))
```

That would print out `3` to the console.