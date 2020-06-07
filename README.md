# Read me

In most projects we use interpolations for several reasons. This could be simple html class-names, sql queries, or even more complicated strings that needs to be mutated on the fly. This is what this package is good for. You can easily create your own dynamic strings, with conditions, expressions or whatever you need.

## Basic Usage

```
taggedTemplate(`template-string`, values, conditions?);
```

### Examples


## Basic
```
taggedTemplate(`Hello ${0}`, 'world');

// Hello World

taggedTemplate(`Hello {target}`, { target: 'World'});

// Hello World

taggedTemplate(`Hello {target}`, { target: ['World', 'Mars']}, { target: false });

// Hello Mars

```

## Html class names
```
const isFirstNavItem = index === 0;

const className = taggedTemplate(
  `link__{1}--{0} link__type--{1}`,
  [['active',''], 'nav'],
  [isFirstNavItem, true]
);

<h1 :class="className">Title</h1> // VueJs Sample

// Output

<h1 class="link__nav--active link__type--nav">Title</h1>

```

## SQL
```
const isClient = true;
const asCol = 'name';
const from = ['clientTable', 'relationTable'];
const fromCondition = isClient;
const where = `${as} = ${42}`;
const start = 0, end = 10;

taggedTemplate(`
  SELECT {select} AS {as}
  FROM {from}
  WHERE {where}
  LIMIT {start}, {end}
`,
  { select: 'firstname', as: asCol, from, where, start, end },
  { from: fromCondition },
);


// Outputs

SELECT firstname AS name
  FROM clientTable
  WHERE name = 42
  LIMIT 0, 10

```


## HTML

```

const classHandler = (id, activeIndex, classes) => {
  if (!!classes) {
     return taggedTemplate(
       `class="{0}"`, 
       [[Array.from(new Set(classes)).join(' '), classes[0]]],
       [id === activeIndex]
     );
  }
};

const activeIndex = 1;

const result = taggedTemplate(
  (listWrapper, listItems, activeClass, activeIndex) => `
    <ul class="${listWrapper}">
        ${listItems.reduce((ul, {id, label}) => {
          return ul+`<li id="${id}" ${classHandler(id, activeIndex, activeClass)}>${label}</li>`;
        }, '')}
    </ul>
  `,
  [
    'list__wrapper',
    [
      { id: 1, label: 'Item 1' },
      { id: 2, label: 'Item 2' }
    ],
    ['list__item','list__item--active'],
    activeIndex
  ]
);

// Outputs

<ul class="list__wrapper">
  <li id="1" class="list__item list__item--active">
    Item 1</li>
  <li id="2" class="list__item">
    Item 2</li>
</ul>
```

