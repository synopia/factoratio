/**
 * Created by synopia on 23/06/14.
 */
function findFactories( item ) {
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
        return a.speed- b.speed;
    });
    return result;
}

function getFactoryCount(factory, recipe, speed) {
    if( recipe ) {
        return speed/(recipe.speed*factory.speed);
    } else {
        return speed/factory.speed;
    }
}

selectRecipes = [];
$.each(recipes, function(name, recipe){
    selectRecipes.push({id:name, value:recipe.name})
});

selectRecipes.sort(function(a,b){
    return a["value"].localeCompare(b["value"])
});

function getName(item) {
    if( recipes[item]!=null ) {
        return recipes[item].name;
    } else if( resources[item]!=null ) {
        return resources[item].name;
    } else {
        return item
    }
}

productions = {};
id = 0;
function buildTree(parentItem, item, targetSpeed) {
    var data = [];
    var recipe = recipes[item];
    var production = productions[item];
    if( production==null ) {
        productions[item] = production = { targetSpeed: 0, item: item, outputs: {} };
    }
    production.targetSpeed += targetSpeed;
    if( parentItem ) {
        if( production.outputs[parentItem]==null ) {
            production.outputs[parentItem] = 0
        }
        production.outputs[parentItem] += targetSpeed;
    }

    if( recipe ) {
        $.each(recipe.ingredients, function (index, list) {
            var ingredient = list[0];
            var amount = list[1];
            data.push(buildTree(item, ingredient, targetSpeed * amount/recipe.resultCount));
        });
    }
    id++;
    return {id:id, name:getName(item), item: item, speed:targetSpeed, open:true, data: data}
}

function buildRatioTree() {
    var data = [];
    var id = 0;
    $.each(productions, function(item, production) {
        var outputs = [];
        $.each(production.outputs, function(outputItem, speed){
            outputs.push({ id:id, name:getName(outputItem), item: item, speed:speed});
            id++;
        });
        if( outputs.length>0 ) {
            data.push({ id: id, name: getName(item), item: item, speed: production.targetSpeed, open: true, data: outputs });
            id++;
        }
    });
    return data;
}

function update() {
    var recipe = $$("selected_recipe").getValue();
    var speed = 1; //$$("selected_recipe_speed").getValue()/60;
    productions = {};
    var recipeTree = [ buildTree(null, recipe, speed) ];
    var ratioTree = buildRatioTree();
    $$("recipe_tree").clearAll();
    var rtree = $$("recipe_tree").parse(recipeTree);
    console.log(rtree)
    $$("ratio_tree").clearAll();
    $$("ratio_tree").parse(ratioTree);

    updateSpeed();
}

function updateSpeed() {
    var speed = $$("selected_recipe_speed").getValue()/60;

    $(".speed").each(function(){
        var data = $(this).attr("data");
        var itemSpeed = +(60.0 * data*speed).toFixed(2).toString();
        $(this).text(itemSpeed)
    });

}


