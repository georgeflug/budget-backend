import { mkdirSync, remove, writeFile } from 'fs-extra'
import { FileCache } from './file-cache'
import { resolve } from 'path'

const testPath = 'tmp/file-cache-tests'

describe('File Cache', () => {
  let fileCache: FileCache

  beforeEach(async () => {
    await remove(testPath)
    mkdirSync(testPath)
    fileCache = new FileCache()
  })

  afterEach(async () => {
    await remove(testPath)
  })

  it('should get file contents', async () => {
    const path = resolve(testPath, 'test-file.txt')
    await writeFile(path, 'test-data')

    const result = await fileCache.readFile(path)

    expect(result).toEqual('test-data')
  })

  it('should cache file contents', async () => {
    const path = resolve(testPath, 'test-file.txt')
    await writeFile(path, 'test-data')
    await fileCache.readFile(path)
    await remove(testPath)

    const cachedResult = await fileCache.readFile(path)

    expect(cachedResult).toEqual('test-data')
  })

  it('should blow up if file does not exist', async () => {
    const path = resolve(testPath, 'test-file.txt')

    const promise = fileCache.readFile(path)

    await expect(promise).rejects.toEqual(expect.anything())
  })

  it('should not cache a file if it does not exist', async () => {
    const path = resolve(testPath, 'test-file.txt')
    try {
      await fileCache.readFile(path)
    } catch (e) {
      // ignore
    }
    await writeFile(path, 'test-data')

    const result = await fileCache.readFile(path)

    expect(result).toEqual('test-data')
  })
})
