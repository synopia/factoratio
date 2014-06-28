/**
 * Created by synopia on 27.06.2014.
 */

selectRecipes = [];
$.each(recipes, function (name, recipe) {
    selectRecipes.push({id: name, value: recipe.name})
});

selectRecipes.sort(function (a, b) {
    return a["value"].localeCompare(b["value"])
});

var helpers = {
    speedFormat : function(value) {
        return helpers.formatNumber(value, 60, 2);
    },
    countFormat : function(value) {
        return helpers.formatNumber(value, 1, 2);
    },

    formatNumber : function (number, total, digits) {
        total = total || 100;
        digits = digits || 2;
        return +(total * number).toFixed(digits).toString();
    },
    renderFactory : function( line, common ) {
        if( line.factory ) {
            return factories[line.factory].name;
        } else {
            return "";
        }
    },
    renderInputInserters: function( line, common ) {
        if( line.inputInserters ) {
            return inserters[line.inputInserters].name;
        } else {
            return "";
        }
    },
    renderOutputInserters: function( line, common ) {
        if( line.outputInserters ) {
            return inserters[line.outputInserters].name;
        } else {
            return "";
        }
    },

    getName: function (item) {
        if( recipes[item]!=null ) {
            return recipes[item].name;
        } else if( resources[item]!=null ) {
            return resources[item].name;
        } else {
            return item
        }
    },


    findFactories : function ( item ) {
        var result = [];
        var recipe = recipes[item];
        var resource = resources[item];
        if( recipe ) {
            $.each(factories, function (name, factory) {
                if (factory.categories.indexOf(recipe.category) != -1) {
                    if (factory.ingredientCount >= recipe.ingredients.length) {
                        result.push(factory);
                    }
                }
            });
        } else if( resource ) {
            $.each(factories, function (name, factory) {
                if (factory.categories.indexOf(resource.category) != -1) {
                    result.push(factory);
                }
            });
        }
        result.sort(function(a,b){
            return a.speed - b.speed;
        });
        return result;
    }
};
