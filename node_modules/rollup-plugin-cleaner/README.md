# rollup-plugin-cleaner

:wastebasket: A rollup plugin to clean directories before rebuilding.

## Installation

### npm

`npm install rollup-plugin-cleaner --save-dev`

### yarn

`yarn add rollup-plugin-cleaner --dev`

## Usage

### Options

| Option    | Type      | Description                                                 | Default |
| --------- | --------- | ----------------------------------------------------------- | ------- |
| `targets` | `Array`   | List of directories which should be cleaned on every build. | `[]`    |
| `silent`  | `Boolean` | Flag to disable logging output to console.                  | `false` |

### Example

To remove the `build` directory on every build add the following to `rollup.config.js`:

```JavaScript
import cleaner from 'rollup-plugin-cleaner';

export default {
  entry: './src/index.js',
  output: {
    dest: './build/bundle.js',
  },
  plugins: [
    cleaner({
      targets: [
        './build/'
      ]
    })
  ]
};
```

## License

MIT
