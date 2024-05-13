import { useEffect } from "react";
import ConfigObject, { type ConfigObjectProps } from "./item/ConfigObject";
import type { Node, Scheme } from "./types";
import { getDefaultValue } from "./ConfigRegister";
import deepmerge from "deepmerge";

type ConfigUIProps<Value extends Record<string, unknown>> = {
  scheme: Scheme;
  value: Value;
  onChange?: (target: any, field: string, val: any) => void;
};

export default function ConfigUI<Value extends Record<string, unknown>>(
  props: ConfigUIProps<Value>
) {
  useEffect(() => {
    const defaultValue = getDefaultValue(props.scheme);
    if (!props.value[props.scheme.field]) {
      props.value = {
        ...props.value,
        [props.scheme.field]: {},
      };
    }
    const mergeValue = deepmerge(
      defaultValue,
      (props.value as any)[props.scheme.field],
      { arrayMerge: (dest, source) => source }
    );
    (props.value as any)[props.scheme.field] = mergeValue;
    console.log("ConfigUI onChange", defaultValue, mergeValue);
    props.onChange?.(props.value, props.scheme.field, mergeValue);
  }, [props.scheme]);
  return (
    <ConfigObject
      label={props.scheme.label}
      field={props.scheme.field}
      properties={props.scheme.properties}
      value={props.value[props.scheme.field]}
      options={props.scheme.options}
      target={props.value}
      onChange={(target: any, field: string, val: any) => {
        props.onChange?.(target, field, val);
      }}
    ></ConfigObject>
  );
}
