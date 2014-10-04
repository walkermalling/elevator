'use strict';

var Elevator = function(){
  this.currentFloor = 1;
  this.scope = '';
  this.interval = 2000;
  this.transit = null;
  this.queue = []; 
  this.panel = {
    floorIndicator: this.currentFloor,
    directionIndicator: 0
  };

  this.print();
};

Elevator.prototype.motivate = function(){
  var direction = this.getDirection();
  if(direction === 0) {
    return false;
  } 
  
  console.log('(going ' + (direction === 1 ? 'up':'down') + ' ...)');
  
  this.transit = true;
  this.setPanel(); // set up/down indicator
  this.arrive();
  return;
};

Elevator.prototype.getDirection = function(){
  var currentFloor = this.currentFloor;
  var nextFloor = !!this.queue[0] ? this.queue[0] : false;
  var direction = 0;
  if( nextFloor ){
    if( nextFloor > currentFloor){
      direction = 1;
    } else if ( nextFloor < currentFloor ){
      direction = -1;
    }
  }

  return direction;
};

Elevator.prototype.arrive = function(){

  this.transit = false;
  this.currentFloor += this.getDirection();
  var queuePosition = this.queue.indexOf( this.currentFloor );
  console.log('(arriving at ' + this.currentFloor + ' ...)');
  
  if( queuePosition > -1 ){
    // remove current floor from queue
    console.log('(satisfied request for ' + this.currentFloor + ' ...)');
    this.queue.splice( queuePosition, 1 );
  }

  this.setPanel();
  this.print();
  this.motivate();
};

Elevator.prototype.addRequest = function(floor){
  if(this.queue.indexOf(floor) === -1) {
    console.log('(floor ' + floor + ' requested ... )');
    this.queue.push(floor);
  }
  if(!this.transit) {
    this.motivate();
  }
  return;
};

Elevator.prototype.addSeveral = function(floors){
  if(!Array.isArray(floors)){
    return false;
  }
  var queue = this.queue;
  floors.forEach(function(floor){
    queue.push(floor);
  });
  this.motivate();
};

Elevator.prototype.setPanel = function(){
  this.panel.floorIndicator = this.currentFloor;
  this.panel.directionIndicator = this.getDirection();
  return;
};

Elevator.prototype.print = function(){
  var direction = this.getDirection();
  console.log('----------------');
  console.log('## Floor [ ' + this.panel.floorIndicator + '  ] #');
  console.log('## Dir   [ ' + (direction === 1 ? '/\\':'\\/') + ' ] #');

  this.queue.forEach(function(floor){
    console.log('##       > ' + floor + '    #');
  });
  console.log('-----------------');
  return;
};

module.exports = Elevator;
