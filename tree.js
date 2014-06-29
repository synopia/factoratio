/**
 * Created by synopia on 28.06.2014.
 */

function Tree(name) {
    var tree = this;
    this.webixTree = $$(name);
    this.webixTree.attachEvent("onBeforeEditStart", function(id) {
        logic.editingId = id;
    });

    this.webixTree.attachEvent("onAfterEditStop", function(state, id, ignoreUpdate) {
        var line = model.treeLines[id.row];
        if( state.value != state.old ) {
            setModified(line, id, true);
            line.factorySpeed = tree.calcSpeed(line.item, line.factory, line.inputInserters, line.outputInserters);
        } else {
            setModified(line, id, false);
            tree.webixTree.refresh()
        }
    });

    function setModified(line, id, modified) {
        line[id.column+"Modified"] = modified
    }

    this.calcSpeed = function(item, factory, inputInserters, outputInserters) {
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
            var factorySpeed = factories[factory].speed * itemSpeed;
            var total = Math.min(factorySpeed, maxSpeed);
            return { total: total, factory: factorySpeed, input: maxInputSpeed, output: maxOutputSpeed, inputCount: inputCount, outputCount: outputCount };
        } else {
            return undefined;
        }
    };

    this.updateTargetSpeed = function() {
        tree.webixTree.eachRow( function(id){
            var line = model.treeLines[id];
            line.targetSpeed = logic.targetSpeed * line.relativeSpeed;
        }, true);
        tree.optimize();
    };

    this.optimize = function() {
        tree.webixTree.eachRow( function(id){
            var line = model.treeLines[id];
            if( name!="ratio_tree" || line.$level==1) {
                tree.optimizeLine(line);
            }
        }, true);
        tree.webixTree.refresh();
    };

    function sortConfiguration(configurations) {
        configurations.sort(function (a, b) {
            var cmp = b.speed.total - a.speed.total;
            if (cmp == 0) {
                cmp = b.speed.factory - a.speed.factory;
                if (cmp == 0) {
                    cmp = b.speed.input - a.speed.input;
                    if (cmp == 0) {
                        cmp = b.speed.output - a.speed.output
                    }
                }
            }
            return cmp;
        });
    }

    function getConfigurations(factories, inputInserters, outputInserters, item) {
        var configurations = [];
        $.each(factories, function (index, factory) {
            $.each(inputInserters, function (index, inputInserter) {
                $.each(outputInserters, function (index, outputInserter) {
                    if (inputInserter.id.indexOf("inserter") != -1 && outputInserter.id.indexOf("inserter") != -1) {
                        var speed = tree.calcSpeed(item, factory.id, inputInserter.id, outputInserter.id);
                        configurations.push({ speed: speed, factory: factory, input: inputInserter, output: outputInserter});
                    }
                });
            });
        });
        sortConfiguration(configurations);
        return configurations;
    }

    function removeEqualSpeeds(configurations) {
        var last = null;
        var list = [];
        $.each(configurations, function (index, conf) {
            if (last != null) {
                if (conf.speed.total != last.speed.total) {
                    list.push(last)
                }
            }
            last = conf;
        });
        list.push(last);
        return list;
    }

    function findBestConfiguration(list, line) {
        var best = null;
        $.each(list, function (index, conf) {
            var count = line.targetSpeed / conf.speed.total;
            if (count <= 1) {
                best = conf
            }
        });
        if (best == null) {
            best = list[0]
        }
        return best;
    }

    this.optimizeLine = function(line) {
        var selectedIds = $$("setup_tree").getChecked();
        function filter( list ) {
            var result = [];
            $.each(list, function(index, item){
                if( selectedIds.indexOf(item.id)!=-1 ) {
                    result.push(item)
                }
            });
            return result
        }
        var item = line.item;
        var usableFactories = getUsable("factory", line, factories, function(line) {
            return filter(helpers.findFactories(line.item));
        });
        var usableInputInserters = getUsable("inputInserters", line, inserters, function(line) {
            return filter(inserters);
        });
        var usableOutputInserters = getUsable("outputInserters", line, inserters, function(line) {
            return filter(inserters);
        });
        var configurations = getConfigurations(usableFactories, usableInputInserters, usableOutputInserters, item);
        if( configurations.length>0 ) {
            var list = removeEqualSpeeds(configurations);
            var best = findBestConfiguration(list, line);

            line.factory = best.factory.id;
            line.inputInserters = best.input.id;
            line.outputInserters = best.output.id;
            line.factorySpeed = best.speed;
        } else {
            console.log(line)
        }
    }

    function getUsable(what, line, collection, callback) {
        var result;
        if( line[what+"Modified"] ) {
            result = [collection[line[what]]]
        } else {
            result = callback(line)
        }
        return result;
    }
}