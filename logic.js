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
    ratioTree : null,
    recipeTree : null,
    recipes : [],

    init: function() {
        logic.recipeTree = new Tree("recipe_tree");
        logic.ratioTree = new Tree("ratio_tree");
    },

    selectInserters: function(id) {
        var selectedInserters = [];
        $.each(inserters, function(index, inserter) {
            selectedInserters.push({ id: inserter.id, value:inserter.name+" ("+helpers.formatNumber(inserter.speed*60, 60)+" u/m)"});
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
            var count = line.targetSpeed / line.factorySpeed.total;
            return helpers.countFormat(count);
        } else {
            return ""
        }
    },

    addRecipe : function(recipe) {
        logic.recipes.push(recipe);
        logic.updateRecipes();
    },

    removeRecipe : function(recipe) {
        var index = logic.recipes.indexOf(recipe);
        if( index!=-1 ) {
            logic.recipes.splice(index)
            logic.updateRecipes();
        }
    },

    reset : function() {
        logic.recipes = [];
        logic.updateRecipes();
    },

    updateRecipes : function() {
        model.init();
        var recipeTree = $.map(logic.recipes, function(recipe) {
            return model.buildProductionTree(null, recipe, 1);
        });
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
        logic.recipeTree.updateTargetSpeed();
        logic.ratioTree.updateTargetSpeed();
    }

};

