//HHgTestSpec.js

//redo sequence and clusters to use less memory allocation
//put ActionShells into a class, and sub class clusters and sequences

//screen resizing, while not really part of the design, does bad things to mouse position offsets


//test sequences repeat n


//test to make sure action counts are correct when completed or moved, now that clusters and sequences chain

//TODO tests
  //test actions cluster
  //test text scaling
  //parent rotation and scale should change child movement actions/directions?


//TODO features
  //add sound
  //add sprite map system
  //add frame by frame sequencing for holder sprite animations
  //add object pool
  //add sound pool
  //add persistence
  //add collision
  //add physics
  //add server hook
  //add alignment system

  //9 slice
  //killing holders needs to clean up actions they are running
  //add move in parent action

//BUGS
  //fonts and font shadows now fuzzing on scale
    //add text positinging system
    //adding paragraph text doesn't check to see if p text already exists

  //rotation adding forever
  //scaleBy .5 plus scale by 2.0 if run concurrently is equal to scale by 1.5, not sure if that's right, maybe it is, how else would it keep track?



// TEST SUITES
//Holders - set values

  //screen

    //Position

    //Scale

    //Rotation

  //in parent

    //Position

    //scale

    //rotation

  //adding and removing holders

  //tinting

//Actions
  //holder paused

  //action paused

  //screen

    //Position

    //quad

    //Scale

    //Rotation

  //parent

    //Position

    //scale

    //rotation

    //adding and removing actions

    //sequences
      //repeat x times
      //repeat forever

    //clusters

    //timers

    //play sound

//colors
  //HSL RGB HEX

//mouse
  //click on holder

//vectors
  //add subtract rotate, minus equals, etc

//sprites
 //load images, use coordinate maps

//shapes
  //appear, have color, have borders

//text
  //paragraph text
  //canvas text


//Parent / Child

//
