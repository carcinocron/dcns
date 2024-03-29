﻿function Tile (a)
{
    this.hydrate(a);
}
Tile.prototype.get = ModelTrait.get;
Tile.prototype.set = ModelTrait.set;
Tile.prototype.hydrate = ModelTrait.hydrate;
Tile.prototype.dump = ModelTrait.dump;
Tile.prototype.isWater = function()
{
  return this.get('t',[]).includes('ocean','shallow','lake');
};
Tile.prototype.n = function (k){//get neighbor
  if (this.get(k,0))
  {
    return this.parent.getTile(this.get(k));
  }
  return null;
};
Tile.prototype.allNeighbors = function (){//get all neigbors
  return [
    this.n('nw'),
    this.n('ne'),
    this.n('east'),
    this.n('se'),
    this.n('sw'),
    this.n('west')
  ].filter(function(t)
  {
    return t;
  });
};
Tile.prototype.travel = function (c1,c2){//coord1, coord2
  co = c1;
  var dest = null;
  do{
    if (c1.x > c2.x)
    {
      c1 = c1.west();
      dest = (dest||this).n('west');
    }
    else if (c1.x < c2.x)
    {
      c1 = c1.east();
      dest = (dest||this).n('east');
    }
    if (c1.y > c2.y)
    {
      c1 = c1.nw();
      dest = (dest||this).n('nw');
    }
    else if (c1.y < c2.y)
    {
      c1 = c1.se();
      dest = (dest||this).n('se');
    }
  }
  while(c1.toJson()!=c2.toJson() && dest);
  
  return dest;
};
Tile.prototype.getUnits = function(){
  return this.get('ul',[]).map(function(unit_id)
  {
    return G.map.attr.units[unit_id];
  });
};
Tile.prototype.getTerrains = function(){
  if (this.get('t',[]).length===0)
  {
    return ['grassland'];
  }
  return this.get('t');
}
Tile.prototype.getSelectInfoBoxText = function(){
  return this.getTerrains().join(', ');
}
Tile.prototype.draw = function(c,r,p,coord,d)
{
  var x = r.x;
  var y = r.y;
  var d = r.d;
  var fts = p.z*p.ts;//final tile size
  var coord = r.coord;
  var tile_recursion_depth = r.tile_recursion_depth;

  var t = this.get('t',[]);
  if (!t.t1FillStyle)
  {
    if (t.includes('mountain'))
    {
      t.t1FillStyle="rgb(70,70,70)";
    }
    else if (t.includes('ocean','sea','lake'))
    {
      t.t1FillStyle="rgb(0,0,"+mt_rand(200,235)+")";
    }
    else if (t.includes('plains'))
    {
      t.t1FillStyle="rgb("+mt_rand(110,130)+","+mt_rand(190,210)+","+mt_rand(40,50)+")";
    }
    else if (t.includes('desert'))
    {
      t.t1FillStyle="rgb("+mt_rand(245,250)+","+mt_rand(225,245)+","+mt_rand(115,135)+")";
    }
    else
    {
      t.t1FillStyle="rgb("+mt_rand(0,20)+","+mt_rand(230,255)+","+mt_rand(0,20)+")";
    }
  }
  c.tiles1.fillStyle = t.t1FillStyle;
  
  c.tiles1.beginPath();
  c.tiles1.lineWidth=0.51;
  c.tiles1.moveTo(x, y + p.hdft);
  c.tiles1.lineTo(x + fts/2, y - p.hdft);
  c.tiles1.lineTo(x + fts,   y + p.hdft);
  c.tiles1.lineTo(x + fts,   y - p.hdft + fts);
  c.tiles1.lineTo(x + fts/2, y + p.hdft + fts);
  c.tiles1.lineTo(x, y - p.hdft + fts);
  c.tiles1.closePath();
  
  c.tiles1.fill();

  if (!false) // debug
  {
    c.tiles1.save();

    c.tiles1.shadowColor = "black"; // string
    c.tiles1.shadowOffsetX = 0.75; // integer
    c.tiles1.shadowOffsetY = 0.75; // integer
    c.tiles1.shadowBlur = 1.5;

    if (coord)
    {
      c.tiles1.fillStyle = "white";
      c.tiles1.font = (fts*0.20)+"px monospace";
      c.tiles1.fillText(coord.x+','+coord.y, x+(fts*0.2), y+fts/2);
      this.coord = coord.toJson();
    }

    if (false){
      c.tiles1.fillStyle = "white";//"rgb(80,95,180)";
      c.tiles1.font = (fts*0.20)+"px monospace";
      c.tiles1.fillText("#"+debug_c1++ + " d:" + tile_recursion_depth, x, y+fts/4);
    }
    
    if (false){
      d = d||'o';
      if (d=='o')
      {
        c.tiles1.shadowColor = "black";
        c.tiles1.shadowOffsetX = 0.75; // integer
        c.tiles1.shadowOffsetY = 0.75; // integer
        c.tiles1.shadowBlur = 2;
        c.tiles1.fillStyle = "yellow";
      }
      c.tiles1.font = (fts*0.20)+"px monospace";
      c.tiles1.fillText(d, x+(fts*0.25), y+fts*0.9);
      
      c.tiles1.stroke();
    }
    c.tiles1.restore();
  }
  c.tiles1.stroke();
  
  if (this.get('farm'))
  {
    c.tiles2.save();
    c.tiles2.fillStyle="rgb(127,127,0)";
    c.tiles2.font = (fts*0.20)+"px monospace";
    c.tiles2.fillText("♒Farm", x+(fts*0.25), y+fts*0.9);
    c.tiles2.stroke();
    c.tiles2.restore();
  }

  if (this.get('mine'))
  {
    c.tiles2.save();
    c.tiles2.fillStyle="rgb(127,127,255)";
    c.tiles2.font = (fts*0.20)+"px monospace";
    c.tiles2.fillText("☗Mine", x+(fts*0.25), y+fts*0.9);
    c.tiles2.stroke();
    c.tiles2.restore();
  }
  
  this.getUnits().forEach(function(e)
  {
    c.units2.save();
    c.units2.fillStyle="rgb(127,127,255)";
    c.units2.shadowColor = "black";
    c.units2.shadowOffsetX = 0.75; // integer
    c.units2.shadowOffsetY = 0.75; // integer
    c.units2.shadowBlur = 2;
    c.units2.font = (fts*0.66)+"px monospace";
    c.units2.fillText("☃", x+(fts*0.15), y+(0.75*fts));//snowman
    
    c.units2.stroke();
    c.units2.restore();
  });
  
  if (this.selected)
  {
    c.tiles3.save();
    c.tiles3.beginPath();
    c.tiles3.strokeStyle="rgb(0,0,255)";
    c.tiles3.lineWidth=2;
    c.tiles3.moveTo(x, y + p.hdft);
    c.tiles3.lineTo(x + fts/2, y - p.hdft);
    c.tiles3.lineTo(x + fts,   y + p.hdft);
    c.tiles3.lineTo(x + fts,   y - p.hdft + fts);
    c.tiles3.lineTo(x + fts/2, y + p.hdft + fts);
    c.tiles3.lineTo(x, y - p.hdft + fts);
    c.tiles3.closePath();
    c.tiles3.stroke();

    c.tiles3.beginPath();
    c.tiles3.strokeStyle="rgb(255,0,0)";
    c.tiles3.lineWidth=2;
    c.tiles3.moveTo(x, y + p.hdft);
    c.tiles3.lineTo(x + fts/2, y - p.hdft);
    c.tiles3.lineTo(x + fts,   y + p.hdft);
    c.tiles3.lineTo(x + fts,   y - p.hdft + fts);
    c.tiles3.lineTo(x + fts/2, y + p.hdft + fts);
    c.tiles3.lineTo(x, y - p.hdft + fts);
    c.tiles3.closePath();
    c.tiles3.stroke();
    c.tiles3.restore();
    
    if (this.getUnits()[0])
    {
      this.getUnits()[0].drawMovableTileLines(c,r,p,this);
    }
  }
  
  return;
};
/*
var example.attr = {
  t:[] //terra // can be "ocean","lake","shallow","atoll","bay","marsh","jungle","plains","tundra","glacier","hill","mountain","desert","oasis"
                // default is grassland, stored as empty/no array. all terrains are modifiers to grassland.
  Y:0 => 100 // trees count
  c: // current // direction of sea current
  r:"" // resource // special resource e.g. "wheat","buffalo","rats"
  i:[] // improvements // [Improvement{},Improvement{}] // e.g. road, railroad, farm, plantation
  p:0 => 100 // pollution (value is exponent of damage, also represents half-life) //☠☢
  ul:[] //unit id list

  city_id="" // if the city is the improvement
  road:0 => 100 //health/maintenance 
  farm:0 => 100
  mine:0 => 100
  plantation:0 => 100
  
}


 */