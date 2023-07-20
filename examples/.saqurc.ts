
import { defineConfig } from 'saqu';

export default () => defineConfig({
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ['@saqu/loader-md-react-preview'],
        type: 'typescript',
      },
    ],
  },
});
