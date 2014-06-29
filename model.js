/**
 * Created by synopia on 27.06.2014.
 */

var model = {
    productions : {},
    treeLines : {},
    id : 0,

    init : function() {
        model.id = 0;
        model.productions = {};
        model.treeLines = {};
    },

    buildProductionTree : function (parentItem, item, relativeSpeed) {
        var data = [];
        var recipe = recipes[item];
        var production = model.productions[item];
        if( production==null ) {
            model.productions[item] = production = { relativeSpeed: 0, item: item, outputs: {} };
        }
        production.relativeSpeed += relativeSpeed;
        if( parentItem ) {
            if( production.outputs[parentItem]==null ) {
                production.outputs[parentItem] = 0
            }
            production.outputs[parentItem] += relativeSpeed;
        }

        if( recipe ) {
            $.each(recipe.ingredients, function (index, list) {
                var ingredient = list[0];
                var amount = list[1];
                data.push(model.buildProductionTree(item, ingredient, relativeSpeed * amount/recipe.resultCount));
            });
        }
        return model.insertLine("p", item, relativeSpeed, data);
    },

    buildRatioTree : function () {
        var data = [];
        $.each(model.productions, function(item, production) {
            var outputs = [];
            $.each(production.outputs, function(outputItem, speed){
                var line = model.insertLine("r", outputItem, speed);
                outputs.push(line);
            });
            var line = model.insertLine("r", item, production.relativeSpeed, outputs, false);
            data.push(line);
        });
        return data;
    },

    insertLine : function(type, item, speed, children, open) {
        model.id ++;
        var uniqueId = type + "_" + model.id;
        var line =  { id: uniqueId, name: helpers.getName(item), item: item, relativeSpeed: speed, open: open == undefined ? true : open, data: children };
        model.treeLines[uniqueId] = line;
        return line;
    }

};
