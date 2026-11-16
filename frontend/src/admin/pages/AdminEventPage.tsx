import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, SessionExpiredError } from '../../common/api/apiFetch';
import './AdminEventPage.css';

type EventSummary = { eventId: number; eventName: string; location: string };

export default function AdminEventPage() {
  const [access, setAccess] = useState<'loading' | 'allowed' | 'denied' | 'error'>('loading');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rows, setRows] = useState('4');
  const [cols, setCols] = useState('4');
  const submitting = useRef(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openTime, setOpenTime] = useState('10:00');
  const [closeTime, setCloseTime] = useState('18:00');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [listError, setListError] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const count = Number(rows) * Number(cols);
  // UTC 날짜로 계산해 시간대와 일광 절약 시간에 따른 하루 길이 차이를 피한다.
  const startDay = Date.parse(`${startDate}T00:00:00Z`);
  const endDay = Date.parse(`${endDate}T00:00:00Z`);
  const dayCount = Number.isFinite(startDay) && Number.isFinite(endDay) && endDay >= startDay
    ? Math.round((endDay - startDay) / 86_400_000) + 1 : 0;

  async function loadEvents() {
    setListLoading(true);
    setListError('');
    try {
      const response = await apiFetch('/api/events');
      if (!response.ok) throw new Error('행사 목록을 불러오지 못했습니다.');
      setEvents(await response.json());
    } catch (e) {
      if (!(e instanceof SessionExpiredError)) setListError(e instanceof Error ? e.message : '목록 조회 실패');
    } finally { setListLoading(false); }
  }

  useEffect(() => {
    const controller = new AbortController();
    async function check() {
      try {
        const response = await apiFetch('/api/auth/session', { signal: controller.signal });
        if (!response.ok) throw new Error('세션 확인 실패');
        const user = await response.json();
        if (!controller.signal.aborted) {
          setAccess(user.userRole === 'ADMIN' ? 'allowed' : 'denied');
          if (user.userRole === 'ADMIN') await loadEvents();
        }
      } catch (e) {
        if (!controller.signal.aborted && !(e instanceof SessionExpiredError)) setAccess('error');
      }
    }
    void check();
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    const rowCount = Number(rows), colCount = Number(cols);
    if (!name.trim() || !location.trim()) { setError('행사 이름과 장소를 입력해주세요.'); return; }
    if (![rowCount, colCount].every(value => Number.isInteger(value) && value >= 1 && value <= 60) || count > 400) { setError('행·열은 각각 1~60, 총 부스는 400개 이하여야 합니다.'); return; }
    if (!dayCount) { setError('시작일과 종료일을 입력하고, 종료일을 시작일과 같거나 늦게 설정해주세요.'); return; }
    if (!openTime || !closeTime || openTime >= closeTime) { setError('운영 종료 시간은 시작 시간보다 늦어야 합니다.'); return; }
    const days = Array.from({ length: dayCount }, (_, index) => ({
      eventDate: new Date(startDay + index * 86_400_000).toISOString().slice(0, 10),
      openTime: `${openTime}:00`,
      closeTime: `${closeTime}:00`,
    }));
    submitting.current = true;
    setBusy(true);
    setCreatedId(null);
    try {
      const response = await apiFetch('/api/admin/events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName: name.trim(), location: location.trim(), boothRows: rowCount, boothCols: colCount,
          days }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (response.status === 403) { setAccess('denied'); return; }
        throw new Error(response.status >= 500 ? '서버에서 등록을 완료하지 못했습니다. 아래 목록과 서버 로그를 확인한 뒤 재시도해주세요.' : body?.detail || body?.message || '입력값을 확인해주세요.');
      }
      const result = await response.json();
      setCreatedId(result.eventId);
      setName(''); setLocation(''); setStartDate(''); setEndDate('');
      setOpenTime('10:00'); setCloseTime('18:00');
      await loadEvents();
    } catch (e) {
      if (!(e instanceof SessionExpiredError)) setError(e instanceof Error ? e.message : '응답을 확인하지 못했습니다. 목록에서 등록 여부를 확인해주세요.');
    } finally { submitting.current = false; setBusy(false); }
  }

  if (access === 'loading') return <div className="ae-page" role="status">관리자 권한을 확인하고 있어요.</div>;
  if (access === 'denied') return <div className="ae-page"><h1>관리자 전용 페이지입니다.</h1><p>관리자 계정으로 로그인해주세요.</p><Link to="/login">로그인으로 이동</Link></div>;
  if (access === 'error') return <div className="ae-page" role="alert">로그인 정보를 확인하지 못했습니다. 백엔드 실행 상태를 확인한 뒤 페이지를 새로고침해주세요.</div>;
  return <div className="ae-page">
    <header className="ae-heading"><h1>행사 관리</h1><p>행사 등록 및 등록 내역</p></header>
    <form onSubmit={submit} className="ae-layout">
      <div className="ae-sections"><fieldset disabled={busy} className="ae-card"><legend>행사 정보</legend><label>행사 이름<input required maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="예: 자리온 겨울 촬영회" /></label><label>행사 장소<input required maxLength={255} value={location} onChange={e => setLocation(e.target.value)} placeholder="행사장 이름 또는 주소" /></label></fieldset>
      <fieldset disabled={busy} className="ae-card">
        <legend>운영 일정</legend>
        <div className="ae-schedule-row">
          <label>시작일<input required type="date" max={endDate || undefined} value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
          <label>종료일<input required type="date" min={startDate || undefined} value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
        </div>
        <div className="ae-schedule-row">
          <label>운영 시작<input required type="time" step={1800} value={openTime} onChange={e => setOpenTime(e.target.value)} /></label>
          <label>운영 종료<input required type="time" step={1800} value={closeTime} onChange={e => setCloseTime(e.target.value)} /></label>
        </div>
        <p className="ae-muted">시작일부터 종료일까지 매일 같은 시간으로 운영합니다. 하루 행사라면 같은 날짜를 선택해주세요.</p>
      </fieldset>
      <fieldset disabled={busy} className="ae-card"><legend>부스 배치</legend><div className="ae-dimensions"><label>행 수<input required type="number" min={1} max={60} step={1} value={rows} onChange={e => setRows(e.target.value)} /></label><span aria-hidden="true">×</span><label>열 수<input required type="number" min={1} max={60} step={1} value={cols} onChange={e => setCols(e.target.value)} /></label></div><p className="ae-muted">부스 이름은 행-열 형식으로 생성돼요. 총 400개까지 등록할 수 있어요.</p></fieldset></div>
      <div className="ae-summary">
        <div className="ae-registration-total">운영일 <strong>{dayCount}일</strong><span>·</span>부스 <strong>{rows || '0'}행 × {cols || '0'}열 / {Number.isFinite(count) ? count : 0}개</strong></div>
        <div className="ae-submit-row"><p className="ae-save-note">등록 시 행사·운영일·부스가 저장됩니다.</p><button className="ae-primary" disabled={busy || count < 1 || count > 400} type="submit">{busy ? '등록 중…' : '행사 등록'}</button></div>
        <div role="alert" className="ae-error">{error}</div><div role="status" className="ae-success">{createdId !== null && `등록 완료 · 행사 번호 ${createdId}`}</div>
      </div>
    </form>
    <section className="ae-card ae-list"><div className="ae-list-heading"><h2>등록된 행사</h2><button type="button" className="ae-secondary" disabled={listLoading || busy} onClick={() => void loadEvents()}>{listLoading ? '조회 중…' : '새로고침'}</button></div>{listError && <p role="alert" className="ae-error">{listError}</p>}{listLoading ? <p role="status">행사 목록을 불러오고 있어요.</p> : events.length === 0 ? <p className="ae-muted">등록된 행사가 없습니다.</p> : <div className="ae-table-scroll"><table className="ae-event-table"><thead><tr><th scope="col">번호</th><th scope="col">행사명</th><th scope="col">장소</th></tr></thead><tbody>{events.map(item => <tr key={item.eventId}><td>{item.eventId}</td><td>{item.eventName}</td><td>{item.location}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}
