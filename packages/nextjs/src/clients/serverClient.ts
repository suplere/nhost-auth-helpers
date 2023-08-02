import { NhostClient, NhostClientConstructorParams, NhostSession } from "@nhost/nhost-js"
import { StateFrom } from 'xstate'
import { waitFor } from 'xstate/lib/waitFor'

export async function createServerNhostClient(
	params: NhostClientConstructorParams,
  initSession?: NhostSession
): Promise<NhostClient>  {
	let clientParams: NhostClientConstructorParams = {
		...params
	}

	const nhost = new NhostClient({
    ...clientParams,
  })

  if (initSession) {
		nhost.auth.client.start({ initialSession: initSession });

		await waitFor(
			nhost.auth.client.interpreter!,
			(state: StateFrom<any>) => !state.hasTag('loading')
		);
	}

  return nhost

}