import React, { FC, HTMLAttributes, ReactChild } from 'react';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** custom content, defaults to 'the snozzberries taste like snozzberries' */
  children?: ReactChild;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing: FC<Props> = ({ children }) => {
  return <div>{children || `the snozzberries taste like snozzberries`}</div>;
};

type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json }
  | Json[];

type JsonBlobComponents = {
  Text: React.ElementType;
  ExpandText: React.ElementType; // needs to have onPress or onClick
  View: React.ElementType;
  ExpandView: React.ElementType;
};

type JsonBlobProps = {
  obj: Json;
  keyString?: string;
  level?: number;
  Components: JsonBlobComponents;
};

export const JsonBlob: React.FC<JsonBlobProps> = ({
  obj,
  keyString,
  level = 1,
  Components,
}) => {
  if (typeof obj !== 'object' || obj === null) {
    return <Components.Text>{`${keyString}: ${obj},`}</Components.Text>;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return <Components.Text>{`${keyString}: [],`}</Components.Text>;
    }
    return (
      <NestedArray
        obj={obj}
        keyString={keyString}
        level={level}
        Components={Components}
      />
    );
  }
  if (obj) {
    if (Object.keys(obj).length === 0) {
      return <Components.Text>{`${keyString}: {},`}</Components.Text>;
    }
    return (
      <NestedObject
        obj={obj}
        keyString={keyString}
        level={level}
        Components={Components}
      />
    );
  }
  return null;
};

const NestedObject: React.FC<{
  obj: { [property: string]: Json };
  keyString?: string;
  level: number;
  Components: JsonBlobComponents;
}> = ({ obj, keyString, level, Components }) => {
  const [expanded, setExpanded] = React.useState(false);
  if (expanded) {
    return (
      <Components.View>
        <Components.ExpandText
          onPress={() => setExpanded(false)}
          onClick={() => setExpanded(false)}
        >{`${keyString ? `${keyString}: ` : ``}{`}</Components.ExpandText>
        <Components.ExpandView level={level}>
          {Object.entries(obj).map(([key, value], index) => {
            return (
              <JsonBlob
                key={`${index}:${key}:${value}`}
                obj={value}
                keyString={key}
                level={level + 1}
                Components={Components}
              />
            );
          })}
        </Components.ExpandView>
        <Components.Text>{`},`}</Components.Text>
      </Components.View>
    );
  }
  return (
    <Components.ExpandText
      onPress={() => setExpanded(true)}
      onClick={() => setExpanded(true)}
    >{`${keyString ? `${keyString}: ` : ``}{...},`}</Components.ExpandText>
  );
};

const NestedArray: React.FC<{
  obj: Json[];
  keyString?: string;
  level: number;
  Components: JsonBlobComponents;
}> = ({ obj, keyString, level, Components }) => {
  const [expanded, setExpanded] = React.useState(false);
  if (expanded) {
    return (
      <Components.View>
        <Components.ExpandText
          onPress={() => setExpanded(false)}
          onClick={() => setExpanded(false)}
        >{`${keyString ? `${keyString}: ` : ``}[`}</Components.ExpandText>
        <Components.ExpandView level={level} style={{}}>
          {obj.map((value, index) => {
            return (
              <JsonBlob
                key={`${index}::${value}`}
                obj={value}
                keyString={`${index}`}
                level={level + 1}
                Components={Components}
              />
            );
          })}
        </Components.ExpandView>
        <Components.Text>],</Components.Text>
      </Components.View>
    );
  }
  return (
    <Components.ExpandText
      onPress={() => setExpanded(true)}
      onClick={() => setExpanded(true)}
    >{`${keyString ? `${keyString}: ` : ``}[...],`}</Components.ExpandText>
  );
};
