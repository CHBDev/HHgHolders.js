

function convertTo00Centric(xyPos){
	return new HHgVector2(xyPos.myX + this.halfWidth, xyPos.myY - this.halfHeight);
}

var HHgScene;
var theAll = document.getElementById("all");

function startHHgScene(){
	console.log("scene setup start");
	HHgScene = new HHgHolder(400,300, "stop");

	HHgScene.addThisHolder = function(holder){
		
		var div =document.createElement("div");
		holder.setDiv(div);
		div.style.display ="inline-block";
		div.style.position = "absolute";
		
		div.style.backgroundColor ="red";
		div.style.border = "2px solid black";
		div.style.width = "" + holder.getHeight() + "px";
		div.style.height ="" + holder.getWidth() + "px";
		var centricConversion = convertTo00Centric(holder.getPositionInScreen());
		div.style.left ="" + centricConversion.getX() +"px";
		div.style.bottom ="" + (centricConversion.getY()) + "px";
		div.setHolder(holder);
		
		theAll.appendChild(div);
	};

HHgScene.addThisHolder(HHgScene);

var testBlock = new HHgHolder(50,50);
testBlock.setPositionInScreen(199,199);
HHgScene.addThisHolder(testBlock);

}





	
	

