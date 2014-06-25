/**
 * Created by b3fritschep on 25.06.2014.
 */
function selected(_, id, item, speed) {
    var factory = factories[_.val()];
    var recipe = recipes[item];
    var count = getFactoryCount(factory, recipe, speed);
    $("#"+id+"_count").text(+count.toFixed(2))
}
function renderFactory(line, common) {
    var item = line.item;
    var factories = findFactories(item);
    var result = "<select onchange='selected($(this),\""+line.id+"\", \""+item+"\", "+line.speed+")'>";
    $.each(factories, function(index, factory){
        var itemSpeed = +(60.0 * factory.speed).toFixed(2).toString();
        result += "<option value=\""+factory.id+"\">"+factory.name+" ("+itemSpeed+"u/m)</option>";
    });
    result += "</select>";

//    var recipe = recipes[line.item];
//    if( recipe ) {
//        var speed = recipe.speed;
//        var count = line.speed / speed;
//        return count.toFixed(2).toString()+factories[0].name.toString()
//        return result;
//    } else {
//
//    }
    return result;
}
function renderSpeed(line, common) {
    return "<span data=\""+line.speed+"\" class=\"speed\">-</span>";
}

function renderCount(line, common) {
    var item = line.item;
    var factory = findFactories(item)[0];
    var count = getFactoryCount(factory, recipes[item], line.speed)
    return "<span id=\""+line.id+"_count\" class=\"count\">"+(+count.toFixed(2))+"</span>"
}
