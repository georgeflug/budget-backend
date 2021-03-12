import { resolve } from 'path'
import { FileLister } from './file-lister'
import { ensureDir, remove, writeFile } from 'fs-extra'

const testPath = 'tmp/file-lister-test'

describe('File Lister', () => {
  let fileLister: FileLister

  beforeEach(async () => {
    await remove(testPath)
    await ensureDir(testPath)
    fileLister = createFileLister()
  })

  afterEach(async () => {
    await fileLister.shutdown()
    await remove(testPath)
  })

  it('should list nothing when no files exist', async () => {
    // no arrange

    const files = await fileLister.listFiles()

    expect(files).toEqual([])
  })

  it('should list existing file', async () => {
    await createFile('test-file.json')

    const files = await fileLister.listFiles()

    expect(files).toEqual(['test-file.json'])
  })

  it('should list file that was created after cache was initialized', async () => {
    await createFile('test-file.json')
    await fileLister.listFiles()
    await createFile('test-file-2.json')
    await new Promise(res => setTimeout(res, 500))

    const files = await fileLister.listFiles()

    expect(files).toEqual(['test-file.json', 'test-file-2.json'])
  })

  it('should remove file that was deleted after cache was initialized', async () => {
    await createFile('test-file.json')
    await fileLister.listFiles()
    await remove(resolve(testPath, 'test-file.json'))
    await new Promise(res => setTimeout(res, 500))

    const files = await fileLister.listFiles()

    expect(files).toEqual([])
  })

  it('should list existing file and new file when new file appears before list is queried for the first time', async () => {
    await createFile('test-file-1.json')
    const newFileLister = createFileLister()
    try {
      await createFile('test-file-2.json')
      await new Promise(res => setTimeout(res, 500))

      const files = await newFileLister.listFiles()

      expect(files).toEqual(['test-file-1.json', 'test-file-2.json'])
    } finally {
      await newFileLister.shutdown()
    }
  })
})

function createFileLister(): FileLister {
  return new FileLister(testPath)
}

async function createFile(fileName: string) {
  await writeFile(resolve(testPath, fileName), 'contentsDoNotMatter')
}
