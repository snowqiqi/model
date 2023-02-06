/**
 * 此对象为 @DefaultValue 装饰器分配的元数据
 */
export interface DefaultValueMetadata {
  prototype: Object;

  /**
   * 属性名称
   */
  propertyName: string;

  /**
   * 默认值
   */
  defaultValue: any;
}
