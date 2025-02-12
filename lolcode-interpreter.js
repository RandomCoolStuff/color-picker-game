class LOLCODEInterpreter {
    constructor(code) {
        this.code = code;
        this.functions = this.parseFunctions();
    }

    parseFunctions() {
        const functions = {};
        const lines = this.code.split('\n');
        let currentFunction = null;
        let functionBody = '';

        for (const line of lines) {
            if (line.startsWith('HOW IZ I')) {
                if (currentFunction) {
                    functions[currentFunction] = new Function(...this.params, functionBody);
                }
                const parts = line.split(' ');
                currentFunction = parts[3];
                this.params = parts.slice(4).map(param => param.toLowerCase());
                functionBody = '';
            } else if (line.startsWith('IF U SAY SO')) {
                if (currentFunction) {
                    functions[currentFunction] = new Function(...this.params, functionBody);
                    currentFunction = null;
                    functionBody = '';
                }
            } else if (currentFunction) {
                functionBody += this.translateLine(line) + '\n';
            }
        }

        return functions;
    }

    translateLine(line) {
        if (line.startsWith('VISIBLE')) {
            return `return "${line.slice(8).trim()}";`;
        }
        return line;
    }

    run(functionName, args = []) {
        if (this.functions[functionName]) {
            return this.functions[functionName](...args);
        }
        throw new Error(`Function ${functionName} not found`);
    }
}
