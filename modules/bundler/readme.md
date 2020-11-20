# One Atom Bundler

## Development server
```TypeScript
import { Run } from 'one-atom/run';

Run.development({
  hmr: true,
  root: process.cwd(),
});
```

## Production build
```TypeScript
import { Run } from 'one-atom/run';

Run.production({
  root: process.cwd(),
})
  .then(() => {
    console.log('completed');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
