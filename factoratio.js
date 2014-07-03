/**
 * Created by synopia on 03/07/14.
 */

function Factory(type, obj, count) {
    this.type  = type;
    this.obj   = obj;
    this.count = count || 0;

    switch (type) {
        case "factory":  this.collection = factories; break;
        case "inserter": this.collection = inserters; break;
        default :        this.collection = {};        break;
    }

    if( obj ) {
        this.factory = this.collection[obj];
    } else {
        this.factory = null;
    }
}

Factory.prototype = {

};

function ProductionLine(id, item) {
    this.id         = id;
    this.item       = item;
    this.recipe     = recipes[item];
    this.name       = this.recipe.name;

    this.factory            = new Factory("factory",  null);
    this.inputInserters     = new Factory("inserter", null);
    this.outputInserters    = new Factory("inserter", null);

    this.dirty  = true;
    this.locked = [];
}

ProductionLine.prototype = {
    update : function() {
        if( !this.dirty ) {
            return;
        }



        this.dirty = false;
    }


};

function Factoratio() {
    this.tree = $$("recipe_tree");
    this.store = this.tree.data;
}

Factoratio.prototype = {
    addRecipe : function( recipe ) {
        this.store.add( new ProductionLine("1", recipe));
    }
};
