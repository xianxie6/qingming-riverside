// A full-density world-space tile survives continuous camera movement. The
// water renderer samples this same tile instead of re-uploading each viewport.
export class BackdropCache{
  constructor(createCanvas){this.canvas=createCanvas();this.context=this.canvas.getContext('2d',{alpha:false});this.version=0;this.key=null;this.rect=null;}
  invalidate(){this.key=null;}
  get({camera,viewWidth,height,density,key},draw){
    const cacheKey=[viewWidth,height,density,key].join(':');
    if(this.key===cacheKey&&camera>=this.rect.x&&camera+viewWidth<=this.rect.x+this.rect.width)return this;
    const margin=Math.min(160,viewWidth/3);
    const pixelWidth=Math.ceil((viewWidth+margin*2)*density),pixelHeight=Math.ceil(height*density);
    if(this.canvas.width!==pixelWidth)this.canvas.width=pixelWidth;
    if(this.canvas.height!==pixelHeight)this.canvas.height=pixelHeight;
    const x=Math.floor((camera-margin)*density)/density;
    this.rect={x,y:0,width:pixelWidth/density,height:pixelHeight/density};
    this.context.setTransform(1,0,0,1,0,0);this.context.clearRect(0,0,pixelWidth,pixelHeight);
    this.context.setTransform(density,0,0,density,-x*density,0);
    this.context.imageSmoothingQuality='high';draw(this.context,this.rect);
    this.key=cacheKey;this.version++;return this;
  }
}
