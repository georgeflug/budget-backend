import { saveLatestTransactionsToDb } from './index'
import * as scheduler from './schedule'
import moment from 'moment'

jest.mock('./index')

describe('Schedule', () => {
  const MILLIS_PER_HOUR = 1000 * 60 * 60

  beforeEach(() => {
    jest.resetAllMocks()
    jest.useFakeTimers()
  })

  it('sets the initial run at 6:00 pm today when started before 6:00 pm', async () => {
    const jan1Before6 = moment().dayOfYear(1).hour(17).minute(0).second(0).millisecond(0)

    scheduler.startScheduler(() => jan1Before6.clone())

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledWith(expect.anything(), MILLIS_PER_HOUR)
  })

  it('sets the initial run at 6:00 pm tomorrow when started after 6:00 pm', async () => {
    const jan1After6 = moment().dayOfYear(1).hour(19).minute(0).second(0).millisecond(0)

    scheduler.startScheduler(() => jan1After6.clone())

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledWith(expect.anything(), MILLIS_PER_HOUR * 23)
  })

  it('downloads the transactions when the scheduler runs', async () => {
    const jan1Before6 = moment().dayOfYear(1).hour(17).minute(0).second(0).millisecond(0)

    scheduler.startScheduler(() => jan1Before6.clone())
    expect(saveLatestTransactionsToDb).not.toHaveBeenCalled()

    await jest.advanceTimersByTime(MILLIS_PER_HOUR)
    expect(saveLatestTransactionsToDb).toHaveBeenCalled()
  })

  it('sets the second run at 6:00 pm tomorrow', async () => {
    const jan1Before6 = moment().dayOfYear(1).hour(17).minute(0).second(0).millisecond(0)

    scheduler.startScheduler(() => jan1Before6.clone())
    await jest.advanceTimersByTime(MILLIS_PER_HOUR)

    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.anything(), MILLIS_PER_HOUR * 25)
  })
})
