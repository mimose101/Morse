// ================= MORSE DICTIONARY & CONFIGS =================
const morseData = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..',
            'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
            'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
            'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
            'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..',
            '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
            '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----'
        };

        const letterVisualConfigs = {
            "A": [
                {
                    "type": "dot",
                    "left": 50,
                    "top": 26,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 50,
                    "top": 62,
                    "rotate": -90
                }
            ],
            "B": [
                {
                    "type": "dash",
                    "left": 22,
                    "top": 50,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 60,
                    "top": 25,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 60,
                    "top": 50,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 62,
                    "top": 75,
                    "rotate": 0
                }
            ],
            "C": [
                {
                    "type": "dash",
                    "left": 53,
                    "top": 25,
                    "rotate": -90
                },
                {
                    "type": "dot",
                    "left": 17,
                    "top": 37,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 21,
                    "top": 61,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 55,
                    "top": 74,
                    "rotate": 0
                }
            ],
            "D": [
                {
                    "type": "dash",
                    "left": 22,
                    "top": 51,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 60,
                    "top": 27,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 60,
                    "top": 73,
                    "rotate": 0
                }
            ],
            "E": [
                {
                    "type": "dot",
                    "left": 26,
                    "top": 48,
                    "rotate": 0
                }
            ],
            "F": [
                {
                    "type": "dot",
                    "left": 26,
                    "top": 25,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 84,
                    "top": 25,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 26,
                    "top": 52,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 80,
                    "top": 50,
                    "rotate": 0
                }
            ],
            "G": [
                {
                    "type": "dash",
                    "left": 19,
                    "top": 47,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 55,
                    "top": 74,
                    "rotate": -90
                },
                {
                    "type": "dot",
                    "left": 61,
                    "top": 52,
                    "rotate": 0
                }
            ],
            "H": [
                {
                    "type": "dot",
                    "left": 20,
                    "top": 25,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 80,
                    "top": 25,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 20,
                    "top": 75,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 80,
                    "top": 75,
                    "rotate": 0
                }
            ],
            "I": [
                {
                    "type": "dot",
                    "left": 50,
                    "top": 25,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 50,
                    "top": 75,
                    "rotate": 0
                }
            ],
            "J": [
                {
                    "type": "dot",
                    "left": 74,
                    "top": 7,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 74,
                    "top": 35,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 74,
                    "top": 71,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 20,
                    "top": 81,
                    "rotate": -90
                }
            ],
            "K": [
                {
                    "type": "dash",
                    "left": 73,
                    "top": 29,
                    "rotate": 38
                },
                {
                    "type": "dot",
                    "left": 39,
                    "top": 50,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 72,
                    "top": 67,
                    "rotate": -30
                }
            ],
            "L": [
                {
                    "type": "dot",
                    "left": 26,
                    "top": 24,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 26,
                    "top": 49,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 26,
                    "top": 74,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 82,
                    "top": 74,
                    "rotate": 0
                }
            ],
            "M": [
                {
                    "type": "dash",
                    "left": 16,
                    "top": 50,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 84,
                    "top": 50,
                    "rotate": 0
                }
            ],
            "N": [
                {
                    "type": "dash",
                    "left": 20,
                    "top": 50,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 78,
                    "top": 71,
                    "rotate": 0
                }
            ],
            "O": [
                {
                    "type": "dash",
                    "left": 18,
                    "top": 49,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 50,
                    "top": 76,
                    "rotate": -90
                },
                {
                    "type": "dash",
                    "left": 82,
                    "top": 49,
                    "rotate": 0
                }
            ],
            "P": [
                {
                    "type": "dot",
                    "left": 22,
                    "top": 40,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 51,
                    "top": 25,
                    "rotate": -90
                },
                {
                    "type": "dash",
                    "left": 54,
                    "top": 54,
                    "rotate": -90
                },
                {
                    "type": "dot",
                    "left": 83,
                    "top": 39,
                    "rotate": 0
                }
            ],
            "Q": [
                {
                    "type": "dash",
                    "left": 23,
                    "top": 32,
                    "rotate": 40
                },
                {
                    "type": "dash",
                    "left": 25,
                    "top": 67,
                    "rotate": -40
                },
                {
                    "type": "dot",
                    "left": 64,
                    "top": 74,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 84,
                    "top": 49,
                    "rotate": 0
                }
            ],
            "R": [
                {
                    "type": "dot",
                    "left": 21,
                    "top": 28,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 22,
                    "top": 60,
                    "rotate": -180
                },
                {
                    "type": "dot",
                    "left": 79,
                    "top": 73,
                    "rotate": 0
                }
            ],
            "S": [
                {
                    "type": "dot",
                    "left": 50,
                    "top": 25,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 50,
                    "top": 50,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 50,
                    "top": 75,
                    "rotate": 0
                }
            ],
            "T": [
                {
                    "type": "dash",
                    "left": 50,
                    "top": 26,
                    "rotate": -90
                }
            ],
            "U": [
                {
                    "type": "dot",
                    "left": 21,
                    "top": 27,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 79,
                    "top": 27,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 50,
                    "top": 72,
                    "rotate": -90
                }
            ],
            "V": [
                {
                    "type": "dot",
                    "left": 19,
                    "top": 26,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 83,
                    "top": 26,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 50,
                    "top": 71,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 50,
                    "top": 88,
                    "rotate": -90
                }
            ],
            "W": [
                {
                    "type": "dot",
                    "left": 14,
                    "top": 26,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 42,
                    "top": 50,
                    "rotate": 11
                },
                {
                    "type": "dash",
                    "left": 80,
                    "top": 50,
                    "rotate": 11
                }
            ],
            "X": [
                {
                    "type": "dash",
                    "left": 29,
                    "top": 32,
                    "rotate": -29
                },
                {
                    "type": "dot",
                    "left": 68,
                    "top": 35,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 33,
                    "top": 62,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 70,
                    "top": 66,
                    "rotate": -29
                }
            ],
            "Y": [
                {
                    "type": "dash",
                    "left": 26,
                    "top": 33,
                    "rotate": -27
                },
                {
                    "type": "dot",
                    "left": 50,
                    "top": 53,
                    "rotate": 0
                },
                {
                    "type": "dash",
                    "left": 74,
                    "top": 33,
                    "rotate": 27
                },
                {
                    "type": "dash",
                    "left": 50,
                    "top": 77,
                    "rotate": 0
                }
            ],
            "Z": [
                {
                    "type": "dash",
                    "left": 46,
                    "top": 25,
                    "rotate": -90
                },
                {
                    "type": "dash",
                    "left": 54,
                    "top": 49,
                    "rotate": 36
                },
                {
                    "type": "dot",
                    "left": 20,
                    "top": 74,
                    "rotate": 0
                },
                {
                    "type": "dot",
                    "left": 85,
                    "top": 74,
                    "rotate": 0
                }
            ]
        };

        const levels = [
            { id: 1, name: "第一关：入门双音", chars: ['E', 'T'], desc: "基础单音 E (.) 与 T (-)" },
            { id: 2, name: "第二关：双音对称", chars: ['I', 'M'], desc: "双音对称 I (..) 与 M (--)" },
            { id: 3, name: "第三关：双音镜像", chars: ['A', 'N'], desc: "双音镜像 A (.-) 与 N (-.)" },
            { id: 4, name: "第四关：三音对称", chars: ['S', 'O'], desc: "三音对称 S (...) 与 O (---)" },
            { id: 5, name: "第五关：高频引入", chars: ['H', 'G'], desc: "引入 H (....) 与 G (--.)" },
            { id: 6, name: "第六关：三音镜像", chars: ['D', 'U'], desc: "三音镜像 D (-..) 与 U (..-)" },
            { id: 7, name: "第七关：三音夹心", chars: ['R', 'K'], desc: "三音夹心 R (.-.) 与 K (-.-)" },
            { id: 8, name: "第八关：四音镜像", chars: ['B', 'V'], desc: "四音镜像 B (-...) 与 V (...-)" },
            { id: 9, name: "第九关：四音对称", chars: ['L', 'F'], desc: "四音易混 L (.-..) 与 F (..-.)" },
            { id: 10, name: "第十关：四音交替", chars: ['C', 'Y'], desc: "四音交替 C (-.-.) 与 Y (-.--)" },
            { id: 11, name: "十一关：点起手长音", chars: ['P', 'W', 'J'], desc: "P (.--.)、W (.--) 与 J (.---)" },
            { id: 12, name: "十二关：难点收尾", chars: ['Q', 'X', 'Z'], desc: "Q (--.-)、X (-..-) 与 Z (--..)" },
            { id: 13, name: "十三关：基础数字", chars: ['1', '2', '3', '4', '5'], desc: "数字 1-5" },
            { id: 14, name: "十四关：高位数字", chars: ['6', '7', '8', '9', '0'], desc: "数字 6-0" },
            { id: 15, name: "十五关：经典缩写", chars: ['SOS', 'OK', 'HI'], desc: "求救 SOS、确认 OK 与笑声 HI" },
            { id: 16, name: "十六关：常用词汇 I", chars: ['THE', 'AND', 'YOU'], desc: "高频英语词汇 THE、AND、YOU" },
            { id: 17, name: "十七关：经典问候", chars: ['HELLO', 'LOVE', 'BYE'], desc: "日常问候 HELLO、LOVE、BYE" },
            { id: 18, name: "十八关：无线电密语", chars: ['CQ', '73', 'GL'], desc: "呼叫 CQ、美好祝愿 73 与好运 GL" }
        ];

        // ================= WEB AUDIO PLAYER =================

// ================= CODEBOOK DICTIONARY =================
const codebookItems = [
            { char: 'A', morse: '.-', type: 'letter' },
            { char: 'B', morse: '-...', type: 'letter' },
            { char: 'C', morse: '-.-.', type: 'letter' },
            { char: 'D', morse: '-..', type: 'letter' },
            { char: 'E', morse: '.', type: 'letter' },
            { char: 'F', morse: '..-.', type: 'letter' },
            { char: 'G', morse: '--.', type: 'letter' },
            { char: 'H', morse: '....', type: 'letter' },
            { char: 'I', morse: '..', type: 'letter' },
            { char: 'J', morse: '.---', type: 'letter' },
            { char: 'K', morse: '-.-', type: 'letter' },
            { char: 'L', morse: '.-..', type: 'letter' },
            { char: 'M', morse: '--', type: 'letter' },
            { char: 'N', morse: '-.', type: 'letter' },
            { char: 'O', morse: '---', type: 'letter' },
            { char: 'P', morse: '.--.', type: 'letter' },
            { char: 'Q', morse: '--.-', type: 'letter' },
            { char: 'R', morse: '.-.', type: 'letter' },
            { char: 'S', morse: '...', type: 'letter' },
            { char: 'T', morse: '-', type: 'letter' },
            { char: 'U', morse: '..-', type: 'letter' },
            { char: 'V', morse: '...-', type: 'letter' },
            { char: 'W', morse: '.--', type: 'letter' },
            { char: 'X', morse: '-..-', type: 'letter' },
            { char: 'Y', morse: '-.--', type: 'letter' },
            { char: 'Z', morse: '--..', type: 'letter' },
            { char: '1', morse: '.----', type: 'number' },
            { char: '2', morse: '..---', type: 'number' },
            { char: '3', morse: '...--', type: 'number' },
            { char: '4', morse: '....-', type: 'number' },
            { char: '5', morse: '.....', type: 'number' },
            { char: '6', morse: '-....', type: 'number' },
            { char: '7', morse: '--...', type: 'number' },
            { char: '8', morse: '---..', type: 'number' },
            { char: '9', morse: '----.', type: 'number' },
            { char: '0', morse: '-----', type: 'number' },
            { char: 'SOS', morse: '... --- ...', type: 'word' },
            { char: 'OK', morse: '--- -.-', type: 'word' },
            { char: 'HI', morse: '.... ..', type: 'word' },
            { char: 'THE', morse: '- .... .', type: 'word' },
            { char: 'AND', morse: '.- -. -..', type: 'word' },
            { char: 'YOU', morse: '-.-- --- ..-', type: 'word' },
            { char: 'HELLO', morse: '.... . .-.. .-.. ---', type: 'word' },
            { char: 'LOVE', morse: '.-.. --- ...- .', type: 'word' },
            { char: 'BYE', morse: '-... -.-- .', type: 'word' },
            { char: 'CQ', morse: '-.-. --.-', type: 'word' },
            { char: '73', morse: '--... ...--', type: 'word' },
            { char: 'GL', morse: '--. .-..', type: 'word' }
        ];