# @fund/transform-model

> 数据模型转换

## Usage

准备工作：
```bash
// 切换私库
yarn config set registry http://npm.1234567.fed
// 下载模块
yarn add @fund/transform-model
```

## demo

```ts
import {
  Model,
  Property,
  Transform,
  DefaultValue,
  Type,
  Definition,
} from '@fund/transform-model';

class Score extends Model {
  @Definition('学科名称')
  @Property('subject')
  subjectName: string;

  @Definition('学科分数')
  @Property('score')
  score: number;
}

class Student extends Model {
  @Definition('学生名字')
  @Property('name')
  @DefaultValue('张三')
  name: string;

  @Definition('学生年龄')
  @Property('age')
  @Transform(value => value * 2)
  age: number;

  @Definition('学生成绩')
  @Property('scores')
  @Type(Score)
  scores: Score[];
}

const data = {
  name: '李四',
  age: 18,
  scores: [{
    subject: '语文',
    score: 95,
  }, {
    subject: '数学',
    score: 98,
  }, {
    subject: '英语',
    score: 99,
  }],
};

console.log(new Student(data));
// Student {
//   name: '李四',
//   age: 36,
//   scores: [
//     Score { subjectName: '语文', score: 95 },
//     Score { subjectName: '数学', score: 98 },
//     Score { subjectName: '英语', score: 99 }
//   ]
// }
```

## Model 类

> 该类提供了一个构造函数，使类在被 new 时自动匹配数据。<br/>
> 若数据是数组或 Set 实例则会返回类对象数组，若数据为单个对象则会返回单个类对象。

```ts
import { Model, Property } from '@fund/transform-model';

class Person extends Model {
  @Property('name')
  name: string;
}

const personData = {
  name: '张三',
};

const personList = [
  { name: '张三' },
  { name: '李四' },
];

console.log(new Person(personData));
// Person { name: '张三' }
console.log(new Person(personList));
// [Person { name: '张三' }, Person { name: '李四' }]

// 注意：返回的是类对象，非普通的 Object 对象，也就是说，生成的类对象可以调用类定义的方法。

// 如果不确定接口返回的是单个对象还是数组，建议统一转数组处理，例如：
// data = Array.isArray(data) ? data : [data];
// new Class(data);
```

## 属性装饰器 Property

> 该装饰器用于指定映射路径，[] 分隔符和 . 分隔符都可。

参数

name | desc | type | default |
-- | -- | -- | -- |
property | 映射路径 | `string` | `/`

```ts
import { Model, Property } from '@fund/transform-model';
import { Transform } from './transform.decorator';

class Person extends Model {
  @Property('firstName', 'lastName')
  @Transform((name1, name2) => name1 + name2)
  name: string;

  @Property('info[0].age')
  age: number;
}

const personData = {
  firstName: '张',
  lastName: '三',
  info: [{ age: 18 }],
};

console.log(new Person(personData));
// Person { name: '张三', age: 18 }
// 注意：当 Property 传入多个路径时，一定要使用 Transform 对多个值进行处理，否则默认取第一个路径的值。
```

## 属性装饰器 Transform

> 该装饰器用于指定转换器，对原始值进行转换。

参数

name | desc | type | default |
-- | -- | -- | -- |
transformFn | 转换函数 | `Function` | `/`

此函数的参数列表和 Property 一一对应

```ts
import { Model, Property, Transform } from '@fund/transform-model';

class Person extends Model {
  @Property('firstName', 'lastName')
  @Transform((name1, name2) => name1 + name2)
  name: string;
  
  @Property('age')
  @Transform(value => value * 2)
  age: number;
}

const personData = {
  firstName: '张',
  lastName: '三',
  age: 18,
};

console.log(new Person(personData));
// Person { name: '张三', age: 36 }
// 注意：转换后的值须与声明的类型相符，不然会被抹除。
```

## 属性装饰器 DefaultValue

> 该装饰器用于指定默认值。

参数

name | desc | type | default |
-- | -- | -- | -- |
defaultValue | 默认值 | `any` | `/`

```ts
import { Model, Property, DefaultValue } from '@fund/transform-model';

class Person extends Model {
  @Property('name')
  @DefaultValue('name')
  name: string;

  @Property('age')
  age: number;
}

const personData = {
  name: '',
  age: '18',
};

console.log(new Person(personData));
// Person { name: 'name', age: 0 }
// 注意：在以下情况会被视为无值：value === undefined || value === null
// 注意：默认值并不会进行类型校验，即使与声明类型不同也会使用默认值。
//
// 不传 DefaultValue，那么会应用内置默认值：
// String: ''
// Number: 0
// Boolean: false
// Symbol: Symbol('')
// Array: []
// Object: {}
// 其他: {}
```

## 属性装饰器 Type

> 该装饰器用于指定属性类型。由于反射能力有限，类似 number[] 仅会反射成 Array，故须指定数组项类型。

参数

name | desc | type | default |
-- | -- | -- | -- |
type | 类型（构造函数） | `Function` | `/`

```ts
import { Model, Property, Type } from '@fund/transform-model';

class Student extends Model {
  @Property('name')
  @Type(String)
  name: number;

  @Property('scores')
  @Type(Number)
  scores: number[];

  @Property('array')
  array: string[];
}

const studentData = {
  name: '张三',
  scores: [95, '98', 99],
  array: [95, '98', 99],
};

console.log(new Student(studentData));
// Student { name: '张三', scores: [ 95, 0, 99 ], array: [ 95, '98', 99 ] }
// 注意：@Type 的优先级比属性声明类型优先级高，若有 @Type 则类型会被定义为 @Type 指定的类型。
// 注意：数组必须使用 @Type 指明子项类型，否则数组子项不校验类型。
```

## 属性装饰器 Definition

> 该注释器用于添加注释，用于生成文档。（目前无作用）

参数

name | desc | type | default |
-- | -- | -- | -- |
definition | 注释 | `string` | `/`

```ts
import { Model, Property, Definition } from '@fund/transform-model';

class Person extends Model {
  @Definition('名字')
  @Property('name')
  name: string;
}

const personData = {
  name: '张三',
};

console.log(new Person(personData));
// Person { name: '张三' }
```

## Tips

* 执行顺序：从数据源取值 > transform 转换 > type 校验 > defaultValue 赋值。
* 不要使用循环嵌套，例如：A 中有 B 类型的属性，B 中有 A 类型的属性。

## 小技巧

> 映射后的数据是类对象，代表你可以在这个类里面定义方法并在类对象里面调用

```ts
import {
  Model,
  Property,
  Definition,
  Transform,
} from '@fund/transform-model';

class Fund extends Model {
  @Definition('基金名称')
  @Property('FUND_NAME')
  name: string;

  @Definition('日涨幅')
  @Property('RISE')
  @Transform(rise => Number(rise))
  rise: number;

  get2DigitsRise() {
    return `${this.rise.toFixed(2)}%`;
  }

  get4DigitsRise() {
    return `${this.rise.toFixed(4)}%`;
  }
}

const fundData = {
  FUND_NAME: '上证指数',
  RISE: '0.2543',
};

const fund = new Fund(fundData);
console.log(fund);
// Fund { name: '上证指数', rise: 0.2543 }
console.log(fund.get2DigitsRise());
// 0.25%
console.log(fund.get4DigitsRise());
// 0.2543%
```

> 如果你想把一个平层级的数据，转换成嵌套层级的模型，Property 可传 ''

```ts
// 原始数据
// const srcData = {
//   postId: 'xxx',
//   postTitle: 'yyy',
//   postUserId: 'zzz',
//   postUserName: '张三',
// };

// 目标数据
// const resData = {
//   postId: 'xxx',
//   postTitle: 'yyy',
//   postUser: {
//     userId: 'zzz',
//     userName: '张三',
//   },
// };

import { Model, Property } from '@fund/transform-model';

class User extends Model {
  @Property('postUserId')
  userId: string;

  @Property('postUserName')
  userName: string;
}

class Post extends Model {
  @Property('postId')
  postId: string;

  @Property('postTitle')
  postTitle: string;

  @Property('')
  postUser: User;
}

const postData = {
  postId: 'xxx',
  postTitle: 'yyy',
  postUserId: 'zzz',
  postUserName: '张三',
};

console.log(new Post(postData));
// Post {
//   postId: 'xxx',
//   postTitle: 'yyy',
//   postUser: User {
//     userId: 'zzz',
//     userName: '张三',
//   },
// }
```
