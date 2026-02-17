// ========================================
// Golf CRM Prototype - Application Logic
// ========================================

(function () {
  const pageContent = document.getElementById("pageContent");
  const pageTitle = document.getElementById("pageTitle");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");
  const navItems = document.querySelectorAll(".nav-item");

  let currentPage = "dashboard";

  // ---- Navigation ----
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const page = item.dataset.page;
      navigateTo(page);
    });
  });

  function navigateTo(page, params) {
    currentPage = page;
    navItems.forEach((n) => n.classList.remove("active"));
    const activeNav = document.querySelector(`[data-page="${page}"]`);
    if (activeNav) activeNav.classList.add("active");

    const titles = {
      dashboard: "ダッシュボード",
      customers: "顧客管理",
      "customer-detail": "顧客詳細",
      reservations: "予約管理",
      "visit-history": "来場履歴",
      membership: "会員種別・料金",
    };
    pageTitle.textContent = titles[page] || "";

    const renderers = {
      dashboard: renderDashboard,
      customers: renderCustomers,
      "customer-detail": () => renderCustomerDetail(params),
      reservations: renderReservations,
      "visit-history": renderVisitHistory,
      membership: renderMembership,
    };

    if (renderers[page]) renderers[page]();
  }

  // ---- Modal ----
  function openModal(html) {
    modalContent.innerHTML = html;
    modalOverlay.style.display = "flex";
  }

  function closeModal() {
    modalOverlay.style.display = "none";
    modalContent.innerHTML = "";
  }

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ---- Dashboard ----
  function renderDashboard() {
    const todayReservations = RESERVATIONS.filter(
      (r) => r.date === "2026-02-17"
    );
    const todayGuests = todayReservations.reduce(
      (sum, r) => sum + 1 + r.guests,
      0
    );

    pageContent.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">本日の予約組数</span>
            <div class="stat-icon green">&#9971;</div>
          </div>
          <div class="stat-value">${todayReservations.length}<span style="font-size:14px;color:var(--text-light);"> 組</span></div>
          <div class="stat-change up">&#9650; 前週比 +2組</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">本日の来場者数</span>
            <div class="stat-icon blue">&#9787;</div>
          </div>
          <div class="stat-value">${todayGuests}<span style="font-size:14px;color:var(--text-light);"> 名</span></div>
          <div class="stat-change up">&#9650; 前週比 +5名</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">会員総数</span>
            <div class="stat-icon orange">&#9733;</div>
          </div>
          <div class="stat-value">715<span style="font-size:14px;color:var(--text-light);"> 名</span></div>
          <div class="stat-change up">&#9650; 今月 +3名</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-label">今月の売上</span>
            <div class="stat-icon gold">&#165;</div>
          </div>
          <div class="stat-value">¥12.8M</div>
          <div class="stat-change down">&#9660; 前月比 -4%</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h3>月別来場者数推移</h3>
            <button class="btn btn-secondary btn-sm">詳細</button>
          </div>
          <div class="card-body">
            <div class="chart-placeholder" style="padding-bottom:28px;">
              ${MONTHLY_VISITORS.map(
                (m) => `
                <div class="chart-bar" style="height:${(m.count / 2200) * 100}%">
                  <span class="bar-value">${m.count}</span>
                  <span class="bar-label">${m.month}</span>
                </div>
              `
              ).join("")}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h3>本日のスケジュール</h3>
            <button class="btn btn-secondary btn-sm" onclick="document.querySelector('[data-page=reservations]').click()">全て見る</button>
          </div>
          <div class="card-body">
            <ul class="schedule-list">
              ${todayReservations
                .slice(0, 6)
                .map(
                  (r) => `
                <li class="schedule-item">
                  <span class="schedule-time">${r.startTime}</span>
                  <div class="schedule-detail">
                    <span class="schedule-name">${r.customerName}</span>
                    <span style="color:var(--text-light);font-size:12px;"> ${r.course} / ${1 + r.guests}名</span>
                  </div>
                  <span class="status-badge ${r.status}">${r.status === "confirmed" ? "確定" : r.status === "pending" ? "仮予約" : "キャンセル"}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-header">
          <h3>直近の来場実績</h3>
          <button class="btn btn-secondary btn-sm" onclick="document.querySelector('[data-page=visit-history]').click()">全て見る</button>
        </div>
        <div class="card-body">
          <table class="data-table">
            <thead>
              <tr>
                <th>日付</th><th>顧客名</th><th>コース</th><th>スコア</th><th>パット</th><th>FW キープ率</th>
              </tr>
            </thead>
            <tbody>
              ${VISIT_HISTORY.slice(0, 5)
                .map(
                  (v) => `
                <tr onclick="window._app.showCustomer(${v.customerId})">
                  <td>${v.date}</td><td>${v.customerName}</td><td>${v.course}</td><td>${v.score}</td><td>${v.putts}</td><td>${v.fairwayKeep}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ---- Customer List ----
  function renderCustomers() {
    pageContent.innerHTML = `
      <div class="toolbar">
        <div class="toolbar-left">
          <input type="text" class="filter-input" id="customerSearch" placeholder="顧客名・会員番号で検索...">
          <select class="filter-select" id="typeFilter">
            <option value="">全ての会員種別</option>
            <option value="正会員">正会員</option>
            <option value="平日会員">平日会員</option>
            <option value="法人会員">法人会員</option>
            <option value="家族会員">家族会員</option>
            <option value="ビジター">ビジター</option>
          </select>
          <select class="filter-select" id="genderFilter">
            <option value="">全ての性別</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
          </select>
        </div>
        <button class="btn btn-primary" id="addCustomerBtn">+ 新規顧客登録</button>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>会員番号</th><th>氏名</th><th>会員種別</th><th>性別</th><th>電話番号</th><th>来場回数</th><th>最終来場日</th><th>HC</th>
              </tr>
            </thead>
            <tbody id="customerTableBody">
              ${renderCustomerRows(CUSTOMERS)}
            </tbody>
          </table>
        </div>
      </div>
      <div class="pagination">
        <button>&laquo;</button>
        <button class="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>&raquo;</button>
      </div>
    `;

    document
      .getElementById("addCustomerBtn")
      .addEventListener("click", openCustomerForm);

    const searchInput = document.getElementById("customerSearch");
    const typeFilter = document.getElementById("typeFilter");
    const genderFilter = document.getElementById("genderFilter");

    function filterCustomers() {
      const q = searchInput.value.toLowerCase();
      const type = typeFilter.value;
      const gender = genderFilter.value;
      const filtered = CUSTOMERS.filter((c) => {
        const matchQ =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.memberNo.toLowerCase().includes(q) ||
          c.nameKana.toLowerCase().includes(q);
        const matchType = !type || c.type === type;
        const matchGender = !gender || c.gender === gender;
        return matchQ && matchType && matchGender;
      });
      document.getElementById("customerTableBody").innerHTML =
        renderCustomerRows(filtered);
    }

    searchInput.addEventListener("input", filterCustomers);
    typeFilter.addEventListener("change", filterCustomers);
    genderFilter.addEventListener("change", filterCustomers);
  }

  function renderCustomerRows(list) {
    if (list.length === 0) {
      return '<tr><td colspan="8" style="text-align:center;color:var(--text-light);padding:40px;">該当する顧客が見つかりません</td></tr>';
    }
    return list
      .map(
        (c) => `
      <tr onclick="window._app.showCustomer(${c.id})">
        <td>${c.memberNo}</td>
        <td><strong>${c.name}</strong><br><span style="font-size:11px;color:var(--text-light);">${c.nameKana}</span></td>
        <td><span class="member-type-badge ${c.type}">${c.type}</span></td>
        <td>${c.gender}</td>
        <td>${c.phone}</td>
        <td>${c.visits}回</td>
        <td>${c.lastVisit}</td>
        <td>${c.handicap}</td>
      </tr>
    `
      )
      .join("");
  }

  function openCustomerForm(customer) {
    const isEdit = customer && customer.id;
    const c = isEdit
      ? customer
      : {
          memberNo: "",
          name: "",
          nameKana: "",
          type: "正会員",
          gender: "男性",
          birthDate: "",
          phone: "",
          email: "",
          address: "",
          notes: "",
        };

    openModal(`
      <div class="modal-header">
        <h2>${isEdit ? "顧客情報編集" : "新規顧客登録"}</h2>
        <button class="modal-close" onclick="window._app.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>会員番号</label>
            <input type="text" value="${c.memberNo}" placeholder="M-0000" ${isEdit ? "readonly" : ""}>
          </div>
          <div class="form-group">
            <label>会員種別</label>
            <select>
              ${["正会員", "平日会員", "法人会員", "家族会員", "ビジター"]
                .map(
                  (t) =>
                    `<option ${c.type === t ? "selected" : ""}>${t}</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="form-group">
            <label>氏名</label>
            <input type="text" value="${c.name}" placeholder="山田 太郎">
          </div>
          <div class="form-group">
            <label>フリガナ</label>
            <input type="text" value="${c.nameKana}" placeholder="ヤマダ タロウ">
          </div>
          <div class="form-group">
            <label>性別</label>
            <select>
              <option ${c.gender === "男性" ? "selected" : ""}>男性</option>
              <option ${c.gender === "女性" ? "selected" : ""}>女性</option>
            </select>
          </div>
          <div class="form-group">
            <label>生年月日</label>
            <input type="date" value="${c.birthDate}">
          </div>
          <div class="form-group">
            <label>電話番号</label>
            <input type="tel" value="${c.phone}" placeholder="090-0000-0000">
          </div>
          <div class="form-group">
            <label>メールアドレス</label>
            <input type="email" value="${c.email}" placeholder="example@mail.com">
          </div>
          <div class="form-group full-width">
            <label>住所</label>
            <input type="text" value="${c.address}" placeholder="東京都...">
          </div>
          <div class="form-group full-width">
            <label>備考</label>
            <textarea rows="3">${c.notes}</textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window._app.closeModal()">キャンセル</button>
        <button class="btn btn-primary" onclick="alert('プロトタイプのため保存機能は未実装です'); window._app.closeModal();">
          ${isEdit ? "更新" : "登録"}
        </button>
      </div>
    `);
  }

  // ---- Customer Detail ----
  function renderCustomerDetail(customerId) {
    const c = CUSTOMERS.find((x) => x.id === customerId);
    if (!c) return;

    const visits = VISIT_HISTORY.filter((v) => v.customerId === c.id);
    const reservations = RESERVATIONS.filter((r) => r.customerId === c.id);

    pageContent.innerHTML = `
      <button class="btn btn-secondary mb-16" onclick="document.querySelector('[data-page=customers]').click()">
        &larr; 顧客一覧に戻る
      </button>

      <div class="detail-header">
        <div class="detail-avatar">${c.name.charAt(0)}</div>
        <div class="detail-info">
          <h2>${c.name} <span style="font-size:14px;color:var(--text-light);font-weight:normal;">${c.nameKana}</span></h2>
          <div class="detail-meta">
            <span><span class="member-type-badge ${c.type}">${c.type}</span></span>
            <span>${c.memberNo}</span>
            <span>HC ${c.handicap}</span>
            <span>来場 ${c.visits}回</span>
          </div>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;">
          <button class="btn btn-primary" onclick="window._app.editCustomer(${c.id})">編集</button>
          <button class="btn btn-secondary">予約作成</button>
        </div>
      </div>

      <div class="detail-tabs">
        <div class="detail-tab active" data-tab="info">基本情報</div>
        <div class="detail-tab" data-tab="history">来場履歴</div>
        <div class="detail-tab" data-tab="reserv">予約一覧</div>
      </div>

      <div id="tabContent">
        <div class="card">
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item"><div class="info-label">性別</div><div class="info-value">${c.gender}</div></div>
              <div class="info-item"><div class="info-label">生年月日</div><div class="info-value">${c.birthDate}</div></div>
              <div class="info-item"><div class="info-label">電話番号</div><div class="info-value">${c.phone}</div></div>
              <div class="info-item"><div class="info-label">メールアドレス</div><div class="info-value">${c.email}</div></div>
              <div class="info-item"><div class="info-label">住所</div><div class="info-value">${c.address}</div></div>
              <div class="info-item"><div class="info-label">入会日</div><div class="info-value">${c.joinDate || "―"}</div></div>
              <div class="info-item"><div class="info-label">最終来場日</div><div class="info-value">${c.lastVisit}</div></div>
              <div class="info-item"><div class="info-label">ハンディキャップ</div><div class="info-value">${c.handicap}</div></div>
              <div class="info-item full-width"><div class="info-label">備考</div><div class="info-value">${c.notes || "―"}</div></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const tabs = document.querySelectorAll(".detail-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const tabName = tab.dataset.tab;
        const container = document.getElementById("tabContent");

        if (tabName === "info") {
          container.innerHTML = `
            <div class="card"><div class="card-body">
              <div class="info-grid">
                <div class="info-item"><div class="info-label">性別</div><div class="info-value">${c.gender}</div></div>
                <div class="info-item"><div class="info-label">生年月日</div><div class="info-value">${c.birthDate}</div></div>
                <div class="info-item"><div class="info-label">電話番号</div><div class="info-value">${c.phone}</div></div>
                <div class="info-item"><div class="info-label">メールアドレス</div><div class="info-value">${c.email}</div></div>
                <div class="info-item"><div class="info-label">住所</div><div class="info-value">${c.address}</div></div>
                <div class="info-item"><div class="info-label">入会日</div><div class="info-value">${c.joinDate || "―"}</div></div>
                <div class="info-item"><div class="info-label">最終来場日</div><div class="info-value">${c.lastVisit}</div></div>
                <div class="info-item"><div class="info-label">ハンディキャップ</div><div class="info-value">${c.handicap}</div></div>
                <div class="info-item full-width"><div class="info-label">備考</div><div class="info-value">${c.notes || "―"}</div></div>
              </div>
            </div></div>`;
        } else if (tabName === "history") {
          container.innerHTML = `
            <div class="card"><div class="card-body" style="padding:0;">
              <table class="data-table">
                <thead><tr><th>日付</th><th>コース</th><th>スコア</th><th>パット</th><th>FWキープ率</th><th>備考</th></tr></thead>
                <tbody>
                  ${
                    visits.length
                      ? visits
                          .map(
                            (v) => `
                    <tr><td>${v.date}</td><td>${v.course}</td><td>${v.score}</td><td>${v.putts}</td><td>${v.fairwayKeep}</td><td>${v.notes}</td></tr>
                  `
                          )
                          .join("")
                      : '<tr><td colspan="6" style="text-align:center;color:var(--text-light);padding:40px;">来場履歴はありません</td></tr>'
                  }
                </tbody>
              </table>
            </div></div>`;
        } else if (tabName === "reserv") {
          container.innerHTML = `
            <div class="card"><div class="card-body" style="padding:0;">
              <table class="data-table">
                <thead><tr><th>日付</th><th>時間</th><th>コース</th><th>人数</th><th>ステータス</th><th>備考</th></tr></thead>
                <tbody>
                  ${
                    reservations.length
                      ? reservations
                          .map(
                            (r) => `
                    <tr>
                      <td>${r.date}</td><td>${r.startTime}</td><td>${r.course}</td>
                      <td>${1 + r.guests}名</td>
                      <td><span class="status-badge ${r.status}">${r.status === "confirmed" ? "確定" : r.status === "pending" ? "仮予約" : "キャンセル"}</span></td>
                      <td>${r.notes}</td>
                    </tr>
                  `
                          )
                          .join("")
                      : '<tr><td colspan="6" style="text-align:center;color:var(--text-light);padding:40px;">予約はありません</td></tr>'
                  }
                </tbody>
              </table>
            </div></div>`;
        }
      });
    });
  }

  // ---- Reservations ----
  function renderReservations() {
    const year = 2026;
    const month = 1; // February (0-indexed)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = 17;

    let calDays = "";
    // Previous month filler
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      calDays += `<div class="cal-day other-month"><div class="day-number">${prevMonthDays - i}</div></div>`;
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today;
      const dayReservations = RESERVATIONS.filter((r) => {
        const rDay = parseInt(r.date.split("-")[2]);
        return rDay === d;
      });
      const eventHtml = dayReservations
        .slice(0, 2)
        .map(
          (r) =>
            `<div class="cal-event">${r.startTime} ${r.customerName.split(" ")[0]}</div>`
        )
        .join("");
      const moreHtml =
        dayReservations.length > 2
          ? `<div style="font-size:10px;color:var(--text-light);">+${dayReservations.length - 2}件</div>`
          : "";
      calDays += `<div class="cal-day ${isToday ? "today" : ""}"><div class="day-number">${d}</div>${eventHtml}${moreHtml}</div>`;
    }
    // Next month filler
    const totalCells = firstDay + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      calDays += `<div class="cal-day other-month"><div class="day-number">${i}</div></div>`;
    }

    pageContent.innerHTML = `
      <div class="toolbar">
        <div class="toolbar-left">
          <button class="btn btn-secondary btn-sm">&larr;</button>
          <h3 style="margin:0;">2026年 2月</h3>
          <button class="btn btn-secondary btn-sm">&rarr;</button>
          <select class="filter-select" id="reservStatusFilter">
            <option value="">全てのステータス</option>
            <option value="confirmed">確定</option>
            <option value="pending">仮予約</option>
            <option value="cancelled">キャンセル</option>
          </select>
        </div>
        <button class="btn btn-primary" id="addReservBtn">+ 新規予約</button>
      </div>

      <div class="reservation-calendar">
        <div class="cal-header">日</div>
        <div class="cal-header">月</div>
        <div class="cal-header">火</div>
        <div class="cal-header">水</div>
        <div class="cal-header">木</div>
        <div class="cal-header">金</div>
        <div class="cal-header">土</div>
        ${calDays}
      </div>

      <div class="card">
        <div class="card-header">
          <h3>本日の予約一覧 (2026/02/17)</h3>
        </div>
        <div class="card-body" style="padding:0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>時間</th><th>コース</th><th>顧客名</th><th>人数</th><th>ホール</th><th>ステータス</th><th>備考</th><th></th>
              </tr>
            </thead>
            <tbody>
              ${RESERVATIONS.filter((r) => r.date === "2026-02-17")
                .map(
                  (r) => `
                <tr>
                  <td><strong>${r.startTime}</strong></td>
                  <td>${r.course}</td>
                  <td><a class="btn-link" onclick="window._app.showCustomer(${r.customerId})">${r.customerName}</a></td>
                  <td>${1 + r.guests}名</td>
                  <td>${r.holes}H</td>
                  <td><span class="status-badge ${r.status}">${r.status === "confirmed" ? "確定" : r.status === "pending" ? "仮予約" : "キャンセル"}</span></td>
                  <td>${r.notes}</td>
                  <td><button class="btn btn-secondary btn-sm" onclick="window._app.editReservation(${r.id})">編集</button></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document
      .getElementById("addReservBtn")
      .addEventListener("click", openReservationForm);
  }

  function openReservationForm(reservation) {
    const isEdit = reservation && reservation.id;
    const r = isEdit
      ? reservation
      : {
          date: "2026-02-17",
          startTime: "",
          course: "OUT",
          holes: 18,
          customerName: "",
          guests: 3,
          status: "pending",
          notes: "",
        };

    openModal(`
      <div class="modal-header">
        <h2>${isEdit ? "予約編集" : "新規予約"}</h2>
        <button class="modal-close" onclick="window._app.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>予約日</label>
            <input type="date" value="${r.date}">
          </div>
          <div class="form-group">
            <label>スタート時間</label>
            <input type="time" value="${r.startTime}" step="480">
          </div>
          <div class="form-group">
            <label>コース</label>
            <select>
              <option ${r.course === "OUT" ? "selected" : ""}>OUT</option>
              <option ${r.course === "IN" ? "selected" : ""}>IN</option>
            </select>
          </div>
          <div class="form-group">
            <label>ホール数</label>
            <select>
              <option ${r.holes === 18 ? "selected" : ""}>18</option>
              <option ${r.holes === 9 ? "selected" : ""}>9</option>
            </select>
          </div>
          <div class="form-group">
            <label>代表者（顧客）</label>
            <select>
              <option value="">選択してください</option>
              ${CUSTOMERS.map((c) => `<option ${r.customerName === c.name ? "selected" : ""} value="${c.id}">${c.name} (${c.memberNo})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>同伴者数</label>
            <input type="number" value="${r.guests}" min="0" max="3">
          </div>
          <div class="form-group">
            <label>ステータス</label>
            <select>
              <option value="pending" ${r.status === "pending" ? "selected" : ""}>仮予約</option>
              <option value="confirmed" ${r.status === "confirmed" ? "selected" : ""}>確定</option>
              <option value="cancelled" ${r.status === "cancelled" ? "selected" : ""}>キャンセル</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label>備考</label>
            <textarea rows="2">${r.notes}</textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="window._app.closeModal()">キャンセル</button>
        <button class="btn btn-primary" onclick="alert('プロトタイプのため保存機能は未実装です'); window._app.closeModal();">
          ${isEdit ? "更新" : "予約登録"}
        </button>
      </div>
    `);
  }

  // ---- Visit History ----
  function renderVisitHistory() {
    pageContent.innerHTML = `
      <div class="toolbar">
        <div class="toolbar-left">
          <input type="text" class="filter-input" id="visitSearch" placeholder="顧客名で検索...">
          <input type="date" class="filter-input" id="visitDateFrom" value="2026-02-01" style="width:160px;">
          <span style="color:var(--text-light);">〜</span>
          <input type="date" class="filter-input" id="visitDateTo" value="2026-02-28" style="width:160px;">
        </div>
        <button class="btn btn-secondary">CSVエクスポート</button>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>日付</th><th>顧客名</th><th>コース</th><th>スコア</th><th>パット</th><th>FWキープ率</th><th>備考</th>
              </tr>
            </thead>
            <tbody id="visitTableBody">
              ${renderVisitRows(VISIT_HISTORY)}
            </tbody>
          </table>
        </div>
      </div>
      <div class="pagination">
        <button>&laquo;</button>
        <button class="active">1</button>
        <button>2</button>
        <button>&raquo;</button>
      </div>
    `;

    const searchInput = document.getElementById("visitSearch");
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      const filtered = VISIT_HISTORY.filter(
        (v) => !q || v.customerName.toLowerCase().includes(q)
      );
      document.getElementById("visitTableBody").innerHTML =
        renderVisitRows(filtered);
    });
  }

  function renderVisitRows(list) {
    if (list.length === 0) {
      return '<tr><td colspan="7" style="text-align:center;color:var(--text-light);padding:40px;">該当する履歴が見つかりません</td></tr>';
    }
    return list
      .map(
        (v) => `
      <tr onclick="window._app.showCustomer(${v.customerId})">
        <td>${v.date}</td>
        <td><strong>${v.customerName}</strong></td>
        <td>${v.course}</td>
        <td>${v.score}</td>
        <td>${v.putts}</td>
        <td>${v.fairwayKeep}</td>
        <td>${v.notes}</td>
      </tr>
    `
      )
      .join("");
  }

  // ---- Membership / Pricing ----
  function renderMembership() {
    pageContent.innerHTML = `
      <div class="pricing-cards">
        ${MEMBERSHIP_PLANS.map(
          (p) => `
          <div class="pricing-card ${p.featured ? "featured" : ""}">
            <h3>${p.name}</h3>
            <div class="price">&yen;${p.price}</div>
            <div class="price-unit">${p.unit}</div>
            <div style="font-size:13px;color:var(--text-light);margin-bottom:12px;">現在の会員数: <strong>${p.memberCount}名</strong></div>
            <ul class="features">
              ${p.features.map((f) => `<li>&#10003; ${f}</li>`).join("")}
            </ul>
          </div>
        `
        ).join("")}
      </div>

      <div class="card">
        <div class="card-header">
          <h3>プレー料金表</h3>
          <button class="btn btn-secondary btn-sm">料金編集</button>
        </div>
        <div class="card-body" style="padding:0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>区分</th>
                <th>メンバー (平日)</th>
                <th>メンバー (土日祝)</th>
                <th>ビジター (平日)</th>
                <th>ビジター (土日祝)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>18ホール</strong></td>
                <td>&yen;8,800</td>
                <td>&yen;13,200</td>
                <td>&yen;15,400</td>
                <td>&yen;22,000</td>
              </tr>
              <tr>
                <td><strong>9ホール (ハーフ)</strong></td>
                <td>&yen;5,500</td>
                <td>&yen;7,700</td>
                <td>&yen;8,800</td>
                <td>&yen;12,100</td>
              </tr>
              <tr>
                <td><strong>薄暮プレー</strong></td>
                <td>&yen;3,300</td>
                <td>&yen;4,400</td>
                <td>&yen;5,500</td>
                <td>&yen;6,600</td>
              </tr>
              <tr>
                <td><strong>カート利用料</strong></td>
                <td colspan="4" style="text-align:center;">&yen;3,300 / 1台 (2名乗り)</td>
              </tr>
              <tr>
                <td><strong>ロッカー利用料</strong></td>
                <td colspan="2" style="text-align:center;">無料 (メンバー)</td>
                <td colspan="2" style="text-align:center;">&yen;550</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-header">
          <h3>会員種別ごとの会員数</h3>
        </div>
        <div class="card-body">
          <div class="chart-placeholder" style="padding-bottom:28px;height:160px;">
            ${MEMBERSHIP_PLANS.map(
              (p) => `
              <div class="chart-bar" style="height:${(p.memberCount / 500) * 100}%;background:${p.featured ? "var(--accent)" : "var(--primary)"}">
                <span class="bar-value">${p.memberCount}</span>
                <span class="bar-label">${p.name}</span>
              </div>
            `
            ).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // ---- Public API ----
  window._app = {
    showCustomer: (id) => navigateTo("customer-detail", id),
    editCustomer: (id) => {
      const c = CUSTOMERS.find((x) => x.id === id);
      if (c) openCustomerForm(c);
    },
    editReservation: (id) => {
      const r = RESERVATIONS.find((x) => x.id === id);
      if (r) openReservationForm(r);
    },
    closeModal: closeModal,
  };

  // ---- Init ----
  navigateTo("dashboard");
})();
