/**
 * Created by synopia on 27.06.2014.
 */
var ui_scheme = {
    rows : [
        {
            view: "label", label: "<strong>Factoratio</strong>"
        },
        {
            cols : [
                {
                    view: "select", label: "Recipe", options:selectRecipes,
                    id: "selected_recipe"
                },
                {
                    view: "slider", min:1, max:120,
                    id: "selected_recipe_speed",
                    title:webix.template("#value# u/m"),
                    on: {
                        onChange: function(newv, oldv) {
                            logic.updateTargetSpeed(newv);
                        },
                        onSliderDrag: function () {
                            logic.updateTargetSpeed(this.getValue());
                        }
                    }
                }
            ]
        },
        {
            cols : [
                {
                    view : "button", value: "+", click:function() {
                        logic.addRecipe($$("selected_recipe").getValue());
                    }
                },
                {
                    view : "button", value: "-", click:function() {
                        logic.removeRecipe($$("selected_recipe").getValue());
                    }
                },
                {
                    view : "button", value: "Reset", click : function () {
                        logic.reset();
                    }
                },
                {
                    view : "button", value: "Setup", popup: "setup"
                }
            ]
        },
        {
            view: "tabview",
            id:"tabs",
            animate: false,
            cells: [
                {
                    header: "Recipe view",
                    body: {
                        view: "treetable",
                        id: "recipe_tree",
                        editable: true,
                        editaction: 'click',
                        tooltip: true,
                        columns: [
                            {id: "targetSpeed", header: "u/m", format: helpers.speedFormat, width: 100, tooltip: false},
                            {id: "name", header: "Item", template: "{common.treetable()} #value#", width: 300, tooltip: false},
                            {id: "count", header: "Count", template: helpers.renderCount, width: 100, tooltip: tooltips.count },
                            {id: "factorySpeed", header: "u/m/factory",  format: helpers.speedFormat, width: 100, tooltip: tooltips.factorySpeed},
                            {id: "factory", header: "Factory",  editor: 'myselect', width: 300, template: helpers.renderFactory, options:logic.selectFactories, tooltip: tooltips.factory},
                            {id: "inputInserters", header: "Input inserters",  editor: 'myselect', width: 300, template: helpers.renderInputInserters, options:logic.selectInserters, tooltip: tooltips.inputInserters},
                            {id: "outputInserters", header: "Output inserters",  editor: 'myselect', width: 300, template: helpers.renderOutputInserters, options:logic.selectInserters, tooltip: tooltips.outputInserters}
                        ]
                    }
                },
                {
                    header: "Ratio view",
                    body: {
                        view: "treetable",
                        id: "ratio_tree",
                        editable: true,
                        editaction: 'click',
                        tooltip: true,
                        columns: [
                            {id: "targetSpeed", header: "u/m", template: helpers.renderSpeedRatio, width: 100, tooltip: false},
                            {id: "name", header: "Item", template: "{common.treetable()} #value#", width: 300, tooltip: false},
                            {id: "count", header: "Count", template: helpers.renderCount, width: 100, tooltip: tooltips.count },
                            {id: "factorySpeed", header: "u/m/factory",  format: helpers.speedFormat, width: 100, tooltip: tooltips.factorySpeed},
                            {id: "factory", header: "Factory",  editor: 'myselect', width: 300, template: helpers.renderFactory, options:logic.selectFactories, tooltip: tooltips.factory},
                            {id: "inputInserters", header: "Input inserters",  editor: 'myselect', width: 300, template: helpers.renderInputInserters, options:logic.selectInserters, tooltip: tooltips.inputInserters},
                            {id: "outputInserters", header: "Output inserters",  editor: 'myselect', width: 300, template: helpers.renderOutputInserters, options:logic.selectInserters, tooltip: tooltips.outputInserters}
                        ]
                    }
                }
            ]
        }
    ]
};

function buildData(factories, categories) {
    var result = [];
    $.each(factories, function(index, factory) {
        var found = false;
        if( categories ) {
            for (var i = 0; i < factory.categories.length; i++) {
                var category = factory.categories[i];
                if (categories.indexOf(category) != -1) {
                    found = true;
                    break;
                }
            }
        } else {
            found = true
        }
        if( found ) {
            result.push({ id: factory.id, name: factory.name, checked: true})
        }
    });
    result.sort( function(a,b){
        return a.name.localeCompare(b.name)
    });
    return result;
}

var selectableData = []
selectableData.push({
    name: "Assembling Machines",
    open: true,
    data : buildData(factories, ["crafting"])
});
selectableData.push({
    name: "Mining",
    data : buildData(factories, ["stone_mining", "iron_mining"])
});
selectableData.push({
    name: "Smelting",
    data : buildData(factories, ["smelting"])
});
selectableData.push({
    name: "Fluid",
    data : buildData(factories, ["oil-processing", "fluid", "chemistry"])
});
selectableData.push({
    name: "Inserters",
    data : buildData(inserters)
});

var ui_setup = {
    view: "popup",
    id: "setup",
    position: "center",
    width: 600,
    height: 400,
    body : {
        view: "tree",
        id: "setup_tree",
        threeState: true,
        editable: true,
        template: "{common.icon()} {common.checkbox()} {common.folder()} #name#",
        data: selectableData
    }
};