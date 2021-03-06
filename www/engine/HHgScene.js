//================= HHgScene ===================
// this is the only file that interfaces with the DOM.
// it handles converting game data and logic into visuals
// essentially using the DOM, divs, and canvas, as the engine renderer.
// it also processes mouse/click/touch and translates the data
// into game space passing all info to HHgMouse
//
// there's no reason to modify anything here, unless you wanted to
// use a completely different platform than the DOM.

HHgScreenSize = new HHgVector2(HHgScreen.w, HHgScreen.h);
HHgScreenSizeHalf = HHgScreenSize.times(.5);

HHgTopHolder = document.getElementById("HHgTopHolder");

HHgTopHolder.style.width = "" + HardwareScreen.w + "px";
HHgTopHolder.style.height = "" + HardwareScreen.h + "px";

HHgSceneDoStart = function () {
  HHg.warn("HHgScene Start NOW");
  HHg0Vector = new HHgVector2(0, 0);
  HHg0Vector.setX = HHgNoOp;
  HHg0Vector.setY = HHgNoOp;
  HHg0Vector.setXY = HHgNoOp;

  HHg1Vector = new HHgVector2(1, 1);
  HHg1Vector.setX = HHgNoOp;
  HHg1Vector.setY = HHgNoOp;
  HHg1Vector.setXY = HHgNoOp;

  HHgHalfVector = new HHgVector2(.5, .5);
  HHgHalfVector.setX = HHgNoOp;
  HHgHalfVector.setY = HHgNoOp;
  HHgHalfVector.setXY = HHgNoOp;

  HHg10000Vector = new HHgVector2(10000, 10000);
  HHg10000Vector.setX = HHgNoOp;
  HHg10000Vector.setY = HHgNoOp;
  HHg10000Vector.setXY = HHgNoOp;

  HHgScene = new HHgHolder({w: HardwareScreen.w, h: HardwareScreen.h});

  HHgScene.test = "scene";
  doAddFunctionsToScene(HHgScene);
  //HHgGameHolder = HHgScene;

  function doAddScene() {
    var div = document.createElement("div");
    HHgScene.setDiv(div);
    div.style.display = "inline-block";
    div.style.position = "absolute";
    div.style.backgroundColor = "white";

    div.id = HHgScene.getHash();
    div.classList.add("scene");

    div.style.width = "" + HardwareScreen.w + "px";
    div.style.maxHeight = "" + HardwareScreen.w / HHgScreen.w * HHgScreen.maxh + "px";
    div.style.height = "" + HardwareScreen.w / HHgScreen.w * HHgScreen.maxh + "px";

    div.style.left = "" + 0 + "px";
    div.style.top = "" + ((HardwareScreen.h - (HardwareScreen.w / HHgScreen.w * HHgScreen.maxh)) / 2) + "px";

    HHgScene._holders[div.id] = HHgScene;

    HHgTopHolder.appendChild(div);

    HHgScene._setPositionInParentTo = HHgNoOp;
    HHgScene._setPositionInScreenTo = HHgNoOp;
    HHgScene._setPositionInScreenBy = HHgNoOp;
    HHgScene._notifySceneOfUpdates = HHgNoOp;
    HHgScene.doFrameDump = HHgNoOp;
    //HHgGameHolder.killHolder = HHgNoOp;
    HHgScene.getPositionInScreenNet = function () {
      return HHg0Vector;
    };
    HHgScene.setScene();
  };
  doAddScene();

  HHgSceneDiv = HHgScene.getDiv();
  HHgScreenDiff = new HHgVector2(0, (HardwareScreen.h - (HHgScreen.h * (HardwareScreen.w / HHgScreen.w) )) / 2);

  function buildHolderFromScratch() {
    HHgGameHolder = new HHgHolder({w: HHgScreen.w, h: HHgScreen.h});
    var div = document.createElement("div");
    HHgGameHolder.setDiv(div);
    div.style.display = "inline-block";
    div.style.position = "absolute";
    div.style.backgroundColor = "white";

    div.id = HHgGameHolder.getHash();
    div.classList.add("scene");

    HHgScene._holders[div.id] = HHgGameHolder;

    HHgSceneDiv.appendChild(div);
    //from here on out the game holder is now the scene div other holders are added to
    HHgSceneDiv = div;
    if (HHgTestDashSceneDiv) {
      HHgSceneDiv.style.borderTop = "2px dashed black";
      HHgSceneDiv.style.borderBottom = "2px dashed black";
    }

    HHgScene._addToChildrenList(HHgGameHolder);
    div.classList.add("game-holder");
    div.classList.remove("mouseable");
    div.style.width = "" + HHgScreen.w * (HardwareScreen.w / HHgScreen.w) + "px";
    div.style.height = "" + HHgScreen.h * (HardwareScreen.w / HHgScreen.w) + "px";
    HHgSceneDiv.style.left = "0px";

    HHgScreenDiffPlus = new HHgVector2(0, ((HardwareScreen.w / HHgScreen.w * HHgScreen.maxh) - (HHgScreen.h * (HardwareScreen.w / HHgScreen.w))) / 2);

    HHgSceneDiv.style.top = "" + HHgScreenDiffPlus.y + "px";

    HHgGameHolder._notifySceneOfUpdates = HHgNoOp;
    HHgGameHolder._setPositionInParentTo = HHgNoOp;
    HHgGameHolder._setPositionInScreenTo = HHgNoOp;
    HHgGameHolder._setPositionInScreenBy = HHgNoOp;
    HHgGameHolder.doFrameDump = HHgNoOp;
    //HHgGameHolder.killHolder = HHgNoOp;

    HHgGameHolder.getPositionInScreenNet = function () {
      return HHg0Vector;
    }

    HHgGameHolder.setGameHolder();
    HHgPixelScale = HHgGameHolder.getScaleNetForChildScale().x;
  };
  buildHolderFromScratch();
  //ALL CUSTOM GAME CODE START IN THIS FUNCTION:
  HHgGame.doStart();
};

function doAddFunctionsToScene(scene) {
  scene._holders = {};
  scene._dirtyHolders = {};
  scene._finalDirtyHolders = {};
  scene.isDirty = false;

  //==== specific 1 off updates ====//
  scene.doAddToDirtyList = function (holder) {
    scene._dirtyHolders[holder.getHash()] = holder;
    scene.isDirty = true;
  };

  scene.doUpdateHolderMouseable = function (holder) {
    holder.getMouseable() ? holder.getDiv().classList.add("mouseable") : holder.getDiv().classList.remove("mouseable");
  };

  scene.doUpdateHolderVisible = function (holder) {
    if (holder.getVisible()) {
      holder.getDiv().style.display = "inline-block";
    } else {
      holder.getDiv().style.display = "none";
    }
  };

  scene.doEndOfFrame = function () {
    if (!scene.isDirty) {
      return;
    }
    var newList = scene._dirtyHolders;
    scene._dirtyHolders = {};

    for (var thing in newList) {
      newList[thing].doFrameDump();
    }
  };

  scene.doUpdateHolders = function () {
    //this handles all visual updates per frame for holders

    if (!scene.isDirty) {
      return;
    }
    var newList = scene._finalDirtyHolders;
    scene._finalDirtyHolders = {};
    scene.isDirty = false;

    var holder, div, insideDiv, scalerDiv, widthNet, heightNet, parsedWidth, parsedHeight, changes, scaleX, scaleY, scalerScaleString, insideSkewStringX, insideSkewStringY, insideSkewString, insideTransformString, adjustedPosition, divTransformString;

    for (var thing in newList) {
      holder = newList[thing];

      div = holder.getDiv();
      if (div === undefined) return;

      scalerDiv = holder.getScalerDiv();
      insideDiv = holder.getInsideDiv();
      changes = holder.changes;

      if (changes.backgroundColor === true) {
        insideDiv.style.backgroundColor = holder.getBackgroundColor().returnString();
      }
      if (changes.tint === true) {
        scene.tintCanvasByFill(holder.getCanvas(), holder.getTintRGBA().returnString());
      }

      if (holder.firstUpdate !== true) {
        //this positions and scales the object on inital placement
        //after it will only use the transforms for divs
        holder.firstUpdate = true;

        div.style.width = "" + holder.getWidthNet() + "px";
        div.style.height = "" + holder.getHeightNet() + "px";
        scalerDiv.style.width = "" + holder.getFirstWidth() + "px";
        scalerDiv.style.height = "" + holder.getFirstHeight() + "px";
        scalerDiv.style.position = "absolute";
        scalerDiv.style.left = "0px";
        scalerDiv.style.bottom = "0px";
        insideDiv.style.position = "absolute";
        insideDiv.style.left = "0px";
        insideDiv.style.bottom = "0px";

        div.style.left = "0px";
        div.style.bottom = "0px";

        div.style.transformOrigin = "bottom left";
        div.style.webkitTransformOrigin = "bottom left";
        div.style.MozTransformOrigin = "bottom left";
        div.style.msTransformOrigin = "bottom left";
        div.style.OTransformOrigin = "bottom left";

        scalerDiv.style.transformOrigin = "bottom left";
        scalerDiv.style.webkitTransformOrigin = "bottom left";
        scalerDiv.style.MozTransformOrigin = "bottom left";
        scalerDiv.style.msTransformOrigin = "bottom left";
        scalerDiv.style.OTransformOrigin = "bottom left";

        if (holder.paragraph !== undefined) {
          //style test***
          //holder.paragraph.style.fontSize = "" + holder.fontSizeScaled + "px";
        }
        if (holder.borderWidthOriginal > 0) {
          //style test***
          //div.style.borderWidth = "" + holder.borderWidthScaled + "px";
        }
      }
      //=============== Begin conditional for transform types
      if (changes.scale === true || changes.rotation === true || changes.position === true) {
        //the inside div only handles visuals and self rotation
        widthNet = holder.getWidthNet();
        heightNet = holder.getHeightNet();
        parsedWidth = parseFloat(scalerDiv.style.width);
        parsedHeight = parseFloat(scalerDiv.style.height);

        // The scale is so that we use graphics card scaling on contents
        scaleX = widthNet / parsedWidth;
        scaleY = heightNet / parsedHeight;

        scalerScaleString = "scale(" + scaleX + "," + scaleY + ") ";

        scalerDiv.style.webkitTransform = scalerScaleString;
        scalerDiv.style.MozTransform = scalerScaleString;
        scalerDiv.style.msTransform = scalerScaleString;
        scalerDiv.style.OTransform = scalerScaleString;
        scalerDiv.style.transform = scalerScaleString;

        insideSkewStringX = "skewX(" + ( 0 ) + "deg)"; // TODO: cooper, hook up skew
        insideSkewStringY = "skewY(" + ( 0 ) + "deg)";
        insideSkewString = insideSkewStringX + " " + insideSkewStringY;
        insideTransformString = "rotate(" + holder.getRotationNet() + "deg" + ") " + insideSkewString;

        insideDiv.style.webkitTransform = insideTransformString;
        insideDiv.style.MozTransform = insideTransformString;
        insideDiv.style.msTransform = insideTransformString;
        insideDiv.style.OTransform = insideTransformString;
        insideDiv.style.transform = insideTransformString;

        adjustedPosition = holder.getPositionInScreenNet();

        divTransformString = "translate(" + adjustedPosition.x + "px, " + (-adjustedPosition.y) + "px) ";

        div.style.webkitTransform = divTransformString;
        div.style.MozTransform = divTransformString;
        div.style.msTransform = divTransformString;
        div.style.OTransform = divTransformString;
        div.style.transform = divTransformString;
      }
      //======== END Conditional for transform types

      if (changes.zIndex === true) {
        div.style.zIndex = "" + holder.getZIndex();
      }

      if (changes.mouseable === true) {
        scene.doUpdateHolderMouseable(holder);
      }

      if (changes.visible === true) {
        scene.doUpdateHolderVisible(holder);
      }

      if (changes.classList === true) {
        for (var key in holder.classAddingObject) {
          div.classList.add(holder.classAddingObject[key]);
        }
        holder.classAddingObject = undefined;

        for (var key in holder.classRemovingObject) {
          div.classList.remove(holder.classRemovingObject[key]);
        }
        holder.classRemovingObject = undefined;
      }
      holder.resetChanges();
    }
  };

  scene.addToFinalPassList = function (holder) {
    scene._finalDirtyHolders[holder.getHash()] = holder;
  };

  scene.doAddThisHolder = function (holder) {
    if (holder.getDiv()) {
      scene.addToFinalPassList(holder);
      return;
    }

    var div = document.createElement("div");
    var scalerDiv = document.createElement("div");
    var insideDiv = document.createElement("div");
    holder.setDiv(div);
    holder.setInsideDiv(insideDiv);
    holder.setScalerDiv(scalerDiv);
    div.style.display = "inline-block";
    div.style.position = "absolute";

    div.appendChild(scalerDiv);

    insideDiv.style.display = "inline-block";
    insideDiv.style.height = "100%";
    insideDiv.style.width = "100%";

    scalerDiv.appendChild(insideDiv);

    if (HHgTestBoxes === true) {
      div.style.border = "2px solid black";
      insideDiv.style.border = "2px solid blue";
    }

    div.id = holder.getHash();
    insideDiv.id = holder.getHash() + "_inside";
    scalerDiv.id = holder.getHash() + "_scaler";
    scene.addToFinalPassList(holder);
    scene._holders[div.id] = holder;
    HHgSceneDiv.appendChild(div);
  };

  scene.doRemoveThisHolder = function (holder) {
    var div = holder.getDiv();
    delete scene._finalDirtyHolders[holder.getHash()];
    if (!div) {
      HHg.warn("WARNING: attempting to remove a holder without a DOM element.");
      return;
    }
    delete scene._holders[div.id];
    HHgSceneDiv.removeChild(div);
  };

  //====================================================

  scene.doAddTextDiv = function (owner, props) {
    var parent = document.createElement("div");
    owner.getInsideDiv().appendChild(parent);
    var child = document.createElement("pre");
    parent.appendChild(child);
    var parentScale = owner.getScaleNetForChildScale().x * HHgPixelScale;
    var tempFontSize = props.fontSize * parentScale;
    child.style.color = props.color ? props.color.returnString() : "black";
    parent.style.fontSize = "" + tempFontSize + "px";
    parent.style.lineHeight = "1em";
    child.style.lineHeight = "1.2em"; //TODO: cooper, all this old lineheight and pre stuff should get yanked and redone.
    child.style.paddingTop = ".2em";
    child.style.fontStyle = props.fontStyle;
    child.classList.add(props.fontStyle);
    child.innerHTML = props.text;

    child.style.textAlign = props.hAlign;
    child.style.verticalAlign = props.vAlign;
    parent.classList.add("textDiv");
    if (props.hAlign === "center") {
      parent.classList.add("textCenter");
    } else if (props.hAlign === "right") {
      parent.classList.add("textRight");
    } else {
      parent.classList.add("textLeft");
    }
    if (props.vAlign === "middle") {
      parent.classList.add("textMiddle");
    } else if (props.vAlign === "bottom") {
      parent.classList.add("textBottom");
    } else {
      parent.classList.add("textTop");
    }

    parent.id = owner.getHash() + "t";
    child.id = owner.getHash() + "p";

    if (props.shadow !== undefined) {
      props.shadow.x *= parentScale;
      props.shadow.y *= parentScale;
      props.shadow.blur *= parentScale;

      child.style.textShadow = "" + props.shadow.x + "px " + props.shadow.y + "px " + props.shadow.blur + "px " + props.shadow.color.returnString();
    }
    owner.textDiv = parent;
    owner.paragraph = child;
    owner.fontSizeOriginal = props.fontSize;
  };

  scene.doAddTextToCanvas = function (owner, props) {
    var x, y, textWidth, textHeight;

    var can = document.createElement('canvas');

    can.classList.add(owner.getHash());

    owner.getInsideDiv().appendChild(can);
    var parentScale = owner.getScaleNetForChildScale().x * HHgPixelScale;
    var width = owner.getWidthNet() * parentScale;
    var height = owner.getHeightNet() * parentScale;
    can.width = width;
    can.height = height;
    can.classList.add("canvasAsText");

    owner.setTextCanvas(can);
    var ctx = can.getContext("2d");

    var lines = props.text.split("\n");

    var lineHeight = props.fontSize * parentScale;
    ctx.font = "" + lineHeight + "px " + props.fontStyle;
    textHeight = lineHeight * lines.length;

    ctx.textBaseline = "bottom";
    if (props.vAlign === "top") {
      y = 0;
    } else if (props.vAlign === "middle") {
      y = (height - textHeight) / 2;
    } else {
      y = height - textHeight;
    }

    if (props.shadow !== undefined) {
      ctx.shadowOffsetX = props.shadow.x * parentScale;
      ctx.shadowOffsetY = props.shadow.y * parentScale;
      ctx.shadowColor = props.shadow.color.returnString();
      ctx.shadowBlur = props.shadow.blur * parentScale;
    }

    if (props.stroke !== undefined) {
      ctx.strokeStyle = props.stroke.color.returnString();
      ctx.lineWidth = props.stroke.width * parentScale;
      ctx.strokeText(props.text, x, y);
    }

    ctx.fillStyle = props.color.returnString();

    var widest = 0;
    for (var i = 0; i < lines.length; i++) {
      textWidth = ctx.measureText(lines[i]).width;
      if (textWidth > widest) {
        widest = textWidth;
      }
      if (props.hAlign === "left") {
        x = 0;
        ctx.textAlign = "left";
      } else if (props.hAlign === "center") {
        x = width / 2;
        ctx.textAlign = "center";
      } else {
        x = width;
        ctx.textAlign = "right";
      }

      //ctx.globalCompositeOperation="destination-over";
      ctx.fillText(lines[i], x, y + (lineHeight * (i + 1)));
    }

    // if(widest > width){
    //   ctx.scale(width / widest, width/widest);
    // }
  };

  scene.flipCanvasH = function (canvas) {
    canvas.getContext("2d").scale(-1, 1);
  };

  scene.doAddShadowToCanvas = function (canvas, props) {
    var ctx = canvas.getContext("2d");

    if (props.shadow !== undefined) {
      ctx.shadowOffsetX = props.shadow.x * parentScale * HHgHoldCanvasUpresScaleBy;
      ctx.shadowOffsetY = props.shadow.y * parentScale * HHgHoldCanvasUpresScaleBy;
      ctx.shadowColor = props.shadow.color.returnString();
      ctx.shadowBlur = props.shadow.blur * parentScale * HHgHoldCanvasUpresScaleBy;
    }
    //ctx.globalCompositeOperation="destination-over";
  };

  scene.doRemoveShadowFromCanvas = function (canvas) {

  };
  //========================================================

  scene.doAddMouseDownAndUpListeners = function () {
    var wOffset = 0;
    var hOffset = 0;
    var relX = 0, relY = 0;
    var mouseXY, touch, touchlist, i, test;

    HHgTopHolder.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      relX = e.pageX;
      relY = e.pageY;
      mouseXY = new HHgVector2(relX, relY);
      mouseXY = scene.convertMouseToHolder(mouseXY);
      HHgMouse.doMouseDown(scene.returnHoldersUnderPoint(mouseXY), mouseXY);
      return false;
    }, false);

    HHgTopHolder.addEventListener("mouseup", function (e) {
      e.preventDefault();
      e.stopPropagation();
      relX = e.pageX;
      relY = e.pageY;
      mouseXY = new HHgVector2(relX, relY);
      mouseXY = scene.convertMouseToHolder(mouseXY);
      HHgMouse.doMouseUp(scene.returnHoldersUnderPoint(mouseXY), mouseXY);
      return false;
    }, false);

    document.addEventListener("mouseout", function (e) {
      e = e ? e : window.event;
      test = e.relatedTarget || e.toElement;
      if (!test || test.nodeName == "HTML") {
        relX = e.pageX;
        relY = e.pageY;
        mouseXY = new HHgVector2(relX, relY);
        mouseXY = scene.convertMouseToHolder(mouseXY);
        HHgMouse.doMouseCancel(scene.returnHoldersUnderPoint(mouseXY), mouseXY);
      }
      return false;
    }, false);

    HHgTopHolder.addEventListener("mousemove", function (e) {
      e.preventDefault();
      e.stopPropagation();
      relX = e.pageX;
      relY = e.pageY;
      mouseXY = new HHgVector2(relX, relY);
      mouseXY = scene.convertMouseToHolder(mouseXY);
      HHgMouse.doMouseMove(mouseXY);
      return false;
    }, false);

    HHgTopHolder.addEventListener("touchstart", function (e) {
      e.preventDefault();

      touch = e.changedTouches[0];
      //also e.targetTouches, and e.touches
      HHgTrackedTouch = touch.identifier;
      relX = touch.pageX;
      relY = touch.pageY;
      mouseXY = new HHgVector2(relX, relY);
      mouseXY = scene.convertMouseToHolder(mouseXY);
      HHgMouse.doMouseDown(scene.returnHoldersUnderPoint(mouseXY), mouseXY);
      return false;
    }, false);

    HHgTopHolder.addEventListener("touchend", function (e) {
      e.preventDefault();
      touchList = e.changedTouches;

      for (i = 0; i < touchList.length; i++) {
        if (touchList[i].identifier === HHgTrackedTouch) {

          relX = touchList[i].pageX;
          relY = touchList[i].pageY;
          mouseXY = new HHgVector2(relX, relY);
          mouseXY = scene.convertMouseToHolder(mouseXY);
          HHgMouse.doMouseUp(scene.returnHoldersUnderPoint(mouseXY), mouseXY);
          break;
        }
      }
      return false;
    }, false);

    HHgTopHolder.addEventListener("touchmove", function (e) {
      e.preventDefault();
      touchList = e.changedTouches;

      for (i = 0; i < touchList.length; i++) {
        if (touchList[i].identifier === HHgTrackedTouch) {
          relX = touchList[i].pageX;
          relY = touchList[i].pageY;
          mouseXY = new HHgVector2(relX, relY);
          mouseXY = scene.convertMouseToHolder(mouseXY);
          HHgMouse.doMouseMove(mouseXY);
          break;
        }
      }
      return false;
    }, false);

    //does this also need "touchleave"?
    HHgTopHolder.addEventListener("touchcancel", function (e) {
      e.preventDefault();
      touchList = e.changedTouches;
      for (i = 0; i < touchList.length; i++) {
        if (touchList[i].identifier === HHgTrackedTouch) {
          relX = touchList[i].pageX;
          relY = touchList[i].pageY;
          mouseXY = new HHgVector2(relX, relY);
          mouseXY = scene.convertMouseToHolder(mouseXY);
          HHgMouse.doMouseCancel(scene.returnHoldersUnderPoint(mouseXY), mouseXY);
          break;
        }
      }
      return false;
    }, false);
  };

  scene.convertMouseToHolder = function (xy) {
    xy = xy.plus(HHgScreenDiff);
    xy.y = HardwareScreen.h - xy.y;

    xy = HHgGameHolder.returnHalfSizeVector().subtractedFrom(xy);
    xy = xy.dividedBy(HHgGameHolder.getScaleNetForChildScale());
    return xy;
  };

  scene.doesHolderContainPoint = function (holder, xy) {
    var canvas = holder.getCanvas();
    var mousePos = xy.getCopy();
    var holderCenter = holder.getPositionInScreenOriginal();
    var mouseFinalRelative = mousePos.getVectorRotated(holderCenter, holder.getRotationNet());

    var holderAbsoluteSize = new HHgVector2(holder.getWidthNet(), holder.getHeightNet());
    holderAbsoluteSize.dividedEquals(HHgPixelScale);
    var holderBottomLeft = holderCenter.minus(holderAbsoluteSize.dividedBy(2));
    mouseFinalRelative.minusEquals(holderBottomLeft);

    var left = 0;
    var right = holderAbsoluteSize.x;
    var bottom = 0;
    var top = holderAbsoluteSize.y;
    var posX = mouseFinalRelative.x;
    var posY = mouseFinalRelative.y;

    if (posX < left) return false;

    if (posX > right) return false;

    if (posY > top) return false;

    if (posY < bottom) return false;

    if (canvas !== undefined) {
      var canvasRatio = new HHgVector2(canvas.width, canvas.height);
      canvasRatio.dividedEquals(holderAbsoluteSize);
      mouseFinalRelative.timesEquals(canvasRatio);
      if (isAlphaPixel(canvas, mouseFinalRelative.x, mouseFinalRelative.y)) return false;
    }
    return true;
  };

  scene.returnHoldersUnderPoint = function (xy) {
    var arr = document.getElementsByClassName("mouseable"),
      mArr = [],
      highestZ = -100,
      thisHolder;

    for (var i = 0; i < arr.length; i++) {
      thisHolder = scene.getHolderFromDiv(arr[i]);

      if (scene.doesHolderContainPoint(thisHolder, xy)) {
        if (mArr.length < 1) {
          mArr.push(thisHolder);
          continue;
        }

        for (var j = 0; j < mArr.length; j++) {
          if (thisHolder.getZIndex() >= mArr[j].getZIndex()) {
            mArr.unshift(thisHolder);
            break;
          }
        }
      }
    }
    return mArr;
  };

  scene.getHolderFromDiv = function (div) {
    return scene._holders[div.id];
  };

  scene.getCanvasFromDiv = function (div) {
    return scene._holders[div.id].getCanvas();
  };

  scene.setBackgroundImageForHolder = function (holder, fileName) {
    //holder.getDiv().style.backgroundImage = "url(" + fileName +")";
    var img = new Image();
    img.src = fileName;
    holder.getInsideDiv().appendChild(img);
  };

  scene.setCanvasImageForHolder = function (holder, fileName, whitePixelTintColor) {
    var canvas = document.createElement('canvas');
    canvas.classList.add("canvasAsSprite");
    var ctx = canvas.getContext('2d');
    canvas.classList.add(holder.getHash());
    var div = holder.getInsideDiv();
    canvas.width = HHgHoldCanvasUpresScaleBy * holder.getWidthNet();
    canvas.height = HHgHoldCanvasUpresScaleBy * holder.getHeightNet();
    var color = whitePixelTintColor;

    holder.setCanvas(canvas);

    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = fileName;

    div.appendChild(canvas);
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (color) {
        tintCanvasByColorize(canvas, color);
      }
    };
  };

  var ctx, imgData;
  scene.tintCanvasByFill = function (canvas, color) {
    ctx = canvas.getContext("2d");
    ctx.fillStyle = color.returnString();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "destination-atop";
  };

  function tintCanvasByColorize(canvas, color) {
    ctx = canvas.getContext("2d");
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 4] === 0) continue;

      imgData.data[i] = imgData.data[i] / 255 * color.R;
      imgData.data[i + 1] = imgData.data[i + 1] / 255 * color.G;
      imgData.data[i + 2] = imgData.data[i + 2] / 255 * color.B;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  function tintCanvasByOverlay(canvas, color) {
    var ctx = canvas.getContext("2d");
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    function overlay(a, b) {
      a /= 255;
      b /= 255;
      if (a < .5) return 255 * 2 * a * b;
      return 255 * (1 - 2 * (1 - a) * (1 - b));
    };

    for (var i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 4] === 0) continue;

      imgData.data[i] = overlay(imgData.data[i], color.R);
      imgData.data[i + 1] = overlay(imgData.data[i + 1], color.G);
      imgData.data[i + 2] = overlay(imgData.data[i + 2], color.B);
    }
    ctx.putImageData(imgData, 0, 0);
  };

  function isAlphaPixel(canvas, x, y) {
    if (isNaN(x)) {
      HHg.warn("ERROR: isAlphaPixel: canvas: " + canvas + " xy: " + x + " y: " + y);
    }
    return canvas.getContext('2d').getImageData(x, y, 1, 1).data[3] > .15 ? false : true;
  };

  function getpixelcolour(canvas, x, y) {
    var cx = canvas.getContext('2d');
    var pixel = cx.getImageData(x, y, 1, 1);
    return {
      r: pixel.data[0],
      g: pixel.data[1],
      b: pixel.data[2],
      a: pixel.data[3]
    };
  };

  scene.maskShapeTriangle = function (props) {
    if (props.borderRadius === undefined) return;
    var holder = props.holder;
    var str = "", i, br = props.borderRadius;
    if (br !== undefined) {
      for (i = 0; i < br.length; i++) {
        str += br[i];
      }
    }
    holder.getInsideDiv().style.borderRadius = str;
  };

  scene.maskShapeEllipse = function (props) {
    if (props.borderRadius === undefined) return;

    var holder = props.holder;
    var str = "", i, br = props.borderRadius;
    if (br !== undefined) {
      for (i = 0; i < br.length; i++) {
        str += br[i];
      }
    }

    holder.getInsideDiv().style.borderRadius = str;
  };

  scene.maskShapeRectangle = function (props) { //TODO, cooper, all of these require you to add the holder to scene first, and there's no real reason to.
    if (props.borderRadius === undefined) return;
    var holder = props.holder;
    var str = "", i, br = props.borderRadius;
    if (br !== undefined) {
      for (i = 0; i < br.length; i++) {
        if (i == 4) {
          str += " / ";
        }
        if (br[i] < 1) {
          str += (br[i] * 100) + "% ";
        } else {
          str += br[i] * HHgPixelScale + "px ";
        }
      }
    }
    holder.getInsideDiv().style.borderRadius = str;
  };

  scene.removeShape = function (holder) {
    holder.getInsideDiv().style.borderRadius = 0;
  };

  scene.addBorderToHolder = function (props) {
    var bw = props.borderWidth, holder = props.holder;
    if (bw < .5) {
      bw *= holder.getHeightNet();
    }
    props.holder.borderWidthOriginal = bw;
    bw *= HHgPixelScale;
    holder.getInsideDiv().style.border = "" + bw + "px " + props.borderStyle + " " + props.color.returnString();
  };
};








