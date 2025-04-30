import {
  TypeString,
  TypeTrue,
  TypeNull,
  TypeFalse,
  TypeFloat,
  TypeBigint,
  TypeInt,
  TypeDate,
  TypeUndefined,
  TypeNan,
  TypeUrl,
} from '../types/index.js';

const isFloat = (n: number) => (Number(n) === n && n % 1 !== 0) || isNaN(n);

interface ValueProps {
  value?: unknown;
  keyName: string | number;
  expandKey: string;
}

export const Value = (props: ValueProps) => {
  const { value, keyName, expandKey } = props;
  const reset = { keyName, expandKey };
  if (value instanceof URL) {
    return <TypeUrl {...reset}>{value}</TypeUrl>;
  }
  if (typeof value === 'string') {
    return <TypeString {...reset}>{value}</TypeString>;
  }
  if (value === true) {
    return <TypeTrue {...reset}>{value}</TypeTrue>;
  }
  if (value === false) {
    return <TypeFalse {...reset}>{value}</TypeFalse>;
  }

  if (value === null) {
    return <TypeNull {...reset}>{value}</TypeNull>;
  }
  if (value === undefined) {
    return <TypeUndefined {...reset}>{value}</TypeUndefined>;
  }
  if (value instanceof Date) {
    return <TypeDate {...reset}>{value}</TypeDate>;
  }

  if (typeof value === 'number' && isNaN(value)) {
    return <TypeNan {...reset}>{value}</TypeNan>;
  } else if (typeof value === 'number' && isFloat(value)) {
    return <TypeFloat {...reset}>{value}</TypeFloat>;
  } else if (typeof value === 'bigint') {
    return <TypeBigint {...reset}>{value}</TypeBigint>;
  } else if (typeof value === 'number') {
    return <TypeInt {...reset}>{value}</TypeInt>;
  }

  return null;
};
Value.displayName = 'JVR.Value';
