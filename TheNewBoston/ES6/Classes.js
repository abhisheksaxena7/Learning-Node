class Person {

    constructor(name, age, weight) {
        this.name = name;
        this.age = age;
        this.weight = weight;
    }

    displayWeight() {
        console.log(this.weight);
    }

}

const bucky = new Person('Bucky', 87, 6650);
const sally = new Person('Sally', 21, 89);
bucky.displayWeight();
sally.displayWeight();
