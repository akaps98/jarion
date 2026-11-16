export type Status = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type Booking = { id: number; date: string; booth: number; hour: number; status: Status };
export const booths = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1, name: `${'ABCD'[Math.floor(i / 4)]}${i % 4 + 1}`,
  photographer: i % 3 === 0 ? null : ['빛결', '모노', '유월', '온유'][i % 4],
  concept: ['자연광 · 인물', '컬러 조명 · 판타지', '화이트 · 캐릭터', '무드 · 시네마틱'][i % 4],
}));
export const hours = Array.from({ length: 9 }, (_, i) => i + 10);
export const time = (h: number) => `${String(h).padStart(2, '0')}:00`;
export function localDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
