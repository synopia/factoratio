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
                    id: "selected_recipe",
                    on: {
                        onChange: function(newv, oldv) {
                            logic.updateRecipe(newv);
                        }
                    }
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
                    view : "button", value: "Optimize", click: logic.optimize
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
                        columns: [
                            {id: "targetSpeed", header: "u/m", format: helpers.speedFormat, width: 100},
                            {id: "name", header: "Item", template: "{common.treetable()} #value#", width: 300},
                            {id: "count", header: "Count", template: logic.renderCount, width: 100 },
                            {id: "factorySpeed", header: "u/m/factory",  format: helpers.speedFormat, width: 100},
                            {id: "factory", header: "Factory",  editor: 'myselect', width: 300, template: helpers.renderFactory, options:logic.selectFactories},
                            {id: "inputInserters", header: "Input inserters",  editor: 'myselect', width: 300, template: helpers.renderInputInserters, options:logic.selectInserters},
                            {id: "outputInserters", header: "Output inserters",  editor: 'myselect', width: 300, template: helpers.renderOutputInserters, options:logic.selectInserters}
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
                        columns: [
                            {id: "targetSpeed", header: "u/m", format: helpers.speedFormat, width: 100},
                            {id: "name", header: "Item", template: "{common.treetable()} #value#", width: 300},
                            {id: "count", header: "Count", template: logic.renderCount, width: 100 },
                            {id: "factorySpeed", header: "u/m/factory",  format: helpers.speedFormat, width: 100},
                            {id: "factory", header: "Factory",  editor: 'myselect', width: 300, template: helpers.renderFactory, options:logic.selectFactories},
                            {id: "inputInserters", header: "Input inserters",  editor: 'myselect', width: 300, template: helpers.renderInputInserters, options:logic.selectInserters},
                            {id: "outputInserters", header: "Output inserters",  editor: 'myselect', width: 300, template: helpers.renderOutputInserters, options:logic.selectInserters}
                        ]
                    }
                }
            ]
        }
    ]
};