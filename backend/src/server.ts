import app from './app';
import { config } from './config/env';

const PORT = config.port;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Environment: ${config.env}`);
});
