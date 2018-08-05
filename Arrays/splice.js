const characters = ['Klaus', 'Elijah', 'Rebekkah', 'Kol'];

characters.splice(0, 1, 'Stefan');
console.log(characters);

characters.splice(1, 2, 'Damon', 'Elena');
console.log(characters);

characters.splice(1, 2, 'Caroline');
console.log(characters);

characters.splice(1, 1);
console.log(characters);
