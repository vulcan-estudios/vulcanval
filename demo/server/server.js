const vulcanval = require('../../src/js/vulcanval');

const map = {
  name: 'Romel',
  age: 22,
  likesPumpkin: false
};

const settings = {
  fields: [{
    name: 'name',
    required: true,
    validators: {
      isAlphanumeric: 'en-US',
      isLowercase: true
    }
  }, {
    name: 'age',
    validators: {
      isInt: { min: 1, max: 500 }
    }
  }, {
    name: 'likesPumpkin',
    required: true
  }]
};

const result = vulcanval.validateMap(map, settings);
console.log(result);
// {
//   name: 'This field should only contain lowercase text.',
//   likesPumpkin: 'Please fill out this field.'
// }

map.name = 'romel';
map.likesPumpkin = true;
const result2 = vulcanval.validateMap(map, settings);
console.log(result2);
// false
