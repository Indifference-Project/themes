import classNames from 'classnames';

import { getResponsiveStyles } from './get-responsive-styles.js';
import { mergeStyles } from './merge-styles.js';
import { marginPropDefs } from '../props/margin.props.js';

import type { MarginProps } from '../props/margin.props.js';

type CustomProperties = `--${string}`[];

/**
 * The margin utility classes in `src/styles/utilities/margin.css` consume the
 * custom properties declared in `marginPropDefs` (`--m`, `--ml`, `--mr`,
 * `--mt`, `--mb`). Read the names from there so this helper can never drift
 * out of sync with the stylesheet.
 */
function customPropertiesOf(prop: { customProperties: string[] }): CustomProperties {
  return prop.customProperties as CustomProperties;
}

const marginValues = marginPropDefs.m.values;

export function getMarginStyles(props: MarginProps) {
  const [mClassNames, mCustomProperties] = getResponsiveStyles({
    className: marginPropDefs.m.className,
    customProperties: customPropertiesOf(marginPropDefs.m),
    propValues: marginValues,
    value: props.m,
  });

  const [mxClassNames, mxCustomProperties] = getResponsiveStyles({
    className: marginPropDefs.mx.className,
    customProperties: customPropertiesOf(marginPropDefs.mx),
    propValues: marginValues,
    value: props.mx,
  });

  const [myClassNames, myCustomProperties] = getResponsiveStyles({
    className: marginPropDefs.my.className,
    customProperties: customPropertiesOf(marginPropDefs.my),
    propValues: marginValues,
    value: props.my,
  });

  const [mtClassNames, mtCustomProperties] = getResponsiveStyles({
    className: marginPropDefs.mt.className,
    customProperties: customPropertiesOf(marginPropDefs.mt),
    propValues: marginValues,
    value: props.mt,
  });

  const [mrClassNames, mrCustomProperties] = getResponsiveStyles({
    className: marginPropDefs.mr.className,
    customProperties: customPropertiesOf(marginPropDefs.mr),
    propValues: marginValues,
    value: props.mr,
  });

  const [mbClassNames, mbCustomProperties] = getResponsiveStyles({
    className: marginPropDefs.mb.className,
    customProperties: customPropertiesOf(marginPropDefs.mb),
    propValues: marginValues,
    value: props.mb,
  });

  const [mlClassNames, mlCustomProperties] = getResponsiveStyles({
    className: marginPropDefs.ml.className,
    customProperties: customPropertiesOf(marginPropDefs.ml),
    propValues: marginValues,
    value: props.ml,
  });

  return [
    classNames(
      mClassNames,
      mxClassNames,
      myClassNames,
      mtClassNames,
      mrClassNames,
      mbClassNames,
      mlClassNames,
    ),
    mergeStyles(
      mCustomProperties,
      mxCustomProperties,
      myCustomProperties,
      mtCustomProperties,
      mrCustomProperties,
      mbCustomProperties,
      mlCustomProperties,
    ),
  ] as const;
}
