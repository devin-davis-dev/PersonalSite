---
title: JavaScript Object Constructors
thumbnail: assets/logo_2.png
date: 2019-12-06T16:47:52.678Z
keywords: object constructors, javascript, javascript object constructors
draft: false
category: programming
---

Object constructors are an important aspect of object oriented programming. At
first, these constructors can be difficult to understand because they are a
type of function and not their own separate thing. The first step in
understanding how they work is to first learn how to use dot notation to
access values in an object. Here is a simple example of dot notation on an
object to access the value of the color property.

```javascript
let bird = {
  colour: "brown",
};

console.log(bird.colour);

// output: brown
```

To add properties to this object we can use dot notation to name it then provide it with a value using the assignment operator.

```javascript
bird.numLegs = 2;
```

Now now the bird object also contains the *numLegs* property.

## Object constructors

Dot notation is used in object constructors as well, however it is done by reference using the *this* keyword. Let’s take a look at a constructor function.

```javascript
let Bird = function () {
  (this.colour = "brown"), (this.numLegs = 2);
};

let brownBird = new Bird();

console.log(brownBird.numLegs);

// output: 2
```

The *brownBird* variable contains the function Bird function. The *this* keyword is referencing the variable *brownBird* which is then provided the key value pairs defined in the *Bird* function (object constructor). To visualize this, imagine the *this* keyword is the *brownBird* variable. It’s setting a new property just like it would using regular dot notation. It’s important to understand that the brownBird variable contains a function but also consider that functions are also objects. This means you can access certain properties defined inside of them. Pretty neat right!

The *Bird* function can also be changed to also include parameters to define dynamic values of the properties defined within the function.

```javascript
let Bird = function (colour, numLegs) {
  (this.colour = colour), (this.numLegs = numLegs);
};

let brownBird = new Bird("purple", 2);

console.log(brownBird.colour);

// output: purple
```

There is no limit to what can be done using constructor functions. Once this is learned it is easier to understand how prototypes work but that’s for another article.
