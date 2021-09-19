var myDocument = app.activeDocument;
var myPage = myDocument.pages.item(0);
var myTextFrame = myPage.textFrames.add();
// var mySpread = myDocument.spreads.item(0);
var i;
var myPageWidth = myDocument.documentPreferences.pageWidth;
var myPageHeight = myDocument.documentPreferences.pageHeight;
var grid = 12;
var myParagraph;

function setup(){

  //set ruler to points
  with (myDocument.viewPreferences) {
    horizontalMeasurementUnits = MeasurementUnits.points;
    verticalMeasurementUnits = MeasurementUnits.points;
  }

  myDocument.documentPreferences.facingPages == true;

  with(myDocument.documentPreferences){
    pageHeight = "8.5in";
    pageWidth = "5.5in";
    pageOrientation = PageOrientation.portrait;
    pagesPerDocument = 100;
    // facingPages == true;
    //Bleed
    //For Uniform you have to spec TopOffset
    documentBleedUniformSize = true;
    documentBleedTopOffset = "3pt";
    facingPages=true;
  }


  var doc = app.properties.activeDocument, pgs, pg, b, w, h, m;
  pgs = doc.pages.everyItem().getElements();
  while ( pg = pgs.pop() ) {
    var topMargin = getRandomIntInclusive(10, 120);
    var leftMargin =getRandomIntInclusive(10, 120);
    var rightMargin = getRandomIntInclusive(10, 120);
    var bottomMargin = getRandomIntInclusive(10, 120);

    b = pg.bounds;
    pg.marginPreferences.properties = {
      top : topMargin,
      left: leftMargin,
      right: rightMargin,
      bottom: bottomMargin
    };
  }
}

function colors(){
  // add new color
  // Create a color.
  try{
    myColorA = myDocument.colors.item("Cyan2");
    //If the color does not exist, trying to get its name will generate an error.
    myName = myColorA.name;
  }
  catch (myError){
    //The color style did not exist, so create it.
    myColorA = myDocument.colors.add({name:"Cyan2", model:ColorModel.process, colorValue:[100, 0, 0, 20]});
  }
  try{
    myColorA = myDocument.colors.item("BigRed");
    //If the color does not exist, trying to get its name will generate an error.
    myName = myColorA.name;
  }
  catch (myError){
    //The color style did not exist, so create it.
    myColorA = myDocument.colors.add({name:"BigRed", model:ColorModel.process, colorValue:[0, 84, 52, 0]});
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
  //The maximum is inclusive and the minimum is inclusive
}

function textFrames(){

  function myGetBounds(myDocument, myPage){
    var myPageWidth = myDocument.documentPreferences.pageWidth;
    var myPageHeight = myDocument.documentPreferences.pageHeight
    if(myPage.side == PageSideOptions.leftHand){
      var myX2 = myPage.marginPreferences.left;
      var myX1 = myPage.marginPreferences.right;
    }
    else{
      var myX1 = myPage.marginPreferences.left;
      var myX2 = myPage.marginPreferences.right;
    }
    var myY1 = myPage.marginPreferences.top;
    var myX2 = myPageWidth - myX2;
    var myY2 = myPageHeight - myPage.marginPreferences.bottom;
    return [myY1, myX1, myY2, myX2];
  }

  //Create a text frame on the current page.
  var myTextFrame = myPage.textFrames.add();
  //Set the bounds of the text frame.
  myTextFrame.geometricBounds = myGetBounds(myDocument, myPage);

  myDocument.paragraphStyles.add({name:"title", pointSize:getRandomIntInclusive(45, 75), leading: getRandomIntInclusive(25, 50), skew: getRandomIntInclusive(-30, 30), strokeColor:"Cyan2", strokeWeight: 0.5, fillColor:"Paper", appliedFont:"Times", });
  myDocument.paragraphStyles.add({name:"body", leading:getRandomIntInclusive(14, 20), fillColor:"Cyan2", appliedFont:"Helvetica", hyphenation: false, spaceAfter: getRandomIntInclusive(8, 16), });
  myDocument.paragraphStyles.add({name:"captions", pointSize:getRandomIntInclusive(6, 10), leading:getRandomIntInclusive(6, 10), fillColor:"Cyan2", appliedFont:"Helvetica", hyphenation: false,});
  myDocument.paragraphStyles.add({name:"folios", pointSize:getRandomIntInclusive(4, 8), leading:getRandomIntInclusive(6, 10), fillColor:"Cyan2", appliedFont:"Helvetica", hyphenation: false,});

  var myStory = myPage.place(File("/Users/cts4/Documents/Code/Thesis one documant.rtf"), [0, 0], undefined, false, true) [0];

  for(i = 0; i < myStory.paragraphs.length; i++){
    myStory.paragraphs.item(0).appliedParagraphStyle = "title";
    myStory.paragraphs.item(i).appliedParagraphStyle = "body";
    myStory.paragraphs.item(i).pointSize = getRandomIntInclusive(8, 16);
    myStory.paragraphs.item(i).characterRotation = getRandomIntInclusive(-5, 5);
  }
}

function images(){
  for(i = 1; i < myDocument.pages.length; i = i + 2){
    var randoP = getRandomIntInclusive(1, 4);
    var randoX = getRandomIntInclusive(0, myPageHeight - 300);
    var randoY = getRandomIntInclusive(0, myPageWidth - 300);
    var myFrame = myDocument.pages.item(i).rectangles.add({geometricBounds:[randoX, randoY, randoX + 300, randoY + 300]});
    var myPicture = myFrame.place(File("/Users/cts4/Documents/Code/APRS/shoes" + getRandomIntInclusive(1, 292) + ".png"))[0];

    myPicture.fit(FitOptions.CONTENT_TO_FRAME);
    myPicture.textWrapPreferences.textWrapMode = TextWrapModes.JUMP_OBJECT_TEXT_WRAP;
    myPicture.textWrapPreferences.textWrapOffset = ["0.0139 in", "0.0139 in", "0.125 in", "0.0139 in"];

    var myCaption = myFrame.parent.textFrames.add ();
    myCaption.geometricBounds = [randoX, randoY, randoX + 330, randoY + 300];
    // myCaption.contents = "Caption";
    myCaption.contents = myPicture.itemLink.name;
    myCaption.paragraphs.item(0).appliedParagraphStyle = "captions";
    myCaption.textWrapPreferences.textWrapMode = TextWrapModes.JUMP_OBJECT_TEXT_WRAP;
    myCaption.textWrapPreferences.textWrapOffset = ["0.0139 in", "0.0139 in", "0.125 in", "0.0139 in"];
  }
}

function folio(){
  for(i = 2; i < myDocument.pages.length; i = i + 2){
    var myFolio = myDocument.pages.item(i+2).textFrames.add();
    myFolio.geometricBounds = [i * 2, 10, (i * 2) + 30, 30];
    myFolio.contents = "p." + i;
    myFolio.paragraphs.item(0).appliedParagraphStyle = "folios";
    myFolio.textFramePreferences.ignoreWrap = true ;
  }

}

function covers() {
  myDocument.paragraphStyles.add({name:"coverTitle", pointSize:getRandomIntInclusive(80, 140), leading:getRandomIntInclusive(60, 130), fillColor:"Paper", appliedFont:"Helvetica", fontStyle:"Bold",  hyphenation: true, justification: Justification.CENTER_ALIGN, skew: getRandomIntInclusive(-60, 60), strokeColor:"BigRed", strokeWeight: 0.5});
  myDocument.paragraphStyles.add({name:"otherCoverText", pointSize:getRandomIntInclusive(20, 30), leading:getRandomIntInclusive(15, 30), fillColor:"Paper", appliedFont:"Helvetica", fontStyle:"Bold", hyphenation: false, justification: Justification.CENTER_ALIGN, strokeColor:"BigRed", strokeWeight: 0.5});
  myDocument.paragraphStyles.add({name:"issueInfo", pointSize:getRandomIntInclusive(40, 60), leading:getRandomIntInclusive(30, 50), fillColor:"Paper", appliedFont:"Helvetica", fontStyle:"Bold", hyphenation: false, justification: Justification.CENTER_ALIGN, skew: getRandomIntInclusive(-60, 60), strokeColor:"BigRed", strokeWeight: 0.5});
  myDocument.spreads.item(0).pages.add(LocationOptions.AT_BEGINNING);
  myDocument.spreads.item(1).pages.add(LocationOptions.AT_BEGINNING);

  var myFrame = myDocument.pages.item(0).rectangles.add({geometricBounds:[0, 0, myPageHeight, myPageWidth]});
  var myCover = myFrame.place(File("/Users/cts4/Documents/Code/APRS/shoes" + getRandomIntInclusive(1, 292) + ".png"))[0];
  myCover.fit(FitOptions.FILL_PROPORTIONALLY);
  var myCoverTitle = myDocument.pages.item(0).textFrames.add();
  myCoverTitle.geometricBounds = [30, 0, myPageHeight, myPageWidth];
  myCoverTitle.contents = "CONTROL";
  myCoverTitle.paragraphs.item(0).appliedParagraphStyle = "coverTitle";

  var myIssueInfo = myDocument.pages.item(0).textFrames.add();
  myIssueInfo.geometricBounds = [612, 0, 105+612, 612];
  myIssueInfo.contents = "volume 1 issue 1";
  myIssueInfo.paragraphs.item(0).appliedParagraphStyle = "issueInfo";
  myIssueInfo.rotationAngle = 90;

  var myCoverConent = myDocument.pages.item(0).textFrames.add();
  myCoverConent.geometricBounds = [500, 50, myPageHeight, myPageWidth-50];
  myCoverConent.contents = "Purely Electric Images of the Twentieth Century";
  myCoverConent.paragraphs.item(0).appliedParagraphStyle = "otherCoverText";
}



setup();
colors();
textFrames();
images();
covers();
folio();
