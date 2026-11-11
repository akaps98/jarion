import { useState } from 'react';
import { booths, hours, time, localDate } from '../demoData';
import { useEffect } from 'react';
import type { Booking, Status } from '../demoData';
import './ReservationPage.css';

const labels: Record<Status, string> = { PENDING: '승인 대기', ACCEPTED: '예약 확정', REJECTED: '거절됨' };

// 실제 API 연결 전 체험 화면. 변경 사항은 메모리에만 보관한다.
export default function ReservationPage() {
  const [today] = useState(() => localDate(new Date()));
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const [date, setDate] = useState(today);
  const [mode, setMode] = useState<'USER' | 'PHOTO'>('USER');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');
  const selected = booths.find(b => b.id === selectedId);
  const photographer = (id: number) => owned[date] === id ? '나의 데모 부스' : booths.find(b => b.id === id)?.photographer;
  const active = bookings.filter(b => b.date === date && b.status !== 'REJECTED');
  // 데모 신청자는 한 명이다. 다른 부스라도 같은 시간에는 신청할 수 없다.
  const blocked = (h: number) => new Date(`${date}T${time(h)}:00`).getTime() <= now || active.some(b => b.hour === h);
  const canSubmit = !!selected && (mode === 'PHOTO'
    ? !photographer(selected.id) && !owned[date]
    : !!photographer(selected.id) && hour !== null && !blocked(hour));
  const list = bookings.filter(b => b.date === date && (mode === 'USER' || b.booth === owned[date]));
  function reset() { setSelectedId(null); setHour(null); setMessage(''); }
  function submit() {
    if (!canSubmit || !selected) return;
    if (mode === 'PHOTO') {
      setOwned(prev => ({ ...prev, [date]: selected.id }));
      setMessage(`${selected.name} 부스를 데모로 점유했어요. 코스어 체험에서 신청 후 수락·거절을 체험할 수 있어요.`);
    } else if (hour !== null) {
      setBookings(prev => [...prev, { id: Date.now(), date, booth: selected.id, hour, status: 'PENDING' }]);
      setHour(null);
      setMessage('데모 신청을 추가했어요. 승인 대기 중에도 시간은 선점돼요.');
    }
  }
  function review(id: number, status: Status) {
    setBookings(prev => prev.map(b => b.id === id && b.booth === owned[date] && b.status === 'PENDING' ? { ...b, status } : b));
    setMessage(status === 'ACCEPTED' ? '데모 신청을 수락했어요.' : '데모 신청을 거절하고 시간을 반환했어요.');
  }
  return <div className="rv-page">
    <div className="rv-notice"><strong>인터랙티브 데모</strong> 예시 부스와 사진사입니다. 실제 저장되지 않으며 새로고침하면 초기화됩니다.</div>
    <header className="rv-heading"><div><p className="rv-eyebrow">FIND YOUR SPOT</p><h1>설레는 촬영, 여기서 시작해요<span>.</span></h1><p>마음에 드는 부스와 사진사를 만나 나만의 순간을 남겨보세요.</p></div><span className="rv-brand">JARION RESERVATION</span></header>
    <div className="rv-mode" aria-label="데모 역할 선택">{(['USER', 'PHOTO'] as const).map(role => <button key={role} aria-pressed={mode === role} onClick={() => { setMode(role); reset(); }}>{role === 'USER' ? '코스어 예약 체험' : '사진사 점유·관리 체험'}</button>)}</div>
    <div className="rv-workspace">
      <section className="rv-panel" aria-labelledby="rv-map-title">
        <div className="rv-panel-top"><div><span className="rv-step">STEP 01</span><h2 id="rv-map-title">날짜와 부스 선택</h2></div><label className="rv-date">촬영 날짜<input type="date" min={today} value={date} onChange={e => { if (e.target.value && e.target.value >= today) { setDate(e.target.value); reset(); } }} /></label></div>
        <p className="rv-help">{mode === 'PHOTO' ? '하루에 한 개의 빈 부스를 점유할 수 있어요.' : '사진사가 있는 부스를 선택해 촬영 시간을 확인하세요.'}</p>
        <div className="rv-entrance">ENTRANCE · 입구</div>
        <div className="rv-grid" aria-label="4행 4열 예시 부스 배치">{booths.map(b => {
          const owner = photographer(b.id);
          const disabled = mode === 'USER' ? !owner : !!owner || !!owned[date];
          return <button key={b.id} disabled={disabled} aria-pressed={selectedId === b.id} aria-label={`${b.name}, ${owner || '미점유'}, ${disabled ? '선택 불가' : '선택 가능'}`} className={`rv-booth ${owner ? 'occupied' : 'empty'} ${selectedId === b.id ? 'selected' : ''} ${owned[date] === b.id ? 'mine' : ''}`} onClick={() => { setSelectedId(b.id); setHour(null); setMessage(''); }}><span aria-hidden="true">▣</span><strong>{b.name}</strong><small>{owned[date] === b.id ? '내 부스' : owner ? `${owner} 작가` : '미점유'}</small></button>;
        })}</div>
        <div className="rv-legend"><span><i className="occupied" />사진사 있음</span><span><i className="empty" />미점유</span><span><i className="selected" />선택한 부스</span></div><p className="rv-caption">4 × 4 예시 배치 · 실제 행사장 배치와는 다를 수 있어요.</p>
      </section>
      <aside className="rv-panel rv-summary" aria-labelledby="rv-summary-title"><span className="rv-step">STEP 02</span><h2 id="rv-summary-title">{mode === 'PHOTO' ? '하루 점유 확인' : '촬영 시간 선택'}</h2>
        {!selected ? <div className="rv-placeholder"><span aria-hidden="true">▦</span><h3>어떤 자리에서 만날까요?</h3><p>{mode === 'PHOTO' ? '배치도에서 빈 부스를 선택해주세요.' : '사진사가 있는 부스를 선택해주세요.'}</p></div> : <>
          <div className="rv-info"><span>{selected.name}</span><div><strong>{mode === 'PHOTO' ? '하루 동안 나의 촬영 공간' : `${photographer(selected.id)} 작가`}</strong><p>{selected.concept}</p></div></div>
          <dl className="rv-details"><div><dt>촬영 날짜</dt><dd>{date}</dd></div><div><dt>이용 단위</dt><dd>{mode === 'PHOTO' ? '하루' : '1시간'}</dd></div></dl>
          {mode === 'USER' && <><h3 className="rv-slot-title">촬영 시작 시간</h3><div className="rv-times">{hours.map(h => <button key={h} disabled={blocked(h)} aria-pressed={hour === h} onClick={() => setHour(h)}>{time(h)}<small>{blocked(h) ? '선택 불가' : '예약 가능'}</small></button>)}</div><p className="rv-fine">신청 즉시 시간이 선점되고, 사진사 수락 후 예약이 확정돼요.</p></>}
          <div className="rv-choice"><span>{mode === 'PHOTO' ? '선택한 부스' : '선택한 시간'}</span><strong>{mode === 'PHOTO' ? selected.name : hour !== null ? `${time(hour)} – ${time(hour + 1)}` : '시간을 선택해주세요'}</strong></div>
        </>}
        <button className="rv-submit" disabled={!canSubmit} onClick={submit}>{mode === 'PHOTO' ? '데모 부스 점유하기' : '데모 촬영 신청하기'}<span aria-hidden="true">↗</span></button><p className="rv-fine">이 체험은 실제 예약에 영향을 주지 않아요.</p>
      </aside>
    </div>
    <p className="rv-feedback" role="status">{message}</p>
    <section className="rv-panel" aria-labelledby="rv-bookings-title"><div className="rv-panel-top"><div><span className="rv-step">MY RESERVATIONS</span><h2 id="rv-bookings-title">{mode === 'PHOTO' ? '내 부스 신청 관리' : '나의 데모 신청'}</h2></div><span className="rv-help">{date}</span></div>
      {list.length === 0 ? <p className="rv-empty-message">{mode === 'PHOTO' ? owned[date] ? '코스어 예약 체험으로 전환해 내 부스에 신청하면 여기서 수락·거절할 수 있어요.' : '먼저 빈 부스를 점유해주세요.' : '아직 신청이 없어요. 부스와 시간을 선택해보세요.'}</p> : <ul className="rv-bookings">{list.map(b => <li key={b.id}><div><strong>{booths.find(booth => booth.id === b.booth)?.name} 부스</strong><p>{time(b.hour)} – {time(b.hour + 1)} · 데모 코스어</p></div><span className={`rv-status ${b.status}`}>{labels[b.status]}</span>{mode === 'PHOTO' && b.status === 'PENDING' && <div className="rv-actions"><button onClick={() => review(b.id, 'REJECTED')}>거절</button><button onClick={() => review(b.id, 'ACCEPTED')}>수락</button></div>}</li>)}</ul>}
    </section>
  </div>;
}
