import moment, {Moment} from 'moment'
import { saveLatestTransactionsToDb } from './index'
import { debug, error } from '../log'

const TIME_OF_DAY_TO_RUN_IT = 18

export function startScheduler(getCurrentMoment: () => Moment = moment): void {
  const today = getCurrentMoment()
  if (today.hour() < TIME_OF_DAY_TO_RUN_IT) {
    scheduleNextExecution(today)
  } else {
    const tomorrow = today.add(1, 'days')
    scheduleNextExecution(tomorrow)
  }

  function scheduleNextExecution(day) {
    const scheduledTime = day.hour(TIME_OF_DAY_TO_RUN_IT).minute(0).second(0)
    const millisFromNow = scheduledTime.diff(getCurrentMoment())

    setTimeout(async function () {
      scheduleNextExecution(day.add(1, 'days'))
      debug('SCHEDULER', 'Beginning scheduled download')
      try {
        await saveLatestTransactionsToDb()
        debug('SCHEDULER', 'Finished scheduled download')
      } catch (ex) {
        error('SCHEDULER', 'Failed to download transactions', ex)
      }
    }, millisFromNow)
  }
}
