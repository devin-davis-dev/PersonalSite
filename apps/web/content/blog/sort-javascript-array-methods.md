---
title: Sort - JavaScript Array Methods
thumbnail: assets/photo-1521192520982-5d6ca468a30f.jpg
date: 2019-11-11T16:36:11.369Z
keywords: javascript sort, javascript, sort, javascript sort array method, method
draft: false
category: programming
---

The .sort() method is one of the many methods that iterate over an array. This
method in particular is used to sort an array based on its elements. When
called directly on an array without any arguments, it will return a sorted
array but it may not behave the way you may have intended it to. With numbers,
it will sort them based on the first number.

> So for the array of \[4, 32] it will sort it based on each elements first number rather than the whole number. The output would be \[32, 4].

If it fails to sort your array to your desire, you’ll need to create a sorting function as an argument. This function is usually set with two parameters being “a” and “b". These will represent two values within your given array. These arguments will be swapped out on each element in the array, until the last one. By doing this, it is comparing two elements at a time until it sorts all of them.

Great! Now for an example…

```javascript

var numbers = [78, 82, 55, 38];

var sortedNums = numbers.sort((a, b) => {

if(a — b) {

return 1;

} else {

return -1

}

};

console.log(sortedNums);

// output: [38, 55, 78, 82];

```

The returned numbers used 1 and -1 are moving each element back and forth within the array until each are sorted.

Pretty cool eh?

Large sets of data always need organization and the .sort() method can help you achieve that!
