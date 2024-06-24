import nconf from 'nconf';
import path from 'path';
import fs from 'fs';
import recursive from 'recursive-readdir';
import 'colors';

import config from './config';

nconf.argv().env();

const dirs = nconf.get('dir');
const verbose = nconf.get('verbose');

if (dirs.length !== 2) {
  console.error('two paths required as arguments');
} else {
  console.log('--'.repeat(30));
  console.log('directories:'.magenta, dirs);
  console.log('--'.repeat(30));

  const [dir1, dir2] = dirs;

  if (fs.existsSync(dir1) && fs.existsSync(dir2)) {
    const regex = /[_\- ]/;

    const splitAll = (str: string) =>
      str
        .split(regex)
        .map(x => x.trim())
        .filter(x => !!x);

    recursive(dir2, [], (_, files2) => {
      const splitsDir2 = files2.map(x => ({
        file: path.basename(x),
        splits: splitAll(path.parse(x).name),
      }));

      recursive(dir1, [], (_, files) => {
        for (const file of files) {
          const fileName = path.parse(file).name;
          if (verbose) {
            console.log(fileName);
          }

          const splitsDir1 = splitAll(fileName);

          splitsDir2.forEach(({ file, splits }) => {
            const intersections = splits
              .filter(m => splitsDir1.includes(m))
              .filter(x => !config.excludeNameParts.find(y => y.toLowerCase() === x.toLowerCase()))
              .filter(x => x.length > 1);

            if (intersections.length > 2) {
              let source = fileName;
              intersections.forEach(i => {
                source = source.replace(i, i.yellow);
              });

              console.log('file ', source);

              let found = file;
              intersections.forEach(i => {
                found = found.replace(i, i.yellow);
              });

              console.log('match'.green, found);

              console.log();
              console.log();
            }
          });
        }
      });
    });
  } else {
    console.error('some paths not exits');
  }
}
