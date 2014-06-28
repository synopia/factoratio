/**
 * Created by synopia on 23/06/14.
 */


webix.editors.myselect = webix.extend({
    focus:function(){},
    getValue:function(){
        return this.getInputNode().getSelectedId().id||this.getInputNode().getSelectedId()||"";
    },
    setValue:function(value){
        var suggest =  this.config.collection || this.config.options(logic.editingId);
        var list = this.getInputNode();
        if (suggest)
            this.getPopup().getList().data.importData(suggest);

        this.getPopup().show(this.node);
        if(value){
            webix.assert(list.exists(value), "Option with ID "+value+" doesn't exist");
            if(list.exists(value)){
                list.select(value);
                list.showItem(value);
            }
        }else{
            list.unselect();
            list.showItem(list.getFirstId());
        }
    },
    getInputNode:function(){
        return this.getPopup().getList();
    },
    popupInit:function(popup){
        popup.attachEvent("onValueSuggest", function(data){
            webix.delay(function(){
                webix.callEvent("onEditEnd",[data.id]);
            });
        });
        popup.linkInput(document.body);
    },
    popupType:"richselect"
}, webix.editors.popup);


var logic = {    
    targetSpeed : 0,
    editingId : null,
    init: function() {
        $$("recipe_tree").attachEvent("onBeforeEditStart", function(id) {
            logic.editingId = id;
        });

        $$("recipe_tree").attachEvent("onAfterEditStop", function(state, id, ignoreUpdate) {
            if( state.value != state.old ) {
                var line = model.treeLines[id.row];
                line.factorySpeed = logic.calcSpeed(line.item, line.factory, line.inputInserters, line.outputInserters);
            }
        });
    },

    calcSpeed : function(item, factory, inputInserters, outputInserters) {
        var itemSpeed = 1;
        var inputCount = 0;
        var outputCount = 0;
        if( recipes[item] ) {
            $.each(recipes[item].ingredients, function(index, ingredient){
                inputCount += ingredient[1];
            });
            outputCount = recipes[item].resultCount;
            itemSpeed = recipes[item].speed;
        } else {
            inputCount = 1;
            outputCount = 1;
        }

        if( factories[factory] ) {
            var maxInputSpeed = (inputInserters ? inserters[inputInserters].speed*60 : 1000000)/inputCount;
            var maxOutputSpeed = (outputInserters ? inserters[outputInserters].speed*60 : 1000000)/outputCount;
            var maxSpeed = Math.min(maxInputSpeed, maxOutputSpeed);
            return Math.min(factories[factory].speed*itemSpeed, maxSpeed);
        } else {
            return undefined;
        }
    },

    optimize : function() {
        $$("recipe_tree").eachRow( function(id){
            var line = model.treeLines[id];
            var item = line.item;
            var factories = helpers.findFactories(item);
            if( factories.length==0 ) {
                return
            }
            var configurations = [];
            $.each(factories, function(index, factory){
                $.each(inserters, function(index, inserter) {
                    if( inserter.id.indexOf("inserter")!=-1) {
                        var speed = logic.calcSpeed(item, factory.id, inserter.id, inserter.id)
                        configurations.push({ speed: speed, factory: factory, inserter:inserter});
                    }
                });
            });
            configurations.sort( function(a,b){
                var cmp = b.speed - a.speed;
                if( cmp==0 ) {
                    cmp = b.factory.speed - a.factory.speed;
                    if( cmp==0 ) {
                        cmp = b.inserter.speed - a.inserter.speed;
                    }
                }
                return cmp;
            });
            var last = null;
            var list = [];
            $.each( configurations, function(index, conf) {
                if( last!=null ) {
                    if( conf.speed!=last.speed) {
                        list.push(last)
                    }
                }
                last = conf;
            });
            list.push(last);
            var best = null;
            $.each(list, function(index, conf) {
                var count = line.targetSpeed / conf.speed;
                if( count<=1 ) {
                    best = conf
                }
            });
            if( best==null ) {
                best = list[0]
            }
            line.factory = best.factory.id;
            line.inputInserters = best.inserter.id;
            line.outputInserters = best.inserter.id;
            line.factorySpeed = logic.calcSpeed(line.item, line.factory, line.inputInserters, line.outputInserters);
        }, true);
        $$("recipe_tree").refresh();
    },

    selectInserters: function(id) {
        var selectedInserters = [];
        $.each(inserters, function(index, inserter) {
            selectedInserters.push({ id: inserter.id, value:inserter.name});
        });
        return selectedInserters;
    },
    selectFactories : function(id) {
        var item = model.treeLines[id.row].item;
        var factories = helpers.findFactories(item);
        var selectableFactories = [];
        var itemSpeed = 1;
        if( recipes[item] ) {
            itemSpeed = recipes[item].speed;
        }
        $.each(factories, function(index, factory){
            selectableFactories.push({ id:factory.id, value:factory.name+" ("+helpers.formatNumber(itemSpeed*factory.speed, 60)+" u/m)"});
        });
        return selectableFactories;
    },

    renderCount : function(line, common) {
        if( line.factorySpeed ) {
            var count = line.targetSpeed / line.factorySpeed;
            return helpers.countFormat(count);
        } else {
            return ""
        }
    },

    updateRecipe : function(recipe) {
        model.init();
        var recipeTree = [ model.buildProductionTree(null, recipe, 1) ];
        var ratioTree = model.buildRatioTree();

        $$("recipe_tree").clearAll();
        $$("recipe_tree").parse(recipeTree);
        $$("ratio_tree").clearAll();
        $$("ratio_tree").parse(ratioTree);

        logic.updateTargetSpeed();
    },

    updateTargetSpeed : function( targetSpeed ) {
        if( targetSpeed ) {
            logic.targetSpeed = targetSpeed / 60;
        }
        $$("recipe_tree").eachRow( function(id){
            var line = model.treeLines[id];
            line.targetSpeed = logic.targetSpeed * line.relativeSpeed;
        }, true);
        $$("recipe_tree").refresh();
    }

};

