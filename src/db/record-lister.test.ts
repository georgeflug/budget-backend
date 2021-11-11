import { RecordLister } from './record-lister'
import { FileLister } from './file-lister'
import { JsonFileName } from './json-filename'

describe('Record Lister', () => {
  let recordLister: RecordLister
  let fileLister: FileLister
  let listFiles: jest.Mock

  beforeEach(async () => {
    listFiles = jest.fn()
    fileLister = ({ listFiles } as Partial<FileLister>) as FileLister
    recordLister = new RecordLister('doesNotMatter', fileLister)
  })

  it('should return single record', async () => {
    listFiles.mockReturnValue([JsonFileName.getFileName(1, 1)])

    const result = await recordLister.listLatestRecords()

    expect(result).toEqual([{ recordId: 1, version: 1 }])
  })

  it('should return multiple records', async () => {
    listFiles.mockReturnValue([JsonFileName.getFileName(1, 1), JsonFileName.getFileName(2, 1)])

    const result = await recordLister.listLatestRecords()

    expect(result).toEqual([
      { recordId: 1, version: 1 },
      { recordId: 2, version: 1 },
    ])
  })

  it('should return latest version of record with multiple versions', async () => {
    listFiles.mockReturnValue([
      JsonFileName.getFileName(1, 1),
      JsonFileName.getFileName(2, 1),
      JsonFileName.getFileName(1, 2),
    ])

    const result = await recordLister.listLatestRecords()

    expect(result).toEqual([
      { recordId: 1, version: 2 },
      { recordId: 2, version: 1 },
    ])
  })

  it('should return latest version of record with multiple versions when latest version appears first', async () => {
    listFiles.mockReturnValue([
      JsonFileName.getFileName(1, 2),
      JsonFileName.getFileName(2, 1),
      JsonFileName.getFileName(1, 1),
    ])

    const result = await recordLister.listLatestRecords()

    expect(result).toEqual([
      { recordId: 1, version: 2 },
      { recordId: 2, version: 1 },
    ])
  })

  it('should ignore nextRecord file', async () => {
    listFiles.mockReturnValue([JsonFileName.getFileName(1, 2), 'nextRecord.txt'])

    const result = await recordLister.listLatestRecords()

    expect(result).toEqual([{ recordId: 1, version: 2 }])
  })
})
