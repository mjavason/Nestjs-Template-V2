import configuration from '@configs/configuration';
import axios from 'axios';

export async function pingSelf() {
  try {
    await axios.get(<string>`${configuration().BASE_URL}`);
    console.log('Ping successful');
  } catch (e: unknown) {
    if (e instanceof Error) console.log('Ping failed:', e.message);
  }
}

setInterval(pingSelf, 600000); //10 minutes
