/**
 * 该装饰器负责收集属性定义, 用于文档生成.<br/>
 * 该装饰器可被应用于类属性声明.<br/>
 * @param definition 定义
 */
// @ts-ignore
export function Definition(definition: string): PropertyDecorator {

  // @ts-ignore
  return function (target: Object, propertyName: string | symbol): void {
    // TODO 文档生成逻辑
  };
}
