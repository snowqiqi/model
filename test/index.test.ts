import {
  Model,
  Property,
  Transform,
  DefaultValue,
  Type,
  Definition,
} from '../src';

class A extends Model {
  @Definition('名字')
  @Property('name')
    // @ts-ignore
  name: string;
}

class B extends Model {
  @Definition('名字')
  @Property('name')
  @DefaultValue(3)
    // @ts-ignore
  name: number;

  @Definition('a对象')
  @Property('a')
    // @ts-ignore
  a: A;
}

class C extends Model {
  @Definition('名字')
  @Property('test')
    // @ts-ignore
  name: string;

  @Definition('年龄')
  @Property('age')
  @Transform(value => value * 2)
    // @ts-ignore
  age: number;

  @Definition('性别')
  @Property('sex')
  @DefaultValue('未知')
    // @ts-ignore
  sex: string;

  @Definition('a对象')
  @Property('a')
    // @ts-ignore
  a: A;

  @Definition('b对象数组')
  @Property('b')
  @Type(B)
    // @ts-ignore
  b: B[];
}

const data = [{
  name: '张三',
  age: 18,
  sex: '',
  a: [{
    name: '李四',
  }],
  b: [{
    name: '王五',
  }],
}];

const expectResult = [{
  name: '',
  age: 36,
  sex: '未知',
  a: {
    name: '',
  },
  b: [{
    name: 3,
    a: {
      name: '',
    },
  }],
}];

test('transform-model', () => {
  expect(JSON.stringify(new C(data)))
    .toBe(JSON.stringify(expectResult));
});
