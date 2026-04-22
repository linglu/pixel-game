# 🕹️ Pixel Quiz Arcade - 像素問答闖關遊戲

這是一個採用 React + Vite 開發的像素風格問答遊戲，具備街機質感與動態特效。後端整合 Google Sheets 作為資料庫，透過 Google Apps Script (GAS) 進行題目存取與成績統計。

## 🚀 快速開始

### 1. 前端環境設定
1. **安裝依賴**：
   ```bash
   npm install
   ```
2. **設定環境變數**：
   在專案根目錄建立 `.env` 檔案，並填入內容（參考 `.env.example`）。

3. **啟動開發伺服器**：
   ```bash
   npm run dev
   ```

---

### 2. 自動部署到 GitHub Pages

本專案已內建 GitHub Actions，當你推送程式碼到 `main` 分支時會自動部署。

**設定步驟：**
1. 在 GitHub 儲存庫頁面，點選 **「Settings」 > 「Secrets and variables」 > 「Actions」**。
2. 點選 **「New repository secret」**，依序新增以下三個 Secret：
   - `VITE_GOOGLE_APP_SCRIPT_URL`：你的 GAS 連結。
   - `VITE_PASS_THRESHOLD`：通過門檻。
   - `VITE_QUESTION_COUNT`：總題數。
3. 前往 **「Settings」 > 「Actions」 > 「General」**，確保 **「Workflow permissions」** 設定為 **「Read and write permissions」**（以便 Action 有權限建立 `gh-pages` 分支）。
4. 推送程式碼後，在 **「Settings」 > 「Pages」** 將 Source 設定為 `gh-pages` 分支即可。


---

### 2. Google Sheets 資料表設定

請建立一份新的 Google 試算表，並設定以下兩個工作表：

#### A. 「題目」工作表
用於存放題庫，欄位順序如下：
- **A 欄 (題號)**：數字 ID
- **B 欄 (題目)**：問題敘述
- **C-F 欄 (A, B, C, D)**：選項內容
- **G 欄 (解答)**：正確選項代碼 (A, B, C 或 D)

#### B. 「回答」工作表
用於紀錄玩家成績，欄位標題請填寫於第一列：
1. `ID`
2. `闖關次數`
3. `總分`
4. `最高分`
5. `第一次通關分數`
6. `花了幾次通關`
7. `最近遊玩時間`

---

### 3. Google Apps Script (GAS) 部署步驟

1. 在 Google 試算表選單點選 **「擴充功能」 > 「Apps Script」**。
2. 將專案中的 `google_apps_script.js` 內容完整複製並貼上。
3. 點選 **「部署」 > 「新部署」**。
4. **選取類型**：網頁應用程式 (Web App)。
5. **設定權限**：
   - 「執行身分」：**我 (Me)**。
   - 「誰有權限存取」：**所有人 (Anyone)**。
6. 點選部署，並複製產生的 **「網頁應用程式網址」**。
7. 將此網址填回前端專案的 `.env` 檔案中。

---

## 📝 測試題庫 (生成式 AI 基礎知識)

| 題號 | 題目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | GPT 全名中的 "P" 代表什麼意思？ | Processed | Pre-trained | Private | Powerful | B |
| 2 | ChatGPT 是由哪一家公司開發的？ | Google | Meta | OpenAI | Microsoft | C |
| 3 | 目前主流大型語言模型 (LLM) 的核心架構是什麼？ | CNN | RNN | Transformer | GAN | C |
| 4 | AI 產生看似合理但事實錯誤資訊的現象稱稱為？ | 幻覺 (Hallucination) | 遺忘 (Forgetting) | 偏見 (Bias) | 過擬合 (Overfitting) | A |
| 5 | 下列哪一個模型主要用於「文字生成圖片」？ | BERT | Midjourney | Whisper | Claude | B |
| 6 | 透過調整輸入語句來優化 AI 輸出結果的技術稱為？ | 數據清洗 | 特徵工程 | 提示工程 (Prompt Engineering) | 機器學習 | C |
| 7 | AI 在沒有看過特定任務範例的情況下執行任務的能力稱為？ | One-shot | Zero-shot | Few-shot | Multi-shot | B |
| 8 | Transformer 架構中最重要的機制是什麼？ | 卷積機制 | 循環機制 | 注意力機制 (Attention) | 遞迴機制 | C |
| 9 | 下列哪一個模型具備「多模態 (Multimodal)」理解能力？ | GPT-4o | GPT-2 | BERT-Base | Word2Vec | A |
| 10 | 在預訓練模型基礎上，使用特定領域數據進行微調的過程稱為？ | Pre-training | Fine-tuning | Reinforcement | Distillation | B |

---

## 🎨 遊戲特色
- **像素視覺**：使用 Google Fonts "Press Start 2P" 與自訂像素 CSS 框架。
- **動態關主**：整合 DiceBear Pixel Art API，每關自動更換像素風 Boss 頭像。
- **成績連動**：玩家作答紀錄會即時更新至 Google Sheets，且會追蹤玩家「第幾次」才成功過關。
- **慶祝特效**：過關門檻達標時，觸發像素感十足的五彩紙屑特效。

## 🛠️ 技術棧
- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Assets**: DiceBear API, Canvas-confetti
