import {Context} from './context';

//Creates a single object where all contexts with their tasks are listed
class ContextList {
    constructor(Context){
        this.Context = Context;
        this.list = [];
        this.init();
    }

    init() {
        const defaultContext = new Context('inbox');
        this.addNewContext(defaultContext);
        this.setActiveContext(defaultContext);
    }

    addNewContext(context) {
        this.list.push(context);
    }

    deleteContext(contextId) {
        const contextListIndex = this.getIndexOfContext(contextId);
        this.list.splice(contextListIndex, 1);
    }

    getContext(contextId) {
        const contextIndexInList = this.getIndexOfContext(contextId);
        return this.list[contextIndexInList];
    }

    getIndexOfContext(contextId) {
        contextId = parseInt(contextId);
        const contextListIndex = this.list.findIndex(function(currentContext) {
            if (currentContext.id === contextId){
                return true;
            }
        })
        return contextListIndex;
    }

    setActiveContext(context) {
        this.activeContext = context;
    }

    getActiveContext() {
        return this.activeContext;
    }

    getAllContexts() {
        return this.list;
    }
}

export {ContextList}