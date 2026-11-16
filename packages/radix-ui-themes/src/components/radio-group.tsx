'use client';

import * as React from 'react';
import classNames from 'classnames';
import { Context } from 'radix-ui/internal';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { radioGroupRootPropDefs } from './radio-group.props.js';
import { Text } from './text.js';
import { extractProps } from '../helpers/extract-props.js';
import { marginPropDefs } from '../props/margin.props.js';

import type { ComponentPropsWithout, RemovedProps } from '../helpers/component-props.js';
import type { MarginProps } from '../props/margin.props.js';
import type { GetPropDefTypes } from '../props/prop-def.js';

const RADIO_GROUP_NAME = 'RadioGroup';

type ScopedProps<P> = P & { __scopeRadioGroup?: Context.Scope };
const [createRadioGroupContext] = Context.createContextScope(RADIO_GROUP_NAME, [
  RadioGroupPrimitive.createRadioGroupScope,
]);
const useRadioGroupScope = RadioGroupPrimitive.createRadioGroupScope();

type RadioGroupRootOwnProps = GetPropDefTypes<typeof radioGroupRootPropDefs>;
type RadioGroupContextValue = RadioGroupRootOwnProps;

const [RadioGroupProvider, useRadioGroupContext] =
  createRadioGroupContext<RadioGroupContextValue>(RADIO_GROUP_NAME);

type RadioGroupRootElement = React.ElementRef<typeof RadioGroupPrimitive.Root>;
interface RadioGroupRootProps
  extends
    ComponentPropsWithout<typeof RadioGroupPrimitive.Root, 'asChild' | 'color' | 'defaultChecked'>,
    MarginProps,
    RadioGroupRootOwnProps {}
const RadioGroupRoot = React.forwardRef<RadioGroupRootElement, RadioGroupRootProps>(
  (
    {
      color = radioGroupRootPropDefs.color.default,
      highContrast = radioGroupRootPropDefs.highContrast.default,
      size = radioGroupRootPropDefs.size.default,
      variant = radioGroupRootPropDefs.variant.default,
      ...props
    }: ScopedProps<RadioGroupRootProps>,
    forwardedRef,
  ) => {
    const { __scopeRadioGroup, className, ...rootProps } = extractProps(props, marginPropDefs);
    const radioGroupScope = useRadioGroupScope(__scopeRadioGroup);
    return (
      <RadioGroupProvider
        scope={__scopeRadioGroup}
        color={color}
        highContrast={highContrast}
        size={size}
        variant={variant}
      >
        <RadioGroupPrimitive.Root
          {...radioGroupScope}
          {...rootProps}
          ref={forwardedRef}
          className={classNames('rt-RadioGroupRoot', className)}
        />
      </RadioGroupProvider>
    );
  },
);
RadioGroupRoot.displayName = 'RadioGroup.Root';

type RadioGroupItemElement = React.ElementRef<typeof RadioGroupItemRadio>;
// `checked` is stripped: the checked state of an item is derived from the root's
// `value` prop, and forwarding `checked` to the underlying `<button>` breaks it
interface RadioGroupItemProps
  extends Omit<
      ComponentPropsWithout<typeof RadioGroupItemRadio, RemovedProps>,
      'checked'
    >, MarginProps {}
const RadioGroupItem = React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
  (_props: ScopedProps<RadioGroupItemProps>, forwardedRef) => {
    // `checked` is intentionally absent from the public props. Strip it here as
    // well so that plain-JS callers can't override the checked state that the
    // primitive derives from the root's `value` prop.
    const { checked: _checked, ...propsWithoutChecked } = _props as typeof _props & {
      checked?: boolean;
    };
    const { __scopeRadioGroup, children, className, style, ...props } = propsWithoutChecked;
    const { size } = useRadioGroupContext('RadioGroupItem', __scopeRadioGroup);

    // Render `<Text as="label">` if children are provided, otherwise render
    // the solo radio button to allow building out your custom layouts with it.
    if (children) {
      return (
        <Text
          as="label"
          size={size}
          className={classNames('rt-RadioGroupItem', className)}
          style={style}
        >
          <RadioGroupItemRadio
            __scopeRadioGroup={__scopeRadioGroup}
            {...props}
            ref={forwardedRef}
          />
          {children && <span className="rt-RadioGroupItemInner">{children}</span>}
        </Text>
      );
    }

    return (
      <RadioGroupItemRadio
        __scopeRadioGroup={__scopeRadioGroup}
        {...props}
        ref={forwardedRef}
        className={className}
        style={style}
      />
    );
  },
);
RadioGroupItem.displayName = 'RadioGroup.Item';

type RadioGroupItemRadioElement = React.ElementRef<typeof RadioGroupPrimitive.Item>;
interface RadioGroupItemRadioProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  'checked'
> {}
const RadioGroupItemRadio = React.forwardRef<
  RadioGroupItemRadioElement,
  ScopedProps<RadioGroupItemRadioProps>
>((_props, forwardedRef) => {
  const { __scopeRadioGroup, checked: _checked, ...props } = _props as typeof _props & {
    checked?: boolean;
  };
  const context = useRadioGroupContext('RadioGroupItemRadio', __scopeRadioGroup);
  const radioGroupScope = useRadioGroupScope(__scopeRadioGroup);
  const { color, className } = extractProps(
    { ...props, ...context },
    radioGroupRootPropDefs,
    marginPropDefs,
  );
  return (
    <RadioGroupPrimitive.Item
      {...radioGroupScope}
      data-accent-color={color}
      {...props}
      asChild={false}
      ref={forwardedRef}
      className={classNames('rt-reset', 'rt-BaseRadioRoot', className)}
    />
  );
});
RadioGroupItemRadio.displayName = 'RadioGroup.ItemRadio';

export { RadioGroupRoot as Root, RadioGroupItem as Item };
export type { RadioGroupRootProps as RootProps, RadioGroupItemProps as ItemProps };
