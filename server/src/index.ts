import "dotenv/config";
import app from "./app";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
