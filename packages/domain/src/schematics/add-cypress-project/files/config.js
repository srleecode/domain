import { configure, addDecorator } from '';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);
configure(
  [
    require.context('../feature', true, /\.stories\.js$/),
    require.context('../ui', true, /\.stories\.js$/),
  ],
  module
);
