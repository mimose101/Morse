// ================= MORSE DICTIONARY & CONFIGS =================

// 游戏化：发射答对彩屑粒子爆炸特效
        function spawnCorrectParticles(element) {
            if (!element) return;
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2 + window.scrollX;
            const centerY = rect.top + rect.height / 2 + window.scrollY;
            
            // 产生 15 个彩色小粒子
            const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#FF9600', '#B2FF59'];
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'mini-particle';
                
                const size = Math.random() * 8 + 6; 
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // 定位在卡片中央
                particle.style.left = `${centerX - size / 2}px`;
                particle.style.top = `${centerY - size / 2}px`;
                
                // 向上向外飘落抛射
                const angle = (Math.random() * 360) * Math.PI / 180;
                const distance = Math.random() * 80 + 40; 
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance - 30; // 向上偏移模拟反重力爆炸
                
                particle.style.setProperty('--dx', `${dx}px`);
                particle.style.setProperty('--dy', `${dy}px`);
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 600);
            }
        }

        // 游戏化：在答题界面中央弹出 Combo 连击动画气泡
        function showComboToast(comboCount) {
            const oldToast = document.querySelector('.combo-toast');
            if (oldToast) oldToast.remove();
            
            const toast = document.createElement('div');
            toast.className = 'combo-toast';
            toast.innerHTML = `🔥 连击 X${comboCount}`;
            
            const lessonScreen = document.getElementById('lesson-screen');
            if (lessonScreen) {
                lessonScreen.appendChild(toast);
            }
            
            setTimeout(() => {
                toast.remove();
            }, 1000);
        }

        // 渲染高质感图形化点划组件 (Visual Morse)
        // 拼字题：生成乱序候选字母气泡（包含干扰项）
        function generateSpellingOptions(target) {
            const letters = target.split('');
            const poolCandidates = currentLesson.learnedPool.filter(c => c.length === 1 && !letters.includes(c));
            const shuffledCandidates = shuffle([...poolCandidates]);
            
            const maxBubbles = Math.max(6, letters.length + 3);
            const options = [...letters];
            for (let i = 0; i < shuffledCandidates.length; i++) {
                if (options.length >= maxBubbles) break;
                options.push(shuffledCandidates[i]);
            }
            if (options.length < maxBubbles) {
                const fallbacks = ['E', 'T', 'I', 'M', 'A', 'N', 'S', 'O'].filter(c => !options.includes(c));
                const shuffledFallbacks = shuffle(fallbacks);
                for (let i = 0; i < shuffledFallbacks.length; i++) {
                    if (options.length >= maxBubbles) break;
                    options.push(shuffledFallbacks[i]);
                }
            }
            return shuffle(options);
        }

        // 拼字题：点击字母气泡填入槽位
        function clickSpellingBubble(char, bubbleIdx) {
            const q = currentLesson.currentQuestion;
            const targetLen = q.target.length;
            if (currentLesson.spellingInput.length >= targetLen) return;

            currentLesson.spellingInput.push({ char: char, bubbleIdx: bubbleIdx });
            playMorseUnit('dot'); // 拼字音效反馈
            updateSpellingUI();

            if (currentLesson.spellingInput.length === targetLen) {
                enableCheckButton();
            }
        }

        // 拼字题：点击槽位退回字母气泡
        function removeSpellingSlot(slotIdx) {
            if (slotIdx >= currentLesson.spellingInput.length) return;
            currentLesson.spellingInput.splice(slotIdx, 1);
            playMorseUnit('dot'); // 撤回音效反馈
            updateSpellingUI();
            
            const actionBtn = document.getElementById('lesson-action-btn');
            actionBtn.className = "duo-btn duo-btn-gray duo-btn-disabled";
            actionBtn.onclick = null;
        }

        // 拼字题：刷新插槽与气泡的视觉状态
        function updateSpellingUI() {
            const q = currentLesson.currentQuestion;
            const letters = q.target.split('');
            const targetLen = letters.length;
            
            for (let i = 0; i < targetLen; i++) {
                const slot = document.getElementById(`spelling-slot-${i}`);
                if (!slot) continue;
                if (i < currentLesson.spellingInput.length) {
                    slot.textContent = currentLesson.spellingInput[i].char;
                    slot.classList.add('filled');
                } else {
                    slot.textContent = '';
                    slot.classList.remove('filled');
                }
            }
            
            const bubbles = document.querySelectorAll('.spelling-bubble');
            bubbles.forEach(b => b.classList.remove('used'));
            
            currentLesson.spellingInput.forEach(input => {
                const b = document.getElementById(`spelling-bubble-${input.bubbleIdx}`);
                if (b) b.classList.add('used');
            });
        }

        function getMorseVisualHtml(morseCode) {
            if (!morseCode) return '';
            let html = '<span class="morse-visual-container">';
            for (let char of morseCode) {
                if (char === '.') {
                    html += '<span class="morse-visual-char morse-visual-dot"></span>';
                } else if (char === '-') {
                    html += '<span class="morse-visual-char morse-visual-dash"></span>';
                } else if (char === ' ') {
                    html += '<span style="width: 10px;"></span>';
                }
            }
            html += '</span>';
            return html;
        }

        // ================= CODEBOOK DICTIONARY =================

// ================= MULTI-USER DATA STATE =================
        let users = [];
        let currentUserId = '';

        let state = {
            id: '',
            xp: 0,
            streak: 0,
            maxStreak: 0,
            unlockedLevel: 1,
            lastCompletedDate: null,
            username: "极客学员",
            avatarId: 1,
            joinDate: '',
            perfectRounds: 0,
            stats: {
                audioCorrectCount: 0
            }
        };

        // 当前关卡状态
        let currentLesson = {
            id: null,
            isPractice: false,
            charsPool: [],
            queue: [],
            wrongAnswers: new Set(),
            totalOriginalCount: 10,
            correctCount: 0,
            hearts: 5,
            maxHearts: 5,
            errorCount: 0,
            currentQuestion: null,
            phase: 'preview',
            selectedOption: null,
            morseInput: '',
            selectedMatchLeft: null,
            selectedMatchRight: null,
            pairedLeft: new Set(),
            pairedRight: new Set()
        };

        // ================= USER SYSTEM INITIALIZATION & PERSISTENCE =================
        function initUserSystem() {
            const savedUsers = localStorage.getItem('morse_game_users');
            const savedCurrentId = localStorage.getItem('morse_current_user_id');
            
            if (savedUsers) {
                try {
                    users = JSON.parse(savedUsers);
                    currentUserId = savedCurrentId || users[0].id;
                } catch(e) {
                    console.error("加载多用户数据失败", e);
                }
            }
            
            // 老用户兼容无损升级逻辑
            if (users.length === 0) {
                const oldStateStr = localStorage.getItem('morse_game_state');
                let oldState = null;
                if (oldStateStr) {
                    try { oldState = JSON.parse(oldStateStr); } catch(e){}
                }
                
                const firstUser = {
                    id: 'user_' + Date.now(),
                    username: oldState ? (oldState.username || '极客学员') : '极客学员',
                    avatarId: oldState ? (oldState.avatarId || 1) : 1,
                    xp: oldState ? (oldState.xp || 0) : 0,
                    streak: oldState ? (oldState.streak || 0) : 0,
                    maxStreak: oldState ? (oldState.maxStreak || 0) : 0,
                    unlockedLevel: oldState ? (oldState.unlockedLevel || 1) : 1,
                    lastCompletedDate: oldState ? oldState.lastCompletedDate : null,
                    joinDate: oldState ? (oldState.joinDate || new Date().toLocaleDateString('zh-CN')) : new Date().toLocaleDateString('zh-CN'),
                    perfectRounds: oldState ? (oldState.perfectRounds || 0) : 0,
                    stats: oldState ? (oldState.stats || { audioCorrectCount: 0 }) : { audioCorrectCount: 0 }
                };
                
                users.push(firstUser);
                currentUserId = firstUser.id;
                
                localStorage.setItem('morse_game_users', JSON.stringify(users));
                localStorage.setItem('morse_current_user_id', currentUserId);
            }
            
            loadActiveUserState();
        }

        function loadActiveUserState() {
            const activeUser = users.find(u => u.id === currentUserId);
            if (activeUser) {
                state = { ...activeUser };
            } else {
                currentUserId = users[0].id;
                state = { ...users[0] };
            }
            
            updateStatusHeader();
            checkPracticeUnlock();
            
            // 同步更新欢迎界面的微预览
            const welcomeAvatar = document.getElementById('welcome-avatar');
            if (welcomeAvatar) welcomeAvatar.textContent = getAvatarEmoji(state.avatarId);
            const welcomeUsername = document.getElementById('welcome-username');
            if (welcomeUsername) welcomeUsername.textContent = state.username;
            const welcomeXp = document.getElementById('welcome-xp');
            if (welcomeXp) welcomeXp.textContent = state.xp;
        }

        function saveGameState() {
            const idx = users.findIndex(u => u.id === currentUserId);
            if (idx !== -1) {
                users[idx] = { ...state };
            }
            localStorage.setItem('morse_game_users', JSON.stringify(users));
            localStorage.setItem('morse_current_user_id', currentUserId);
            
            localStorage.setItem('morse_game_state', JSON.stringify(state));
            
            updateStatusHeader();
            checkPracticeUnlock();
            
            const welcomeAvatar = document.getElementById('welcome-avatar');
            if (welcomeAvatar) welcomeAvatar.textContent = getAvatarEmoji(state.avatarId);
            const welcomeUsername = document.getElementById('welcome-username');
            if (welcomeUsername) welcomeUsername.textContent = state.username;
            const welcomeXp = document.getElementById('welcome-xp');
            if (welcomeXp) welcomeXp.textContent = state.xp;
        }

        function updateStatusHeader() {
            document.getElementById('streak-val').textContent = state.streak;
            document.getElementById('xp-val').textContent = state.xp;
            document.getElementById('hearts-val').textContent = 3;
        }

        function checkPracticeUnlock() {
            const btn = document.getElementById('practice-all-btn');
            if (state.unlockedLevel > 1) {
                btn.className = "duo-btn duo-btn-blue";
                btn.innerHTML = "✨ 进入综合温习 (不耗生命值)";
                btn.onclick = () => startLesson(0);
            } else {
                btn.className = "duo-btn duo-btn-blue duo-btn-disabled";
                btn.innerHTML = "🔒 通关第1关解锁综合练习";
                btn.onclick = null;
            }
        }

        // ================= GLOBAL SCREEN MANAGEMENT =================
        function showScreen(screenId) {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('home-screen').classList.add('hidden');
            document.getElementById('codebook-screen').classList.add('hidden');
            document.getElementById('profile-screen').classList.add('hidden');
            document.getElementById('lesson-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.add('hidden');
            
            document.getElementById(screenId).classList.remove('hidden');
            
            const statusBar = document.getElementById('app-status-bar');
            if (['welcome-screen', 'home-screen', 'profile-screen'].includes(screenId)) {
                statusBar.classList.remove('hidden');
                updateStatusHeader();
            } else {
                statusBar.classList.add('hidden');
            }
            
            const backBtn = document.getElementById('status-bar-back-btn');
            if (screenId === 'home-screen' || screenId === 'profile-screen') {
                if (backBtn) backBtn.style.display = 'flex';
            } else {
                if (backBtn) backBtn.style.display = 'none';
            }
            
            if (screenId === 'home-screen') {
                renderLevelMap();
            }
            
            if (screenId === 'profile-screen') {
                renderProfileScreen();
            }
            
            if (screenId === 'codebook-screen') {
                renderCodebook();
            }
        }

        // ================= CODEBOOK LOGIC =================
        let codebookFilterTab = 'all';
        let codebookSearchQuery = '';

        function switchCodebookTab(tab, btnDom) {
            codebookFilterTab = tab;
            
            const tabs = document.querySelectorAll('.codebook-tab');
            tabs.forEach(t => t.classList.remove('active'));
            btnDom.classList.add('active');
            
            renderCodebook();
        }

        function filterCodebook() {
            const input = document.getElementById('codebook-search-input');
            codebookSearchQuery = input.value;
            
            const clearBtn = document.getElementById('search-clear-btn');
            if (codebookSearchQuery) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }
            
            renderCodebook();
        }

        function clearSearchInput() {
            const input = document.getElementById('codebook-search-input');
            input.value = '';
            codebookSearchQuery = '';
            document.getElementById('search-clear-btn').classList.add('hidden');
            renderCodebook();
        }

        function renderCodebook() {
            const grid = document.getElementById('codebook-grid-items');
            grid.innerHTML = '';
            
            const filtered = codebookItems.filter(item => {
                const matchesTab = (codebookFilterTab === 'all' || item.type === codebookFilterTab);
                const query = codebookSearchQuery.trim().toLowerCase();
                if (!query) return matchesTab;
                
                const matchesChar = item.char.toLowerCase().includes(query);
                const matchesMorse = item.morse.includes(query);
                return matchesTab && (matchesChar || matchesMorse);
            });
            
            if (filtered.length === 0) {
                grid.innerHTML = `<div class="codebook-empty">没有找到匹配的摩斯密码</div>`;
                return;
            }
            
            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'codebook-card';
                card.id = `codebook-card-${item.char}`;
                card.onclick = () => {
                    playCodebookItem(item.char, item.morse);
                };
                
                if (item.type === 'word') {
                    // 单词类型：跨列通栏，不放图形，显示大字
                    card.classList.add('word-type');
                    card.innerHTML = `
                        <div class="codebook-card-char">${item.char}</div>
                        <div class="codebook-card-morse">${getMorseVisualHtml(item.morse)}</div>
                        <div class="codebook-card-play">🔊</div>
                    `;
                } else {
                    // 字母与数字类型：包含图形联想（嵌入了缩放容器中）
                    card.innerHTML = `
                        <div class="codebook-card-play">🔊</div>
                        <div class="codebook-mnemonic-wrap">
                            <div class="mnemonic-container">
                                ${renderMnemonicSvg(item.char)}
                            </div>
                        </div>
                        <div class="codebook-card-char">${item.char}</div>
                        <div class="codebook-card-morse">${getMorseVisualHtml(item.morse)}</div>
                    `;
                }
                grid.appendChild(card);
            });
        }

        // 辅助在特定的卡片容器内寻找点划索引并精准高亮
        function flashMnemonicElementsInContainer(containerDom, char, speedMultiplier = 1.0) {
            let config = null;
            const savedData = localStorage.getItem(`morse_pos_${char}`);
            if (savedData) {
                try { config = JSON.parse(savedData); } catch(e){}
            }
            if (!config) {
                config = letterVisualConfigs[char];
            }
            if (!config) return;

            const baseUnit = 80 * speedMultiplier;
            const dotDuration = baseUnit;
            const dashDuration = baseUnit * 3;
            const intraGap = baseUnit;

            let delay = 50;

            config.forEach((elConfig, idx) => {
                const duration = elConfig.type === 'dot' ? dotDuration : dashDuration;
                
                setTimeout(() => {
                    const elDom = containerDom.querySelector(`[data-index="${idx}"]`);
                    if (elDom) {
                        elDom.classList.add('active-blink');
                        setTimeout(() => {
                            elDom.classList.remove('active-blink');
                        }, duration);
                    }
                }, delay);

                delay += duration + intraGap;
            });
        }

        function playCodebookItem(char, morse) {
            morsePlayer.play(morse, 1.0);
            
            const card = document.getElementById(`codebook-card-${char}`);
            if (card) {
                card.classList.add('playing');
                // 让当前卡片内缩放的记忆点划进行顺序闪烁
                flashMnemonicElementsInContainer(card, char);
                
                // 下方的微缩版 Visual Morse 同步亮起
                const visualChars = card.querySelectorAll('.codebook-card-morse .morse-visual-char');
                visualChars.forEach(vc => vc.classList.add('active-blink'));
                
                const baseUnit = 80;
                let duration = 0;
                for (let c of morse) {
                    if (c === '.') duration += baseUnit;
                    else if (c === '-') duration += baseUnit * 3;
                    else if (c === ' ') duration += baseUnit * 3;
                    duration += baseUnit;
                }
                
                setTimeout(() => {
                    card.classList.remove('playing');
                    visualChars.forEach(vc => vc.classList.remove('active-blink'));
                }, duration + 50);
            }
        }

        // ================= AVATAR MAPPING =================
        function getAvatarEmoji(avatarId) {
            const avatars = {
                1: '🦉',
                2: '🐱',
                3: '🦊',
                4: '🦁',
                5: '🐸',
                6: '🐼'
            };
            return avatars[avatarId] || '🦉';
        }

        // ================= NICKNAME & PROFILE LOGIC =================
        function startEditUsername() {
            document.getElementById('username-display-row').classList.add('hidden');
            document.getElementById('username-edit-row').classList.remove('hidden');
            
            const input = document.getElementById('username-edit-input');
            input.value = state.username;
            input.focus();
        }

        function cancelEditUsername() {
            document.getElementById('username-display-row').classList.remove('hidden');
            document.getElementById('username-edit-row').classList.add('hidden');
        }

        function saveEditedUsername() {
            const input = document.getElementById('username-edit-input');
            const newName = input.value.trim();
            if (!newName) {
                alert("昵称不能为空！");
                return;
            }
            state.username = newName;
            saveGameState();
            cancelEditUsername();
            renderProfileScreen();
        }

        function handleUsernameKeydown(e) {
            if (e.key === 'Enter') {
                saveEditedUsername();
            } else if (e.key === 'Escape') {
                cancelEditUsername();
            }
        }

        function openAvatarSelector() {
            const modal = document.getElementById('modal-container');
            
            let avatarsHtml = '';
            for (let i = 1; i <= 6; i++) {
                const emoji = getAvatarEmoji(i);
                const isActive = (state.avatarId === i) ? 'active' : '';
                avatarsHtml += `
                    <div class="avatar-option-card ${isActive}" onclick="selectAvatar(${i})">
                        <div class="avatar-option-emoji">${emoji}</div>
                    </div>
                `;
            }
            
            modal.innerHTML = `
                <div class="modal-box" style="max-width: 380px;">
                    <div class="modal-title">更换头像</div>
                    <div class="modal-desc">挑选一个你喜欢的吉祥物作为学习伙伴</div>
                    <div class="avatar-options-grid">
                        ${avatarsHtml}
                    </div>
                    <div class="modal-buttons" style="margin-top: 20px;">
                        <button class="duo-btn duo-btn-gray" onclick="closeModal()">取消</button>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function selectAvatar(id) {
            state.avatarId = id;
            saveGameState();
            closeModal();
            renderProfileScreen();
        }

        // ================= BADGES DICTIONARY & SCREEN RENDER =================
        const badgesConfig = [
            {
                id: 'first_steps',
                title: '初出茅庐',
                desc: '成功通关第一关',
                icon: '🌱',
                check: (s) => s.unlockedLevel > 1,
                getProgress: (s) => s.unlockedLevel > 1 ? { cur: 1, max: 1 } : { cur: 0, max: 1 }
            },
            {
                id: 'morse_master',
                title: '电报大师',
                desc: '成功解锁全部 18 个关卡',
                icon: '🎓',
                check: (s) => s.unlockedLevel >= 18,
                getProgress: (s) => ({ cur: s.unlockedLevel - 1, max: 17 })
            },
            {
                id: 'audio_master',
                title: '声声入耳',
                desc: '答题中累计答对 20 道听音辨字',
                icon: '🎧',
                check: (s) => (s.stats && s.stats.audioCorrectCount >= 20),
                getProgress: (s) => ({ cur: (s.stats ? s.stats.audioCorrectCount : 0), max: 20 })
            },
            {
                id: 'perfect_gold',
                title: '金牌速记',
                desc: '累计完成 5 次无错完美通关',
                icon: '👑',
                check: (s) => s.perfectRounds >= 5,
                getProgress: (s) => ({ cur: s.perfectRounds, max: 5 })
            },
            {
                id: 'on_fire',
                title: '持之以恒',
                desc: '连续学习天数达到 3 天',
                icon: '🔥',
                check: (s) => s.streak >= 3,
                getProgress: (s) => ({ cur: s.streak, max: 3 })
            }
        ];

        function renderProfileScreen() {
            document.getElementById('profile-avatar-display').textContent = getAvatarEmoji(state.avatarId);
            document.getElementById('profile-username-val').textContent = state.username;
            document.getElementById('profile-join-date-val').textContent = state.joinDate || new Date().toLocaleDateString('zh-CN');
            
            document.getElementById('profile-stat-xp').textContent = state.xp;
            document.getElementById('profile-stat-streak').textContent = state.streak;
            document.getElementById('profile-stat-max-streak').textContent = state.maxStreak || state.streak;
            document.getElementById('profile-stat-perfect').textContent = state.perfectRounds || 0;
            const levelSelect = document.getElementById('profile-level-select');
            if (levelSelect) {
                levelSelect.innerHTML = '';
                levels.forEach(lvl => {
                    const opt = document.createElement('option');
                    opt.value = lvl.id;
                    opt.textContent = `第 ${lvl.id} 关`;
                    if (lvl.id === state.unlockedLevel) {
                        opt.selected = true;
                    }
                    levelSelect.appendChild(opt);
                });
            }
            
            const container = document.getElementById('profile-badges-items');
            container.innerHTML = '';
            
            badgesConfig.forEach(badge => {
                const isUnlocked = badge.check(state);
                const prog = badge.getProgress(state);
                const pct = Math.min(100, Math.round((prog.cur / prog.max) * 100));
                
                const badgeDom = document.createElement('div');
                badgeDom.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
                
                badgeDom.innerHTML = `
                    <div class="badge-icon-wrapper">
                        <span class="badge-icon">${badge.icon}</span>
                        ${!isUnlocked ? '<span class="badge-lock">🔒</span>' : ''}
                    </div>
                    <div class="badge-info">
                        <div class="badge-title">${badge.title}</div>
                        <div class="badge-desc">${badge.desc}</div>
                        <div class="badge-progress-container">
                            <div class="badge-progress-fill" style="width: ${pct}%"></div>
                            <div class="badge-progress-text">${prog.cur}/${prog.max}</div>
                        </div>
                    </div>
                `;
                container.appendChild(badgeDom);
            });
        }

        // ================= USER SWITCHER LOGIC =================
        function openUserSwitcherModal() {
            const modal = document.getElementById('modal-container');
            renderUserSwitcherInModal(modal);
            modal.classList.remove('hidden');
        }

        function renderUserSwitcherInModal(modal) {
            let slotsHtml = '';
            
            users.forEach(u => {
                const isActive = (u.id === currentUserId) ? 'active' : '';
                const avatar = getAvatarEmoji(u.avatarId);
                const showDelete = (users.length > 1);
                const deleteBtnHtml = showDelete ? `<button class="user-slot-delete-btn" onclick="confirmDeleteUser('${u.id}', event)">✖</button>` : '';
                
                slotsHtml += `
                    <div class="user-slot-card ${isActive}" onclick="switchUser('${u.id}')">
                        ${deleteBtnHtml}
                        <div class="user-slot-avatar">${avatar}</div>
                        <div class="user-slot-info">
                            <div class="user-slot-name">${u.username}</div>
                            <div class="user-slot-xp">${u.xp} XP</div>
                            <div class="user-slot-progress">进度: ${u.unlockedLevel}/${levels.length}关</div>
                        </div>
                        ${u.id === currentUserId ? '<span class="user-slot-active-badge">✓</span>' : ''}
                    </div>
                `;
            });
            
            const addSlotHtml = `
                <div class="user-slot-card user-slot-add" onclick="showCreateUserForm()">
                    <div class="user-slot-add-icon">+</div>
                    <div class="user-slot-add-label">新建用户存档</div>
                </div>
            `;
            
            modal.innerHTML = `
                <div class="modal-box" style="max-width: 440px;">
                    <div class="modal-title">切换用户与存档管理</div>
                    <div class="modal-desc">您可以在多位用户之间自由切换，或创建新的独立学习进度。</div>
                    
                    <div class="user-slots-grid" id="user-slots-container">
                        ${slotsHtml}
                        ${addSlotHtml}
                    </div>
                    
                    <div class="modal-buttons" style="margin-top: 20px;">
                        <button class="duo-btn duo-btn-gray" onclick="closeModal()">关闭</button>
                    </div>
                </div>
            `;
        }

        function switchUser(userId) {
            if (userId === currentUserId) return;
            currentUserId = userId;
            loadActiveUserState();
            closeModal();
            
            renderProfileScreen();
            renderLevelMap();
            
            alert(`👤 已成功切换到用户：${state.username}`);
        }

        function confirmDeleteUser(userId, event) {
            event.stopPropagation();
            const u = users.find(user => user.id === userId);
            if (!u) return;
            
            const modal = document.getElementById('modal-container');
            modal.innerHTML = `
                <div class="modal-box" style="max-width: 380px;">
                    <div class="modal-icon">⚠️</div>
                    <div class="modal-title">确定删除该存档？</div>
                    <div class="modal-desc">删除用户「 ${u.username} 」的存档将永久抹去其所有的 XP、关卡进度和徽章，且此操作不可撤销！</div>
                    <div class="modal-buttons">
                        <button class="duo-btn duo-btn-red" onclick="executeDeleteUser('${userId}')">确认彻底删除</button>
                        <button class="duo-btn duo-btn-gray" onclick="openUserSwitcherModal()">取消</button>
                    </div>
                </div>
            `;
        }

        function executeDeleteUser(userId) {
            if (users.length <= 1) {
                alert("无法删除：设备上必须保留至少一个用户存档！");
                openUserSwitcherModal();
                return;
            }
            
            if (userId === currentUserId) {
                const remaining = users.filter(u => u.id !== userId);
                currentUserId = remaining[0].id;
            }
            
            users = users.filter(u => u.id !== userId);
            
            localStorage.setItem('morse_game_users', JSON.stringify(users));
            localStorage.setItem('morse_current_user_id', currentUserId);
            
            loadActiveUserState();
            openUserSwitcherModal();
            renderProfileScreen();
            renderLevelMap();
        }

        let selectedNewAvatarId = 1;

        function showCreateUserForm() {
            selectedNewAvatarId = 1;
            const modal = document.getElementById('modal-container');
            
            let avatarsHtml = '';
            for (let i = 1; i <= 6; i++) {
                const emoji = getAvatarEmoji(i);
                const isActive = (i === 1) ? 'active' : '';
                avatarsHtml += `
                    <div class="new-avatar-option ${isActive}" id="new-avatar-${i}" onclick="selectNewUserAvatar(${i})">
                        ${emoji}
                    </div>
                `;
            }
            
            modal.innerHTML = `
                <div class="modal-box" style="max-width: 400px;">
                    <div class="modal-title">新建学习存档</div>
                    <div class="modal-desc">为新的学习者配置个性的昵称和头像</div>
                    
                    <div style="margin-bottom: 20px; text-align: left;">
                        <label style="font-weight: 800; font-size: 14px; color: var(--color-text-dark); display: block; margin-bottom: 8px;">用户昵称：</label>
                        <input type="text" id="new-user-name-input" placeholder="输入昵称 (最多8个字)" maxlength="8" 
                            style="width: 100%; height: 48px; border: 2px solid var(--color-gray-border); border-radius: 12px; padding: 0 16px; font-size: 16px; font-weight: 800; outline: none; transition: border-color 0.2s;"
                            onfocus="this.style.borderColor='var(--color-blue)'"
                            onblur="this.style.borderColor='var(--color-gray-border)'">
                    </div>
                    
                    <label style="font-weight: 800; font-size: 14px; color: var(--color-text-dark); display: block; margin-bottom: 8px; text-align: left;">选择初始头像：</label>
                    <div class="new-avatars-grid" style="display: flex; gap: 8px; justify-content: space-between; margin-bottom: 24px;">
                        ${avatarsHtml}
                    </div>
                    
                    <div class="modal-buttons">
                        <button class="duo-btn duo-btn-green" onclick="executeCreateUser()">✓ 创建并登录</button>
                        <button class="duo-btn duo-btn-gray" onclick="openUserSwitcherModal()">返回</button>
                    </div>
                </div>
            `;
        }

        function selectNewUserAvatar(id) {
            document.getElementById(`new-avatar-${selectedNewAvatarId}`).classList.remove('active');
            selectedNewAvatarId = id;
            document.getElementById(`new-avatar-${id}`).classList.add('active');
        }

        function executeCreateUser() {
            const nameInput = document.getElementById('new-user-name-input');
            let name = nameInput.value.trim();
            if (!name) {
                alert("请输入昵称！");
                return;
            }
            
            const newUser = {
                id: 'user_' + Date.now(),
                username: name,
                avatarId: selectedNewAvatarId,
                xp: 0,
                streak: 0,
                maxStreak: 0,
                unlockedLevel: 1,
                lastCompletedDate: null,
                joinDate: new Date().toLocaleDateString('zh-CN'),
                perfectRounds: 0,
                stats: {
                    audioCorrectCount: 0
                }
            };
            
            users.push(newUser);
            currentUserId = newUser.id;
            
            localStorage.setItem('morse_game_users', JSON.stringify(users));
            localStorage.setItem('morse_current_user_id', currentUserId);
            
            loadActiveUserState();
            closeModal();
            
            renderProfileScreen();
            renderLevelMap();
            
            alert(`🎉 恭喜！新存档「 ${name} 」已成功创建并登录！`);
        }

        // ================= RENDERING: LEVEL MAP =================
        function renderLevelMap() {
            // 动态根据关卡数量自适应拉长蜿蜒折线容器高度，保证间距永远合理
            const container = document.getElementById('level-map-container');
            if (container) {
                container.style.minHeight = `${levels.length * 72}px`;
            }

            const wrapper = document.getElementById('level-nodes-wrapper');
            wrapper.innerHTML = '';

            const containerWidth = 460; // 内部可用宽度
            const steps = levels.length;
            const nodes = [];

            levels.forEach((lvl, idx) => {
                const nodeRow = document.createElement('div');
                nodeRow.className = 'level-node-row';

                // 使用正弦曲线计算横向偏移，形成流畅蛇形蜿蜒
                const xOffset = Math.sin(idx * 1.2) * 85; 
                
                const circle = document.createElement('div');
                circle.className = 'level-circle';
                
                // 关卡锁定/解锁样式判定
                if (lvl.id < state.unlockedLevel) {
                    circle.classList.add('completed');
                    circle.innerHTML = '★'; // 通关显示星星
                } else if (lvl.id === state.unlockedLevel) {
                    circle.classList.add('unlocked', 'active-level');
                    circle.innerHTML = lvl.id;
                } else {
                    circle.classList.add('locked');
                    circle.innerHTML = '🔒';
                }

                // 悬浮泡泡
                const tooltip = document.createElement('div');
                tooltip.className = 'level-tooltip';
                tooltip.innerHTML = `<strong>${lvl.name}</strong><br>${lvl.desc}`;
                circle.appendChild(tooltip);

                // 点击进入关卡
                circle.onclick = () => {
                    if (lvl.id <= state.unlockedLevel) {
                        startLesson(lvl.id);
                    }
                };

                circle.style.transform = `translateX(${xOffset}px)`;
                nodeRow.appendChild(circle);
                wrapper.appendChild(nodeRow);

                // 缓存中心点位置以便绘制连接SVG虚线
                nodes.push({ x: xOffset, id: lvl.id });
            });

            // 绘制SVG连接折线
            setTimeout(() => {
                const svg = document.getElementById('map-svg');
                const path = document.getElementById('map-path');
                const circles = document.querySelectorAll('.level-circle');
                
                if (circles.length === 0) return;

                const containerRect = document.getElementById('level-map-container').getBoundingClientRect();
                let pathD = '';

                circles.forEach((c, idx) => {
                    const r = c.getBoundingClientRect();
                    const cx = (r.left + r.right) / 2 - containerRect.left;
                    const cy = (r.top + r.bottom) / 2 - containerRect.top;

                    if (idx === 0) {
                        pathD += `M ${cx} ${cy}`;
                    } else {
                        // 使用贝塞尔曲线使连线圆润平滑
                        const prevR = circles[idx - 1].getBoundingClientRect();
                        const prevCx = (prevR.left + prevR.right) / 2 - containerRect.left;
                        const prevCy = (prevR.top + prevR.bottom) / 2 - containerRect.top;
                        const midY = (prevCy + cy) / 2;
                        pathD += ` C ${prevCx} ${midY}, ${cx} ${midY}, ${cx} ${cy}`;
                    }
                });

                path.setAttribute('d', pathD);
            }, 100);
        }

        // ================= LESSON ENGINE =================
        function startLesson(levelId) {
            morsePlayer.init(); // 允许音频环境激活

            currentLesson.id = levelId;
            currentLesson.isPractice = (levelId === 0);
            
            if (currentLesson.isPractice) {
                // 综合练习：从所有已解锁的字母中抽题
                let unlockedChars = [];
                levels.forEach(lvl => {
                    if (lvl.id < state.unlockedLevel) {
                        unlockedChars = unlockedChars.concat(lvl.chars);
                    }
                });
                // 防止极端情况下无题
                if (unlockedChars.length === 0) {
                    unlockedChars = ['E', 'T'];
                }
                currentLesson.charsPool = unlockedChars;
                currentLesson.learnedPool = [...unlockedChars]; // 综合练习的已学字符池为 unlockedChars
                currentLesson.maxHearts = 999; // 综合练习不扣心
                currentLesson.hearts = 999;
                currentLesson.phase = 'question'; // 直接开始，不显示关卡卡片预览
            } else {
                const lvl = levels.find(l => l.id === levelId);
                currentLesson.charsPool = lvl.chars;
                
                // 收集当前关卡及之前所有已学关卡的字符
                let learned = [];
                levels.forEach(l => {
                    if (l.id <= levelId) {
                        learned = learned.concat(l.chars);
                    }
                });
                currentLesson.learnedPool = learned;

                currentLesson.maxHearts = levelId <= 3 ? 5 : 3;
                currentLesson.hearts = currentLesson.maxHearts;
                currentLesson.phase = 'preview'; // 先进行预览
            }

            currentLesson.correctCount = 0;
            currentLesson.errorCount = 0;
            currentLesson.wrongAnswers.clear();
            currentLesson.combo = 0; // 重置连击

            // 生成10道题的队列
            generateQuestionsQueue();

            // 切换屏幕
            document.getElementById('home-screen').classList.add('hidden');
            document.getElementById('app-status-bar').classList.add('hidden');
            document.getElementById('lesson-screen').classList.remove('hidden');

            updateLessonHeartsUI();
            updateProgressBar();

            if (currentLesson.phase === 'preview') {
                renderPreviewPhase();
            } else {
                nextQuestion();
            }
        }

        function generateQuestionsQueue() {
            currentLesson.queue = [];
            
            // 1. 首先，将本关卡的所有待学字符，强行各生成一道“char-to-morse”（输入摩斯码）题型
            // 并把它们打乱顺序后排在队列的最前头
            const mustMorseChars = shuffle([...currentLesson.charsPool]);
            mustMorseChars.forEach(targetChar => {
                currentLesson.queue.push({
                    type: 'char-to-morse',
                    target: targetChar,
                    morse: morseData[targetChar]
                });
            });

            // 2. 补齐剩下的题目至 10 道
            const remainingCount = Math.max(0, 10 - currentLesson.queue.length);
            
            // 题型列表。如果已学字符不足 4 个，剔除连线匹配题，避免选项无法凑齐
            let types = ['audio-to-char', 'char-to-morse', 'matching', 'translation', 'audio-spelling', 'translation-spelling', 'telegraph-tap', 'blind-matching'];
            if (currentLesson.learnedPool.length < 4) {
                types = ['audio-to-char', 'char-to-morse', 'translation', 'audio-spelling', 'translation-spelling', 'telegraph-tap'];
            }
            
            for (let i = 0; i < remainingCount; i++) {
                // 随机选一道题型
                let randType = types[Math.floor(Math.random() * types.length)];
                
                // 数字关卡（13、14关）不提供配对连线 and 听力发音（只考输入和翻译，防止音频数据解析错误）
                const isNumberLevel = currentLesson.charsPool.some(c => !isNaN(c));
                if (isNumberLevel) {
                    randType = Math.random() > 0.5 ? 'char-to-morse' : 'translation';
                }

                // 随机选择主测试字符
                const targetChar = currentLesson.charsPool[Math.floor(Math.random() * currentLesson.charsPool.length)];

                let q = {
                    type: randType,
                    target: targetChar,
                    morse: morseData[targetChar]
                };

                // 为选择题和拼字题生成选项
                if (randType === 'audio-spelling' || randType === 'translation-spelling') {
                    q.spellingOptions = generateSpellingOptions(targetChar);
                } else if (randType === 'audio-to-char' || randType === 'translation') {
                    q.options = generateOptions(targetChar, 'char');
                } else if (randType === 'matching' || randType === 'blind-matching') {
                    // 配对与声音配对：获取当前关卡字符 pool 并混淆
                    const pool = [...currentLesson.charsPool];
                    
                    // 优先从已学字符中补充其他字母以凑满 4 个
                    const learnedCandidates = currentLesson.learnedPool.filter(c => !pool.includes(c));
                    const shuffledLearned = shuffle([...learnedCandidates]);
                    for (let j = 0; j < shuffledLearned.length; j++) {
                        if (pool.length >= 4) break;
                        pool.push(shuffledLearned[j]);
                    }
                    
                    // 取前4个并打乱
                    const selected = pool.slice(0, 4);
                    q.leftItems = shuffle([...selected]);
                    q.rightItems = shuffle(selected.map(char => ({ char: char, morse: morseData[char] })));
                }

                currentLesson.queue.push(q);
            }

            currentLesson.totalOriginalCount = currentLesson.queue.length;
        }

        function generateOptions(target, mode) {
            const options = [target];
            const learnedCandidates = currentLesson.learnedPool.filter(c => c !== target);
            
            // 如果是单词，干扰项也应当全部为单词
            if (target.length > 1) {
                // 1. 优先从已学字符里的单词中选
                const learnedWords = learnedCandidates.filter(c => c.length > 1);
                const shuffledLearnedWords = shuffle([...learnedWords]);
                shuffledLearnedWords.forEach(w => {
                    if (options.length < 4) options.push(w);
                });
                
                // 2. 如果不足4个，使用全局预设的所有单词做兜底，保持极佳的挑战性与合理性
                if (options.length < 4) {
                    const allWords = ['SOS', 'OK', 'HI', 'THE', 'AND', 'YOU', 'HELLO', 'LOVE', 'BYE', 'CQ', '73', 'GL'];
                    const backups = shuffle(allWords.filter(w => w !== target && !options.includes(w)));
                    backups.forEach(w => {
                        if (options.length < 4) options.push(w);
                    });
                }
            } else {
                // 如果是单个字符，只从已解锁的单字符中提取干扰项，不进行任何全局兜底，确保早期关卡无混入
                const learnedChars = learnedCandidates.filter(c => c.length === 1);
                const shuffledLearned = shuffle([...learnedChars]);
                for (let i = 0; i < shuffledLearned.length; i++) {
                    if (options.length >= 4) break;
                    options.push(shuffledLearned[i]);
                }
            }
            
            // 终极安全补齐（防止极少元素导致的不够4项）
            if (options.length < 4) {
                const fallbackGroup = target.length > 1 ? ['SOS', 'OK', 'HI', 'CQ'] : ['E', 'T', 'I', 'M'];
                const secureBackups = shuffle(fallbackGroup.filter(b => b !== target && !options.includes(b)));
                secureBackups.forEach(b => {
                    if (options.length < 4) options.push(b);
                });
            }
            
            return shuffle(options);
        }

        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function updateProgressBar() {
            const fill = document.getElementById('lesson-progress-fill');
            const percent = (currentLesson.correctCount / currentLesson.totalOriginalCount) * 100;
            fill.style.width = `${Math.min(percent, 100)}%`;
        }

        function updateLessonHeartsUI() {
            const count = document.getElementById('lesson-heart-count');
            const icon = document.getElementById('lesson-heart-icon');
            
            if (currentLesson.isPractice) {
                count.textContent = '∞';
                icon.textContent = '✨';
            } else {
                count.textContent = currentLesson.hearts;
                icon.textContent = '❤️';
            }
        }

        // ================= RENDERING: PREVIEW PHASE =================
        let previewIndex = 0; // 当前正在预览的字母索引

        function renderPreviewPhase() {
            previewIndex = 0;
            renderPreviewCard(previewIndex);
        }

        function renderPreviewCard(idx) {
            const area = document.getElementById('lesson-body-area');
            const pool = currentLesson.charsPool;
            const char = pool[idx];
            const total = pool.length;
            const isLast = (idx === total - 1);
            const isSingleChar = (char.length === 1);

            // 进度指示点
            let dotsHtml = '';
            for (let i = 0; i < total; i++) {
                const activeClass = (i === idx) ? 'style="background-color: var(--color-blue); transform: scale(1.3);"' : 'style="background-color: var(--color-gray-border);"';
                dotsHtml += `<span ${activeClass} style="${(i === idx) ? 'background-color: var(--color-blue); transform: scale(1.3);' : 'background-color: var(--color-gray-border);'} display: inline-block; width: 10px; height: 10px; border-radius: 50%; transition: all 0.2s;"></span>`;
            }

            // 摩斯码文本
            const morseCode = morseData[char] || '';

            area.innerHTML = `
                <div class="preview-phase" style="animation: fadeSlideIn 0.35s ease;">
                    <div class="preview-title">学习新字符 <span style="color: var(--color-blue);">${idx + 1}</span> / ${total}</div>
                    <div class="preview-desc">仔细观察摩斯码点划如何契合字母笔画</div>
                    
                    <!-- 进度指示点 -->
                    <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;">
                        ${dotsHtml}
                    </div>

                    <!-- 字母大号展示 -->
                    <div style="font-size: 48px; font-weight: 900; color: var(--color-text-dark); margin-bottom: 4px; letter-spacing: 2px;">${char}</div>
                    
                    <!-- 点划视觉徽章 -->
                    <div style="margin-bottom: 16px;">${getMorseVisualHtml(morseCode)}</div>

                    <!-- 记忆叠加层 -->
                    ${isSingleChar ? `
                    <div class="mnemonic-container" id="mnemonic-viewer" style="cursor: pointer;" onclick="playMorseSoundWithFlash('${char}')">
                        ${renderMnemonicSvg(char)}
                    </div>
                    ` : `
                    <div style="font-size: 15px; color: var(--color-text-light); margin-bottom: 24px; padding: 20px; background: var(--color-bg-light); border-radius: 16px; text-align: center;">
                        <div style="font-size: 28px; margin-bottom: 8px;">📡</div>
                        点击下方按钮播放电报声音
                    </div>
                    `}

                    <!-- 播放按钮 -->
                    <button class="audio-play-btn" onclick="playMorseSoundWithFlash('${char}')" title="播放电报声音" style="margin-bottom: 8px;">🔊</button>
                    <div style="font-size: 13px; color: var(--color-text-light); font-weight: 800;">点击播放发音</div>
                </div>
            `;

            // 设置底部按钮
            const actionBtn = document.getElementById('lesson-action-btn');
            if (isLast) {
                actionBtn.className = "duo-btn duo-btn-green";
                actionBtn.innerHTML = "准备好了！开始练习";
                actionBtn.onclick = () => {
                    currentLesson.phase = 'question';
                    nextQuestion();
                };
            } else {
                actionBtn.className = "duo-btn duo-btn-blue";
                actionBtn.innerHTML = `下一个字符 ➜`;
                actionBtn.onclick = () => {
                    previewIndex++;
                    renderPreviewCard(previewIndex);
                };
            }

            // 自动播放发音和闪烁（延迟 400ms 让页面先渲染）
            setTimeout(() => {
                playMorseSoundWithFlash(char);
            }, 400);
        }

        // 定位公式与 morse_position_editor.html 完全一致，支持从 localStorage 动态加载
        function renderMnemonicSvg(char) {
            let config = null;
            const savedData = localStorage.getItem(`morse_pos_${char}`);
            if (savedData) {
                try {
                    config = JSON.parse(savedData);
                } catch(e) {
                    console.error("加载已保存位置失败", e);
                }
            }
            if (!config) {
                config = letterVisualConfigs[char];
            }

            if (!config) {
                // 如果没有视觉记忆图（比如数字、或者长度大于1的单词），自适应计算字号防止溢出
                let fontSize = 120;
                if (char.length > 1) {
                    fontSize = Math.max(32, 120 - (char.length * 12));
                }
                return `<div class="mnemonic-letter-bg" style="color: #f0f1f4; font-size: ${fontSize}px; letter-spacing: 4px; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.8), -1px -1px 0px rgba(0, 0, 0, 0.03);">${char}</div>`;
            }

            let elementsHtml = '';
            config.forEach((el, idx) => {
                const halfWidth = el.type === 'dot' ? 15 : 15;
                const halfHeight = el.type === 'dot' ? 15 : 40;
                // 完全复制编辑器的 updateElementStyle 定位公式
                const style = `left: calc(${el.left}% - ${halfWidth}px); top: calc(${el.top}% - ${halfHeight}px); transform: rotate(${el.rotate || 0}deg);`;
                elementsHtml += `
                    <div class="m-element m-${el.type}" data-index="${idx}" style="${style}" onclick="playMorseUnitWithFlash('${el.type}', ${idx})"></div>
                `;
            });

            // 点划元素放在字母 div 内部作为子元素（与编辑器 letter-display 结构完全一致）
            // 这样百分比坐标就相对于字母文字自身宽高，而非外框容器
            return `
                <div class="mnemonic-letter-bg">${char}${elementsHtml}</div>
            `;
        }

        function playMorseSound(code) {
            morsePlayer.play(code, 1.0);
        }

        function playMorseUnit(type) {
            if (type === 'dot') {
                morsePlayer.play('.', 1.0);
            } else {
                morsePlayer.play('-', 1.0);
            }
        }

        // 音形结合：发音并同步闪烁点划元素
        function playMorseSoundWithFlash(char, speedMultiplier = 1.0) {
            playMorseSound(morseData[char]);
            flashMnemonicElements(char, speedMultiplier);
        }

        // 单音点击闪烁
        function playMorseUnitWithFlash(type, idx) {
            playMorseUnit(type);
            const elDom = document.querySelector(`.mnemonic-container [data-index="${idx}"]`);
            if (elDom) {
                elDom.classList.add('active-blink');
                setTimeout(() => {
                    elDom.classList.remove('active-blink');
                }, type === 'dot' ? 80 : 240);
            }
        }

        // 精准控制发光点划元素的高亮时间
        function flashMnemonicElements(char, speedMultiplier = 1.0) {
            let config = null;
            const savedData = localStorage.getItem(`morse_pos_${char}`);
            if (savedData) {
                try { config = JSON.parse(savedData); } catch(e){}
            }
            if (!config) {
                config = letterVisualConfigs[char];
            }
            if (!config) return;

            const baseUnit = 80 * speedMultiplier;
            const dotDuration = baseUnit;
            const dashDuration = baseUnit * 3;
            const intraGap = baseUnit;

            let delay = 50; // Web Audio 启动稍有 50ms 延时

            config.forEach((elConfig, idx) => {
                const duration = elConfig.type === 'dot' ? dotDuration : dashDuration;
                
                setTimeout(() => {
                    const elDom = document.querySelector(`.mnemonic-container [data-index="${idx}"]`);
                    if (elDom) {
                        elDom.classList.add('active-blink');
                        setTimeout(() => {
                            elDom.classList.remove('active-blink');
                        }, duration);
                    }
                }, delay);

                delay += duration + intraGap;
            });
        }

        // ================= RENDERING: QUESTIONS PHASE =================
        function nextQuestion() {
            // 重置状态
            currentLesson.selectedOption = null;
            currentLesson.morseInput = '';
            currentLesson.spellingInput = [];
            currentLesson.selectedMatchLeft = null;
            currentLesson.selectedMatchRight = null;
            currentLesson.pairedLeft.clear();
            currentLesson.pairedRight.clear();

            // 隐藏反馈栏，恢复底部按钮样式
            document.getElementById('feedback-row').style.display = 'none';
            const footer = document.getElementById('lesson-footer-panel');
            footer.className = "lesson-footer-panel";
            
            const actionBtn = document.getElementById('lesson-action-btn');
            actionBtn.className = "duo-btn duo-btn-gray duo-btn-disabled";
            actionBtn.innerHTML = "检查答案";
            actionBtn.onclick = null;

            if (currentLesson.queue.length === 0) {
                // 队列答完，进入结算
                finishLesson();
                return;
            }

            // 取出队首题目
            const q = currentLesson.queue[0];
            currentLesson.currentQuestion = q;

            // 渲染答题区域
            const area = document.getElementById('lesson-body-area');
            
            if (q.type === 'audio-to-char') {
                renderAudioToChar(area, q);
            } else if (q.type === 'char-to-morse') {
                renderCharToMorse(area, q);
            } else if (q.type === 'matching') {
                renderMatching(area, q);
            } else if (q.type === 'translation') {
                renderTranslation(area, q);
            } else if (q.type === 'audio-spelling') {
                renderAudioSpelling(area, q);
            } else if (q.type === 'translation-spelling') {
                renderTranslationSpelling(area, q);
            } else if (q.type === 'telegraph-tap') {
                renderTelegraphTap(area, q);
            } else if (q.type === 'blind-matching') {
                renderBlindMatching(area, q);
            }

            // 播放音频（如果是听力题，自动响一次）
            if (q.type === 'audio-to-char' || q.type === 'audio-spelling') {
                setTimeout(() => morsePlayer.play(q.morse, 1.0), 300);
            } else if (q.type === 'char-to-morse' || q.type === 'telegraph-tap') {
                // 如果是输入或电键题，自动播放一次记忆卡片点划闪烁和对应音频
                setTimeout(() => playMorseSoundWithFlash(q.target), 400);
            }
        }

        // --- 题型 1: 听音辨字 ---
        function renderAudioToChar(area, q) {
            let optionsHtml = '';
            q.options.forEach((opt, idx) => {
                optionsHtml += `
                    <div class="option-card" onclick="selectOption('${opt}')" id="opt-${opt}">
                        <span class="option-shortcut">${idx + 1}</span>
                        ${opt}
                    </div>
                `;
            });

            area.innerHTML = `
                <div class="lesson-question-container">
                    <div class="question-title">听电报声音，选择对应的字母</div>
                    
                    <div class="audio-buttons-row">
                        <button class="audio-play-btn" onclick="playMorseSound('${q.morse}')" title="播放电报 (Space)">🔊</button>
                    </div>

                    <div class="options-grid">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        }

        function selectOption(val) {
            // 取消上次选择的
            if (currentLesson.selectedOption) {
                const prev = document.getElementById(`opt-${currentLesson.selectedOption}`);
                if (prev) prev.classList.remove('selected');
            }
            currentLesson.selectedOption = val;
            document.getElementById(`opt-${val}`).classList.add('selected');

            // 激活底部检查按钮
            enableCheckButton();
        }

        function enableCheckButton() {
            const actionBtn = document.getElementById('lesson-action-btn');
            actionBtn.className = "duo-btn duo-btn-green";
            actionBtn.onclick = () => checkAnswer();
        }

        // --- 题型 2: 输入摩斯码 ---
        function renderCharToMorse(area, q) {
            area.innerHTML = `
                <div class="lesson-question-container">
                    <div class="question-title">请输入字母 <span style="white-space: nowrap;">「 ${q.target} 」</span> 的摩斯密码</div>
                    
                    <!-- 记忆联想叠加层，辅助记忆 -->
                    <div class="mnemonic-container">
                        ${renderMnemonicSvg(q.target)}
                    </div>

                    <div class="input-code-display" id="morse-input-display">...</div>

                    <div class="morse-input-panel">
                        <button class="duo-btn duo-btn-blue morse-input-btn" onclick="pressMorseChar('.')">
                            <span class="btn-symbol">
                                <span class="morse-visual-char morse-visual-dot" style="background-color: white; width: 14px; height: 14px; border-radius: 50%; display: inline-block;"></span>
                            </span>
                            <span class="btn-label">嘀</span>
                        </button>
                        <button class="duo-btn duo-btn-blue morse-input-btn" onclick="pressMorseChar('-')">
                            <span class="btn-symbol">
                                <span class="morse-visual-char morse-visual-dash" style="background-color: white; width: 36px; height: 12px; border-radius: 6px; display: inline-block;"></span>
                            </span>
                            <span class="btn-label">哒</span>
                        </button>
                        <button class="duo-btn duo-btn-gray morse-backspace-btn" onclick="pressBackspace()">
                            <span class="btn-symbol">⌫</span>
                            <span class="btn-label">退格</span>
                        </button>
                    </div>
                    <div class="keyboard-hint">快捷键：键盘 [ . ] 输入点， [ - ] 输入划， [ Backspace ] 退格， [ Enter ] 提交</div>
                </div>
            `;
            updateInputDisplay();
        }

        function pressMorseChar(ch, playSound = true) {
            const targetCode = currentLesson.currentQuestion ? currentLesson.currentQuestion.morse : '';
            const maxLen = Math.max(6, targetCode.length + 3);
            
            if (currentLesson.morseInput.length < maxLen) {
                currentLesson.morseInput += ch;
                updateInputDisplay();
                enableCheckButton();
                if (playSound) {
                    playMorseUnit(ch === '.' ? 'dot' : 'dash');
                }
            }
        }

        function pressBackspace() {
            currentLesson.morseInput = currentLesson.morseInput.slice(0, -1);
            updateInputDisplay();
            if (currentLesson.morseInput.length === 0) {
                const actionBtn = document.getElementById('lesson-action-btn');
                actionBtn.className = "duo-btn duo-btn-gray duo-btn-disabled";
                actionBtn.onclick = null;
            }
        }

        function updateInputDisplay() {
            const display = document.getElementById('morse-input-display');
            if (currentLesson.morseInput) {
                display.classList.add('has-content');
                display.innerHTML = getMorseVisualHtml(currentLesson.morseInput);
            } else {
                display.classList.remove('has-content');
                display.innerHTML = '<span class="display-placeholder">等待输入摩斯码...</span>';
            }
        }

        // --- 题型 3: 配对连线 ---
        function renderMatching(area, q) {
            let leftHtml = '';
            q.leftItems.forEach((char, idx) => {
                leftHtml += `
                    <div class="match-card" id="match-l-${idx}" onclick="selectMatchItem(${idx}, 'left')">
                        ${char}
                    </div>
                `;
            });

            let rightHtml = '';
            q.rightItems.forEach((item, idx) => {
                rightHtml += `
                    <div class="match-card" id="match-r-${idx}" onclick="selectMatchItem(${idx}, 'right')">
                        ${getMorseVisualHtml(item.morse)}
                    </div>
                `;
            });

            area.innerHTML = `
                <div class="lesson-question-container">
                    <div class="question-title">将字母与其相对应的摩斯码配对连线</div>
                    
                    <div class="matching-columns">
                        <div class="matching-column">
                            ${leftHtml}
                        </div>
                        <div class="matching-column">
                            ${rightHtml}
                        </div>
                    </div>
                </div>
            `;
        }

        function selectMatchItem(idx, side) {
            if (side === 'left') {
                if (currentLesson.pairedLeft.has(idx)) return; // 已经配对的跳过

                if (currentLesson.selectedMatchLeft !== null) {
                    document.getElementById(`match-l-${currentLesson.selectedMatchLeft}`).classList.remove('selected');
                }
                currentLesson.selectedMatchLeft = idx;
                document.getElementById(`match-l-${idx}`).classList.add('selected');
            } else {
                if (currentLesson.pairedRight.has(idx)) return;

                if (currentLesson.selectedMatchRight !== null) {
                    document.getElementById(`match-r-${currentLesson.selectedMatchRight}`).classList.remove('selected');
                }
                currentLesson.selectedMatchRight = idx;
                document.getElementById(`match-r-${idx}`).classList.add('selected');
            }

            // 触发连线核对
            if (currentLesson.selectedMatchLeft !== null && currentLesson.selectedMatchRight !== null) {
                checkMatchPair();
            }
        }

        function checkMatchPair() {
            const leftIdx = currentLesson.selectedMatchLeft;
            const rightIdx = currentLesson.selectedMatchRight;
            
            const leftChar = currentLesson.currentQuestion.leftItems[leftIdx];
            const rightMorse = currentLesson.currentQuestion.rightItems[rightIdx].morse;
            const rightChar = currentLesson.currentQuestion.rightItems[rightIdx].char;

            const lCard = document.getElementById(`match-l-${leftIdx}`);
            const rCard = document.getElementById(`match-r-${rightIdx}`);

            if (leftChar === rightChar) {
                // 配对成功
                morsePlayer.playFeedbackSound(true);
                lCard.className = "match-card paired";
                rCard.className = "match-card paired";

                // 配对爆炸特效
                spawnCorrectParticles(lCard);
                spawnCorrectParticles(rCard);

                currentLesson.pairedLeft.add(leftIdx);
                currentLesson.pairedRight.add(rightIdx);

                // 重置选中
                currentLesson.selectedMatchLeft = null;
                currentLesson.selectedMatchRight = null;

                // 判断是否全部配对完成
                if (currentLesson.pairedLeft.size === 4) {
                    enableCheckButton();
                    // 配对成功后自动点一下 Check 进入结算反馈
                    setTimeout(() => checkAnswer(), 300);
                }
            } else {
                // 配对失败，短暂闪红并抖动
                morsePlayer.playFeedbackSound(false);
                lCard.className = "match-card error-blink";
                rCard.className = "match-card error-blink";

                setTimeout(() => {
                    lCard.className = "match-card";
                    rCard.className = "match-card";
                    lCard.classList.remove('selected');
                    rCard.classList.remove('selected');
                }, 400);

                currentLesson.selectedMatchLeft = null;
                currentLesson.selectedMatchRight = null;
            }
        }

        // --- 题型 5: 听音拼字 ---
        function renderAudioSpelling(area, q) {
            let slotsHtml = '';
            const targetLen = q.target.length;
            for (let i = 0; i < targetLen; i++) {
                slotsHtml += `<div class="spelling-slot" id="spelling-slot-${i}" onclick="removeSpellingSlot(${i})"></div>`;
            }

            let bubblesHtml = '';
            q.spellingOptions.forEach((char, idx) => {
                bubblesHtml += `
                    <div class="spelling-bubble" id="spelling-bubble-${idx}" onclick="clickSpellingBubble('${char}', ${idx})">
                        ${char}
                    </div>
                `;
            });

            area.innerHTML = `
                <div class="lesson-question-container">
                    <div class="question-title">听电报声音，拼出对应的英文字符/单词</div>
                    
                    <div class="audio-buttons-row" style="margin-bottom: 20px;">
                        <button class="audio-play-btn" onclick="playMorseSound('${q.morse}')" title="播放电报 (Space)">🔊</button>
                    </div>

                    <div class="spelling-slots-container">
                        ${slotsHtml}
                    </div>

                    <div class="spelling-pool">
                        ${bubblesHtml}
                    </div>
                </div>
            `;
            updateSpellingUI();
        }

        // --- 题型 6: 看码拼字 ---
        function renderTranslationSpelling(area, q) {
            let slotsHtml = '';
            const targetLen = q.target.length;
            for (let i = 0; i < targetLen; i++) {
                slotsHtml += `<div class="spelling-slot" id="spelling-slot-${i}" onclick="removeSpellingSlot(${i})"></div>`;
            }

            let bubblesHtml = '';
            q.spellingOptions.forEach((char, idx) => {
                bubblesHtml += `
                    <div class="spelling-bubble" id="spelling-bubble-${idx}" onclick="clickSpellingBubble('${char}', ${idx})">
                        ${char}
                    </div>
                `;
            });

            area.innerHTML = `
                <div class="lesson-question-container">
                    <div class="question-title">看摩斯密码，拼出对应的英文字符/单词</div>
                    
                    <div style="display: flex; justify-content: center; margin-bottom: 24px;">
                        ${getMorseVisualHtml(q.morse)}
                    </div>

                    <div class="spelling-slots-container">
                        ${slotsHtml}
                    </div>

                    <div class="spelling-pool">
                        ${bubblesHtml}
                    </div>
                </div>
            `;
            updateSpellingUI();
        }

        // --- 题型 4: 翻译识别 ---
        function renderTranslation(area, q) {
            let optionsHtml = '';
            q.options.forEach((opt, idx) => {
                optionsHtml += `
                    <div class="option-card" onclick="selectOption('${opt}')" id="opt-${opt}">
                        <span class="option-shortcut">${idx + 1}</span>
                        ${opt}
                    </div>
                `;
            });

            area.innerHTML = `
                <div class="lesson-question-container">
                    <div class="question-title">
                        摩斯码 <span style="white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;">「 ${getMorseVisualHtml(q.morse)} 」</span> 翻译后是哪一个字符？
                    </div>
                    <div class="options-grid">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        }

        // --- 题型 7: 模拟电键敲击 ---
        let tapActive = false;
        let tapStartTime = 0;

        function renderTelegraphTap(area, q) {
            const isSingleChar = q.target.length === 1;
            area.innerHTML = `
                <div class="lesson-question-container">
                    <div class="question-title">请使用电键敲击出字母/单词 <span style="white-space: nowrap;">「 ${q.target} 」</span> 的摩斯密码</div>
                    
                    ${isSingleChar ? `
                    <!-- 记忆联想卡片 -->
                    <div class="mnemonic-container">
                        ${renderMnemonicSvg(q.target)}
                    </div>
                    ` : `
                    <div style="font-size: 15px; color: var(--color-text-light); margin-bottom: 16px; padding: 16px; background: var(--color-bg-light); border-radius: 16px; text-align: center;">
                        单词关卡：敲击时注意字母之间的停顿节奏
                    </div>
                    `}

                    <div class="input-code-display" id="morse-input-display">...</div>

                    <!-- 拟真 3D 电报电键 -->
                    <div class="telegraph-key-container">
                        <div class="tap-telegraph-machine" id="telegraph-tap-key">
                            <div class="tap-telegraph-base"></div>
                            <div class="tap-telegraph-pillar"></div>
                            <div class="tap-telegraph-spring"></div>
                            <div class="tap-telegraph-contact"></div>
                            <div class="tap-telegraph-arm">
                                <div class="tap-telegraph-knob"></div>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 12px; width: 100%; justify-content: center; margin-bottom: 8px;">
                        <button class="duo-btn duo-btn-gray morse-backspace-btn" onclick="pressBackspace()" style="max-width: 140px; height: 50px; padding: 0 16px;">
                            <span class="btn-symbol" style="font-size: 18px;">⌫</span>
                            <span class="btn-label" style="font-size: 10px;">退格</span>
                        </button>
                    </div>

                    <div class="keyboard-hint">快捷键：按住/释放 [ 空格键 Space ] 模拟电键敲击，[ Backspace ] 退格，[ Enter ] 提交</div>
                </div>
            `;

            updateInputDisplay();

            // 绑定电键触控与鼠标事件
            const keyDom = document.getElementById('telegraph-tap-key');
            if (keyDom) {
                keyDom.addEventListener('pointerdown', handleTelegraphDown);
                keyDom.addEventListener('pointerup', handleTelegraphUp);
                keyDom.addEventListener('pointerleave', handleTelegraphUp);
                keyDom.addEventListener('pointercancel', handleTelegraphUp);
            }
        }

        function handleTelegraphDown(e) {
            if (e) e.preventDefault();
            if (tapActive) return;
            tapActive = true;
            tapStartTime = performance.now();
            
            const keyDom = document.getElementById('telegraph-tap-key');
            if (keyDom) keyDom.classList.add('pressed');
            
            morsePlayer.startTone();
        }

        function handleTelegraphUp(e) {
            if (e) e.preventDefault();
            if (!tapActive) return;
            tapActive = false;
            
            const keyDom = document.getElementById('telegraph-tap-key');
            if (keyDom) keyDom.classList.remove('pressed');
            
            morsePlayer.stopTone();
            
            const duration = performance.now() - tapStartTime;
            if (duration < 50) return; // 过滤抖动
            
            const symbol = duration < 240 ? '.' : '-';
            pressMorseChar(symbol, false); // 静音输入
        }

        // --- 题型 8: 听音连线 ---
        function renderBlindMatching(area, q) {
            let leftHtml = '';
            q.leftItems.forEach((char, idx) => {
                leftHtml += `
                    <div class="match-card" id="match-l-${idx}" onclick="selectBlindMatchItem(${idx}, 'left')">
                        ${char}
                    </div>
                `;
            });

            let rightHtml = '';
            q.rightItems.forEach((item, idx) => {
                rightHtml += `
                    <div class="match-card audio-match-card" id="match-r-${idx}" onclick="selectBlindMatchItem(${idx}, 'right')">
                        <span class="audio-wave-icon">🔊</span> 声音 ${idx + 1}
                    </div>
                `;
            });

            area.innerHTML = `
                <div class="lesson-question-container">
                    <div class="question-title">将左侧字母与右侧对应的电报声音配对连线</div>
                    
                    <div class="matching-columns">
                        <div class="matching-column">
                            ${leftHtml}
                        </div>
                        <div class="matching-column">
                            ${rightHtml}
                        </div>
                    </div>
                </div>
            `;
        }

        function selectBlindMatchItem(idx, side) {
            if (side === 'left') {
                if (currentLesson.pairedLeft.has(idx)) return;

                if (currentLesson.selectedMatchLeft !== null) {
                    document.getElementById(`match-l-${currentLesson.selectedMatchLeft}`).classList.remove('selected');
                }
                currentLesson.selectedMatchLeft = idx;
                document.getElementById(`match-l-${idx}`).classList.add('selected');
            } else {
                if (currentLesson.pairedRight.has(idx)) return;

                if (currentLesson.selectedMatchRight !== null) {
                    document.getElementById(`match-r-${currentLesson.selectedMatchRight}`).classList.remove('selected');
                }
                currentLesson.selectedMatchRight = idx;
                
                const card = document.getElementById(`match-r-${idx}`);
                card.classList.add('selected');
                
                const rightMorse = currentLesson.currentQuestion.rightItems[idx].morse;
                playBlindAudio(idx, rightMorse);
            }

            if (currentLesson.selectedMatchLeft !== null && currentLesson.selectedMatchRight !== null) {
                checkBlindMatchPair();
            }
        }

        function playBlindAudio(idx, morseCode) {
            morsePlayer.play(morseCode, 1.0);
            const card = document.getElementById(`match-r-${idx}`);
            if (card) {
                card.classList.add('playing-audio');
                
                const baseUnit = 80;
                let duration = 0;
                for (let c of morseCode) {
                    if (c === '.') duration += baseUnit;
                    else if (c === '-') duration += baseUnit * 3;
                    else if (c === ' ') duration += baseUnit * 3;
                    duration += baseUnit;
                }
                
                setTimeout(() => {
                    card.classList.remove('playing-audio');
                }, duration + 150);
            }
        }

        function checkBlindMatchPair() {
            const leftIdx = currentLesson.selectedMatchLeft;
            const rightIdx = currentLesson.selectedMatchRight;
            
            const leftChar = currentLesson.currentQuestion.leftItems[leftIdx];
            const rightChar = currentLesson.currentQuestion.rightItems[rightIdx].char;

            const lCard = document.getElementById(`match-l-${leftIdx}`);
            const rCard = document.getElementById(`match-r-${rightIdx}`);

            if (leftChar === rightChar) {
                morsePlayer.playFeedbackSound(true);
                lCard.className = "match-card paired";
                rCard.className = "match-card audio-match-card paired";

                spawnCorrectParticles(lCard);
                spawnCorrectParticles(rCard);

                currentLesson.pairedLeft.add(leftIdx);
                currentLesson.pairedRight.add(rightIdx);

                currentLesson.selectedMatchLeft = null;
                currentLesson.selectedMatchRight = null;

                if (currentLesson.pairedLeft.size === 4) {
                    enableCheckButton();
                    setTimeout(() => checkAnswer(), 300);
                }
            } else {
                morsePlayer.playFeedbackSound(false);
                lCard.className = "match-card error-blink";
                rCard.className = "match-card audio-match-card error-blink";

                setTimeout(() => {
                    lCard.className = "match-card";
                    rCard.className = "match-card audio-match-card";
                    lCard.classList.remove('selected');
                    rCard.classList.remove('selected');
                }, 400);

                currentLesson.selectedMatchLeft = null;
                currentLesson.selectedMatchRight = null;
            }
        }

        // ================= CHECK AND ACTION CONTROL =================
        function checkAnswer() {
            const q = currentLesson.currentQuestion;
            let isCorrect = false;

            if (q.type === 'audio-to-char' || q.type === 'translation') {
                isCorrect = (currentLesson.selectedOption === q.target);
            } else if (q.type === 'char-to-morse' || q.type === 'telegraph-tap') {
                // 如果是输入题，自动忽略比对时可能包含的空格（让单词输入答题也极顺畅）
                isCorrect = (currentLesson.morseInput.replace(/\s+/g, '') === q.morse.replace(/\s+/g, ''));
            } else if (q.type === 'matching' || q.type === 'blind-matching') {
                isCorrect = true; // 配对连线在卡片层面已经异步核对，到这里直接通过
            }

            // 拼字题答案比对
            if (q.type === 'audio-spelling' || q.type === 'translation-spelling') {
                const typed = currentLesson.spellingInput.map(x => x.char).join('');
                isCorrect = (typed.toUpperCase() === q.target.toUpperCase());
            }

            // 渲染反馈条
            const row = document.getElementById('feedback-row');
            const icon = document.getElementById('feedback-icon');
            const title = document.getElementById('feedback-title');
            const msg = document.getElementById('feedback-message');
            const footer = document.getElementById('lesson-footer-panel');

            row.style.display = 'flex';

            if (isCorrect) {
                if (typeof currentLesson.combo === 'undefined') currentLesson.combo = 0;
                currentLesson.combo++;

                // 播放带连击变调的反馈音效
                morsePlayer.playFeedbackSound(true, currentLesson.combo);

                footer.className = "lesson-footer-panel feedback-correct";
                icon.textContent = "✓";
                title.textContent = "回答正确！";
                msg.innerHTML = `字母 ${q.target} 的摩斯电码正是: ${getMorseVisualHtml(q.morse)}`;

                currentLesson.correctCount++;
                
                // 听音题累加正确总数以支持成就系统
                if (q.type === 'audio-to-char' || q.type === 'audio-spelling' || q.type === 'blind-matching') {
                    if (!state.stats) state.stats = { audioCorrectCount: 0 };
                    state.stats.audioCorrectCount = (state.stats.audioCorrectCount || 0) + 1;
                }

                // ---- 游戏化特效：连击飘字与粒子爆炸 ----
                if (currentLesson.combo >= 2) {
                    showComboToast(currentLesson.combo);
                }
                
                let triggerDom = null;
                if (q.type === 'audio-to-char' || q.type === 'translation') {
                    triggerDom = document.getElementById(`opt-${q.target}`);
                } else if (q.type === 'char-to-morse' || q.type === 'telegraph-tap') {
                    triggerDom = document.getElementById('morse-input-display');
                } else if (q.type === 'audio-spelling' || q.type === 'translation-spelling') {
                    triggerDom = document.querySelector('.spelling-slots-container');
                }
                if (!triggerDom) {
                    triggerDom = document.getElementById('lesson-body-area');
                }
                spawnCorrectParticles(triggerDom);
            } else {
                currentLesson.combo = 0; // 连击清零

                morsePlayer.playFeedbackSound(false);
                footer.className = "lesson-footer-panel feedback-incorrect";
                icon.textContent = "✗";
                title.textContent = "回答错误！";
                msg.innerHTML = `正确答案是 ${q.target} : ${getMorseVisualHtml(q.morse)}`;

                // 如果是输入题，答错后立即自动清空已输入内容
                if (q.type === 'char-to-morse' || q.type === 'telegraph-tap') {
                    currentLesson.morseInput = '';
                    updateInputDisplay();
                }

                // 自动播放正确答案的发音，并在输入题的记忆图案中同步发光闪烁
                setTimeout(() => {
                    playMorseSoundWithFlash(q.target);
                }, 500);

                // 记录错误并将本题追加到队列尾部以待重练
                currentLesson.errorCount++;
                currentLesson.wrongAnswers.add(q.target);
                currentLesson.queue.push(q);

                // 扣减生命值
                if (!currentLesson.isPractice) {
                    currentLesson.hearts--;
                    updateLessonHeartsUI();
                    
                    // 心形抖动动画
                    const heartContainer = document.getElementById('lesson-hearts-container');
                    heartContainer.classList.add('heart-shattered');
                    setTimeout(() => heartContainer.classList.remove('heart-shattered'), 600);

                    // 检查是否死亡
                    if (currentLesson.hearts <= 0) {
                        setTimeout(() => handleLevelFailed(), 500);
                        return;
                    }
                }
            }

            // 将刚才完成的题目从队列首部移出
            currentLesson.queue.shift();

            // 更新进度条
            updateProgressBar();

            // 底部按钮切换为“继续”
            const actionBtn = document.getElementById('lesson-action-btn');
            actionBtn.className = "duo-btn duo-btn-green";
            actionBtn.innerHTML = "继续";
            actionBtn.onclick = () => nextQuestion();
        }

        function handleFooterAction() {
            // 该函数一般用作快捷回车绑定
            const actionBtn = document.getElementById('lesson-action-btn');
            if (actionBtn.classList.contains('duo-btn-disabled')) return;
            actionBtn.click();
        }

        // ================= LEVEL FAILED MODAL =================
        function handleLevelFailed() {
            const modal = document.getElementById('modal-container');
            
            // 是否有足够 XP 复活
            const canRevive = state.xp >= 50;
            const reviveBtnClass = canRevive ? "duo-btn duo-btn-green" : "duo-btn duo-btn-gray duo-btn-disabled";
            const clickAction = canRevive ? "buyLifeWithXp()" : "";

            modal.innerHTML = `
                <div class="modal-box">
                    <div class="modal-icon">💔</div>
                    <div class="modal-title">生命值耗尽</div>
                    <div class="modal-desc">别灰心！摩斯密码需要反复训练。你可以选择花费 50 XP 补满生命值继续，或重新开始。</div>
                    <div class="modal-buttons">
                        <button class="${reviveBtnClass}" onclick="${clickAction}">✨ 花费 50 XP 续命</button>
                        <button class="duo-btn duo-btn-gray" onclick="exitLessonDirectly()">免费重新开始</button>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function buyLifeWithXp() {
            if (state.xp >= 50) {
                state.xp -= 50;
                saveGameState();
                currentLesson.hearts = currentLesson.maxHearts;
                updateLessonHeartsUI();
                
                // 隐藏模态框
                document.getElementById('modal-container').classList.add('hidden');
                
                // 自动继续下一题
                nextQuestion();
            }
        }

        function exitLessonDirectly() {
            document.getElementById('modal-container').classList.add('hidden');
            exitLesson();
        }

        function confirmExitLesson() {
            const modal = document.getElementById('modal-container');
            modal.innerHTML = `
                <div class="modal-box">
                    <div class="modal-icon">🚪</div>
                    <div class="modal-title">确定要退出吗？</div>
                    <div class="modal-desc">现在退出，当前关卡的学习进度将会丢失。</div>
                    <div class="modal-buttons">
                        <button class="duo-btn duo-btn-red" onclick="exitLessonDirectly()">确认退出</button>
                        <button class="duo-btn duo-btn-gray" onclick="closeModal()">留下继续</button>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('modal-container').classList.add('hidden');
        }

        function exitLesson() {
            document.getElementById('lesson-screen').classList.add('hidden');
            document.getElementById('home-screen').classList.remove('hidden');
            document.getElementById('app-status-bar').classList.remove('hidden');
            renderLevelMap();
        }

        // ================= SCREEN: RESULT & Persistency =================
        function finishLesson() {
            document.getElementById('lesson-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');

            // 1. 计算获得的 XP 和星星
            let xpGained = 15;
            let stars = 1;
            
            if (currentLesson.errorCount === 0) {
                stars = 3;
                xpGained = 20; // 完美奖励 5 XP
                
                // 增加完美通关次数
                state.perfectRounds = (state.perfectRounds || 0) + 1;
            } else if (currentLesson.errorCount <= 2) {
                stars = 2;
                xpGained = 15;
            } else {
                stars = 1;
                xpGained = 10;
            }

            // 如果是综合练习，加成减半
            if (currentLesson.isPractice) {
                stars = 3;
                xpGained = 5;
            }

            // 2. 更新全局状态
            state.xp += xpGained;
            
            // 连续学习天数判定
            updateStreakCount();

            // 如果是当前最高解锁关卡，则解锁下一关
            if (!currentLesson.isPractice && currentLesson.id === state.unlockedLevel) {
                if (state.unlockedLevel < levels.length) {
                    state.unlockedLevel++;
                }
            }

            saveGameState();

            // 3. UI 展现
            document.getElementById('result-xp-gain').textContent = `+${xpGained} XP`;
            
            const rawAccuracy = ((currentLesson.totalOriginalCount) / (currentLesson.totalOriginalCount + currentLesson.errorCount)) * 100;
            document.getElementById('result-accuracy').textContent = `${Math.round(rawAccuracy)}%`;
            
            if (!currentLesson.isPractice && currentLesson.errorCount === 0) {
                document.getElementById('result-main-title').innerHTML = `<span class="perfect-title-glow">👑 完美通关 👑</span>`;
            } else {
                document.getElementById('result-main-title').textContent = currentLesson.isPractice ? "温习完成！" : "关卡通过！";
            }

            // 渲染星星动画
            const starNodes = document.querySelectorAll('.result-star');
            starNodes.forEach((s, idx) => {
                s.classList.remove('active');
                if (idx < stars) {
                    setTimeout(() => {
                        s.classList.add('active');
                    }, idx * 250);
                }
            });

            // 4. 纸屑庆祝动画
            initConfetti();
        }

        function updateStreakCount() {
            const todayStr = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
            const lastDateStr = state.lastCompletedDate;
            let streak = state.streak;

            if (!lastDateStr) {
                streak = 1;
            } else {
                const diffTime = Math.abs(new Date(todayStr) - new Date(lastDateStr));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    streak += 1;
                } else if (diffDays > 1) {
                    streak = 1;
                }
            }
            state.streak = streak;
            state.maxStreak = Math.max(state.maxStreak || 0, streak); // 更新历史最高连击
            state.lastCompletedDate = todayStr;
        }

        function exitResultToHome() {
            document.getElementById('result-screen').classList.add('hidden');
            document.getElementById('home-screen').classList.remove('hidden');
            document.getElementById('app-status-bar').classList.remove('hidden');
            renderLevelMap();
        }

        // ================= RESET PROGRESS =================
        function showResetConfirmModal() {
            const modal = document.getElementById('modal-container');
            modal.innerHTML = `
                <div class="modal-box">
                    <div class="modal-icon">⚠️</div>
                    <div class="modal-title">重置所有数据？</div>
                    <div class="modal-desc">重置后，你的经验值、连续天数及所有关卡解锁状态将彻底清空。此操作不可逆！</div>
                    <div class="modal-buttons">
                        <button class="duo-btn duo-btn-red" onclick="resetAllData()">确认彻底重置</button>
                        <button class="duo-btn duo-btn-gray" onclick="closeModal()">取消</button>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
        }

        function resetAllData() {
            localStorage.removeItem('morse_game_state');
            state = {
                xp: 0,
                streak: 0,
                unlockedLevel: 1,
                lastCompletedDate: null
            };
            saveGameState();
            closeModal();
            renderLevelMap();
        }

        // 自定义关卡解锁进度
        function changeUnlockedLevel(levelId) {
            const val = parseInt(levelId);
            if (isNaN(val) || val < 1 || val > levels.length) return;
            state.unlockedLevel = val;
            saveGameState();
            renderLevelMap();
            renderProfileScreen();
        }

        // ================= KEYBOARD SHORTCUTS =================
        document.addEventListener('keydown', (e) => {
            // 只在答题状态下捕获键盘快捷键
            const lessonScreen = document.getElementById('lesson-screen');
            if (lessonScreen.classList.contains('hidden')) return;

            const q = currentLesson.currentQuestion;
            if (!q) return;

            // 空格键：在 telegraph-tap 下为电键敲击，在其他听力题下为播放音频
            if (e.code === 'Space') {
                e.preventDefault();
                if (q.type === 'telegraph-tap') {
                    handleTelegraphDown(e);
                } else if (q.type === 'audio-to-char' || q.type === 'audio-spelling') {
                    playMorseSound(q.morse);
                }
            }

            // 数字键选择选项 (1-4)
            if ((q.type === 'audio-to-char' || q.type === 'translation') && ['1', '2', '3', '4'].includes(e.key)) {
                e.preventDefault();
                const optIndex = parseInt(e.key) - 1;
                if (q.options && q.options[optIndex]) {
                    selectOption(q.options[optIndex]);
                }
            }

            // 摩斯码键盘直输 (. / - / Backspace)
            if (q.type === 'char-to-morse' || q.type === 'telegraph-tap') {
                if (e.key === '.' || e.key === '*') {
                    e.preventDefault();
                    pressMorseChar('.');
                } else if (e.key === '-' || e.key === '_') {
                    e.preventDefault();
                    pressMorseChar('-');
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    pressBackspace();
                }
            }

            // 拼字题键盘输入 (. / - 等字符用于输入题，字母直接用于拼字题)
            if (q.type === 'audio-spelling' || q.type === 'translation-spelling') {
                if (e.key === 'Backspace') {
                    e.preventDefault();
                    if (currentLesson.spellingInput.length > 0) {
                        removeSpellingSlot(currentLesson.spellingInput.length - 1);
                    }
                } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
                    e.preventDefault();
                    const keyChar = e.key.toUpperCase();
                    // 找到气泡池里第一个匹配且未被占用的字母气泡索引
                    const bubbleIdx = q.spellingOptions.findIndex((char, idx) => {
                        const isCharMatch = (char.toUpperCase() === keyChar);
                        const isAlreadyUsed = currentLesson.spellingInput.some(input => input.bubbleIdx === idx);
                        return isCharMatch && !isAlreadyUsed;
                    });
                    if (bubbleIdx !== -1) {
                        clickSpellingBubble(q.spellingOptions[bubbleIdx], bubbleIdx);
                    }
                }
            }

            // Enter 键核对或继续
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFooterAction();
            }
        });

        document.addEventListener('keyup', (e) => {
            const lessonScreen = document.getElementById('lesson-screen');
            if (lessonScreen.classList.contains('hidden')) return;

            const q = currentLesson.currentQuestion;
            if (!q) return;

            if (q.type === 'telegraph-tap' && e.code === 'Space') {
                e.preventDefault();
                handleTelegraphUp(e);
            }
        });

        // ================= CONFETTI CELEBRATION EFFECT =================
        let confetti = [];
        let confettiTimer = null;

        function initConfetti() {
            const canvas = document.getElementById('confetti-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            
            confetti = [];
            const colors = ['#FFC800', '#58CC02', '#1CB0F6', '#FF4B4B', '#FF8A80', '#B2FF59'];

            for (let i = 0; i < 80; i++) {
                confetti.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height - canvas.height,
                    r: Math.random() * 6 + 4,
                    d: Math.random() * canvas.height,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    tilt: Math.random() * 10 - 5,
                    tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                    tiltAngle: 0
                });
            }

            if (confettiTimer) cancelAnimationFrame(confettiTimer);
            
            let start = Date.now();
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let remaining = false;

                confetti.forEach((p, index) => {
                    p.tiltAngle += p.tiltAngleIncremental;
                    p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                    p.x += Math.sin(p.tiltAngle);
                    p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;

                    if (p.y < canvas.height) {
                        remaining = true;
                    }

                    ctx.beginPath();
                    ctx.lineWidth = p.r;
                    ctx.strokeStyle = p.color;
                    ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                    ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                    ctx.stroke();
                });

                // 运行 3.5 秒后自动停止，或者雨落尽后停止
                if (remaining && Date.now() - start < 3500) {
                    confettiTimer = requestAnimationFrame(draw);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            draw();
        }

        // ================= ON LOAD INITIALIZATION =================
        window.onload = () => {
            initUserSystem();
            showScreen('welcome-screen');
        };

        // 窗口拉伸时重新绘制地图连接线以保证精准对齐
        window.onresize = () => {
            const homeScreen = document.getElementById('home-screen');
            if (homeScreen && !homeScreen.classList.contains('hidden')) {
                renderLevelMap();
            }
        };