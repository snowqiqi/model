/**
 * 此对象为 @Property 装饰器分配的元数据
 */
export interface PropertyMetadata {
  prototype: Object;

  /**
   * 属性名称
   */
  propertyName: string;

  /**
   * 目标属性
   */
  properties: string[];
}
