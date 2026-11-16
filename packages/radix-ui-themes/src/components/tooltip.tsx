import * as React from 'react';
import classNames from 'classnames';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { Text } from './text.js';
import { Theme, ThemeContext } from './theme.js';
import { extractProps } from '../helpers/extract-props.js';
import { tooltipPropDefs } from './tooltip.props.js';

import type { ComponentPropsWithout, RemovedProps } from '../helpers/component-props.js';
import type { GetPropDefTypes } from '../props/prop-def.js';

type TooltipElement = React.ElementRef<typeof TooltipPrimitive.Content>;
type TooltipOwnProps = GetPropDefTypes<typeof tooltipPropDefs>;
interface TooltipProps
  extends
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
    ComponentPropsWithout<typeof TooltipPrimitive.Content, RemovedProps | 'content'>,
    TooltipOwnProps {
  content: React.ReactNode;
  container?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>['container'];
  /** Disables the tooltip so that only the child element is rendered */
  disabled?: boolean;
}
const Tooltip = React.forwardRef<TooltipElement, TooltipProps>((props, forwardedRef) => {
  const {
    children,
    className,
    open,
    defaultOpen,
    onOpenChange,
    delayDuration,
    disableHoverableContent,
    content,
    container,
    forceMount,
    disabled = false,
    ...tooltipContentProps
  } = extractProps(props, tooltipPropDefs);
  const rootProps = { open, defaultOpen, onOpenChange, delayDuration, disableHoverableContent };

  // The tooltip renders on an inverted panel (gray-12 background), so accent
  // colors inside the content need to resolve against the opposite appearance
  // to stay readable (#418, #440, #476). Tooltip content only renders after
  // user interaction on the client, so reading the root class for inherited
  // appearances is safe.
  const themeContext = React.useContext(ThemeContext);
  const currentAppearance = themeContext?.appearance ?? 'inherit';
  const invertedAppearance =
    currentAppearance === 'inherit'
      ? typeof document !== 'undefined' &&
        (document.documentElement.classList.contains('dark') ||
          document.documentElement.classList.contains('dark-theme') ||
          document.body.classList.contains('dark') ||
          document.body.classList.contains('dark-theme'))
        ? 'dark'
        : 'light'
      : currentAppearance === 'dark'
        ? 'light'
        : 'dark';

  // Render only the child so that the tooltip is fully suppressed
  if (disabled) return <>{children}</>;

  return (
    <TooltipPrimitive.Root {...rootProps}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal container={container} forceMount={forceMount}>
        <Theme asChild>
          <TooltipPrimitive.Content
            sideOffset={4}
            collisionPadding={10}
            {...tooltipContentProps}
            asChild={false}
            ref={forwardedRef}
            className={classNames('rt-TooltipContent', className)}
          >
            {/* `display: contents` keeps the wrapper out of the layout while the
                inverted `light`/`dark` class re-scopes the CSS variables */}
            <span className={invertedAppearance} style={{ display: 'contents' }}>
              <Text as="p" className="rt-TooltipText" size="1">
                {content}
              </Text>
            </span>
            <TooltipPrimitive.Arrow className="rt-TooltipArrow" />
          </TooltipPrimitive.Content>
        </Theme>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
});
Tooltip.displayName = 'Tooltip';

export { Tooltip };
export type { TooltipProps };
