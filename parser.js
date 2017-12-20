class Parser {
    constructor(args) {

        /**
         * arguments being parsed
         **/
        this._args = args;

        /**
         * stores the registered actions callbacks
         **/
        this._actions = {};

        /**
         * stores the values associated with the tokens
         **/
        this._actionValues = {};

        /**
         * current state of the state machine
         **/
        this._currentState = this.endCommandState;

        /**
         * current token being parsed
         **/
        this._currentValue = '';
    }

    get listToken() {
        return 'list';
    }

    get tagToken() {
        return 'tag';
    }

    get nameToken() {
        return 'names';
    }

    _isReservedToken(token) {
        let reservedTokens = [
            this.tagToken,
            this.listToken
        ];

        return reservedTokens.indexOf(token) > -1;
    }

    _getCommandFromToken(token) {
        if (token === this.listToken) {
            return this.listCommandState;
        }

        if (token === this.tagToken) {
            return this.tagCommandState;
        }

        // name requires no token
        return this.namesCommandState;
    }

    _raiseRegisteredAction(token) {
        if (this._actions[token]) {
            this._actions[token](token, this._actionValues);
        }
        this._actionValues = [];
    }

    parse() {
        if (this._args.length == 0) {
            console.log('nothing to parse');
            return;
        }

        if (!this._getNextValue()) {
            this._currentState = this.endCommandState;
            return;
        }

        this._currentState = this._getCommandFromToken(this._currentValue);

        while (this._currentState !== this.endCommandState) {
            this._currentState();
        }

        // the final state
        this._currentState();
    }

    endCommandState() {}

    namesCommandState() {
        const token = this.nameToken;
        this._actionValues[token] = this._actionValues[token] || [];
        this._actionValues[token].push(this._currentValue.toLowerCase());

        this._currentState = this._getNextValue() ?
            this.namesCommandState : this.endCommandState;

        if (this._currentState === this.endCommandState) {
            this._raiseRegisteredAction(token);
        }
    }

    listCommandState() {
        const token = this.listToken;
        this._actionValues[token] = [];
        this._raiseRegisteredAction(token);
        this._currentState = this.endCommandState;
    }

    tagCommandState() {
        const token = this.tagToken;
        this._actionValues[token] = [];
        if (this._getNextValue()) {
            this._currentState = this.tagEventIdCommandState;
        } else {
            this._currentState = this.endCommandState;
        }
    }

    tagEventIdCommandState() {
        const token = this.tagToken;
        this._actionValues[token].push({
            eventid: this._currentValue
        });
        if (this._getNextValue()) {
            this._currentState = this.tagValueCommandState;
        } else {
            this._raiseRegisteredAction(token);
            this._currentState = this.endCommandState;
        }
    }

    tagValueCommandState() {
        const token = this.tagToken;
        this._actionValues[token].push({
            tagValue: this._currentValue
        });
        if (this._getNextValue()) {
            this._currentState = this.tagValueCommandState;
        } else {
            this._raiseRegisteredAction(token);
            this._currentState = this.endCommandState;
        }
    }

    _getNextValue() {
        let currentValue = this._args.shift();
        if (currentValue) {
            this._currentValue = currentValue;
            return true;
        }
        return false;
    }

    // https://github.com/arieh/CommandParser/blob/b84fe9ab8b7d0e539d7a2d12e74dd93383775a47/lib/Parser.js
    //  this.registerActions({
    //     help : this.printHelp.bind(this)
    // });
    registerAction(action) {
        Object.assign(this._actions, action);
    }
}

module.exports = Parser;
