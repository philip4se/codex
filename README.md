<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>당진시청소년재단 시설 통합 관리 시스템 v1.2</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; }
        .container { max-width: 1400px; margin: 0 auto; padding: 16px; }
        .header { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 20px; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
        .title { font-size: 28px; font-weight: bold; color: #1f2937; }
        .subtitle { color: #6b7280; margin-top: 4px; font-size: 14px; }
        .branch-selector { margin-top: 12px; position: relative; }
        .branch-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
        .branch-btn:hover { background: #1d4ed8; }
        .dropdown { position: absolute; top: 100%; left: 0; background: white; border: 2px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 4px; min-width: 300px; z-index: 1000; display: none; }
        .dropdown.show { display: block; }
        .dropdown-header { padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; font-size: 13px; color: #6b7280; }
        .dropdown-item { padding: 12px; border-bottom: 1px solid #f3f4f6; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .dropdown-item:hover { background: #f9fafb; }
        .dropdown-item.active { background: #dbeafe; }
        .time-display { text-align: right; }
        .time-label { font-size: 12px; color: #6b7280; }
        .time-value { font-size: 18px; font-weight: bold; color: #2563eb; margin: 4px 0; }
        .save-indicator { font-size: 11px; color: #16a34a; margin-top: 4px; display: flex; align-items: center; gap: 4px; justify-content: flex-end; }
        .backup-status { margin-top: 8px; padding: 8px; background: #f3f4f6; border-radius: 6px; font-size: 11px; }
        .backup-status-item { display: flex; align-items: center; gap: 6px; margin: 4px 0; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.online { background: #16a34a; animation: pulse-dot 2s infinite; }
        .status-dot.offline { background: #dc2626; }
        .status-dot.syncing { background: #f59e0b; animation: blink 1s infinite; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .alert-bar { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; padding: 12px 24px; min-height: 60px; }
        .alert-bar-title { font-size: 13px; font-weight: 600; color: #6b7280; margin-bottom: 8px; }
        .alert-list { display: flex; flex-direction: column; gap: 8px; }
        .alert-item { padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px; font-size: 13px; animation: slideIn 0.3s ease-out; }
        .alert-item.success { background: #d1fae5; border: 1px solid #86efac; color: #166534; }
        .alert-item.error { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .tabs { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; overflow-x: auto; }
        .tabs-flex { display: flex; border-bottom: 2px solid #e5e7eb; min-width: max-content; }
        .tab { padding: 14px 20px; font-weight: 600; color: #6b7280; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; white-space: nowrap; font-size: 14px; }
        .tab:hover { color: #1f2937; background: #f9fafb; }
        .tab.active { color: #2563eb; border-bottom-color: #2563eb; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .stat-card { padding: 20px; border-radius: 8px; border: 2px solid; }
        .stat-card.blue { background: #dbeafe; border-color: #93c5fd; }
        .stat-card.green { background: #d1fae5; border-color: #86efac; }
        .stat-card.purple { background: #e9d5ff; border-color: #c084fc; }
        .stat-label { font-size: 13px; font-weight: 600; }
        .stat-card.blue .stat-label { color: #1e40af; }
        .stat-card.green .stat-label { color: #15803d; }
        .stat-card.purple .stat-label { color: #7e22ce; }
        .stat-value { font-size: 32px; font-weight: bold; margin-top: 8px; }
        .stat-card.blue .stat-value { color: #1e3a8a; }
        .stat-card.green .stat-value { color: #166534; }
        .stat-card.purple .stat-value { color: #6b21a8; }
        .panel { background: white; border-radius: 8px; border: 2px solid #e5e7eb; padding: 24px; margin-bottom: 20px; }
        .panel-title { font-size: 18px; font-weight: bold; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .facility-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .facility-card { padding: 16px; border-radius: 8px; border: 2px solid; transition: all 0.3s; cursor: pointer; }
        .facility-card.available { background: #f0fdf4; border-color: #86efac; }
        .facility-card.using { background: #fef2f2; border-color: #fca5a5; }
        .facility-card.reserved { background: #fefce8; border-color: #fde047; }
        .facility-card.overtime { background: #fee2e2; border-color: #dc2626; animation: pulse 1s infinite; }
        .facility-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .facility-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
        .facility-name { font-weight: bold; font-size: 15px; }
        .facility-info { font-size: 12px; color: #6b7280; margin-top: 4px; }
        .status-badge { font-size: 11px; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
        .status-badge.available { background: #86efac; color: #166534; }
        .status-badge.using { background: #fca5a5; color: #991b1b; }
        .status-badge.reserved { background: #fde047; color: #854d0e; }
        .status-badge.overtime { background: #dc2626; color: white; }
        .facility-details { font-size: 13px; margin-top: 8px; }
        .facility-time { color: #ef4444; font-weight: 600; margin-top: 4px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-success { background: #16a34a; color: white; }
        .btn-success:hover { background: #15803d; }
        .btn-danger { background: #dc2626; color: white; }
        .btn-danger:hover { background: #b91c1c; }
        .btn-secondary { background: #6b7280; color: white; }
        .btn-secondary:hover { background: #4b5563; }
        .btn-warning { background: #f59e0b; color: white; }
        .btn-warning:hover { background: #d97706; }
        .btn-full { width: 100%; margin-top: 8px; }
        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #374151; }
        .form-input { width: 100%; padding: 10px; border: 2px solid #d1d5db; border-radius: 6px; font-size: 14px; }
        .form-input:focus { outline: none; border-color: #2563eb; }
        .form-row { display: flex; gap: 8px; align-items: center; }
        .form-input-small { width: 80px; padding: 8px; border: 2px solid #d1d5db; border-radius: 6px; text-align: center; font-size: 14px; }
        .form-select { width: 100%; padding: 10px; border: 2px solid #d1d5db; border-radius: 6px; font-size: 14px; background: white; }
        .form-select:focus { outline: none; border-color: #2563eb; }
        .table { width: 100%; border-collapse: collapse; }
        .table th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 13px; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
        .table td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .table tr:hover { background: #f9fafb; }
        .hidden { display: none; }
        .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; }
        .modal-title { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
        .search-result { border: 2px solid #dbeafe; background: #eff6ff; padding: 12px; border-radius: 6px; margin-bottom: 8px; cursor: pointer; }
        .search-result:hover { background: #dbeafe; }
        .search-result.selected { background: #3b82f6; color: white; border-color: #2563eb; }
        .radio-group { display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
        .radio-label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        textarea { width: 100%; min-height: 200px; padding: 12px; border: 2px solid #d1d5db; border-radius: 6px; font-family: inherit; font-size: 14px; resize: vertical; }
        textarea:focus { outline: none; border-color: #2563eb; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .log-item { padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px; cursor: pointer; }
        .log-item:hover { background: #f9fafb; }
        .log-title { font-weight: 600; font-size: 14px; }
        .log-meta { font-size: 12px; color: #6b7280; margin-top: 4px; }
        .setting-item { padding: 16px; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px; }
        .setting-name { font-weight: bold; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .setting-controls { display: flex; align-items: center; gap: 12px; margin: 8px 0; }
        .setting-value { font-size: 20px; font-weight: bold; color: #2563eb; min-width: 80px; text-align: center; }
        .date-filter { display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
        .chart-container { position: relative; height: 300px; margin: 20px 0; }
        .stats-section { margin-bottom: 32px; padding-bottom: 32px; border-bottom: 2px solid #e5e7eb; }
        .stats-section:last-child { border-bottom: none; }
        .backup-section { background: #fffbeb; border: 2px solid #fde047; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .backup-info { font-size: 13px; color: #78350f; margin-bottom: 16px; line-height: 1.6; }
        .backup-warning { background: #fef3c7; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 12px; color: #92400e; }
        input[type="file"] { display: none; }
        .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .toggle-switch { position: relative; display: inline-block; width: 50px; height: 24px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .toggle-slider { background-color: #2563eb; }
        input:checked + .toggle-slider:before { transform: translateX(26px); }
        .backup-config-panel { background: #e0f2fe; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-flex">
                <div style="flex: 1;">
                    <h1 class="title">당진시청소년재단</h1>
                    <p class="subtitle">시설 통합 관리 시스템 v1.2 투트랙 백업</p>
                    <div class="branch-selector">
                        <button class="branch-btn" onclick="toggleBranchDropdown()">
                            <span>🏢</span>
                            <span id="currentBranchName">당진청소년문화의집</span>
                            <span>▼</span>
                        </button>
                        <div id="branchDropdown" class="dropdown">
                            <div class="dropdown-header">시설 목록</div>
                            <div id="branchList"></div>
                        </div>
                    </div>
                </div>
                <div class="time-display">
                    <div class="time-label">현재 시간</div>
                    <div class="time-value" id="currentTime"></div>
                    <div class="time-label" id="currentDate"></div>
                    <div class="save-indicator" id="saveIndicator">
                        <span>💾</span>
                        <span>자동 저장됨</span>
                    </div>
                    <div class="backup-status">
                        <div class="backup-status-item">
                            <span class="status-dot" id="networkStatus"></span>
                            <span id="networkStatusText">연결 확인중...</span>
                        </div>
                        <div class="backup-status-item">
                            <span>📁</span>
                            <span id="localBackupStatus">로컬: 대기중</span>
                        </div>
                        <div class="backup-status-item">
                            <span>☁️</span>
                            <span id="serverBackupStatus">서버: 대기중</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="alert-bar">
            <div class="alert-bar-title">📢 최근 알림</div>
            <div class="alert-list" id="alertList"></div>
        </div>

        <div class="tabs">
            <div class="tabs-flex">
                <button class="tab active" onclick="showTab('dashboard')">대시보드</button>
                <button class="tab" onclick="showTab('reservation')">이용 신청</button>
                <button class="tab" onclick="showTab('member')">회원 관리</button>
                <button class="tab" onclick="showTab('dailylog')">일지</button>
                <button class="tab" onclick="showTab('statistics')">통계</button>
                <button class="tab" onclick="showTab('history')">이용 기록</button>
                <button class="tab" onclick="showTab('settings')">설정</button>
            </div>
        </div>

        <div id="dashboard" class="tab-content"></div>
        <div id="reservation" class="tab-content hidden"></div>
        <div id="member" class="tab-content hidden"></div>
        <div id="settings" class="tab-content hidden"></div>
        <div id="dailylog" class="tab-content hidden"></div>
        <div id="statistics" class="tab-content hidden"></div>
        <div id="history" class="tab-content hidden"></div>
    </div>

    <div id="modalContainer"></div>
    <input type="file" id="fileInput" accept=".json" onchange="handleFileSelect(event)">
    <input type="file" id="memberExcelInput" accept=".xlsx,.xls" onchange="handleMemberExcelImport(event)">

    <script>
        const STORAGE_KEY = 'djyf_facility_management_system';
        const LAST_SAVE_KEY = 'djyf_last_save_time';
        const BACKUP_CONFIG_KEY = 'djyf_backup_config';

        const state = {
            branches: [
                { id: 'BR-001', name: '당진청소년문화의집', createdAt: new Date().toISOString() },
                { id: 'BR-002', name: '합덕청소년문화의집', createdAt: new Date().toISOString() },
                { id: 'BR-003', name: '송악청소년문화의집', createdAt: new Date().toISOString() },
                { id: 'BR-004', name: '당진시청소년상담복지센터', createdAt: new Date().toISOString() },
                { id: 'BR-005', name: '수다벅스 1호점', createdAt: new Date().toISOString() },
                { id: 'BR-006', name: '수다벅스 2호점', createdAt: new Date().toISOString() },
                { id: 'BR-007', name: '수다벅스 3호점', createdAt: new Date().toISOString() },
                { id: 'BR-008', name: '당진시여자단기청소년쉼터', createdAt: new Date().toISOString() }
            ],
            selectedBranch: 'BR-001',
            branchData: {},
            currentTime: new Date(),
            editingMemberId: null,
            alerts: [],
            editingFacility: {},
            regions: ['고대면', '당진1동', '당진2동', '당진3동', '대호지면', '면천면', '석문면', '송산면', '송악읍', '석문면', '신평면', '우강면', '정미면', '합덕읍', '기타'],
            backupConfig: {
                localEnabled: false,
                serverEnabled: false,
                serverUrl: '',
                localFolderHandle: null,
                localFolderPath: null,
                lastLocalBackup: null,
                lastServerBackup: null
            },
            isOnline: navigator.onLine,
            pendingSyncData: []
        };

        // 백업 설정 로드
        function loadBackupConfig() {
            try {
                const saved = localStorage.getItem(BACKUP_CONFIG_KEY);
                if (saved) {
                    const config = JSON.parse(saved);
                    state.backupConfig.localEnabled = config.localEnabled || false;
                    state.backupConfig.serverEnabled = config.serverEnabled || false;
                    state.backupConfig.serverUrl = config.serverUrl || '';
                    state.backupConfig.lastLocalBackup = config.lastLocalBackup;
                    state.backupConfig.lastServerBackup = config.lastServerBackup;
                }
            } catch (error) {
                console.error('백업 설정 로드 실패:', error);
            }
        }

        // 백업 설정 저장
        function saveBackupConfig() {
            try {
                const config = {
                    localEnabled: state.backupConfig.localEnabled,
                    serverEnabled: state.backupConfig.serverEnabled,
                    serverUrl: state.backupConfig.serverUrl,
                    lastLocalBackup: state.backupConfig.lastLocalBackup,
                    lastServerBackup: state.backupConfig.lastServerBackup
                };
                localStorage.setItem(BACKUP_CONFIG_KEY, JSON.stringify(config));
            } catch (error) {
                console.error('백업 설정 저장 실패:', error);
            }
        }

        // 교체할 함수 1: selectLocalBackupFolder
        async function selectLocalBackupFolder() {
            try {
                // Electron의 dialog 모듈을 직접 사용
                const { dialog } = require('@electron/remote');
                const result = await dialog.showOpenDialog({
                    properties: ['openDirectory']
                });

                if (!result.canceled && result.filePaths.length > 0) {
                    const folderPath = result.filePaths[0];
                    state.backupConfig.localFolderPath = folderPath;
                    showAlert('로컬 백업 폴더가 선택되었습니다.');
                    await performLocalBackup();
                }
            } catch (error) {
                console.error('폴더 선택 실패:', error);
                showAlert('폴더 선택에 실패했습니다.', 'error');
            }
        }

        // 교체할 함수 2: performLocalBackup
       async function performLocalBackup() {
            if (!state.backupConfig.localEnabled || !state.backupConfig.localFolderPath) {
                return;
            }

            try {
                const exportData = {
                    version: '1.2',
                    exportDate: new Date().toISOString(),
                    systemType: 'full',
                    branches: state.branches,
                    branchData: state.branchData
                };

                const jsonString = JSON.stringify(exportData, null, 2);
                const dateStr = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
                const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '');
                const filename = `백업_${dateStr}_${timeStr}.json`;
                
                // 경로 구분자는 Javascript 내에서 슬래시(/)를 사용해도 모든 OS에서 잘 작동합니다.
                const fullPath = `${state.backupConfig.localFolderPath}/${filename}`;

                // '다리'를 통해 main.js의 파일 저장 기능을 호출
                const result = await window.electronAPI.saveFile(fullPath, jsonString);

                if (result.success) {
                    state.backupConfig.lastLocalBackup = new Date().toISOString();
                    saveBackupConfig();
                    updateBackupStatus();
                    showAlert('로컬 폴더에 백업되었습니다.');
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error('로컬 백업 실패:', error);
                showAlert('로컬 백업에 실패했습니다.', 'error');
            }
        }

        // Track 2: 중앙 서버 백업
        // 교체할 함수 2: performLocalBackup
        async function performLocalBackup() {
            if (!state.backupConfig.localEnabled || !state.backupConfig.localFolderPath) {
                return;
            }

            try {
                // Node.js의 'fs'와 'path' 모듈을 직접 사용
                const fs = require('fs');
                const path = require('path');

                const exportData = {
                    version: '1.2',
                    exportDate: new Date().toISOString(),
                    systemType: 'full',
                    branches: state.branches,
                    branchData: state.branchData
                };

                const jsonString = JSON.stringify(exportData, null, 2);
                
                // ===================================================================
                // !! 최종 수정 !! : 파일 이름에서 시간 부분을 제거하여 하루에 한 파일만 생성
                const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
                const filename = `백업_${dateStr}.json`; // <-- 시간(timeStr) 제거!
                // ===================================================================
                
                // path 모듈을 사용하여 전체 파일 경로를 안전하게 생성
                const fullPath = path.join(state.backupConfig.localFolderPath, filename);

                // fs 모듈로 파일 직접 저장 (같은 이름의 파일이 있으면 자동으로 덮어씁니다)
                fs.writeFileSync(fullPath, jsonString, 'utf-8');

                state.backupConfig.lastLocalBackup = new Date().toISOString();
                saveBackupConfig();
                updateBackupStatus();
                showAlert('로컬 폴더에 백업되었습니다.');

            } catch (error) {
                console.error('로컬 백업 실패:', error);
                showAlert('로컬 백업에 실패했습니다.', 'error');
            }
        }

        // 네트워크 상태 감지 및 자동 동기화
        function setupNetworkMonitoring() {
            window.addEventListener('online', () => {
                state.isOnline = true;
                updateNetworkStatus();
                showAlert('온라인 상태로 전환되었습니다.');
                
                // 대기중인 데이터가 있으면 자동 동기화
                if (state.pendingSyncData.length > 0) {
                    performServerBackup();
                }
            });

            window.addEventListener('offline', () => {
                state.isOnline = false;
                updateNetworkStatus();
                showAlert('오프라인 상태입니다.', 'error');
            });
        }

        // 백업 상태 UI 업데이트
        function updateBackupStatus() {
            const localStatus = document.getElementById('localBackupStatus');
            const serverStatus = document.getElementById('serverBackupStatus');

            if (state.backupConfig.lastLocalBackup) {
                const time = new Date(state.backupConfig.lastLocalBackup);
                localStatus.textContent = `로컬: ${time.toLocaleTimeString('ko-KR')}`;
            } else {
                localStatus.textContent = '로컬: 대기중';
            }

            if (state.backupConfig.lastServerBackup) {
                const time = new Date(state.backupConfig.lastServerBackup);
                serverStatus.textContent = `서버: ${time.toLocaleTimeString('ko-KR')}`;
            } else {
                serverStatus.textContent = '서버: 대기중';
            }
        }

        // 네트워크 상태 UI 업데이트
        function updateNetworkStatus() {
            const statusDot = document.getElementById('networkStatus');
            const statusText = document.getElementById('networkStatusText');

            if (state.isOnline) {
                statusDot.className = 'status-dot online';
                statusText.textContent = '온라인';
            } else {
                statusDot.className = 'status-dot offline';
                statusText.textContent = '오프라인';
            }
        }

        // 자동 백업 타이머 설정
        // 교체할 함수 1: setupAutoBackup
        function setupAutoBackup() {
            // Track 1: 로컬 백업 (10분마다로 수정)
            setInterval(() => {
                if (state.backupConfig.localEnabled) {
                    performLocalBackup();
                }
            }, 10 * 60 * 1000); // 10분

            // Track 2: 서버 백업 (10분마다)
            setInterval(() => {
                if (state.backupConfig.serverEnabled) {
                    performServerBackup();
                }
            }, 10 * 60 * 1000); // 10분
        }

        function loadFromStorage() {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.branches) state.branches = parsed.branches;
                    if (parsed.selectedBranch) state.selectedBranch = parsed.selectedBranch;
                    if (parsed.branchData) state.branchData = parsed.branchData;
                    if (parsed.editingFacility) state.editingFacility = parsed.editingFacility;
                    
                    const lastSave = localStorage.getItem(LAST_SAVE_KEY);
                    if (lastSave) {
                        const saveTime = new Date(lastSave);
                        showAlert(`저장된 데이터를 불러왔습니다. (${saveTime.toLocaleString('ko-KR')})`);
                    }
                }
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
                showAlert('저장된 데이터를 불러오는데 실패했습니다.', 'error');
            }
        }

        function saveToStorage() {
            try {
                const dataToSave = {
                    branches: state.branches,
                    selectedBranch: state.selectedBranch,
                    branchData: state.branchData,
                    editingFacility: state.editingFacility
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
                localStorage.setItem(LAST_SAVE_KEY, new Date().toISOString());
                
                const indicator = document.getElementById('saveIndicator');
                if (indicator) {
                    indicator.innerHTML = '<span>💾</span><span>자동 저장됨</span>';
                    indicator.style.color = '#16a34a';
                }
            } catch (error) {
                console.error('데이터 저장 실패:', error);
            }
        }

        let saveTimeout;
        function triggerAutoSave() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => saveToStorage(), 500);
        }

        function exportDataToJSON() {
            try {
                const branch = state.branches.find(b => b.id === state.selectedBranch);
                const currentData = state.branchData[state.selectedBranch];
                
                const exportData = {
                    version: '1.2',
                    exportDate: new Date().toISOString(),
                    branchInfo: branch,
                    data: currentData,
                    metadata: {
                        totalMembers: currentData.members.length,
                        totalReservations: currentData.reservations.length,
                        totalFacilities: currentData.facilities.length,
                        totalDailyLogs: currentData.dailyLogs.length
                    }
                };

                const jsonString = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
                a.href = url;
                a.download = `${dateStr}_${branch.name}_백업.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showAlert(`데이터가 백업되었습니다.`);
            } catch (error) {
                showAlert('데이터 내보내기에 실패했습니다.', 'error');
            }
        }

        function triggerFileImport() {
            document.getElementById('fileInput').click();
        }

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            if (!file.name.endsWith('.json')) {
                showAlert('JSON 파일만 선택할 수 있습니다.', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    importDataFromJSON(e.target.result);
                } catch (error) {
                    showAlert('파일을 읽을 수 없습니다.', 'error');
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }

        function importDataFromJSON(jsonString) {
            try {
                const importedData = JSON.parse(jsonString);
                
                if (!importedData.version || !importedData.branchInfo || !importedData.data) {
                    throw new Error('올바른 백업 파일이 아닙니다.');
                }
                
                const branchName = importedData.branchInfo.name;
                const currentBranchName = state.branches.find(b => b.id === state.selectedBranch).name;
                
                if (!confirm(`"${currentBranchName}" 지점의 데이터를 "${branchName}" 백업 데이터로 덮어쓰시겠습니까?\n\n⚠️ 현재 데이터는 모두 삭제됩니다!`)) {
                    showAlert('데이터 가져오기를 취소했습니다.');
                    return;
                }
                
                state.branchData[state.selectedBranch] = importedData.data;
                triggerAutoSave();
                showAlert(`${branchName} 데이터를 성공적으로 불러왔습니다.`);
                renderCurrentTab();
            } catch (error) {
                showAlert('데이터 가져오기에 실패했습니다.', 'error');
            }
        }

        function exportAllDataToJSON() {
            try {
                const exportData = {
                    version: '1.2',
                    exportDate: new Date().toISOString(),
                    systemType: 'full',
                    branches: state.branches,
                    branchData: state.branchData
                };

                const jsonString = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
                a.href = url;
                a.download = `${dateStr}_전체시설_백업.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showAlert(`전체 시설 데이터가 백업되었습니다.`);
            } catch (error) {
                showAlert('전체 데이터 내보내기에 실패했습니다.', 'error');
            }
        }

        function init() {
            loadFromStorage();
            loadBackupConfig();
            setupNetworkMonitoring();
            setupAutoBackup();
            updateNetworkStatus();
            updateBackupStatus();
            
            state.branches.forEach(branch => {
                if (!state.branchData[branch.id]) {
                    state.branchData[branch.id] = {
                        facilities: [
                            { id: 'PC-001', name: '컴퓨터 1번', type: 'computer', capacity: 1, timeLimit: 60 },
                            { id: 'PC-002', name: '컴퓨터 2번', type: 'computer', capacity: 1, timeLimit: 60 },
                            { id: 'CLUB-001', name: '동아리실', type: 'room', capacity: 10, timeLimit: 60 }
                        ],
                        members: [],
                        reservations: [],
                        dailyLogs: []
                    };
                }
            });
            
            updateTime();
            setInterval(updateTime, 1000);
            renderBranchList();
            renderDashboard();
            renderAlerts();
        }

        function updateTime() {
            state.currentTime = new Date();
            document.getElementById('currentTime').textContent = state.currentTime.toLocaleTimeString('ko-KR');
            document.getElementById('currentDate').textContent = state.currentTime.toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
            });
        }

        function showAlert(message, type = 'success') {
            state.alerts.unshift({ message, type, time: new Date() });
            if (state.alerts.length > 3) state.alerts = state.alerts.slice(0, 3);
            renderAlerts();
        }

        function renderAlerts() {
            const container = document.getElementById('alertList');
            if (state.alerts.length === 0) {
                container.innerHTML = '<div style="color: #6b7280; font-size: 13px;">알림이 없습니다.</div>';
            } else {
                container.innerHTML = state.alerts.map(alert => `
                    <div class="alert-item ${alert.type}">
                        <span>${alert.type === 'success' ? '✓' : '⚠️'}</span>
                        <span>${alert.message}</span>
                    </div>
                `).join('');
            }
        }

        function generateMemberNumber(birthDate) {
            const data = state.branchData[state.selectedBranch];
            const birthYYMMDD = birthDate.replace(/-/g, '').substring(2);
            const sameBirthMembers = data.members.filter(m => 
                m.birthDate.replace(/-/g, '').substring(2) === birthYYMMDD
            );
            const nextNumber = sameBirthMembers.length + 1;
            return birthYYMMDD + nextNumber.toString().padStart(3, '0');
        }

        function toggleBranchDropdown() {
            document.getElementById('branchDropdown').classList.toggle('show');
        }

        function renderBranchList() {
            const list = document.getElementById('branchList');
            list.innerHTML = state.branches.map(branch => `
                <div class="dropdown-item ${branch.id === state.selectedBranch ? 'active' : ''}" onclick="selectBranch('${branch.id}')">
                    <div>
                        <div style="font-weight: 600;">${branch.name}</div>
                        <div style="font-size: 11px; color: #6b7280;">개소일: ${new Date(branch.createdAt).toLocaleDateString('ko-KR')}</div>
                    </div>
                </div>
            `).join('') + `
                <div style="padding: 12px; border-top: 2px solid #e5e7eb;">
                    <button class="btn btn-primary" style="width: 100%; font-size: 13px;" onclick="showAddBranchModal()">
                        ➕ 새 시설 추가
                    </button>
                </div>
            `;
        }

        function selectBranch(branchId) {
            state.selectedBranch = branchId;
            const branch = state.branches.find(b => b.id === branchId);
            document.getElementById('currentBranchName').textContent = branch.name;
            toggleBranchDropdown();
            renderBranchList();
            renderCurrentTab();
            triggerAutoSave();
        }

        function showAddBranchModal() {
            document.getElementById('branchDropdown').classList.remove('show');
            document.getElementById('modalContainer').innerHTML = `
                <div class="modal">
                    <div class="modal-content">
                        <h3 class="modal-title">➕ 새 시설 추가</h3>
                        <div class="form-group">
                            <label class="form-label">시설명</label>
                            <input type="text" class="form-input" id="newBranchName" placeholder="예: 당진청소년문화의집 2호점">
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-primary" style="flex: 1;" onclick="addNewBranch()">추가</button>
                            <button class="btn btn-secondary" style="flex: 1;" onclick="closeModal()">취소</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function addNewBranch() {
            const name = document.getElementById('newBranchName').value.trim();
            
            if (!name) {
                showAlert('시설명을 입력해주세요.', 'error');
                return;
            }
            
            if (state.branches.find(b => b.name === name)) {
                showAlert('이미 존재하는 시설명입니다.', 'error');
                return;
            }
            
            const newBranchId = 'BR-' + String(Date.now()).slice(-3).padStart(3, '0');
            
            state.branches.push({
                id: newBranchId,
                name: name,
                createdAt: new Date().toISOString()
            });
            
            // 새 지점 초기 데이터 생성
            state.branchData[newBranchId] = {
                facilities: [
                    { id: 'PC-001', name: '컴퓨터 1번', type: 'computer', capacity: 1, timeLimit: 60 },
                    { id: 'PC-002', name: '컴퓨터 2번', type: 'computer', capacity: 1, timeLimit: 60 },
                    { id: 'CLUB-001', name: '동아리실', type: 'room', capacity: 10, timeLimit: 60 }
                ],
                members: [],
                reservations: [],
                dailyLogs: []
            };
            
            triggerAutoSave();
            showAlert(`${name} 시설이 추가되었습니다.`);
            closeModal();
            renderBranchList();
        }

        function closeModal() {
            document.getElementById('modalContainer').innerHTML = '';
        }

        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            document.getElementById(tabName).classList.remove('hidden');
            event.target.classList.add('active');
            
            switch(tabName) {
                case 'dashboard': renderDashboard(); break;
                case 'reservation': renderReservation(); break;
                case 'member': renderMember(); break;
                case 'settings': renderSettings(); break;
                case 'dailylog': renderDailyLog(); break;
                case 'statistics': renderStatistics(); break;
                case 'history': renderHistory(); break;
            }
        }

        function renderCurrentTab() {
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) activeTab.click();
        }

        function renderDashboard() {
            const data = state.branchData[state.selectedBranch];
            const usingCount = data.reservations.filter(r => r.status === 'using').length;
            const reservedCount = data.reservations.filter(r => r.status === 'reserved').length;

            document.getElementById('dashboard').innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card blue">
                        <div class="stat-label">이용중</div>
                        <div class="stat-value">${usingCount}</div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-label">예약중</div>
                        <div class="stat-value">${reservedCount}</div>
                    </div>
                    <div class="stat-card purple">
                        <div class="stat-label">총 회원</div>
                        <div class="stat-value">${data.members.length}</div>
                    </div>
                </div>
                <div class="panel">
                    <h3 class="panel-title"><span>📅</span> 실시간 시설 현황</h3>
                    <div class="facility-grid" id="facilityStatus"></div>
                </div>
            `;
            
            renderFacilityStatus();
            setInterval(renderFacilityStatus, 1000);
        }

        function renderFacilityStatus() {
            const data = state.branchData[state.selectedBranch];
            const container = document.getElementById('facilityStatus');
            if (!container) return;

            container.innerHTML = data.facilities.map(facility => {
                const reservation = data.reservations.find(r => 
                    r.facilityId === facility.id && 
                    (r.status === 'using' || r.status === 'reserved')
                );

                let statusClass = 'available';
                let statusText = '이용가능';
                let details = '';

                if (reservation) {
                    const now = state.currentTime;
                    const endTime = new Date(reservation.endTime);
                    const diffMs = endTime - now;
                    const diffMin = Math.floor(diffMs / 60000);
                    const diffSec = Math.floor((diffMs % 60000) / 1000);

                    if (reservation.status === 'using') {
                        const startTime = new Date(reservation.checkedInAt);
                        const usedMs = now - startTime;
                        const usedHours = Math.floor(usedMs / 3600000);
                        const usedMin = Math.floor((usedMs % 3600000) / 60000);
                        const usedSec = Math.floor((usedMs % 60000) / 1000);

                        if (diffMs < 0) {
                            statusClass = 'overtime';
                            statusText = '시간초과!';
                            const overMin = Math.abs(diffMin);
                            const overSec = Math.abs(diffSec);
                            details = `
                                <div class="facility-details">
                                    <div><span>👤</span> ${reservation.memberName} (${reservation.memberNumber})</div>
                                    <div><span>⏱️</span> 이용시간: ${usedHours > 0 ? usedHours + '시간 ' : ''}${usedMin}분 ${usedSec}초</div>
                                    <div class="facility-time" style="color: #dc2626; font-weight: bold;">⚠️ +${overMin}분 ${overSec}초 초과중</div>
                                </div>
                                <button class="btn btn-danger btn-full" onclick="event.stopPropagation(); checkOut('${reservation.id}')">퇴실 처리</button>
                            `;
                        } else {
                            statusClass = 'using';
                            statusText = '이용중';
                            details = `
                                <div class="facility-details">
                                    <div><span>👤</span> ${reservation.memberName} (${reservation.memberNumber})</div>
                                    <div><span>⏱️</span> 이용시간: ${usedHours > 0 ? usedHours + '시간 ' : ''}${usedMin}분 ${usedSec}초</div>
                                    <div class="facility-time">남은시간: ${diffMin}분 ${diffSec}초</div>
                                </div>
                                <button class="btn btn-danger btn-full" onclick="event.stopPropagation(); checkOut('${reservation.id}')">퇴실 처리</button>
                            `;
                        }
                    } else {
                        statusClass = 'reserved';
                        statusText = '예약됨';
                        details = `
                            <div class="facility-details">
                                <div><span>👤</span> ${reservation.memberName} (${reservation.memberNumber})</div>
                                <div><span>🕐</span> ${new Date(reservation.startTime).toLocaleTimeString('ko-KR')}</div>
                            </div>
                            <button class="btn btn-secondary btn-full" onclick="event.stopPropagation(); cancelReservation('${reservation.id}')">예약 취소</button>
                        `;
                    }
                } else {
                    details = '<div style="text-align: center; padding: 10px 0; color: #6b7280; font-size: 13px;">클릭하여 회원 배정</div>';
                }

                return `
                    <div class="facility-card ${statusClass}" onclick="${!reservation ? `showFacilityMemberSearch('${facility.id}')` : ''}">
                        <div class="facility-header">
                            <div>
                                <div class="facility-name">${facility.name}</div>
                                <div class="facility-info">수용인원: ${facility.capacity}명</div>
                            </div>
                            <div class="status-badge ${statusClass}">${statusText}</div>
                        </div>
                        ${details}
                    </div>
                `;
            }).join('');
        }

        function showFacilityMemberSearch(facilityId) {
            const data = state.branchData[state.selectedBranch];
            const facility = data.facilities.find(f => f.id === facilityId);
            
            document.getElementById('modalContainer').innerHTML = `
                <div class="modal">
                    <div class="modal-content">
                        <h3 class="modal-title">${facility.name} - 회원 배정</h3>
                        <div class="form-group">
                            <label class="form-label">회원 검색</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="dashSearchType" value="name" checked> 이름
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="dashSearchType" value="birth"> 생년월일
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="dashSearchType" value="phone"> 연락처
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="dashSearchType" value="number"> 회원번호
                                </label>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" class="form-input" id="dashSearchValue" placeholder="검색어 입력">
                                <button class="btn btn-primary" onclick="searchMemberForFacility()">검색</button>
                            </div>
                        </div>
                        <div id="dashSearchResults"></div>
                        <button class="btn btn-secondary" onclick="closeFacilityModal()">취소</button>
                    </div>
                </div>
            `;
            window.currentFacilityId = facilityId;
        }

        function searchMemberForFacility() {
            const data = state.branchData[state.selectedBranch];
            const searchValue = document.getElementById('dashSearchValue').value.trim();
            const searchType = document.querySelector('input[name="dashSearchType"]:checked').value;

            if (!searchValue) {
                showAlert('검색어를 입력해주세요.', 'error');
                return;
            }

            let results = [];
            if (searchType === 'name') {
                results = data.members.filter(m => m.name.includes(searchValue));
            } else if (searchType === 'birth') {
                results = data.members.filter(m => m.birthDate.replace(/-/g, '').includes(searchValue.replace(/-/g, '')));
            } else if (searchType === 'phone') {
                results = data.members.filter(m => m.phone.includes(searchValue));
            } else if (searchType === 'number') {
                results = data.members.filter(m => m.memberNumber.includes(searchValue));
            }

            const container = document.getElementById('dashSearchResults');
            if (results.length === 0) {
                container.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">일치하는 회원이 없습니다.</div>';
                return;
            }

            container.innerHTML = `
                <div style="margin: 16px 0;">
                    <label class="form-label">검색 결과 (${results.length}명)</label>
                    ${results.map(m => `
                        <div class="search-result" onclick="assignMemberToFacility('${m.id}')">
                            <div style="font-weight: 600; font-size: 15px;">${m.name} (${m.memberNumber})</div>
                            <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${m.phone} | ${m.birthDate}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function assignMemberToFacility(memberId) {
            const data = state.branchData[state.selectedBranch];
            const member = data.members.find(m => m.id === memberId);
            const facility = data.facilities.find(f => f.id === window.currentFacilityId);
            
            // 해당 회원이 현재 이용 중인 시설 확인
            const currentReservation = data.reservations.find(r => 
                r.memberId === memberId && r.status === 'using'
            );
            
            if (currentReservation) {
                // 이미 다른 시설을 이용 중인 경우 확인 모달 표시
                const currentFacility = data.facilities.find(f => f.id === currentReservation.facilityId);
                
                document.getElementById('modalContainer').innerHTML = `
                    <div class="modal">
                        <div class="modal-content">
                            <h3 class="modal-title">⚠️ 시설 이용 중</h3>
                            <div style="padding: 20px 0; font-size: 15px; line-height: 1.6;">
                                <p style="margin-bottom: 12px;"><strong>${member.name}님</strong>은 현재 <strong style="color: #2563eb;">${currentFacility.name}</strong>을(를) 이용 중입니다.</p>
                                <p style="color: #6b7280;">기존 시설을 자동으로 퇴실 처리하고 새로운 시설로 이동하시겠습니까?</p>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn btn-primary" style="flex: 1;" onclick="confirmFacilityTransfer('${memberId}', '${currentReservation.id}')">동의</button>
                                <button class="btn btn-secondary" style="flex: 1;" onclick="closeFacilityModal()">비동의</button>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }
            
            // 이용 중인 시설이 없으면 바로 배정
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + facility.timeLimit * 60000);

            data.reservations.push({
                id: 'R' + Date.now(),
                memberId: member.id,
                memberName: member.name,
                memberNumber: member.memberNumber,
                memberGender: member.gender,
                memberRegion: member.region,
                facilityId: facility.id,
                facilityName: facility.name,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: 'using',
                checkedInAt: startTime.toISOString(),
                checkedOutAt: null
            });

            triggerAutoSave();
            showAlert(`${member.name}님 - ${facility.name} 이용 시작`);
            closeFacilityModal();
            renderFacilityStatus();
        }

        function confirmFacilityTransfer(memberId, oldReservationId) {
            const data = state.branchData[state.selectedBranch];
            const member = data.members.find(m => m.id === memberId);
            const newFacility = data.facilities.find(f => f.id === window.currentFacilityId);
            
            // 기존 시설 퇴실 처리
            const oldReservationIdx = data.reservations.findIndex(r => r.id === oldReservationId);
            if (oldReservationIdx !== -1) {
                data.reservations[oldReservationIdx].status = 'completed';
                data.reservations[oldReservationIdx].checkedOutAt = new Date().toISOString();
            }
            
            // 새 시설 배정
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + newFacility.timeLimit * 60000);

            data.reservations.push({
                id: 'R' + Date.now(),
                memberId: member.id,
                memberName: member.name,
                memberNumber: member.memberNumber,
                memberGender: member.gender,
                memberRegion: member.region,
                facilityId: newFacility.id,
                facilityName: newFacility.name,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: 'using',
                checkedInAt: startTime.toISOString(),
                checkedOutAt: null
            });

            triggerAutoSave();
            showAlert(`${member.name}님 - 시설 이동 완료 (${newFacility.name})`);
            closeFacilityModal();
            renderFacilityStatus();
        }

        function closeFacilityModal() {
            document.getElementById('modalContainer').innerHTML = '';
        }

        function checkOut(reservationId) {
            const data = state.branchData[state.selectedBranch];
            const idx = data.reservations.findIndex(r => r.id === reservationId);
            if (idx !== -1) {
                data.reservations[idx].status = 'completed';
                data.reservations[idx].checkedOutAt = new Date().toISOString();
                triggerAutoSave();
                showAlert('퇴실 처리되었습니다.');
                renderFacilityStatus();
            }
        }

        function cancelReservation(reservationId) {
            const data = state.branchData[state.selectedBranch];
            const idx = data.reservations.findIndex(r => r.id === reservationId);
            if (idx !== -1) {
                data.reservations[idx].status = 'cancelled';
                triggerAutoSave();
                showAlert('예약이 취소되었습니다.');
                renderFacilityStatus();
            }
        }

        function renderMember() {
            const data = state.branchData[state.selectedBranch];
            const isEditing = state.editingMemberId !== null;
            const editMember = isEditing ? data.members.find(m => m.id === state.editingMemberId) : null;

            document.getElementById('member').innerHTML = `
                <div class="panel">
                    <h3 class="panel-title">${isEditing ? '회원 정보 수정' : '신규 회원 등록'}</h3>
                    <div style="max-width: 600px;">
                        <div class="form-group">
                            <label class="form-label">성명</label>
                            <input type="text" class="form-input" id="memberName" placeholder="홍길동" value="${editMember ? editMember.name : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">생년월일</label>
                            <div class="form-row">
                                <input type="text" class="form-input-small" id="birthYear" placeholder="1987" maxlength="4" value="${editMember ? editMember.birthDate.split('-')[0] : ''}" oninput="if(this.value.length >= 4) document.getElementById('birthMonth').focus()">
                                <span>년</span>
                                <input type="text" class="form-input-small" id="birthMonth" placeholder="02" maxlength="2" value="${editMember ? editMember.birthDate.split('-')[1] : ''}" oninput="if(this.value.length >= 2) document.getElementById('birthDay').focus()">
                                <span>월</span>
                                <input type="text" class="form-input-small" id="birthDay" placeholder="02" maxlength="2" value="${editMember ? editMember.birthDate.split('-')[2] : ''}">
                                <span>일</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">성별</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="memberGender" value="남" ${!editMember || editMember.gender === '남' ? 'checked' : ''}> 남
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="memberGender" value="여" ${editMember && editMember.gender === '여' ? 'checked' : ''}> 여
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">연락처</label>
                            <input type="tel" class="form-input" id="memberPhone" placeholder="010-0000-0000" value="${editMember ? editMember.phone : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">거주지역</label>
                            <select class="form-select" id="memberRegion">
                                <option value="">선택해주세요</option>
                                ${state.regions.map(r => `<option value="${r}" ${editMember && editMember.region === r ? 'selected' : ''}>${r}</option>`).join('')}
                            </select>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-primary" style="flex: 1;" onclick="${isEditing ? 'updateMember()' : 'registerMember()'}">
                                ${isEditing ? '수정 완료' : '등록하기'}
                            </button>
                            ${isEditing ? '<button class="btn btn-secondary" onclick="cancelEditMember()">취소</button>' : ''}
                        </div>
                    </div>
                </div>
                <div class="panel">
                    <div class="flex-between">
                        <h4 class="panel-title">등록된 회원 (${data.members.length}명)</h4>
                        <div class="btn-group">
                            <button class="btn btn-success" onclick="downloadMembersExcel()">📥 엑셀 다운로드</button>
                            <button class="btn btn-primary" onclick="triggerMemberExcelImport()">📤 엑셀 업로드</button>
                        </div>
                    </div>
                    <div style="overflow-x: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>회원번호</th>
                                    <th>성명</th>
                                    <th>성별</th>
                                    <th>생년월일</th>
                                    <th>연락처</th>
                                    <th>거주지역</th>
                                    <th>가입일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.members.length === 0 ? '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #6b7280;">등록된 회원이 없습니다.</td></tr>' : 
                                data.members.map(m => `
                                    <tr>
                                        <td>${m.memberNumber}</td>
                                        <td>${m.name}</td>
                                        <td>${m.gender || '-'}</td>
                                        <td>${m.birthDate}</td>
                                        <td>${m.phone}</td>
                                        <td>${m.region || '-'}</td>
                                        <td>${new Date(m.registeredAt).toLocaleDateString('ko-KR')}</td>
                                        <td><button class="btn btn-primary" style="padding: 4px 8px; font-size: 12px;" onclick="editMember('${m.id}')">수정</button></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function registerMember() {
            const name = document.getElementById('memberName').value.trim();
            const year = document.getElementById('birthYear').value.trim();
            const month = document.getElementById('birthMonth').value.trim();
            const day = document.getElementById('birthDay').value.trim();
            const gender = document.querySelector('input[name="memberGender"]:checked').value;
            const phone = document.getElementById('memberPhone').value.trim();
            const region = document.getElementById('memberRegion').value;

            if (!name || !year || !month || !day || !phone || !region) {
                showAlert('모든 필드를 입력해주세요.', 'error');
                return;
            }

            const data = state.branchData[state.selectedBranch];
            const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

            if (data.members.find(m => m.phone === phone)) {
                showAlert('이미 등록된 연락처입니다.', 'error');
                return;
            }

            const memberNumber = generateMemberNumber(birthDate);

            data.members.push({
                id: 'M' + Date.now(),
                memberNumber,
                name, birthDate, gender, phone, region,
                registeredAt: new Date().toISOString(),
                status: 'active'
            });

            triggerAutoSave();
            showAlert(`${name}님이 등록되었습니다. (회원번호: ${memberNumber})`);
            renderMember();
        }

        function editMember(memberId) {
            state.editingMemberId = memberId;
            renderMember();
        }

        function updateMember() {
            const name = document.getElementById('memberName').value.trim();
            const year = document.getElementById('birthYear').value.trim();
            const month = document.getElementById('birthMonth').value.trim();
            const day = document.getElementById('birthDay').value.trim();
            const gender = document.querySelector('input[name="memberGender"]:checked').value;
            const phone = document.getElementById('memberPhone').value.trim();
            const region = document.getElementById('memberRegion').value;

            if (!name || !year || !month || !day || !phone || !region) {
                showAlert('모든 필드를 입력해주세요.', 'error');
                return;
            }

            const data = state.branchData[state.selectedBranch];
            const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            const duplicatePhone = data.members.find(m => m.phone === phone && m.id !== state.editingMemberId);
            if (duplicatePhone) {
                showAlert('이미 등록된 연락처입니다.', 'error');
                return;
            }

            const memberIdx = data.members.findIndex(m => m.id === state.editingMemberId);
            if (memberIdx !== -1) {
                const oldBirthDate = data.members[memberIdx].birthDate;
                const newMemberNumber = birthDate !== oldBirthDate ? generateMemberNumber(birthDate) : data.members[memberIdx].memberNumber;
                
                data.members[memberIdx] = {
                    ...data.members[memberIdx],
                    name, birthDate, gender, phone, region, memberNumber: newMemberNumber
                };
                triggerAutoSave();
                showAlert(`${name}님의 정보가 수정되었습니다.`);
                state.editingMemberId = null;
                renderMember();
            }
        }

        function cancelEditMember() {
            state.editingMemberId = null;
            renderMember();
        }

        function downloadMembersExcel() {
            const data = state.branchData[state.selectedBranch];
            const branch = state.branches.find(b => b.id === state.selectedBranch);
            
            if (data.members.length === 0) {
                showAlert('다운로드할 회원 데이터가 없습니다.', 'error');
                return;
            }
            
            const excelData = data.members.map(m => ({
                '회원번호': m.memberNumber,
                '성명': m.name,
                '성별': m.gender || '-',
                '생년월일': m.birthDate,
                '연락처': m.phone,
                '거주지역': m.region || '-',
                '가입일': new Date(m.registeredAt).toLocaleDateString('ko-KR'),
                '상태': m.status === 'active' ? '활동' : '비활동'
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '회원목록');
            
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const filename = `${dateStr}_${branch.name}_회원목록.xlsx`;
            
            XLSX.writeFile(wb, filename);
            showAlert(`회원 목록이 다운로드되었습니다.`);
        }

        function triggerMemberExcelImport() {
            document.getElementById('memberExcelInput').click();
        }

        function handleMemberExcelImport(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            if (!file.name.match(/\.(xlsx|xls)$/)) {
                showAlert('엑셀 파일(.xlsx, .xls)만 선택할 수 있습니다.', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                    
                    if (jsonData.length === 0) {
                        showAlert('엑셀 파일에 데이터가 없습니다.', 'error');
                        return;
                    }
                    
                    importMembersFromExcel(jsonData);
                } catch (error) {
                    showAlert('엑셀 파일을 읽을 수 없습니다.', 'error');
                }
            };
            reader.readAsArrayBuffer(file);
            event.target.value = '';
        }

        function importMembersFromExcel(jsonData) {
            const branchData = state.branchData[state.selectedBranch];
            let successCount = 0;
            let skipCount = 0;
            const errors = [];
            
            jsonData.forEach((row, index) => {
                try {
                    const name = row['성명']?.toString().trim();
                    const birthDate = row['생년월일']?.toString().trim();
                    const gender = row['성별']?.toString().trim();
                    const phone = row['연락처']?.toString().trim();
                    const region = row['거주지역']?.toString().trim();
                    
                    if (!name || !birthDate || !phone) {
                        errors.push(`${index + 2}행: 필수 정보 누락`);
                        skipCount++;
                        return;
                    }
                    
                    let normalizedBirthDate = birthDate;
                    if (birthDate.match(/^\d{8}$/)) {
                        normalizedBirthDate = `${birthDate.substring(0,4)}-${birthDate.substring(4,6)}-${birthDate.substring(6,8)}`;
                    } else if (!birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        errors.push(`${index + 2}행: 생년월일 형식 오류`);
                        skipCount++;
                        return;
                    }
                    
                    if (branchData.members.find(m => m.phone === phone)) {
                        errors.push(`${index + 2}행: 중복 연락처`);
                        skipCount++;
                        return;
                    }
                    
                    const memberNumber = generateMemberNumber(normalizedBirthDate);
                    
                    branchData.members.push({
                        id: 'M' + Date.now() + '_' + index,
                        memberNumber,
                        name,
                        birthDate: normalizedBirthDate,
                        gender: gender || '남',
                        phone,
                        region: region || '기타',
                        registeredAt: new Date().toISOString(),
                        status: 'active'
                    });
                    
                    successCount++;
                } catch (error) {
                    skipCount++;
                }
            });
            
            if (successCount > 0) {
                triggerAutoSave();
                showAlert(`${successCount}명 등록${skipCount > 0 ? `, ${skipCount}명 건너뜀` : ''}`);
            }
            
            if (errors.length > 0 && errors.length <= 10) {
                alert('일부 데이터 등록 실패:\n\n' + errors.slice(0, 5).join('\n'));
            }
            
            renderMember();
        }

        function renderReservation() {
            const data = state.branchData[state.selectedBranch];
            document.getElementById('reservation').innerHTML = `
                <div class="panel">
                    <h3 class="panel-title">시설 이용 신청</h3>
                    <div style="max-width: 800px;">
                        <div class="form-group">
                            <label class="form-label">회원 검색</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="searchType" value="name" checked> 이름
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="searchType" value="birth"> 생년월일
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="searchType" value="phone"> 연락처
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="searchType" value="number"> 회원번호
                                </label>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" class="form-input" id="searchValue" placeholder="검색어 입력">
                                <button class="btn btn-primary" onclick="searchMember()">검색</button>
                            </div>
                        </div>
                        <div id="searchResults"></div>
                        <div id="reservationForm"></div>
                    </div>
                </div>
            `;
        }

        let selectedMember = null;

        function searchMember() {
            const data = state.branchData[state.selectedBranch];
            const searchValue = document.getElementById('searchValue').value.trim();
            const searchType = document.querySelector('input[name="searchType"]:checked').value;

            if (!searchValue) {
                showAlert('검색어를 입력해주세요.', 'error');
                return;
            }

            let results = [];
            if (searchType === 'name') {
                results = data.members.filter(m => m.name.includes(searchValue));
            } else if (searchType === 'birth') {
                results = data.members.filter(m => m.birthDate.replace(/-/g, '').includes(searchValue.replace(/-/g, '')));
            } else if (searchType === 'phone') {
                results = data.members.filter(m => m.phone.includes(searchValue));
            } else if (searchType === 'number') {
                results = data.members.filter(m => m.memberNumber.includes(searchValue));
            }

            const container = document.getElementById('searchResults');
            if (results.length === 0) {
                container.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">일치하는 회원이 없습니다.</div>';
                return;
            }

            container.innerHTML = `
                <div style="margin: 16px 0;">
                    <label class="form-label">검색 결과 (${results.length}명)</label>
                    ${results.map(m => `
                        <div class="search-result" onclick="selectMemberForReservation('${m.id}')">
                            <div style="font-weight: 600; font-size: 15px;">${m.name} (${m.memberNumber})</div>
                            <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${m.phone} | ${m.birthDate}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function selectMemberForReservation(memberId) {
            const data = state.branchData[state.selectedBranch];
            selectedMember = data.members.find(m => m.id === memberId);
            
            document.getElementById('searchResults').innerHTML = `
                <div class="search-result selected">
                    <div style="font-weight: 600; font-size: 15px;">${selectedMember.name} (${selectedMember.memberNumber})</div>
                    <div style="font-size: 13px; margin-top: 4px;">${selectedMember.phone} | ${selectedMember.birthDate}</div>
                </div>
            `;

            document.getElementById('reservationForm').innerHTML = `
                <div class="form-group">
                    <label class="form-label">이용 유형</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="reservationType" value="immediate" checked onchange="toggleReservationTime()"> 즉시 이용
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="reservationType" value="reserved" onchange="toggleReservationTime()"> 예약
                        </label>
                    </div>
                </div>
                <div class="form-group hidden" id="reservationTimeGroup">
                    <label class="form-label">예약 시간</label>
                    <input type="datetime-local" class="form-input" id="reservationTime">
                </div>
                <div class="form-group">
                    <label class="form-label">시설 선택</label>
                    <div class="facility-grid">
                        ${data.facilities.map(f => `
                            <div class="facility-card available" onclick="selectFacility('${f.id}')" style="cursor: pointer;">
                                <div class="facility-header">
                                    <div>
                                        <div class="facility-name">${f.name}</div>
                                        <div class="facility-info">${f.timeLimit}분, ${f.capacity}명</div>
                                    </div>
                                    <div class="status-badge available">선택</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function toggleReservationTime() {
            const type = document.querySelector('input[name="reservationType"]:checked').value;
            const timeGroup = document.getElementById('reservationTimeGroup');
            if (type === 'reserved') {
                timeGroup.classList.remove('hidden');
            } else {
                timeGroup.classList.add('hidden');
            }
        }

        function selectFacility(facilityId) {
            const data = state.branchData[state.selectedBranch];
            const facility = data.facilities.find(f => f.id === facilityId);
            const type = document.querySelector('input[name="reservationType"]:checked').value;
            
            const startTime = type === 'immediate' ? new Date() : new Date(document.getElementById('reservationTime').value);
            const endTime = new Date(startTime.getTime() + facility.timeLimit * 60000);

            data.reservations.push({
                id: 'R' + Date.now(),
                memberId: selectedMember.id,
                memberName: selectedMember.name,
                memberNumber: selectedMember.memberNumber,
                memberGender: selectedMember.gender,
                memberRegion: selectedMember.region,
                facilityId: facility.id,
                facilityName: facility.name,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: type === 'immediate' ? 'using' : 'reserved',
                checkedInAt: type === 'immediate' ? startTime.toISOString() : null,
                checkedOutAt: null
            });

            triggerAutoSave();
            showAlert(`${selectedMember.name}님 - ${facility.name} ${type === 'immediate' ? '이용 시작' : '예약 완료'}`);
            selectedMember = null;
            renderReservation();
        }

        function renderSettings() {
            const data = state.branchData[state.selectedBranch];
            const branch = state.branches.find(b => b.id === state.selectedBranch);
            
            document.getElementById('settings').innerHTML = `
                <div class="backup-config-panel">
                    <h3 class="panel-title"><span>🔄</span> 투트랙 자동 백업 설정</h3>
                    
                    <div style="margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 4px;">Track 1: 로컬 폴더 백업 (10분마다)</div>
                                <div style="font-size: 12px; color: #0c4a6e;">선택한 폴더에 자동으로 백업 파일 저장</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="localBackupToggle" ${state.backupConfig.localEnabled ? 'checked' : ''} onchange="toggleLocalBackup()">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <button class="btn btn-primary" onclick="selectLocalBackupFolder()">
                            📁 백업 폴더 선택
                        </button>
                        <button class="btn btn-success" onclick="performLocalBackup()" style="margin-left: 8px;">
                            수동 백업
                        </button>
                        ${state.backupConfig.lastLocalBackup ? `
                            <div style="margin-top: 8px; font-size: 12px; color: #0c4a6e;">
                                마지막 백업: ${new Date(state.backupConfig.lastLocalBackup).toLocaleString('ko-KR')}
                            </div>
                        ` : ''}
                    </div>

                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 4px;">Track 2: 중앙 서버 백업 (10분마다)</div>
                                <div style="font-size: 12px; color: #0c4a6e;">온라인 상태에서 서버로 자동 백업</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="serverBackupToggle" ${state.backupConfig.serverEnabled ? 'checked' : ''} onchange="toggleServerBackup()">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="form-label">서버 URL</label>
                            <input type="text" class="form-input" id="serverUrl" placeholder="https://your-server.com/api/backup" value="${state.backupConfig.serverUrl}">
                        </div>
                        <button class="btn btn-primary" onclick="saveServerUrl()">
                            💾 서버 URL 저장
                        </button>
                        <button class="btn btn-success" onclick="performServerBackup()" style="margin-left: 8px;">
                            수동 백업
                        </button>
                        ${state.backupConfig.lastServerBackup ? `
                            <div style="margin-top: 8px; font-size: 12px; color: #0c4a6e;">
                                마지막 백업: ${new Date(state.backupConfig.lastServerBackup).toLocaleString('ko-KR')}
                            </div>
                        ` : ''}
                    </div>

                    <div style="margin-top: 20px; padding: 12px; background: #dbeafe; border-radius: 6px; font-size: 12px; color: #1e40af;">
                        <strong>💡 백업 안내:</strong><br>
                        • 로컬 백업: 브라우저의 File System Access API를 지원하는 Chrome/Edge에서만 사용 가능<br>
                        • 서버 백업: 온라인 상태에서만 작동하며, 오프라인 시 자동 대기 후 온라인 전환 시 동기화<br>
                        • LocalStorage는 항상 자동 저장됩니다
                    </div>
                </div>

                <div class="backup-section">
                    <h3 class="panel-title"><span>💾</span> 수동 백업 및 복원</h3>
                    <div class="backup-info">
                        <strong>📋 백업 기능 안내</strong><br>
                        • JSON 형식으로 데이터를 백업하고 복원할 수 있습니다.<br>
                        • 백업 파일은 회원정보, 예약내역, 시설정보, 일지를 모두 포함합니다.
                    </div>
                    <div class="backup-warning">
                        ⚠️ <strong>주의사항</strong><br>
                        • 데이터를 복원하면 현재 지점의 모든 데이터가 대체됩니다.<br>
                        • 복원 전에 현재 데이터를 백업해두는 것을 권장합니다.
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="exportDataToJSON()">
                            📥 현재 지점 백업 (${branch.name})
                        </button>
                        <button class="btn btn-success" onclick="exportAllDataToJSON()">
                            📦 전체 시설 백업
                        </button>
                        <button class="btn btn-warning" onclick="triggerFileImport()">
                            📤 백업 파일 불러오기
                        </button>
                    </div>
                    <div style="margin-top: 16px; padding: 12px; background: #f3f4f6; border-radius: 6px; font-size: 12px; color: #4b5563;">
                        <strong>현재 데이터:</strong> 회원 ${data.members.length}명 | 시설 ${data.facilities.length}개 | 예약 ${data.reservations.length}건 | 일지 ${data.dailyLogs.length}개
                    </div>
                </div>
                
                <div class="panel">
                    <h3 class="panel-title"><span>⚙️</span> 시설 설정</h3>
                    
                    <div class="setting-item" style="background: #eff6ff; border-color: #3b82f6;">
                        <div class="setting-name">➕ 새 시설 추가</div>
                        <div class="form-group" style="margin-bottom: 12px;">
                            <label class="form-label">시설명</label>
                            <input type="text" class="form-input" id="newFacilityName" placeholder="예: 컴퓨터 3번">
                        </div>
                        <div class="form-group" style="margin-bottom: 12px;">
                            <label class="form-label">유형</label>
                            <select class="form-select" id="newFacilityType">
                                <option value="computer">개별석</option>
                                <option value="room">단체실</option>
                            </select>
                        </div>
                        <div class="form-row" style="margin-bottom: 12px;">
                            <div style="flex: 1;">
                                <label class="form-label">이용시간 제한 (분)</label>
                                <input type="number" class="form-input" id="newFacilityTimeLimit" placeholder="60" min="1">
                            </div>
                            <div style="flex: 1; margin-left: 8px;">
                                <label class="form-label">수용 인원 (명)</label>
                                <input type="number" class="form-input" id="newFacilityCapacity" placeholder="1" min="1">
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="addNewFacility()">시설 추가</button>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
                        ${data.facilities.map((f, idx) => `
                            <div class="setting-item" id="facility-${f.id}">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <div class="setting-name">${f.name}</div>
                                    <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 12px;" onclick="toggleEditFacility('${f.id}')">수정</button>
                                </div>
                                
                                <div id="view-${f.id}">
                                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">
                                        유형: ${f.type === 'computer' ? '개별석' : '단체실'}
                                    </div>
                                    <div style="margin-bottom: 16px;">
                                        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">이용시간 제한</div>
                                        <div class="setting-value">${f.timeLimit}분</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">수용 인원</div>
                                        <div class="setting-value">${f.capacity}명</div>
                                    </div>
                                </div>

                                <div id="edit-${f.id}" class="hidden">
                                    <div class="form-group" style="margin-bottom: 12px;">
                                        <label class="form-label">시설명</label>
                                        <input type="text" class="form-input" id="editName-${f.id}" value="${f.name}">
                                    </div>
                                    <div class="form-row" style="margin-bottom: 12px;">
                                        <div style="flex: 1;">
                                            <label class="form-label">이용시간 제한 (분)</label>
                                            <input type="number" class="form-input" id="editTimeLimit-${f.id}" value="${f.timeLimit}" min="1">
                                        </div>
                                        <div style="flex: 1; margin-left: 8px;">
                                            <label class="form-label">수용 인원 (명)</label>
                                            <input type="number" class="form-input" id="editCapacity-${f.id}" value="${f.capacity}" min="1">
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 8px;">
                                        <button class="btn btn-primary" onclick="saveFacilityEdit('${f.id}')">저장</button>
                                        <button class="btn btn-secondary" onclick="toggleEditFacility('${f.id}')">취소</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function toggleLocalBackup() {
            state.backupConfig.localEnabled = document.getElementById('localBackupToggle').checked;
            saveBackupConfig();
            showAlert(`로컬 백업이 ${state.backupConfig.localEnabled ? '활성화' : '비활성화'}되었습니다.`);
        }

        function toggleServerBackup() {
            state.backupConfig.serverEnabled = document.getElementById('serverBackupToggle').checked;
            saveBackupConfig();
            showAlert(`서버 백업이 ${state.backupConfig.serverEnabled ? '활성화' : '비활성화'}되었습니다.`);
        }

        function saveServerUrl() {
            const url = document.getElementById('serverUrl').value.trim();
            if (!url) {
                showAlert('서버 URL을 입력해주세요.', 'error');
                return;
            }
            state.backupConfig.serverUrl = url;
            saveBackupConfig();
            showAlert('서버 URL이 저장되었습니다.');
        }

        function renderDailyLog() {
            const data = state.branchData[state.selectedBranch];
            const today = new Date().toISOString().split('T')[0];
            const todayLog = data.dailyLogs.find(l => l.date === today);

            document.getElementById('dailylog').innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="panel">
                        <h3 class="panel-title"><span>📝</span> 업무 일지</h3>
                        <div class="form-group">
                            <label class="form-label">날짜</label>
                            <input type="date" class="form-input" id="logDate" value="${today}" onchange="loadLog()">
                        </div>
                        <div class="form-group">
                            <label class="form-label">제목</label>
                            <input type="text" class="form-input" id="logTitle" value="${todayLog?.title || ''}" placeholder="일지 제목">
                        </div>
                        <div class="form-group">
                            <label class="form-label">내용</label>
                            <textarea id="logContent" placeholder="오늘의 업무 내용을 기록하세요...">${todayLog?.content || ''}</textarea>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-primary" style="flex: 1;" onclick="saveLog()">저장</button>
                            ${todayLog ? '<button class="btn btn-danger" onclick="deleteLog()">삭제</button>' : ''}
                        </div>
                    </div>
                    <div class="panel">
                        <h3 class="panel-title"><span>🔍</span> 일지 검색</h3>
                        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                            <input type="text" class="form-input" id="logSearch" placeholder="검색어 입력">
                            <button class="btn btn-primary" onclick="searchLogs()">검색</button>
                        </div>
                        <div id="logList">
                            <div style="font-weight: 600; margin-bottom: 12px;">최근 일지</div>
                            ${data.dailyLogs.length === 0 ? '<div style="text-align: center; padding: 40px; color: #6b7280;">작성된 일지가 없습니다.</div>' :
                            data.dailyLogs.slice().reverse().slice(0, 10).map(log => `
                                <div class="log-item" onclick="viewLog('${log.date}')">
                                    <div class="log-title">${log.title}</div>
                                    <div class="log-meta">${log.date} | ${log.content.substring(0, 50)}...</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        function saveLog() {
            const date = document.getElementById('logDate').value;
            const title = document.getElementById('logTitle').value.trim();
            const content = document.getElementById('logContent').value.trim();

            if (!title || !content) {
                showAlert('제목과 내용을 모두 입력해주세요.', 'error');
                return;
            }

            const data = state.branchData[state.selectedBranch];
            const existingIdx = data.dailyLogs.findIndex(l => l.date === date);

            if (existingIdx !== -1) {
                data.dailyLogs[existingIdx] = { ...data.dailyLogs[existingIdx], title, content, updatedAt: new Date().toISOString() };
                showAlert('일지가 수정되었습니다.');
            } else {
                data.dailyLogs.push({
                    id: 'LOG-' + Date.now(),
                    date, title, content,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                showAlert('일지가 저장되었습니다.');
            }
            triggerAutoSave();
            renderDailyLog();
        }

        function deleteLog() {
            if (!confirm('정말로 이 일지를 삭제하시겠습니까?')) return;
            const date = document.getElementById('logDate').value;
            const data = state.branchData[state.selectedBranch];
            data.dailyLogs = data.dailyLogs.filter(l => l.date !== date);
            triggerAutoSave();
            showAlert('일지가 삭제되었습니다.');
            renderDailyLog();
        }

        function viewLog(date) {
            document.getElementById('logDate').value = date;
            loadLog();
        }

        function loadLog() {
            const date = document.getElementById('logDate').value;
            const data = state.branchData[state.selectedBranch];
            const log = data.dailyLogs.find(l => l.date === date);
            document.getElementById('logTitle').value = log?.title || '';
            document.getElementById('logContent').value = log?.content || '';
        }

        function searchLogs() {
            renderDailyLog();
        }

        let currentChartInstances = {};
        
        function renderStatistics() {
            const data = state.branchData[state.selectedBranch];
            const completed = data.reservations.filter(r => r.status === 'completed');
            
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let y = currentYear - 30; y <= currentYear; y++) {
                years.push(y);
            }
            
            document.getElementById('statistics').innerHTML = `
                <div class="panel">
                    <div class="flex-between">
                        <h3 class="panel-title"><span>📊</span> 이용 통계</h3>
                        <button class="btn btn-success" onclick="downloadAllStatisticsExcel()">📥 통계 엑셀 다운로드</button>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card blue">
                            <div class="stat-label">총 이용자</div>
                            <div class="stat-value">${new Set(completed.map(r => r.memberId)).size}</div>
                        </div>
                        <div class="stat-card green">
                            <div class="stat-label">총 이용 건수</div>
                            <div class="stat-value">${completed.length}</div>
                        </div>
                        <div class="stat-card purple">
                            <div class="stat-label">등록 회원</div>
                            <div class="stat-value">${data.members.length}</div>
                        </div>
                    </div>

                    <div class="panel" style="background: #fffbeb; border-color: #fde047; margin: 20px 0;">
                        <h4 class="panel-title">🔍 출생년도 필터</h4>
                        <div class="date-filter">
                            <label class="form-label" style="margin: 0;">시작:</label>
                            <select class="form-select" id="birthYearStart" style="width: 120px;">
                                <option value="">전체</option>
                                ${years.map(y => `<option value="${y}">${y}년</option>`).join('')}
                            </select>
                            <label class="form-label" style="margin: 0;">~</label>
                            <label class="form-label" style="margin: 0;">종료:</label>
                            <select class="form-select" id="birthYearEnd" style="width: 120px;">
                                <option value="">전체</option>
                                ${years.map(y => `<option value="${y}">${y}년</option>`).join('')}
                            </select>
                            <button class="btn btn-primary" onclick="applyBirthYearFilter()">조회</button>
                            <button class="btn btn-secondary" onclick="resetBirthYearFilter()">초기화</button>
                        </div>
                        <div id="filterInfo" style="margin-top: 12px; font-size: 13px; color: #92400e;"></div>
                    </div>

                    <div class="stats-section">
                        <h4 style="font-weight: 600; margin-bottom: 16px;">시설별 이용 현황</h4>
                        ${data.facilities.map((facility, idx) => `
                            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                                <h5 style="font-weight: 600; font-size: 16px; margin-bottom: 16px; color: #1f2937;">
                                    📍 ${facility.name}
                                </h5>
                                
                                <div style="margin-bottom: 20px;">
                                    <div style="font-weight: 600; margin-bottom: 8px;">연령별 이용 분포</div>
                                    <div class="chart-container" style="height: 250px;">
                                        <canvas id="facilityAgeChart-${facility.id}"></canvas>
                                    </div>
                                </div>

                                <div style="margin-bottom: 20px;">
                                    <div style="font-weight: 600; margin-bottom: 8px;">성별 이용 분포</div>
                                    <div class="chart-container" style="height: 250px;">
                                        <canvas id="facilityGenderChart-${facility.id}"></canvas>
                                    </div>
                                </div>

                                <div>
                                    <div style="font-weight: 600; margin-bottom: 8px;">지역별 이용 분포</div>
                                    <div class="chart-container" style="height: 250px;">
                                        <canvas id="facilityRegionChart-${facility.id}"></canvas>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="stats-section">
                        <div class="flex-between">
                            <h4 style="font-weight: 600;">연령별 분포</h4>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="ageChartType" value="bar" checked onchange="updateAgeChart()"> 막대
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="ageChartType" value="pie" onchange="updateAgeChart()"> 원형
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="ageChartType" value="line" onchange="updateAgeChart()"> 선
                                </label>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="ageChart"></canvas>
                        </div>
                    </div>

                    <div class="stats-section">
                        <div class="flex-between">
                            <h4 style="font-weight: 600;">성별 분포</h4>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="genderChartType" value="bar" checked onchange="updateGenderChart()"> 막대
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="genderChartType" value="pie" onchange="updateGenderChart()"> 원형
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="genderChartType" value="line" onchange="updateGenderChart()"> 선
                                </label>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="genderChart"></canvas>
                        </div>
                    </div>

                    <div class="stats-section">
                        <div class="flex-between">
                            <h4 style="font-weight: 600;">지역별 분포</h4>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="regionChartType" value="bar" checked onchange="updateRegionChart()"> 막대
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="regionChartType" value="pie" onchange="updateRegionChart()"> 원형
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="regionChartType" value="line" onchange="updateRegionChart()"> 선
                                </label>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="regionChart"></canvas>
                        </div>
                    </div>
                </div>
            `;
            
            updateAllCharts();
        }

        function getFilteredMembers() {
            const data = state.branchData[state.selectedBranch];
            const startYear = document.getElementById('birthYearStart')?.value;
            const endYear = document.getElementById('birthYearEnd')?.value;
            
            let filtered = [...data.members];
            
            if (startYear || endYear) {
                filtered = filtered.filter(m => {
                    const birthYear = parseInt(m.birthDate.split('-')[0]);
                    if (startYear && birthYear < parseInt(startYear)) return false;
                    if (endYear && birthYear > parseInt(endYear)) return false;
                    return true;
                });
            }
            
            return filtered;
        }

        function applyBirthYearFilter() {
            const startYear = document.getElementById('birthYearStart').value;
            const endYear = document.getElementById('birthYearEnd').value;
            const filtered = getFilteredMembers();
            const data = state.branchData[state.selectedBranch];
            
            let filterText = '';
            if (startYear && endYear) {
                filterText = `📌 ${startYear}년 ~ ${endYear}년생 필터 (${filtered.length}명 / 전체 ${data.members.length}명)`;
            } else if (startYear) {
                filterText = `📌 ${startYear}년생 이후 필터 (${filtered.length}명 / 전체 ${data.members.length}명)`;
            } else if (endYear) {
                filterText = `📌 ${endYear}년생 이전 필터 (${filtered.length}명 / 전체 ${data.members.length}명)`;
            }
            
            document.getElementById('filterInfo').textContent = filterText;
            updateAllCharts();
        }

        function resetBirthYearFilter() {
            document.getElementById('birthYearStart').value = '';
            document.getElementById('birthYearEnd').value = '';
            document.getElementById('filterInfo').textContent = '';
            updateAllCharts();
        }

        function updateAllCharts() {
            updateAgeChart();
            updateGenderChart();
            updateRegionChart();
            updateFacilityDetailCharts();
        }

        function destroyChart(chartId) {
            if (currentChartInstances[chartId]) {
                currentChartInstances[chartId].destroy();
                delete currentChartInstances[chartId];
            }
        }

        function updateFacilityDetailCharts() {
            const data = state.branchData[state.selectedBranch];
            const filtered = getFilteredMembers();
            const filteredIds = new Set(filtered.map(m => m.id));
            
            data.facilities.forEach(facility => {
                const facilityReservations = data.reservations.filter(r => 
                    r.facilityId === facility.id && 
                    r.status === 'completed' && 
                    filteredIds.has(r.memberId)
                );
                
                // 연령별 차트
                const ageGroups = {};
                facilityReservations.forEach(r => {
                    const member = data.members.find(m => m.id === r.memberId);
                    if (member) {
                        const birthYear = member.birthDate.split('-')[0];
                        ageGroups[birthYear] = (ageGroups[birthYear] || 0) + 1;
                    }
                });
                
                const sortedYears = Object.keys(ageGroups).sort();
                const ageCanvas = document.getElementById(`facilityAgeChart-${facility.id}`);
                if (ageCanvas) {
                    destroyChart(`facilityAgeChart-${facility.id}`);
                    const ctx = ageCanvas.getContext('2d');
                    currentChartInstances[`facilityAgeChart-${facility.id}`] = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: sortedYears.map(y => y + '년'),
                            datasets: [{
                                label: '이용 횟수',
                                data: sortedYears.map(y => ageGroups[y]),
                                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                                borderColor: 'rgba(139, 92, 246, 1)',
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                        }
                    });
                }
                
                // 성별 차트
                const genderCounts = { '남': 0, '여': 0 };
                facilityReservations.forEach(r => {
                    const member = data.members.find(m => m.id === r.memberId);
                    if (member && member.gender) {
                        genderCounts[member.gender]++;
                    }
                });
                
                const genderCanvas = document.getElementById(`facilityGenderChart-${facility.id}`);
                if (genderCanvas) {
                    destroyChart(`facilityGenderChart-${facility.id}`);
                    const ctx = genderCanvas.getContext('2d');
                    currentChartInstances[`facilityGenderChart-${facility.id}`] = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: ['남성', '여성'],
                            datasets: [{
                                data: [genderCounts['남'], genderCounts['여']],
                                backgroundColor: [
                                    'rgba(59, 130, 246, 0.7)',
                                    'rgba(236, 72, 153, 0.7)'
                                ],
                                borderColor: [
                                    'rgba(59, 130, 246, 1)',
                                    'rgba(236, 72, 153, 1)'
                                ],
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'right' } }
                        }
                    });
                }
                
                // 지역별 차트
                const regionCounts = {};
                facilityReservations.forEach(r => {
                    const member = data.members.find(m => m.id === r.memberId);
                    if (member) {
                        const region = member.region || '기타';
                        regionCounts[region] = (regionCounts[region] || 0) + 1;
                    }
                });
                
                const sortedRegions = Object.entries(regionCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10);
                
                const regionCanvas = document.getElementById(`facilityRegionChart-${facility.id}`);
                if (regionCanvas) {
                    destroyChart(`facilityRegionChart-${facility.id}`);
                    const ctx = regionCanvas.getContext('2d');
                    currentChartInstances[`facilityRegionChart-${facility.id}`] = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: sortedRegions.map(r => r[0]),
                            datasets: [{
                                label: '이용 횟수',
                                data: sortedRegions.map(r => r[1]),
                                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                                borderColor: 'rgba(16, 185, 129, 1)',
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                        }
                    });
                }
            });
        }

        function updateAgeChart() {
            const filtered = getFilteredMembers();
            
            const ageGroups = {};
            filtered.forEach(m => {
                const birthYear = m.birthDate.split('-')[0];
                ageGroups[birthYear] = (ageGroups[birthYear] || 0) + 1;
            });
            
            const sortedYears = Object.keys(ageGroups).sort();
            
            const chartType = document.querySelector('input[name="ageChartType"]:checked')?.value || 'bar';
            const canvas = document.getElementById('ageChart');
            if (!canvas) return;
            
            destroyChart('ageChart');
            
            const ctx = canvas.getContext('2d');
            currentChartInstances['ageChart'] = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: sortedYears.map(y => y + '년'),
                    datasets: [{
                        label: '회원 수',
                        data: sortedYears.map(y => ageGroups[y]),
                        backgroundColor: 'rgba(139, 92, 246, 0.7)',
                        borderColor: 'rgba(139, 92, 246, 1)',
                        borderWidth: 2,
                        fill: chartType === 'line' ? false : true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: chartType === 'pie', position: 'right' }
                    },
                    scales: chartType !== 'pie' ? { y: { beginAtZero: true, ticks: { stepSize: 1 } } } : {}
                }
            });
        }

        function updateGenderChart() {
            const filtered = getFilteredMembers();
            
            const genderCounts = {
                '남': filtered.filter(m => m.gender === '남').length,
                '여': filtered.filter(m => m.gender === '여').length
            };
            
            const chartType = document.querySelector('input[name="genderChartType"]:checked')?.value || 'bar';
            const canvas = document.getElementById('genderChart');
            if (!canvas) return;
            
            destroyChart('genderChart');
            
            const ctx = canvas.getContext('2d');
            currentChartInstances['genderChart'] = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: ['남성', '여성'],
                    datasets: [{
                        label: '회원 수',
                        data: [genderCounts['남'], genderCounts['여']],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(236, 72, 153, 0.7)'
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(236, 72, 153, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: chartType === 'pie', position: 'right' }
                    },
                    scales: chartType !== 'pie' ? { y: { beginAtZero: true, ticks: { stepSize: 1 } } } : {}
                }
            });
        }

        function updateRegionChart() {
            const filtered = getFilteredMembers();
            
            const regionCounts = {};
            filtered.forEach(m => {
                const region = m.region || '기타';
                regionCounts[region] = (regionCounts[region] || 0) + 1;
            });
            
            const sortedRegions = Object.entries(regionCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            
            const chartType = document.querySelector('input[name="regionChartType"]:checked')?.value || 'bar';
            const canvas = document.getElementById('regionChart');
            if (!canvas) return;
            
            destroyChart('regionChart');
            
            const ctx = canvas.getContext('2d');
            currentChartInstances['regionChart'] = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: sortedRegions.map(r => r[0]),
                    datasets: [{
                        label: '회원 수',
                        data: sortedRegions.map(r => r[1]),
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2,
                        fill: chartType === 'line' ? false : true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: chartType === 'pie', position: 'right' }
                    },
                    scales: chartType !== 'pie' ? { y: { beginAtZero: true, ticks: { stepSize: 1 } } } : {}
                }
            });
        }

        function downloadAllStatisticsExcel() {
            const data = state.branchData[state.selectedBranch];
            const branch = state.branches.find(b => b.id === state.selectedBranch);
            const filtered = getFilteredMembers();
            
            const wb = XLSX.utils.book_new();
            
            // 전체 연령별 통계
            const ageGroups = {};
            filtered.forEach(m => {
                const birthYear = m.birthDate.split('-')[0];
                ageGroups[birthYear] = (ageGroups[birthYear] || 0) + 1;
            });
            const ageStats = Object.keys(ageGroups).sort().map(year => ({
                '출생년도': year + '년',
                '회원 수': ageGroups[year]
            }));
            const ws1 = XLSX.utils.json_to_sheet(ageStats);
            XLSX.utils.book_append_sheet(wb, ws1, '전체-연령별');
            
            // 전체 성별 통계
            const genderStats = [
                { '성별': '남성', '회원 수': filtered.filter(m => m.gender === '남').length },
                { '성별': '여성', '회원 수': filtered.filter(m => m.gender === '여').length }
            ];
            const ws2 = XLSX.utils.json_to_sheet(genderStats);
            XLSX.utils.book_append_sheet(wb, ws2, '전체-성별');
            
            // 전체 지역별 통계
            const regionCounts = {};
            filtered.forEach(m => {
                const region = m.region || '기타';
                regionCounts[region] = (regionCounts[region] || 0) + 1;
            });
            const regionStats = Object.entries(regionCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([region, count]) => ({ '지역': region, '회원 수': count }));
            const ws3 = XLSX.utils.json_to_sheet(regionStats);
            XLSX.utils.book_append_sheet(wb, ws3, '전체-지역별');
            
            // 시설별 세부 통계
            const filteredIds = new Set(filtered.map(m => m.id));
            data.facilities.forEach((facility, index) => {
                const facilityReservations = data.reservations.filter(r => 
                    r.facilityId === facility.id && 
                    r.status === 'completed' && 
                    filteredIds.has(r.memberId)
                );
                
                // 시설별 연령 통계
                const facilityAgeGroups = {};
                facilityReservations.forEach(r => {
                    const member = data.members.find(m => m.id === r.memberId);
                    if (member) {
                        const birthYear = member.birthDate.split('-')[0];
                        facilityAgeGroups[birthYear] = (facilityAgeGroups[birthYear] || 0) + 1;
                    }
                });
                const facilityAgeStats = Object.keys(facilityAgeGroups).sort().map(year => ({
                    '출생년도': year + '년',
                    '이용 횟수': facilityAgeGroups[year]
                }));
                if (facilityAgeStats.length > 0) {
                    const wsAge = XLSX.utils.json_to_sheet(facilityAgeStats);
                    XLSX.utils.book_append_sheet(wb, wsAge, `${facility.name}-연령별`.substring(0, 31));
                }
                
                // 시설별 성별 통계
                const facilityGenderCounts = { '남': 0, '여': 0 };
                facilityReservations.forEach(r => {
                    const member = data.members.find(m => m.id === r.memberId);
                    if (member && member.gender) {
                        facilityGenderCounts[member.gender]++;
                    }
                });
                const facilityGenderStats = [
                    { '성별': '남성', '이용 횟수': facilityGenderCounts['남'] },
                    { '성별': '여성', '이용 횟수': facilityGenderCounts['여'] }
                ];
                const wsGender = XLSX.utils.json_to_sheet(facilityGenderStats);
                XLSX.utils.book_append_sheet(wb, wsGender, `${facility.name}-성별`.substring(0, 31));
                
                // 시설별 지역 통계
                const facilityRegionCounts = {};
                facilityReservations.forEach(r => {
                    const member = data.members.find(m => m.id === r.memberId);
                    if (member) {
                        const region = member.region || '기타';
                        facilityRegionCounts[region] = (facilityRegionCounts[region] || 0) + 1;
                    }
                });
                const facilityRegionStats = Object.entries(facilityRegionCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([region, count]) => ({ '지역': region, '이용 횟수': count }));
                if (facilityRegionStats.length > 0) {
                    const wsRegion = XLSX.utils.json_to_sheet(facilityRegionStats);
                    XLSX.utils.book_append_sheet(wb, wsRegion, `${facility.name}-지역별`.substring(0, 31));
                }
            });
            
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const filename = `${dateStr}_${branch.name}_전체통계.xlsx`;
            
            XLSX.writeFile(wb, filename);
            showAlert('전체 통계가 다운로드되었습니다.');
        }

        function renderHistory() {
            const data = state.branchData[state.selectedBranch];
            
            document.getElementById('history').innerHTML = `
                <div class="panel">
                    <h3 class="panel-title">이용 기록</h3>
                    <div class="date-filter">
                        <label class="form-label" style="margin: 0;">시작일:</label>
                        <input type="date" class="form-input" id="startDate" style="width: 180px;">
                        <label class="form-label" style="margin: 0;">종료일:</label>
                        <input type="date" class="form-input" id="endDate" style="width: 180px;">
                        <button class="btn btn-primary" onclick="filterHistory()">조회</button>
                        <button class="btn btn-secondary" onclick="resetHistoryFilter()">전체보기</button>
                    </div>
                    <div style="overflow-x: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>회원번호</th>
                                    <th>회원명</th>
                                    <th>시설</th>
                                    <th>시작시간</th>
                                    <th>종료시간</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody id="historyTableBody">
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            displayHistory();
        }

        function displayHistory(filteredData = null) {
            const data = state.branchData[state.selectedBranch];
            const reservations = filteredData || data.reservations;
            const sorted = [...reservations].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            
            const tbody = document.getElementById('historyTableBody');
            if (sorted.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">이용 기록이 없습니다.</td></tr>';
            } else {
                tbody.innerHTML = sorted.map(r => `
                    <tr>
                        <td>${r.memberNumber || '-'}</td>
                        <td>${r.memberName}</td>
                        <td>${r.facilityName}</td>
                        <td>${new Date(r.startTime).toLocaleString('ko-KR')}</td>
                        <td>${new Date(r.endTime).toLocaleString('ko-KR')}</td>
                        <td>
                            <span class="status-badge ${r.status === 'using' ? 'using' : r.status === 'reserved' ? 'reserved' : 'available'}">
                                ${r.status === 'using' ? '이용중' : r.status === 'reserved' ? '예약중' : r.status === 'completed' ? '완료' : '취소'}
                            </span>
                        </td>
                    </tr>
                `).join('');
            }
        }

        function filterHistory() {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            if (!startDate || !endDate) {
                showAlert('시작일과 종료일을 모두 선택해주세요.', 'error');
                return;
            }
            
            const data = state.branchData[state.selectedBranch];
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            
            const filtered = data.reservations.filter(r => {
                const resDate = new Date(r.startTime);
                return resDate >= start && resDate <= end;
            });
            
            displayHistory(filtered);
            showAlert(`${filtered.length}건의 기록을 찾았습니다.`);
        }

        function resetHistoryFilter() {
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';
            displayHistory();
        }

        function addNewFacility() {
            const name = document.getElementById('newFacilityName').value.trim();
            const type = document.getElementById('newFacilityType').value;
            const timeLimit = parseInt(document.getElementById('newFacilityTimeLimit').value);
            const capacity = parseInt(document.getElementById('newFacilityCapacity').value);

            if (!name || !timeLimit || !capacity) {
                showAlert('모든 필드를 입력해주세요.', 'error');
                return;
            }

            const data = state.branchData[state.selectedBranch];
            const newId = 'FAC-' + Date.now();

            data.facilities.push({
                id: newId,
                name: name,
                type: type,
                capacity: capacity,
                timeLimit: timeLimit
            });

            triggerAutoSave();
            showAlert(`${name} 시설이 추가되었습니다.`);
            renderSettings();
        }

        function toggleEditFacility(facilityId) {
            const viewDiv = document.getElementById(`view-${facilityId}`);
            const editDiv = document.getElementById(`edit-${facilityId}`);
            
            if (viewDiv.classList.contains('hidden')) {
                viewDiv.classList.remove('hidden');
                editDiv.classList.add('hidden');
            } else {
                viewDiv.classList.add('hidden');
                editDiv.classList.remove('hidden');
            }
        }

        function saveFacilityEdit(facilityId) {
            const name = document.getElementById(`editName-${facilityId}`).value.trim();
            const timeLimit = parseInt(document.getElementById(`editTimeLimit-${facilityId}`).value);
            const capacity = parseInt(document.getElementById(`editCapacity-${facilityId}`).value);

            if (!name || !timeLimit || !capacity) {
                showAlert('모든 필드를 입력해주세요.', 'error');
                return;
            }

            const data = state.branchData[state.selectedBranch];
            const facilityIdx = data.facilities.findIndex(f => f.id === facilityId);

            if (facilityIdx !== -1) {
                data.facilities[facilityIdx].name = name;
                data.facilities[facilityIdx].timeLimit = timeLimit;
                data.facilities[facilityIdx].capacity = capacity;

                triggerAutoSave();
                showAlert(`${name} 시설이 수정되었습니다.`);
                renderSettings();
            }
        }

        window.addEventListener('DOMContentLoaded', init);
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.branch-selector')) {
                document.getElementById('branchDropdown').classList.remove('show');
            }
        });

        window.addEventListener('beforeunload', function() {
            saveToStorage();
        });
    </script>
</body>
</html>
