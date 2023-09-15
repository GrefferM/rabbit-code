export interface IApplicationException<T, V> {
  code: V;
  details: T;
}
