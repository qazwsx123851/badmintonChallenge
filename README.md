# 🏸 羽球場地報名系統

一個功能完善的羽球場地預約與賽事管理系統，採用現代化網頁技術打造。本系統支援用戶個人或團隊報名羽球活動、管理場地使用狀態，並自動分配比賽場地。

## ✨ 功能特色

### 用戶與團隊管理
- **用戶註冊與認證**：具有會話管理的安全登入系統
- **團隊建立**：建立團隊並指定隊長（每隊最多 2 人）
- **團隊管理**：邀請和管理團隊成員

### 活動管理
- **活動建立**：管理員可建立自訂時段的羽球活動
- **即時報名追蹤**：即時容量監控與進度條顯示
- **報名類型**：支援個人報名與團隊報名
- **容量控制**：自動執行參與人數限制並提供視覺化回饋

### 場地管理
- **完整 CRUD 操作**：場地的新增、查詢、更新與刪除功能
- **可用性追蹤**：即時場地狀態監控
- **比賽顯示**：顯示每個場地的當前與即將進行的比賽
- **業務規則強制執行**：
  - 系統至少需要保留 1 個場地
  - 無法刪除已排程或進行中的場地
  - 場地容量限制為最多 10 人

### 自動比賽分配
- **智慧分配演算法**：自動將參與者分配到可用場地
- **單打與雙打識別**：根據參與人數智慧判斷比賽類型
  - 單打：2 位參與者（1v1）
  - 雙打：4 位參與者（2v2）
- **公平分配**：30 分鐘時段與場地輪換，確保公平比賽時間
- **容量遵守**：確保遵守場地容量限制（每場地最多 10 人）

### 比賽賽程
- **完整檢視**：顯示所有比賽的活動名稱、時間與參與者
- **視覺指示**：自動為單打/雙打比賽加上標籤
- **即時更新**：賽程會自動刷新以反映最新分配

## 🎨 設計

本系統採用針對運動應用優化的 **Material Design 3** 風格介面：

- **色彩配置**：
  - 電光藍（主色）
  - 活力橙（次要色）
  - 動感綠（強調色）
- **字型**：使用 Roboto 字型系列以保持一致性
- **響應式佈局**：行動優先設計，為運動員量身打造
- **立體化 UI**：明顯的陰影與深度，呈現現代美學
- **觸控優化**：大型互動元素，適合行動裝置

## 🏗️ 系統架構

### 前端技術棧

- **框架**：React 18 搭配 TypeScript
- **建構工具**：Vite（支援熱模組替換）
- **UI 組件**：Radix UI 原語 + shadcn/ui 設計系統
- **樣式**：Tailwind CSS 自訂主題
- **狀態管理**：TanStack Query (React Query) 管理伺服器狀態
- **路由**：Wouter 輕量級客戶端導航
- **表單處理**：React Hook Form 搭配 Zod 驗證
- **日期時間選擇器**：react-datepicker 搭配自訂 Bootstrap 相容樣式

### 後端技術棧

- **執行環境**：Node.js 搭配 Express.js
- **程式語言**：TypeScript
- **資料庫**：PostgreSQL（透過 Neon serverless 連接器）
- **ORM**：Drizzle ORM 提供型別安全查詢
- **會話儲存**：PostgreSQL 支援的會話（connect-pg-simple）
- **驗證**：前後端共享的 Zod 模式

### 資料庫架構

```
users（用戶）
├── id (UUID, 主鍵)
├── username (唯一)
└── password (雜湊)

teams（團隊）
├── id (UUID, 主鍵)
├── name
├── captainId (外鍵 → users.id)
└── members (用戶 ID 陣列)

courts（場地）
├── id (UUID, 主鍵)
├── name
└── isAvailable (布林值)

events（活動）
├── id (UUID, 主鍵)
├── name
├── startTime
├── endTime
├── maxParticipants
└── status

registrations（報名）
├── id (UUID, 主鍵)
├── eventId (外鍵 → events.id)
├── userId (外鍵 → users.id, 可為空)
├── teamId (外鍵 → teams.id, 可為空)
├── registrationType (individual | team)
└── registeredAt

matches（比賽）
├── id (UUID, 主鍵)
├── eventId (外鍵 → events.id)
├── courtId (外鍵 → courts.id)
├── participantIds (用戶/團隊 ID 陣列)
├── startTime
├── endTime
└── status (scheduled | in_progress | completed)
```

## 🚀 開始使用

### 環境需求

- Node.js 20+
- PostgreSQL 資料庫
- npm 或 yarn

### 環境變數

建立 `.env` 檔案並設定以下變數：

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
SESSION_SECRET=your-session-secret
```

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <your-repo-url>
   cd badminton-court-system
   ```

2. **安裝相依套件**
   ```bash
   npm install
   ```

3. **設定資料庫**
   ```bash
   npm run db:push
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

5. **開啟瀏覽器**
   前往 `http://localhost:5000`

## 📁 專案結構

```
.
├── client/
│   └── src/
│       ├── components/      # 可重複使用的 UI 組件
│       │   ├── ui/         # shadcn/ui 組件
│       │   ├── CourtCard.tsx
│       │   ├── EventCard.tsx
│       │   ├── TeamCard.tsx
│       │   ├── EditCourtDialog.tsx
│       │   ├── RegistrationDialog.tsx
│       │   └── MatchScheduleTable.tsx
│       ├── pages/          # 頁面組件
│       │   ├── CourtsPage.tsx
│       │   ├── EventsPage.tsx
│       │   ├── MatchesPage.tsx
│       │   └── TeamsPage.tsx
│       ├── lib/            # 工具程式與輔助函式
│       └── App.tsx         # 根組件與路由
├── server/
│   ├── index.ts           # Express 伺服器進入點
│   ├── routes.ts          # API 路由定義
│   ├── storage.ts         # 儲存層抽象
│   └── vite.ts            # Vite 開發伺服器整合
├── shared/
│   └── schema.ts          # 共享的 Drizzle 模式與 Zod 驗證器
└── migrations/            # 資料庫遷移檔案
```

## 🔑 核心業務規則

1. **團隊限制**：
   - 每隊最多 2 人（隊長 + 1 名隊員）
   - 建立團隊時必須指定隊長

2. **報名規則**：
   - 個人報名計為 1 人
   - 團隊報名計為 2 人（隊長 + 隊員）
   - 活動達到人數上限時無法報名

3. **場地限制**：
   - 系統至少需保留 1 個場地
   - 比賽時每場地最多 10 人
   - 無法刪除已排程或進行中的場地

4. **比賽分配**：
   - 單打比賽：2 位參與者（1v1）
   - 雙打比賽：4 位參與者（2v2）
   - 比賽以 30 分鐘為單位分配
   - 所有參與者公平輪換場地

## 🛠️ 開發

### 可用指令

- `npm run dev` - 啟動開發伺服器（前端 + 後端）
- `npm run build` - 建置正式環境版本
- `npm run db:push` - 推送資料庫結構變更
- `npm run db:push --force` - 強制推送結構變更（謹慎使用）

### 程式碼風格

- 啟用 TypeScript 嚴格模式
- 使用 ESLint 進行程式碼品質控管
- Tailwind CSS 樣式（遵循 Material Design 3 原則）
- 基於組件的架構，清楚分離關注點

## 🧪 測試

本系統包含全面的端到端測試，涵蓋：
- 活動建立與報名流程
- 混合個人與團隊報名
- 自動比賽分配
- 參與者名稱顯示的賽程檢視
- 場地管理操作

## 🔐 安全功能

- 用戶帳號密碼雜湊
- 基於會話的身份驗證
- 透過會話管理提供 CSRF 保護
- 客戶端與伺服器端的輸入驗證
- 透過參數化查詢防止 SQL 注入（Drizzle ORM）

## 📝 API 端點

### 場地
- `GET /api/courts` - 取得所有場地列表
- `POST /api/courts` - 建立新場地
- `PUT /api/courts/:id` - 更新場地資訊
- `DELETE /api/courts/:id` - 刪除場地（含業務規則驗證）

### 活動
- `GET /api/events` - 取得所有活動列表
- `POST /api/events` - 建立新活動
- `GET /api/events/:id` - 取得活動詳細資訊

### 團隊
- `GET /api/teams` - 取得所有團隊列表
- `POST /api/teams` - 建立新團隊
- `GET /api/teams/:id` - 取得團隊詳細資訊

### 報名
- `GET /api/registrations` - 取得所有報名列表
- `POST /api/registrations` - 建立新報名
- `GET /api/registrations/event/:eventId` - 取得特定活動的報名資料

### 比賽
- `GET /api/matches` - 取得所有比賽列表
- `POST /api/events/:eventId/allocate-matches` - 自動為活動分配比賽

## 🌟 最近更新

### 2025-10-31: 高優先級功能增強
- **報名表單即時更新**：打開時自動刷新活動容量資訊
- **比賽賽程改進**：新增活動名稱欄位與自動單打/雙打標籤
- **場地管理系統**：
  - 編輯場地名稱與可用性
  - 刪除場地（含業務規則驗證）
  - 顯示每個場地的當前與即將進行的比賽
  - 完整的參與者名稱解析
- **進度條功能**：活動卡片與報名表單顯示即時報名進度與視覺化百分比

### 2025-10-31: 業務規則與分配演算法改進
- 團隊人數與場地容量的模式層級驗證
- 增強分配演算法，區分單打與雙打
- 報名時即時容量檢查
- 改進錯誤訊息與用戶回饋

## 🤝 貢獻

這是一個用於學習與展示全端開發技能的示範專案。

## 📄 授權

本專案採用 MIT 授權條款開放原始碼。

## 🙏 致謝

- 使用 [Replit](https://replit.com) 建置
- UI 組件來自 [shadcn/ui](https://ui.shadcn.com)
- 圖示來自 [Lucide](https://lucide.dev)
- 設計靈感來自 Material Design 3

---

**用 ❤️ 為羽球社群打造**
