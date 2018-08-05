const reverseArray = (array) => {
  const reversedArray = [];
  array.forEach((element) => {
    reversedArray.unshift(element);
  });
  return reversedArray;
};

const reverseArrayInPlace = (array) => {
  const reversedArray = array;
  for (let i = 0; i < Math.floor(reversedArray.length / 2); i++) {
    const old = array[i];
    reversedArray[i] = reversedArray[reversedArray.length - 1 - i];
    reversedArray[reversedArray.length - 1 - i] = old;
  }
  return array;
};


console.log(reverseArray(['A', 'B', 'C']));
// → ["C", "B", "A"];
const arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
