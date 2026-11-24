/* Render the 2025 program from the existing JSON files. */
(() => {
  'use strict';
  // Keep the original conference date and clamp the timer after opening.
  const countdown = document.querySelector('.conference-countdown');
  if (countdown) {
    const start = new Date(countdown.dataset.start).getTime();
    const end = new Date(countdown.dataset.end).getTime();
    function updateCountdown() {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((start - now) / 1000));
      const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
      ['days', 'hours', 'minutes', 'seconds'].forEach((id, index) => {
        countdown.querySelector(`#${id}`).textContent = String(values[index]).padStart(2, '0');
      });
      const status = now < start ? '距离大会开幕' : now <= end ? '大会进行中' : '大会已结束';
      countdown.querySelector('.countdown-status').textContent = status;
      countdown.setAttribute('aria-label', `${status}，${values[0]}天${values[1]}时${values[2]}分${values[3]}秒`);
      return now <= end;
    }
    if (updateCountdown()) {
      const timer = setInterval(() => { if (!updateCountdown()) clearInterval(timer); }, 1000);
    }
  }
  const placeholder = 'assets/img/portrait-placeholder.svg';
  const escapeHTML = (value = '') => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const safeURL = value => {
    if (!value || typeof value !== 'string') return '';
    try {
      const parsed = new URL(value, document.baseURI);
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
    } catch { return ''; }
  };
  const plainText = value => {
    const template = document.createElement('template');
    template.innerHTML = value || '';
    return template.content.textContent.trim();
  };
  function portrait(source, name, size) {
    const url = safeURL(source);
    return `<img src="${escapeHTML(url || placeholder)}" alt="${escapeHTML(name)}${url ? '' : '（照片待补充）'}" width="${size}" height="${size}" loading="lazy" data-portrait>`;
  }
  function renderChair(chair) {
    return `<div class="chair-card">
      <div class="chair-portrait">${portrait(chair.img, chair.name, 76)}</div>
      <div><h4 class="chair-name">${escapeHTML(chair.name)}</h4>
      <p class="chair-affiliation">${escapeHTML(chair.affiliation)}</p>
      ${chair.title ? `<p class="chair-affiliation">${escapeHTML(chair.title)}</p>` : ''}</div>
    </div>`;
  }
  // Legacy files may contain either a URL or an HTML link for talk resources.
  function resourceLink(value, label) {
    if (!value) return '';
    const template = document.createElement('template');
    template.innerHTML = value;
    const link = template.content.querySelector('a[href]');
    const url = safeURL(link ? link.getAttribute('href') : value);
    return url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${label} <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>` : '';
  }
  function renderTalk(talk) {
    const speaker = talk.speaker || {};
    const url = safeURL(speaker.url);
    const photo = portrait(speaker.img, speaker.name, 76);
    const image = url ? `<a class="speaker" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${photo}</a>` : `<div class="speaker">${photo}</div>`;
    const name = url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(speaker.name)}</a>` : escapeHTML(speaker.name);
    const resources = resourceLink(talk.slides, '演讲资料') + resourceLink(talk.recoding, '报告回放');
    const start = talk.time?.[0];
    const end = talk.time?.[1];
    return `<article class="schedule-item">
      <div class="talk-header">
        <div class="talk-person-heading">
          <h4>${name}</h4>
          ${speaker.desc ? `<p class="talk-affiliation">${escapeHTML(speaker.desc)}</p>` : ''}
        </div>
        <div class="talk-meta">
          ${talk.type ? `<span class="talk-label">${escapeHTML(talk.type)}</span>` : ''}
          ${start || end ? `<div class="talk-time" role="group" aria-label="报告时间">
            <i class="bi bi-clock" aria-hidden="true"></i>
            ${start ? `<time>${escapeHTML(start)}</time>` : ''}
            ${start && end ? '<span>–</span>' : ''}
            ${end ? `<time>${escapeHTML(end)}</time>` : ''}
          </div>` : ''}
        </div>
      </div>
      ${image}
      <div class="talk-content">
        <h5 class="item-title">${escapeHTML(talk.title)}</h5>
        <p class="talk-summary-label">演讲摘要</p>
        <p class="item-body">${escapeHTML(talk.desc)}</p>
        ${resources ? `<div class="talk-resources">${resources}</div>` : ''}
      </div>
    </article>`;
  }
  function renderSession(data) {
    const template = document.createElement('template');
    template.innerHTML = data.session_name || '';
    const date = template.content.querySelector('span');
    const dateText = date ? date.textContent.trim().replace(/^\s*\(|\)\s*$/g, '') : '';
    if (date) date.remove();
    const sessionName = template.content.textContent.trim();
    const parts = sessionName.split(/[:：]/);
    const kicker = parts.length > 1 ? parts.shift().trim() : '';
    const title = parts.join('：').trim() || sessionName;
    const chairs = Array.isArray(data.session_chairs) ? data.session_chairs : [];
    const talks = Array.isArray(data.session_list) ? data.session_list : [];
    return `<div class="schedule-chair-item">
      <div class="session-heading">
        <div class="session-meta">
          ${kicker ? `<span class="session-kicker">${escapeHTML(kicker)}</span>` : ''}
          ${dateText ? `<span class="session-date"><i class="bi bi-calendar3" aria-hidden="true"></i>${escapeHTML(dateText)}</span>` : ''}
        </div>
        <h3>${escapeHTML(title)}</h3>
      </div>
      <div class="session-chairs" aria-label="论坛主席">
        <h4 class="chair-section-label">论坛主席</h4>
        <div class="chair-list">${chairs.length ? chairs.map(renderChair).join('') : `<p class="chair-affiliation">${escapeHTML(plainText(data.session_chair))}</p>`}</div>
      </div>
      <p class="session-description"><strong>论坛简介：</strong>${escapeHTML(data.session_desc)}</p>
    </div>
    <h3 class="talks-heading">报告日程</h3>
    ${talks.map(renderTalk).join('')}`;
  }
  // Keep each portrait slot stable when a photo has not been supplied or fails.
  document.addEventListener('error', event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.matches('[data-portrait], .member .speaker img') || image.dataset.fallback) return;
    image.dataset.fallback = 'true';
    image.src = placeholder;
    image.alt = `${image.alt || '人物'}（照片待补充）`;
  }, true);
  async function loadSession(panel) {
    panel.setAttribute('aria-busy', 'true');
    const id = panel.id;
    const index = id.replace('session-', '');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`assets/data/session_${index}.json`, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      panel.innerHTML = renderSession(await response.json());
    } catch (error) {
      panel.innerHTML = '<div class="schedule-error" role="alert"><p>日程暂时加载失败，请稍后重试。</p><button type="button" class="session-action">重新加载</button></div>';
      panel.querySelector('button').addEventListener('click', () => {
        panel.innerHTML = '<p class="schedule-loading" role="status">正在加载论坛日程…</p>';
        loadSession(panel);
      });
      console.warn(`Unable to load ${id}:`, error.message);
    } finally {
      clearTimeout(timeout);
      panel.setAttribute('aria-busy', 'false');
    }
  }
  const tabs = Array.from(document.querySelectorAll('#schedule [role="tab"]'));
  tabs.forEach((tab, index) => {
    tab.addEventListener('shown.bs.tab', () => {
      tabs.forEach(item => item.tabIndex = item === tab ? 0 : -1);
      window.AOS?.refresh();
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined || !window.bootstrap?.Tab) return;
      event.preventDefault();
      tabs[next].focus();
      bootstrap.Tab.getOrCreateInstance(tabs[next]).show();
    });
  });
  // Use actual panels instead of requesting a nonexistent eighth JSON file.
  Promise.all(Array.from(document.querySelectorAll('#schedule [role="tabpanel"]'), loadSession))
    .then(() => window.AOS?.refresh());
})();
