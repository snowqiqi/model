/**
 * 此对象为 @Type 装饰器分配的元数据
 */
export interface TypeMetadata {
  prototype: Object;

  /**
   * 属性名称
   */
  propertyName: string;

  /**
   * 根据 ('design:type') 反射的类型
   */
  reflectedType: any;

  /**
   * 自定义类型
   */
  type: Function | undefined;
}
