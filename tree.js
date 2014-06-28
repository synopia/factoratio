/**
 * Created by synopia on 27.06.2014.
 */

var tree = {
    productions : {},
    treeLines : {},
    id : 0,

    init : function() {
        tree.id = 0;
        tree.productions = {};
        tree.treeLines = {};
    },

    buildProductionTree : function (parentItem, item, relativeSpeed) {
        var data = [];
        var recipe = recipes[item];
        var production = tree.productions[item];
        if( production==null ) {
            tree.productions[item] = production = { relativeSpeed: 0, item: item, outputs: {} };
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
                data.push(tree.buildProductionTree(item, ingredient, relativeSpeed * amount/recipe.resultCount));
            });
        }
        return tree.insertLine("p", item, relativeSpeed, data);
    },

    buildRatioTree : function () {
        var data = [];
        $.each(tree.productions, function(item, production) {
            var outputs = [];
            $.each(production.outputs, function(outputItem, speed){
                var line = tree.insertLine("r", outputItem, speed);
                outputs.push(line);
            });
            var line = tree.insertLine("r", item, production.relativeSpeed, outputs);
            data.push(line);
        });
        return data;
    },

    insertLine : function(type, item, speed, children) {
        tree.id ++;
        var uniqueId = type + "_" + tree.id;
        var line =  { id: uniqueId, name: helpers.getName(item), item: item, relativeSpeed: speed, open: true, data: children };
        tree.treeLines[uniqueId] = line;
        return line;
    }

};
