import EventEmitter from "events"

export default class EmojiDB extends EventEmitter{
  private _db: Map<number, string>
  private _waitForInsertionItem: string
  private _inserted: number

  constructor(params: { [key: string | number]: string } ) {
    super()
    this._db = new Map()
    Object.keys(params).forEach(key => {
      this._db.set(+key, params[+key])
    })
    this._waitForInsertionItem = ''
    this._inserted = 0
  }

  query(str: string) : string {
    const emoji = str[0]
    const query = str.slice(1)
    switch (emoji) {
      case '💉':
        return this.insert(query.slice(1))

      case '🍆':
        const id = +query.slice(1)
        if (isNaN(id)) throw new Error('🌵invalid query')
        return this.findById(id)
    
      case '📖':
        const range = query.split('-')
        if (range.length !== 2) throw new Error('🌵invalid query')

        const from = +range[0]
        const to = + range[1]
        if (isNaN(from) || isNaN(to) || from >= to || from <= 0) throw new Error('🌵invalid query')

        return this.findByRange(from, to)

      default:
        throw new Error('🌵invalid query')
    }
  }

  insert(value: string): string {
    const id = this._db.size + 1
    this._db.set(id, value)
    this.emit('insert', JSON.stringify(Object.fromEntries(this._db)))
    return id + ''
  }

  bulkInsert(data: string) {
    const items = data.split('💩')
    if (items.length === 0)  {
      this._waitForInsertionItem += items[0]
      return
    }
    for (let i = 0; i < items.length - 1; i++) {
      if (i === 0) {
        const id = this._db.size + 1
        this._db.set(id, this._waitForInsertionItem + items[i])
      } else {
        const id = this._db.size + 1
        this._db.set(id, items[i])
      }
      this._inserted++
    }
    this._waitForInsertionItem = items[items.length - 1]
  }

  endBulk(): string {
    this.insert(this._waitForInsertionItem)
    const result = ++this._inserted
    this._inserted = 0
    this.emit('insert', JSON.stringify(Object.fromEntries(this._db)))
    //fs.writeFile('emoji.db', JSON.stringify(Object.fromEntries(this)))
    return result + ''
  }

  findById(id: number) {
    return this._db.get(id) || ''
  }

  findByRange(from: number, to: number) {
    const result = []
    for (let i = from; i <= to; i++) {
      const item = this._db.get(i)
      if (item) result.push(`${i}💲${item}`)
    }
    return result.join('\r\n')
  }
}