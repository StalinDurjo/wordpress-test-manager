import { LocalState } from '../../support/LocalState';

export const saveLocalTestUrl = async (data: { name: string; url: string }) => {
  await LocalState.set(data.name, data.url);
};
