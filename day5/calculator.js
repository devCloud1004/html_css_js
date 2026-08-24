// DOM 요소 선택
const display = document.querySelector('#display');
const buttons = document.querySelectorAll('button');
const powerBtn = document.querySelector('.on-off');

// 계산기 상태 변수
let isPowerOn = true;
let currentExpression = '';

// 1. 화면 업데이트 함수
function updateDisplay(value) {
    display.value = value;
}

// 2. ON/OFF 전원 토글
function togglePower() {
    isPowerOn = !isPowerOn;
    
    if (isPowerOn) {
        powerBtn.classList.remove('on');
        currentExpression = '';
        updateDisplay('0');
        buttons.forEach(btn => btn.disabled = false);
    } else {
        powerBtn.classList.add('on');
        currentExpression = '';
        updateDisplay('');
        buttons.forEach(btn => {
            if (!btn.classList.contains('on-off')) {
                btn.disabled = true;
            }
        });
    }
}

// 3. 초기화 (C 버튼)
function clearDisplay() {
    if (!isPowerOn) return;
    currentExpression = '';
    updateDisplay('0');
}

// 4. 숫자 및 소수점 입력
function appendNumber(num) {
    if (!isPowerOn) return;
    
    // 처음에 0만 있거나 이전 결과가 표시 중일 때 처리
    if (display.value === '0' && num !== '.') {
        currentExpression = num;
    } else {
        currentExpression += num;
    }
    updateDisplay(currentExpression);
}

// 5. 연산자 입력 (+, -, *, /)
function appendOperator(op) {
    if (!isPowerOn) return;
    if (currentExpression === '' && display.value === '0') return;

    // 연산자 교체
    const lastChar = currentExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + op;
    } else {
        currentExpression += op;
    }
    updateDisplay(currentExpression);
}

// 6. 계산 실행
function performCalculate() {
    if (!isPowerOn || currentExpression === '') return;

    try {
        // 정규식 검증
        if (/[^0-9\+\-\*\/\.]/.test(currentExpression)) {
            throw new Error('Invalid Expression');
        }

        // 우선순위 계산
        const result = new Function(`return ${currentExpression}`)();

        if (!isFinite(result)) {
            throw new Error('Divide by Zero');
        }

        updateDisplay(result);
        currentExpression = String(result);
    } catch (error) {
        updateDisplay('Error');
        currentExpression = '';
    }
}

// 7. EventListener 등록
document.addEventListener('DOMContentLoaded', () => {
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target;

            // 클래스 종류에 따른 기능 분기
            if (btn.classList.contains('on-off')) {
                togglePower();
            } else if (btn.classList.contains('clear')) {
                clearDisplay();
            } else if (btn.classList.contains('enter')) {
                performCalculate();
            } else if (btn.classList.contains('operator')) {
                appendOperator(btn.innerText);
            } else if (btn.classList.contains('number')) {
                appendNumber(btn.innerText);
            }
        });
    });
});
