---
title: Map - JavaScript Array Methods
thumbnail: assets/logo_2.png
date: 2019-11-10T16:40:51.117Z
keywords: javascript, javascript map method, javascript map array method, array  method, map array method
draft: false
category: programming
---

The .map() function is used to iterate over an array to apply a function to
each of its elements, much like the forEach() method. The primary difference
between these two methods is that the .map() function returns a completely new
array containing the modified elements while the .forEach() method only
modifies the array it is currently applied to. For the sake of example, the
function below will return a new array containing each number in the "numbers
array" multiplied by two.

```javascript
var numbers = [1, 2, 3, 4];

var numbersMultiplied = numbers.map((number) => {
  return number * 2;
});

console.log(numbersMultiplied); // [2, 4, 6, 8]
```

It is also possible to do the same thing with a .forEach() method. First a new array would need to be created, then the .foreach() method would need to use the .push() method on each element to move them inside this newly created array.

```javascript
var newArr = [1, 2, 3, 4];

numbers.forEach((number) => {
  var newNum = number * 2;
  newArr.push(newNum);
});

console.log(newArr); // [2, 4, 6, 8]
```

_So why use one over the other?_

The map() function is ideal for making copies of an array while not changing the original and each item can be modified before being stored.

On the other hand, the .forEach() method could be used to iterate over an array that does not need to be changed. This would be especially useful when working with .json data inside a database.
