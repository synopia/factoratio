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
            line.factoryModified = true;
            line.factorySpeed = tree.calcSpeed(line.item, line.factory, line.inputInserters, line.outputInserters);
        } else {
            line.factoryModified = true;
            tree.webixTree.refresh()
        }
    });

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
            if( !line.factoryModified ) {
                tree.optimizeLine(line);
            }
        }, true);
        tree.webixTree.refresh();
    };

    this.optimizeLine = function(line) {
        var item = line.item;
        var factories = helpers.findFactories(item);
        if( factories.length==0 ) {
            return
        }
        var configurations = [];
        $.each(factories, function(index, factory){
            $.each(inserters, function(index, inserter) {
                if( inserter.id.indexOf("inserter")!=-1) {
                    var speed = tree.calcSpeed(item, factory.id, inserter.id, inserter.id)
                    configurations.push({ speed: speed, factory: factory, inserter:inserter});
                }
            });
        });
        configurations.sort( function(a,b){
            var cmp = b.speed.total - a.speed.total;
            if( cmp==0 ) {
                cmp = b.speed.factory - a.speed.factory;
                if( cmp==0 ) {
                    cmp = b.speed.input - a.speed.input;
                }
            }
            return cmp;
        });
        var last = null;
        var list = [];
        $.each( configurations, function(index, conf) {
            if( last!=null ) {
                if( conf.speed!=last.speed) {
                    list.push(last)
                }
            }
            last = conf;
        });
        list.push(last);
        var best = null;
        $.each(list, function(index, conf) {
            var count = line.targetSpeed / conf.speed.total;
            if( count<=1 ) {
                best = conf
            }
        });
        if( best==null ) {
            best = list[0]
        }
        line.factory = best.factory.id;
        line.inputInserters = best.inserter.id;
        line.outputInserters = best.inserter.id;
        line.factorySpeed = tree.calcSpeed(line.item, line.factory, line.inputInserters, line.outputInserters);

    }
}