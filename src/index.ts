import { app } from './app';
import { runDB } from './repositories/db';

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await runDB();
  console.log(`Example app listening on port ${port}`);
});
