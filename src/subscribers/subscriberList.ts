// import SubscriberType from '@/constant/SubscriberType';
import SubscriberType from '../constants/SubscriberType';
import { saveLocalTestUrl } from '../services/state-manager/stateManager';
import { subscriber } from './subscriber';

export const registerSubscribers = () => {
  subscriber.subscribe(SubscriberType.SAVE_LOCAL_TEST_URL, saveLocalTestUrl);
};
