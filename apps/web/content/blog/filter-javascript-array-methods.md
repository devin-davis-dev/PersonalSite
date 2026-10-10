---
title: "Filter - JavaScript Array Methods"
thumbnail: assets/photo-1514927298007-a2b56e5270e1.jpg
date: 2019-11-09T16:24:53.076Z
keywords: javascript, filter, array, arrays, javascript arrays, methods, javascript methods
draft: false
category: programming
---

Filtering is a powerful tool that can be used in many different contexts. One
example of filtering is in brewing coffee - depending on your preferences, you
may choose to use a paper filter to keep grinds out of your cup. Similarly,
the JavaScript filter method is used to filter out unwanted data from an
array.

The .filter() method is particularly useful when we want to extract certain elements from an array and ignore the rest. It operates by iterating over the array and applying a function to each element. Elements that do not return a positive value are removed, while those that do are kept.

For example, let's say we have an array of years ranging from 1700 to 2000:

```javascript
var years = [1980, 1878, 1943, 1734, 1793];
```

To filter out all the years that are less than a certain value, we can use the .filter() method. We can specify the array we want to iterate over and apply the filter method to it like so:

```javascript
years.filter(function (year) {
  if (year > 1800) {
    return true;
  }
});

// output: \[1980, 1878, 1943];
```

This code will return all the elements in the array that are greater than 1800. The function passed as an argument to the filter method will evaluate each element and only keep those that evaluate to true after passing through the if statement.

We can also simplify the syntax by using an arrow function and removing the if statement:

```javascript
years.filter((year) => year > 1800);

// output: [1980, 1878, 1943];
```

In this example, the arrow function will evaluate to true for all elements that are greater than 1800 and filter them out. The returned results are compiled into a new array, separate from the original.

In summary, the JavaScript filter method is a powerful tool that can be used to filter out unwanted data from an array. It operates by iterating over the array and applying a function to each element, keeping only those that evaluate to true. This can be useful in a variety of contexts and can be used to extract specific data from an array.
