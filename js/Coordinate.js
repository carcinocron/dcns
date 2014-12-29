function Coordinate (o){
  if (typeof o == 'string')
  {
    o = JSON.parse(o);
  }
  this.x = o.x;
  this.y = o.y;
  
}
Coordinate.prototype.toJson = function(){
  return JSON.stringify({x:this.x,y:this.y});
};
function XY (x,y){
  return new Coordinate({x:x,y:y});
}
Coordinate.prototype.ne   = function (){ return XY(this.x+1, this.y-1); };
Coordinate.prototype.nw   = function (){ return XY(this.x,   this.y-1); };

Coordinate.prototype.se   = function (){ return XY(this.x,   this.y+1); };
Coordinate.prototype.sw   = function (){ return XY(this.x-1, this.y+1); };

Coordinate.prototype.west = function (){ return XY(this.x-1,this.y); };
Coordinate.prototype.east = function (){ return XY(this.x+1,this.y); };
Coordinate.prototype.isInGrid = function (o){
  if (this.x < 0 || this.x >= o.get('width'))
  {
    return false;
  }
  if (this.y < 0 || this.y >= o.get('height'))
  {
    return false;
  }
  return true;
};
Coordinate.prototype.wrapX = function (o)
{
  while (this.x >= o.get('width'))
  {
    this.x -= o.get('width');
  }
  while (this.x < 0)
  {
    this.x += o.get('width');
  }
  return this;
};
Coordinate.prototype.within = function(dis,coord)
{
  return linear_distance(coord,this) < dis;
};

function TestCoordinate (){
  console.log({
    'XY(1,2).nw()':XY(1,2).nw().toJson(),
    'XY(1,2).ne()':XY(1,2).ne().toJson(),
    'XY(1,2).sw()':XY(1,2).sw().toJson(),
    'XY(1,2).se()':XY(1,2).se().toJson(),
    'XY(1,2).west()':XY(1,2).west().toJson(),
    'XY(1,2).east()':XY(1,2).east().toJson()
  });
  var a;
  a = XY(mt_rand(-100,100),mt_rand(-100,100));  console.info(a.toJson()+' ?= '+a.nw().se().toJson());
  a = XY(mt_rand(-100,100),mt_rand(-100,100));  console.info(a.toJson()+' ?= '+a.se().nw().toJson());

  a = XY(mt_rand(-100,100),mt_rand(-100,100));  console.info(a.toJson()+' ?= '+a.ne().sw().toJson());
  a = XY(mt_rand(-100,100),mt_rand(-100,100));  console.info(a.toJson()+' ?= '+a.sw().ne().toJson());
  
  console.log(null);
  
  a = XY(mt_rand(-100,100),mt_rand(-100,100));  console.info(a.toJson()+' nw '+a.nw().toJson());
  a = XY(mt_rand(-100,100),mt_rand(-100,100));  console.info(a.toJson()+' se '+a.se().toJson());

  a = XY(mt_rand(-100,100),mt_rand(-100,100));  console.info(a.toJson()+' ne '+a.ne().toJson());
  a = XY(mt_rand(-100,100),mt_rand(-100,100));  console.info(a.toJson()+' sw '+a.sw().toJson());

}