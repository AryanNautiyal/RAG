class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
        this.history = JSON.parse(localStorage.getItem('calc_history')) || [];
        this.renderHistory();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
    }

    delete() {
        if (this.resetScreen) return;
        if (this.currentOperand === '0' || this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.resetScreen) {
            this.currentOperand = '';
            this.resetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        let operatorSymbol = '';
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                operatorSymbol = '+';
                break;
            case 'subtract':
                computation = prev - current;
                operatorSymbol = '−';
                break;
            case 'multiply':
                computation = prev * current;
                operatorSymbol = '×';
                break;
            case 'divide':
                if (current === 0) {
                    alert('Cannot divide by zero');
                    this.clear();
                    return;
                }
                computation = prev / current;
                operatorSymbol = '÷';
                break;
            default:
                return;
        }

        // Handle floating point precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
        computation = Math.round(computation * 1e12) / 1e12;

        const expression = `${this.formatDisplayNumber(prev)} ${operatorSymbol} ${this.formatDisplayNumber(current)}`;
        
        this.addToHistory(expression, computation);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetScreen = true;
    }

    percent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        const computation = current / 100;
        this.currentOperand = computation.toString();
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    formatDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.formatDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            let operatorSymbol = '';
            switch(this.operation) {
                case 'add': operatorSymbol = '+'; break;
                case 'subtract': operatorSymbol = '−'; break;
                case 'multiply': operatorSymbol = '×'; break;
                case 'divide': operatorSymbol = '÷'; break;
            }
            this.previousOperandElement.innerText = 
                `${this.formatDisplayNumber(this.previousOperand)} ${operatorSymbol}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    addToHistory(expression, result) {
        const historyItem = { expression, result: this.formatDisplayNumber(result) };
        this.history.unshift(historyItem);
        if (this.history.length > 20) this.history.pop(); // Keep last 20
        localStorage.setItem('calc_history', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');
        if (this.history.length === 0) {
            historyList.innerHTML = '<div class="no-history">No history yet</div>';
            return;
        }

        historyList.innerHTML = '';
        this.history.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('history-item');
            div.innerHTML = `
                <div class="history-expr">${item.expression} =</div>
                <div class="history-result">${item.result}</div>
            `;
            div.addEventListener('click', () => {
                this.currentOperand = item.result.replace(/,/g, '');
                this.resetScreen = true;
                this.updateDisplay();
                // Close sidebar on mobile/desktop if needed
                document.getElementById('history-sidebar').classList.remove('active');
            });
            historyList.appendChild(div);
        });
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('calc_history');
        this.renderHistory();
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Button click listeners
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.number !== undefined) {
                if (button.dataset.number === 'decimal') {
                    calculator.appendNumber('.');
                } else {
                    calculator.appendNumber(button.dataset.number);
                }
            } else if (button.dataset.action !== undefined) {
                const action = button.dataset.action;
                switch (action) {
                    case 'clear':
                        calculator.clear();
                        break;
                    case 'delete':
                        calculator.delete();
                        break;
                    case 'percent':
                        calculator.percent();
                        break;
                    case 'sign':
                        calculator.toggleSign();
                        break;
                    case 'decimal':
                        calculator.appendNumber('.');
                        break;
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                        calculator.chooseOperation(action);
                        break;
                    case 'calculate':
                        calculator.compute();
                        break;
                }
            }
            calculator.updateDisplay();
        });
    });

    // Keyboard support
    window.addEventListener('keydown', e => {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            calculator.appendNumber(e.key);
        } else if (e.key === '+' || e.key === '-') {
            calculator.chooseOperation(e.key === '+' ? 'add' : 'subtract');
        } else if (e.key === '*') {
            calculator.chooseOperation('multiply');
        } else if (e.key === '/') {
            e.preventDefault(); // Prevent browser search shortcut
            calculator.chooseOperation('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculator.compute();
        } else if (e.key === 'Backspace') {
            calculator.delete();
        } else if (e.key === 'Escape') {
            calculator.clear();
        } else if (e.key === '%') {
            calculator.percent();
        }
        calculator.updateDisplay();
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('calc_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('calc_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-moon';
        } else {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }

    // History Sidebar toggle
    const historyToggle = document.getElementById('history-toggle');
    const historySidebar = document.getElementById('history-sidebar');
    const clearHistoryBtn = document.getElementById('clear-history');

    historyToggle.addEventListener('click', () => {
        historySidebar.classList.toggle('active');
    });

    clearHistoryBtn.addEventListener('click', () => {
        calculator.clearHistory();
    });

    calculator.updateDisplay();
});
