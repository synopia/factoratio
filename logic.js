/**
 * Created by synopia on 23/06/14.
 */
selectRecipes = [];
$.each(recipes, function(name, recipe){
    selectRecipes.push({id:name, value:recipe.name})
});
selectRecipes.sort(function(a,b){
    return a["value"].localeCompare(b["value"])
});

totalRequested = {};
id = 0;
function buildTree(item, targetSpeed) {
    var data = [];
    var recipe = recipes[item];
    var name = item;
    if( totalRequested[item]==null ) {
        totalRequested[item] = 0;
    }
    totalRequested[item] += targetSpeed;
    if( recipe ) {
        $.each(recipe.ingredients, function (index, list) {
            var item = list[0];
            var speed = list[1];
            data.push(buildTree(item, targetSpeed * speed/recipe.resultCount));
        });
        name = recipes[item].name
    } else {
        var resource = resources[item];
        if( resource ) {
            name = resource.name
        }
    }
    id++;
    return {id:id, name:name, speed:targetSpeed, open:true, data: data}
}

function update() {
    var recipe = $$("selected_recipe").getValue();
    var speed = $$("selected_recipe_speed").getValue();

    var data = [ buildTree(recipe, speed) ];
    $$("recipe_tree").clearAll();
    $$("recipe_tree").parse(data);

    console.log(totalRequested)
}


