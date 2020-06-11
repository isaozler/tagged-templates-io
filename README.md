# Read me

In most projects we use interpolations for several reasons. This could be simple html class-names, sql queries, or even more complicated strings that needs to be mutated on the fly. This is what this package is good for. You can easily create your own dynamic strings, with conditions, expressions or whatever you need.


# API Reference

```js
taggedTemplate(pattern, values, conditions); // string
```

| Pattern     | Values    | Conditions | Result |
| -------------  |:---------- |----------- | -----|
|  *string*  |  *number, string, [number or string]*  | *boolean, string, number, null, [boolean, string, number, null]* |  *string*  |
| `text {0}` | `'val 1'` | `null` | `'text val 1'` |
| `text {0} and {0}` | `'val 1'` | `null` | `'text val 1 and val 1'` |
| `text {0} and {1}` | `'val 1'` | `null` | `'text val 1 and val 1'` |
| `text {0} and {1}` | `['val 1', 'val 2']` | `null` | `'text val 1 and val 2'` |
| `text {0} and {1}` | `[ ['val 1.0', 'val 1.1'], ['val 2.0', 'val 2.1'] ]` | `[ true, false ]` | `'text val 1.0 and val 2.1'` |
| `text {0} and {1}` | `[ ['val 1.0', 'val 1.1'], ['val 2.0', 'val 2.1'] ]` | `[ true, null ]` | `'text val 1.0 and val 2.0'` |
| `text {key1} and {key2}` | `{ key1: ['val 1.1', 'val 1.2'], key2: ['val 2.1', 'val 2.2'] }` | `null` | `'text val 1.1,val 1.2 and val 2.1,val 2.2'` |
| `text {key1} and {key2}` | `{ key1: ['val 1.1', 'val 1.2'], key2: ['val 2.1', 'val 2.2'] }` | `{ key1: true, key2: false }` | `'text val 1.1 and val 2.2'` |
| `text {key1} and {key2}` | `{ key1: ['val 1.1', 'val 1.2'], key2: ['val 2.1', 'val 2.2'] }` | `{ key1: 'true', key2: null }` | `'text val 1.1 and val 2.2'` |
| ``` (key) => `text ${key}` ``` | `'val 1'` | `null` | `'text val 1'` |
| ``` (key) => `text ${key}` ``` | `['val 1']` | `null` | `'text val 1'` |
| ``` (key) => `text ${key}` ``` | `['val 1']` | `true` | `'text val 1'` |
| ``` (key) => `text ${key}` ``` | `['val 1']` | `[true]` | `'text val 1'` |
| ``` (key) => `text ${key}` ``` | `['val 1']` | `[false] or false` | `'text val 1'` |
| ``` (key1, key2) => `text ${key1} and ${key2}` ``` | `[['val 1.1','val 1.2'],['val 2.1', 'val 2.2']]` | `[true, false]` | `'text val 1.1 and val 2.2'` |


## Basic Usage

```js
taggedTemplate(`template-string`, values, conditions?);
```

### Examples


## Basic
```js
taggedTemplate(`Hello {0}`, 'world');

// Hello World

taggedTemplate(`Hello {target}`, { target: 'World'});

// Hello World

taggedTemplate(`Hello {target}`, { target: ['World', 'Mars']}, { target: false });

// Hello Mars

```

## Html class names
```js
const isFirstNavItem = index === 0;

const className = taggedTemplate(
  `link__{1}--{0} link__type--{1}`,
  [['active',''], 'nav'],
  [isFirstNavItem, true]
);

<h1 :class="className">Title</h1> // VueJs Sample

// Output

// <h1 class="link__nav--active link__type--nav">Title</h1>

```

## SQL
```js
const isClient = true;
const as = 'age';
const from = ['clientTable', 'relationTable'];
const fromCondition = isClient;
const where = `${as} = ${42}`;
const start = 0, end = 10;

const a = taggedTemplate(`
  SELECT {select} AS {as}
  FROM {from}
  WHERE {where}
  LIMIT {start}, {end}
`,
  { select: 'age_col', as, from, where, start, end },
  { from: fromCondition },
)

```


## Render HTML

```js

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

/** 
 * Outputs

<ul class="list__wrapper">
  <li id="1" class="list__item list__item--active">
    Item 1</li>
  <li id="2" class="list__item">
    Item 2</li>
</ul>

*/
```
