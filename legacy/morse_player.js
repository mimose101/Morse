class MorsePlayer {
            constructor() {
                this.audioCtx = null;
                this.frequency = 680;
                this.oscillator = null;
                this.gainNode = null;
            }

            init() {
                if (!this.audioCtx) {
                    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }
            }

            startTone() {
                this.init();
                this.stop();

                const now = this.audioCtx.currentTime;
                this.oscillator = this.audioCtx.createOscillator();
                this.gainNode = this.audioCtx.createGain();

                this.oscillator.type = 'sine';
                this.oscillator.frequency.value = this.frequency;

                this.gainNode.gain.setValueAtTime(0, now);
                this.gainNode.gain.linearRampToValueAtTime(0.8, now + 0.005);

                this.oscillator.connect(this.gainNode);
                this.gainNode.connect(this.audioCtx.destination);

                this.oscillator.start(now);
            }

            stopTone() {
                if (this.oscillator && this.gainNode) {
                    const now = this.audioCtx.currentTime;
                    try {
                        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
                        this.gainNode.gain.linearRampToValueAtTime(0, now + 0.015);
                        
                        const currentOsc = this.oscillator;
                        const currentGain = this.gainNode;
                        
                        currentOsc.stop(now + 0.02);
                        setTimeout(() => {
                            try {
                                currentOsc.disconnect();
                                currentGain.disconnect();
                            } catch(e){}
                        }, 50);
                    } catch(e) {}
                    
                    this.oscillator = null;
                    this.gainNode = null;
                }
            }

            play(morseCode, speedMultiplier = 1.0) {
                this.init();
                this.stop();

                const baseUnit = 80 * speedMultiplier; // ms
                const dotDuration = baseUnit / 1000;
                const dashDuration = (baseUnit * 3) / 1000;
                const intraGap = baseUnit / 1000;

                let time = this.audioCtx.currentTime + 0.05;

                this.oscillator = this.audioCtx.createOscillator();
                this.gainNode = this.audioCtx.createGain();

                this.oscillator.type = 'sine';
                this.oscillator.frequency.value = this.frequency;
                
                // 初始静音
                this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

                for (let i = 0; i < morseCode.length; i++) {
                    const char = morseCode[i];
                    if (char === '.' || char === '-') {
                        const duration = (char === '.') ? dotDuration : dashDuration;
                        
                        // 线性渐变淡入淡出，消除切换卡嗒声
                        this.gainNode.gain.setValueAtTime(0, time);
                        this.gainNode.gain.linearRampToValueAtTime(0.8, time + 0.005);
                        this.gainNode.gain.setValueAtTime(0.8, time + duration - 0.005);
                        this.gainNode.gain.linearRampToValueAtTime(0, time + duration);

                        time += duration + intraGap;
                    } else if (char === ' ') {
                        // 单词中字母之间的停顿时间（额外增加 2 个基准时间间隔，连同 intraGap 构成标准字符停顿）
                        time += (baseUnit * 2) / 1000;
                    }
                }

                this.oscillator.connect(this.gainNode);
                this.gainNode.connect(this.audioCtx.destination);

                this.oscillator.start();
                this.oscillator.stop(time);
            }

            stop() {
                if (this.oscillator) {
                    try {
                        this.oscillator.stop();
                    } catch(e) {}
                    this.oscillator.disconnect();
                    this.oscillator = null;
                }
            }

            playFeedbackSound(isCorrect, combo = 1) {
                this.init();
                const now = this.audioCtx.currentTime;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                if (isCorrect) {
                    // 答对：欢快的双音（880Hz -> 1174Hz）
                    // 连击越高，音调加成越大，刺激多巴胺分泌
                    const factor = Math.min(1.6, 1 + (combo - 1) * 0.05);
                    const f1 = 880 * factor;
                    const f2 = 1174 * factor;

                    osc.frequency.setValueAtTime(f1, now);
                    osc.frequency.setValueAtTime(f2, now + 0.08);
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.4, now + 0.01);
                    gain.gain.setValueAtTime(0.4, now + 0.18);
                    gain.gain.linearRampToValueAtTime(0, now + 0.22);
                    
                    osc.start(now);
                    osc.stop(now + 0.22);
                } else {
                    // 答错：低频的降调蜂鸣（220Hz）
                    osc.frequency.setValueAtTime(220, now);
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.5, now + 0.01);
                    gain.gain.setValueAtTime(0.5, now + 0.25);
                    gain.gain.linearRampToValueAtTime(0, now + 0.3);
                    
                    osc.start(now);
                    osc.stop(now + 0.3);
                }
            }
        }

        const morsePlayer = new MorsePlayer();