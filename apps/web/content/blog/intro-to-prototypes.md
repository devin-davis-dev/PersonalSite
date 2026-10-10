---
title: Intro to Prototypes
thumbnail: assets/logo_2.png
date: 2020-04-03T15:13:45.129Z
keywords: javascript, prototypes, javascript prototypes, oop, object oriented, programming, inheritance, augmentation
category: programming
draft: true
---

Prototypes are a challenging JavaScript programming concept to understand. To
put it simply, prototypes are JavaScript method of implementing [Object
Oriented
Programming](https://www.educative.io/blog/object-oriented-programming) (OOP).
With that in mind, knowing about Prototypes can help programmers better
understand the often strange nuances of JavaScript programming.

## What you should know

Before delving into prototypes, it is important that you understand multiple concepts within JavaScript. It should not be the first thing you read about. The following are concepts you should understand:

- What are objects and how to use an object constructor.

- What are the differences between a function and a method.

- The primitive values of JavaScript.

- A general grasp of the “this” keyword.

## What do prototypes do?

Prototypes are used to provide *universal functionality* in JavaScript. This universal functionality is called *inheritance*. Inheritance is a concept used in many object oriented programming languages and is implemented many different ways. In JavaScript it is achieved using prototypes. Without prototypes you could not use methods like **split** or **forEach.** With that brief introduction out of the way, let's first explain inheritance so that we can better understand its implementation in JavaScript.

## Inheritance

Inheritance allows for methods and properties of objects to be shared. To provide more clarity, imagine we have a family of people; consequently, each member of that family shares the same last name. That last name was passed on over generations therefore must have originated from the first person using it. For example, let us translate this family tree to code by creating a new constructor called SmithFamilyMember.

### Example:

```javascript

const SmithFamMember = (firstName) => {
  this.firstName = firstName,

  this.lastName = ‘Smith’,

  this.getName = function() {
  return this.firstName + this.lastName
  }
}


const george = new SmithFamMember(‘george’);

```

Above, a basic family member object constructor was created. Then an instance of it called George was instantiated or created. George has two properties including a **first name** and **last** **name**. Also, it has a method called **getName.** Each time a new instance of SmithFamilyMember is made, they are provided with both properties and method.

Inheritance is simply this behavior of passing along properties and methods which allows you to create a associations between objects. Now that you have an idea of what inheritance is, you can now learn how prototypes make it possible within JavaScript.

## Inheritance Through Prototypes

Prototypes allow for inheritance to occur in JavaScript. This is quite different from other object oriented programming languages like [Java](https://www.upwork.com/resources/java-vs-javascript-what-is-the-difference#:~:text=Java%20follows%20class%20based%20inheritance%E2%80%94a%20top%20down%2C%20hierarchical%2C,inherit%20directly%20from%20other%20objects.) that use class based inheritance. Prototypes are objects stored inside objects that contain a variety of properties and methods. Whenever a new object is created it inherits a \_\_proto\_\_ object that contains its parent’s prototype.

### Heirloom Example

Prototypes are comparable to [heirlooms](https://www.merriam-webster.com/dictionary/heirloom) that are passed down through generations by families. Let’s imagine our heirloom is a small chest which is comparable to a constructor and it contains jewelry; Each piece of jewelry represents a property or method.

### Code Example

The following example demonstrates how to gain access to the concat method that is contained inside the array prototype. It also shows the creation of an instance of array to use the concat method.

```javascript

Array.prototype.concat(); // The original method defined on the prototype.


let newArray = []; // An instance of the array constructor.


newArray = newArray.concat(“apple”); // The concat method being used on the new array.

```

After looking over the Array constructor in above example and comparing it to our constructor named SmithFamilyMember, we can understand that it is no different from it. They are both constructors and they both have prototype objects that contain various methods like **concat()** or **getName()** and properties like **length** or **firstName**. Whenever we instantiate a new instance of either of them we empty its parent’s prototype’s properties and methods into it.

There are many ways to take advantage of this prototype sharing behavior. One of which is the action of augmenting existing prototypes.

## Augmentation

Augmentation is used to add new properties and methods to existing prototypes. This is accomplished by accessing the prototype then defining a new property on it.

```javascript
Number.prototype.addOne = function () {
  // *New method defined on the Number prototype.*

  return this + 1;
};

const number = new Number(1); // *New number instance created.*

const number2 = 2; // *New number instance created.*

number.addOne(); // returns 2

number2.addOne(); // returns 3
```

In the example above, augmentation is used to add a new method to the Number constructor. This method returns the current value of the number plus 1. Because it was defined on the number parent prototype, it trickles down the prototype hierarchy is available on both newly instantiated numbers. This basic example demonstrates the power of prototypes by adding new functionality to one of its existing constructors. The same principle can be followed on your own custom constructors.

## Taking Advantage of Prototypes

After gaining a basic understanding of prototypes, you can have a deeper understanding of the under-workings of JavaScript. This benefits you because it enables code re-usability. I recommend that you read further on the topic by reading [JavaScript the Good Parts](https://www.amazon.ca/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742). Douglas goes in depth on several interesting JavaScript concepts that can help you become a better web developer. Happy coding!
