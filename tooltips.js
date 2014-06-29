/**
 * Created by synopia on 29.06.2014.
 */

var tooltips = {
    count : function( line ) {
        if( line.factorySpeed ) {
            var count = line.targetSpeed / line.factorySpeed.total;
            return helpers.countFormat(count) + " "+factories[line.factory].name+" needed<br>to get "+helpers.speedFormat(line.targetSpeed)+" u/m "+line.name+" ";
        } else {
            return false
        }
    },
    factorySpeed: function( line ) {
        if( line.factorySpeed ) {
            var result = helpers.speedFormat(line.factorySpeed)+" u/m "+line.name+" output using:<br>";
            result += "1x "+factories[line.factory].name+": max "+helpers.speedFormat(line.factorySpeed.factory)+" u/m <br>";
            result += "1x "+inserters[line.inputInserters].name+" for "+line.factorySpeed.inputCount+" inputs: max "+helpers.speedFormat(line.factorySpeed.input)+" u/m<br>";
            result += "1x "+inserters[line.outputInserters].name+" for "+line.factorySpeed.outputCount+" outputs: max "+helpers.speedFormat(line.factorySpeed.output)+" u/m<br>";
            return result
        } else {
            return false
        }
    },
    factory: function( line ) {
        if( line.factory) {
            return "1 "+factories[line.factory].name+" outputs<br>"+helpers.speedFormat(line.factorySpeed.factory)+" u/m "+line.name;
        } else {
            return false
        }
    },
    inputInserters: function( line ) {
        if( line.inputInserters) {
            var inputCount = line.factorySpeed.inputCount;
            var result = "need "+ inputCount + " input item(s)<br>";
            result+="using one "+inserters[line.inputInserters].name+"<br>";
            result+="max total speed is " +helpers.speedFormat(line.factorySpeed.input)+" u/m ";
            return result
        } else {
            return false
        }
    },
    outputInserters: function( line ) {
        if( line.outputInserters) {
            var result = "produces " + line.factorySpeed.outputCount + " output item(s)<br>";
            result +="using one "+inserters[line.outputInserters].name+"<br>";
            result +="max total speed is "+helpers.speedFormat(line.factorySpeed.output)+" u/m "
            return result;
        } else {
            return false
        }
    }
};
