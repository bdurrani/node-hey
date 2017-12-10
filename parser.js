class Parser {
    constructor(args) {
        this._args = args;
        this._actions = {};
        this._currentState = {};
    }

    get listToken() {
        return 'list';
    }

    _parser() {

        for (let i = 0; i < this._args.length; i++) {
            let current = this._args[i].toLowerCase();
            if (current.includes(this.listToken)) {
                this.processListToken();
                return;
            }
        }
    }

    processListToken() {
        const token = this.listToken;
        if (this._actions[this.listToken]) {
            this._actions[this.listToken](token, this);
        }

    }

    registerAction(action) {
        Object.assign(this._actions, action);
    }

}

module.exports = Parser;
