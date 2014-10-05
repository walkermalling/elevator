'use strict';

var Elevator = function(options){
  this.namespace = options.namespace || '';
  this.currentFloor = options.initialFloor || 1;
  this.scope = options.scopeSelector || '';
  this.interval = options.transitInterval || 2000;
  this.transit = null;
  this.queue = [];
  this.panel = {
    floorNumber: null,
    upIndicator: null,
    downIndicator: null
  }

  // 
  this.event = document.createEvent('Event');
  this.event.initEvent( this.namespace + '-arrival', true, true);
};

Elevator.prototype.motivate = function(){
  console.log('motivate called');
  var direction = this.getDirection();

  if(direction === 0) return false; 
  
  console.log('(going ' + (direction === 1 ? 'up':'down') + ' ...)');
  
  this.transit = true;
  this.setPanel(); 
  document.dispatchEvent(this.event);
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
  this.panel.floorNumber.innerHTML = this.currentFloor;
  var direction = this.getDirection();
  if(direction === 1) {
    this.panel.upIndicator.style.display = 'block';
    this.panel.downIndicator.style.display = 'none';
  }
  if(direction === -1) {
    this.panel.downIndicator.style.display = 'block';
    this.panel.upIndicator.style.display = 'none';
  }
};

