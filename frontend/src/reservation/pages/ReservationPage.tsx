import { useEffect, useState } from 'react';
import { apiFetch, SessionExpiredError } from '../../common/api/apiFetch';
import './ReservationPage.css';

type Event = { eventId: number; eventName: string; location: string };
type Day = { eventDate: string; openTime: string; closeTime: string };
type Detail = Event & { days: Day[] };
type Range = { startTime: string; endTime: string };
type Booth = { boothId: number; boothName: string; positionRow: number; positionCol: number; occupancyId: number | null; userName: string | null; timeTable: { date: string; reservations: Range[] }[] | null };
async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await apiFetch(url, { signal });
  if (!response.ok) throw new Error(`조회 실패 (${response.status})`);
  return response.json();
}
function minutes(value: string) { const time = value.includes('T') ? value.split('T')[1] : value; const [hour, minute] = time.split(':').map(Number); return hour * 60 + minute; }
function label(value: number) { return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`; }

export default function ReservationPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState('');
  const [detail, setDetail] = useState<Detail | null>(null);
  const [date, setDate] = useState('');
  const [booths, setBooths] = useState<Booth[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [duration, setDuration] = useState(30);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('행사 목록을 불러오는 중입니다.');
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    getJson<Event[]>('/api/events', controller.signal).then(data => { setEvents(data); setEventId(data.length ? String(data[0].eventId) : ''); setLoading(''); })
      .catch(e => { if (!controller.signal.aborted && !(e instanceof SessionExpiredError)) { setError('행사 목록을 불러오지 못했습니다.'); setLoading(''); } });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!eventId) return;
    const controller = new AbortController();
    getJson<Detail>(`/api/events/${encodeURIComponent(eventId)}`, controller.signal).then(data => { setDetail(data); setDate(data.days[0]?.eventDate ?? ''); setLoading(''); })
      .catch(e => { if (!controller.signal.aborted && !(e instanceof SessionExpiredError)) { setError('행사 정보를 불러오지 못했습니다.'); setLoading(''); } });
    return () => controller.abort();
  }, [eventId]);
  useEffect(() => {
    if (!eventId || !date) return;
    const controller = new AbortController();
    getJson<Booth[]>(`/api/events/${encodeURIComponent(eventId)}/booths?date=${encodeURIComponent(date)}`, controller.signal).then(data => { setBooths(data); setLoading(''); })
      .catch(e => { if (!controller.signal.aborted && !(e instanceof SessionExpiredError)) { setError('부스 정보를 불러오지 못했습니다.'); setLoading(''); } });
    return () => controller.abort();
  }, [eventId, date]);
  const day = detail?.days.find(item => item.eventDate === date);
  const selected = booths.find(booth => booth.boothId === selectedId);
  const reservations = selected?.timeTable?.find(item => item.date === date)?.reservations;
  const opening = day ? minutes(day.openTime) : 0, closing = day ? minutes(day.closeTime) : 0;
  const starts = day ? Array.from({ length: Math.max(0, Math.ceil((closing - Math.ceil(opening / 30) * 30) / 30)) }, (_, i) => Math.ceil(opening / 30) * 30 + i * 30).filter(start => start + duration <= closing) : [];
  const columns = Math.max(1, ...booths.map(booth => booth.positionCol));
  const rows = Math.max(1, ...booths.map(booth => booth.positionRow));
  function changeEvent(value: string) { setEventId(value); setDetail(null); setDate(''); setBooths([]); setSelectedId(null); setError(''); setLoading(value ? '행사 정보를 불러오는 중입니다.' : ''); }
  function changeDate(value: string) { setDate(value); setBooths([]); setSelectedId(null); setError(''); setLoading(value ? '부스를 불러오는 중입니다.' : ''); }
  return <main className="rv-page">
    <header className="rv-heading"><div><h1>부스 예약</h1><p>행사와 날짜를 선택한 후 부스별 촬영 시간을 확인하세요.</p></div></header>
    <section className="rv-panel rv-filters" aria-label="행사 선택">
      <label>행사 <select value={eventId} onChange={e => changeEvent(e.target.value)}>{events.length === 0 && <option value="">등록된 행사가 없습니다</option>}{events.map(event => <option key={event.eventId} value={event.eventId}>{event.eventName} · {event.location}</option>)}</select></label>
      <label>날짜 <select value={date} onChange={e => changeDate(e.target.value)} disabled={!detail?.days.length}>{!detail?.days.length && <option value="">운영일 없음</option>}{detail?.days.map(item => <option key={item.eventDate} value={item.eventDate}>{item.eventDate}</option>)}</select></label>
    </section>
    {error && <p className="rv-error" role="alert">{error} <button type="button" onClick={() => window.location.reload()}>다시 시도</button></p>}
    {loading && <p role="status" className="rv-help">{loading}</p>}
    {!loading && !error && detail && !detail.days.length && <p className="rv-help">이 행사에는 등록된 운영일이 없습니다.</p>}
    {!loading && !error && date && <div className="rv-workspace">
      <section className="rv-panel" aria-labelledby="rv-map-title"><div className="rv-panel-top"><h2 id="rv-map-title">부스 선택</h2><span className="rv-help">{date} · {day?.openTime.slice(0, 5)}~{day?.closeTime.slice(0, 5)}</span></div><p className="rv-help">부스를 누르면 시간표가 펼쳐집니다.</p>
        {booths.length === 0 ? <p className="rv-help">등록된 부스가 없습니다.</p> : <div className="rv-grid-scroll"><div className="rv-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(80px, 1fr))`, gridTemplateRows: `repeat(${rows}, auto)` }} aria-label="부스 배치">{booths.map(booth => <button key={booth.boothId} type="button" style={{ gridRow: booth.positionRow, gridColumn: booth.positionCol }} className={`rv-booth ${booth.occupancyId != null ? 'occupied' : 'empty'} ${selectedId === booth.boothId ? 'selected' : ''}`} aria-pressed={selectedId === booth.boothId} onClick={() => setSelectedId(previous => previous === booth.boothId ? null : booth.boothId)}><strong>{booth.boothName}</strong><small>{booth.occupancyId != null ? `${booth.userName ?? '사진사'}${booth.userName ? ' 작가' : ''}` : '미점유'}</small></button>)}</div></div>}
        <div className="rv-legend"><span><i className="occupied" />사진사 있음</span><span><i className="empty" />미점유</span><span><i className="selected" />선택</span></div>
      </section>
      <section className="rv-panel rv-summary" aria-labelledby="rv-summary-title"><h2 id="rv-summary-title">부스 시간표</h2>
        {!selected ? <p className="rv-help">부스를 선택해주세요.</p> : <><div className="rv-info"><span>{selected.boothName}</span><div><strong>{selected.occupancyId == null ? '사진사 미점유' : `${selected.userName ?? '사진사'}${selected.userName ? ' 작가' : ''}`}</strong><p>{date}</p></div></div>
          {selected.occupancyId == null ? <p className="rv-help">사진사가 아직 점유하지 않은 부스입니다.</p> : reservations == null ? <p className="rv-help">이 부스의 시간표 정보를 받지 못했습니다.</p> : <><div className="rv-duration" aria-label="촬영 길이"><span>촬영 길이</span>{[30, 60].map(value => <button type="button" key={value} aria-pressed={duration === value} onClick={() => setDuration(value)}>{value}분</button>)}</div><p className="rv-fine">이 부스의 예약만 확인한 결과입니다. 본인의 다른 예약과 승인 상태는 확인하지 않았습니다.</p><div className="rv-times">{starts.map(start => {
            const occupied = reservations.some(r => minutes(r.startTime) < start + duration && minutes(r.endTime) > start);
            const past = new Date(`${date}T${label(start)}:00`).getTime() <= now;
            return <div key={start} className={`rv-time-item ${occupied || past ? 'unavailable' : ''}`}><strong>{label(start)}–{label(start + duration)}</strong><small>{past ? '지난 시간' : occupied ? '예약됨' : '빈 시간'}</small></div>;
          })}</div>{starts.length === 0 && <p className="rv-help">운영 시간 안에 선택할 수 있는 촬영 시간이 없습니다.</p>}<p className="rv-fine">촬영 신청 기능은 준비 중이며, 예약 가능 여부는 신청 시 서버에서 다시 확인해야 합니다.</p></>}
        </>}
      </section>
    </div>}
  </main>;
}
