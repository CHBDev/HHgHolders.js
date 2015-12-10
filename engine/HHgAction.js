


var HHgAction = function (owner, totalDelta, startValue, totalTime, ease, onComplete){
  if(owner === undefined){
    console.log("ERROR: no owner holder passed to Action");
    return;
  }

  this.resetVals = {};
  this.resetVals.owner = owner;
  this.resetVals.totalDelta = totalDelta;
  this.resetVals.startValue = startValue;
  this.resetVals.totalTime = totalTime;


  this.owner = owner;
  this.onComplete = onComplete;
  this.ease = ease;
  this.totalTime = totalTime;
  this.easeInPercent = 0;
  this.easeOutPercent = 0;
  this.easeAreaUnderCurveMod = .5; //this is a hack since everything is linear easing right now
  this.startValue = startValue;
  this.totalDelta = totalDelta;
  this.isXY = (totalDelta instanceof HHgVector2);
  this.paused = false;

  if(ease){
    if(ease.easeIn > 1 ) ease.easeIn /= 100;
    if(ease.easeOut > 1) ease.easeOut /= 100;
    if(ease.easeIn !== undefined) this.easeInPercent = ease.easeIn;
    if(ease.easeOut !== undefined) this.easeOutPercent = ease.easeOut;
  }

  this.resetToStartValues();
};

(function(){

  var p = HHgAction.prototype;

  p.resetToStartValues = function(){
    this.timeSoFar = 0;
    this.startTime = +new Date;
    this.lastPercent = 0;
    this.deltaPercent = 0;
    this.deltaValue = this.isXY ? new HHgVector2(0,0) : 0;
    this.lastValue = this.isXY ? new HHgVector2(0,0) : 0;

  }

  p.repeatSelfF = function(){
    var copySelf;
    if(this.isActionSequence){
      copySelf = this.owner.makeSequence.apply(this.owner, this.originalArguments);
      this.owner.doActionSequenceForever(copySelf);
    }else if(this.isActionCluster){
      copySelf = this.owner.makeCluster.apply(this.owner, this.originalArguments);
      this.owner.doActionClusterForever(copySelf);
    }else{
      console.log("ERROR: repeating single actions is not implemented");
      return;
      copySelf = this.copyActionShell(this.originalArguments);
      this.owner.doStoredAction(copySelf);
    }

  };

  p.repeatSelfN = function(){
    this.repeatN--;
    HHgAction.repeatSelfF.call(this);
  };

  p.sequenceChain = function(){

    if(this.myNextAction){
      this.mySequence.props.myActions.push(this.owner.doStoredAction(this.myNextAction));
    }else if(this.isSequenceFinalTimer){
      if(this.mySequence.repeatF){
        this.mySequence.repeatSelfF();
      }else if(this.mySequence.repeatN){
        this.mySequence.repeatSelfN();
      }
      this.mySequence.sequenceChain();
    }else if(this.isClusterFinalTimer){
      if(this.myCluster.repeatF){
        this.myCluster.repeatSelfF();
      }else if(this.myCluster.repeatN){
        this.myCluster.repeatSelfN();
      }
      this.myCluster.sequenceChain();
    }
  };

  p.finalFrame = function(action){
    if(action.onComplete){
      action.onComplete();
    }

    action.sequenceChain();

    action.owner.doRemoveAction(action);
  };

  p.setEase = function(){
    if(this.easeInPercent > 0){
      this.easeInTime = this.totalTime * this.easeInPercent;
    }else{
      this.easeInTime = 0;
    }

    if(this.easeOutPercent > 0){
      this.easeOutTime = (this.totalTime * this.easeOutPercent);
    }else{
      this.easeOutTime = 0;
    }

    this.middlePercent =  1 - (this.easeOutPercent + this.easeInPercent) ;
    this.middlePercent = this.middlePercent + (this.easeInPercent * (1 - this.easeAreaUnderCurveMod));
    this.middlePercent = this.middlePercent + (this.easeOutPercent * (1 - this.easeAreaUnderCurveMod));
    this.middleTime = this.totalTime - (this.easeOutTime + this.easeInTime);
  };

  p.whatShouldIDoThisFrame = function(deltaT){

    this.timeSoFar += deltaT;
    if(this.timeSoFar >= this.totalTime){
      if(this.isSpecial === true){
        this.updateFunc(this.lastValue.subtractedFrom(this.endXY));
      }else if(this.isXY === true){
        if(this.normalizeBy1){
          this.updateFunc( this.lastValue.subtractedFrom(this.totalDelta).plus(HHg1Vector) );
        }else{
          this.updateFunc(this.lastValue.subtractedFrom(this.totalDelta));
        }
      }else{
        this.updateFunc( this.totalDelta - this.lastValue );
      }
      this.finalFrame(this);
      return;
    }
    if(this.timeSoFar < this.easeInTime){
      this.deltaPercent = this.easeInPercent * ( deltaT/this.easeInTime * ( this.timeSoFar/this.easeInTime ) );
    }else if(this.timeSoFar > this.totalTime - this.easeOutTime ){
      this.deltaPercent = this.easeOutPercent * ( deltaT/this.easeOutTime * ( (this.totalTime - this.timeSoFar)/this.easeOutTime) );
    }else{
      this.deltaPercent = this.middlePercent * ( deltaT / this.middleTime );
    }
    this.lastPercent += this.deltaPercent;

    if(this.isSpecial === true){
      this.tempXY = this.specialUpdateFunc(this.lastPercent, this);
      //this.deltaValue = this.tempXY.returnSubtract(this.lastValue);
      this.deltaValue = this.tempXY.minus(this.lastValue);
      this.lastValue = this.tempXY;
    }else if(this.isXY === true){
      this.deltaValue = this.totalDelta.times(this.lastPercent);
      this.deltaValue.minusEquals(this.lastValue);
      this.lastValue.plusEquals(this.deltaValue);
    }else{
      this.deltaValue = this.totalDelta * this.lastPercent;
      this.deltaValue -= this.lastValue;
      this.lastValue += this.deltaValue;
    }
    if(this.normalizeBy1){
      this.updateFunc(this.deltaValue.plus(HHg1Vector));
    }else{
      this.updateFunc(this.deltaValue);
    }
  };
}());

HHg.HHgActionCommands = {
  makeChildOfAction : function(subclass){
    subclass.prototype = Object.create(HHgAction.prototype);
    subclass.prototype.constructor = subclass;
  }
};

//======= MOVEMENT

function HHgActionMoveBy(owner, totalDelta, startValue, totalTime, ease, onComplete){
  HHgAction.call(this, owner, totalDelta, startValue, totalTime, ease, onComplete);
  this.updateFunc = this.owner.setPositionInScreenBy.bind(owner);
  this.setEase();
}
HHg.HHgActionCommands.makeChildOfAction(HHgActionMoveBy);

function HHgActionMoveForever(owner, vectorPerSecond, ease){
  HHgAction.call(this, owner, null, null, null, ease, null);
  this.perSecondXY = vectorPerSecond;
  this.whatShouldIDoThisFrame = function(deltaT){
    owner.setPositionInScreenBy(this.perSecondXY.times(deltaT));
  }
}
HHg.HHgActionCommands.makeChildOfAction(HHgActionMoveForever);

function HHgActionRotateBy(owner, totalDelta, startValue, totalTime, ease, onComplete){
  HHgAction.call(this, owner, totalDelta, startValue, totalTime, ease, onComplete);
  this.updateFunc = this.owner.setRotationOriginalBy.bind(owner);
  this.setEase();
}
HHg.HHgActionCommands.makeChildOfAction(HHgActionRotateBy);

function HHgActionRotateForever(owner, speed, ease){
  HHgAction.call(this, owner, null, null, null, ease, null);
  this.perSecondN = speed;
  this.whatShouldIDoThisFrame = function(deltaT){
    owner.setRotationOriginalBy(this.perSecondN * deltaT);
    //could add ease in option here
  }
}
HHg.HHgActionCommands.makeChildOfAction(HHgActionRotateForever);

function HHgActionScaleBy(owner, totalDelta, startValue, totalTime, ease, onComplete){
  HHgAction.call(this, owner, HHg1Vector.subtractedFrom(totalDelta).times(startValue), startValue, totalTime, ease, onComplete);
  this.normalizeBy1 = true;
  this.updateFunc = this.owner.setScaleOriginalBy.bind(owner);
  this.setEase();
}
HHg.HHgActionCommands.makeChildOfAction(HHgActionScaleBy);

function HHgActionScaleForever(owner, vectorPerSecond, startValue, ease){
  HHgAction.call(this, owner, null, null, null, ease, null);
  this.perSecondXY = HHg1Vector.subtractedFrom(vectorPerSecond).times(startValue);
  this.whatShouldIDoThisFrame = function(deltaT){
    owner.setScaleOriginalBy(this.perSecondXY.times(deltaT).plus(HHg1Vector));
  }
}
HHg.HHgActionCommands.makeChildOfAction(HHgActionScaleForever);

function HHgActionFollowQuad(owner, controlXY, endXY, startValue, totalTime, ease, onComplete){
  HHgAction.call(this, owner, new HHgVector2(1,1), startValue, totalTime, ease, onComplete);
  this.endXY = endXY;
  this.endX = endXY.x;
  this.endY = endXY.y;
  this.startX = this.startValue.x;
  this.startY = this.startValue.y;
  this.controlXY = controlXY;
  this.controlX = controlXY.x;
  this.controlY = controlXY.y;
  this.tempXY = new HHgVector2(0,0);
  this.lastValue = this.startValue;
  this.isSpecial = true;

  this.specialUpdateFunc = function(distance, action){
    return new HHgVector2(action.getXorYAlongQuad(distance, action.startX, action.controlX, action.endX),
                action.getXorYAlongQuad(distance, action.startY, action.controlY, action.endY));
  };
  this.updateFunc = this.owner.setPositionInScreenBy.bind(owner);
  this.setEase();
  var negT;
  this.getXorYAlongQuad = function(t, p1, p2, p3) {
      negT = 1 - t;
      return (negT * negT * p1 + 2 * negT * t * p2 + t * t * p3);
  }
}
HHg.HHgActionCommands.makeChildOfAction(HHgActionFollowQuad);

function HHgActionTimer(owner, totalTime, onComplete){
  HHgAction.call(this, owner, undefined, undefined, totalTime, undefined, onComplete);
  this.whatShouldIDoThisFrame = function(deltaT){
    this.timeSoFar += deltaT;
    if(this.timeSoFar >= this.totalTime){

      this.finalFrame(this);
      return;
    }
  }
}
HHg.HHgActionCommands.makeChildOfAction(HHgActionTimer);

//=======================





