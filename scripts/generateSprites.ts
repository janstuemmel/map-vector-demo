import {generateSprite} from '@unvt/sprite-one';

generateSprite('./public/spites', ['./icons'], [1]).then(() =>
  console.log('Generated sprites'),
);
