import configuration from '@configs/configuration';
import { Logger } from '@nestjs/common';
import axios from 'axios';

export async function pingSelf() {
  try {
    await axios.get(<string>`${configuration().BASE_URL}`);
    Logger.log('Server pinged successfully');
  } catch (e: unknown) {
    if (e instanceof Error) Logger.log(`Ping failed: ${e.message}`);
  }
}

setInterval(pingSelf, 600000); //10 minutes
