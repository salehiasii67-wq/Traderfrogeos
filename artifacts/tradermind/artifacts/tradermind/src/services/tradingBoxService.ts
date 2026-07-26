import { db, TradingBox } from '../db/database';

function uuid(): string {
  return crypto.randomUUID();
}

export const tradingBoxService = {
  async getAll(): Promise<TradingBox[]> {
    return db.tradingBoxes.orderBy('createdAt').reverse().toArray();
  },

  async getById(id: string): Promise<TradingBox | undefined> {
    return db.tradingBoxes.get(id);
  },

  async create(data: Omit<TradingBox, 'id' | 'createdAt' | 'updatedAt'>): Promise<TradingBox> {
    const now = Date.now();
    const box: TradingBox = {
      id: uuid(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    await db.tradingBoxes.add(box);
    return box;
  },

  async update(id: string, data: Partial<Omit<TradingBox, 'id' | 'createdAt'>>): Promise<void> {
    await db.tradingBoxes.update(id, { ...data, updatedAt: Date.now() });
  },

  async delete(id: string): Promise<void> {
    await db.tradingBoxes.delete(id);
  },

  /** تعداد معاملات یک باکس */
  async getTradeCount(boxId: string): Promise<number> {
    return db.trades.where('boxId').equals(boxId).count();
  },
};
