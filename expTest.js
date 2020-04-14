// Matrices to hold experiment data
var timeline = []; // Will hold the trial order

// Keep track of the info we will save or use
var dataMatrix = []; // Holds javascript key press numbers to determine what option was choose in the previous trial
var rewardMatrix = []; // Holds the reward value for each trial
var choiceMatrix = []; // Holds the converted option numbers for each trial
var bestMatrix = []; // 1 and 0 for best choice made on each trial
var rtMatrix = [];
var buttonPush = [];
var choiceSeen = 0

// To keep track of the trialnumber
var trialnum = 0;

// Declare probabilities
const PrA = 0.65;
const PrB = 0.35;
const PrC = 0.75;
const PrD = 0.25;

// Array to hold all of the stimuli pictures
var stimArray = [
  ['static/stims/fractal1.jpg', 'static/stims/fractal1select.png'],
  ['static/stims/fractal2.jpg', 'static/stims/fractal2select.png'],
  ['static/stims/fractal3.jpg', 'static/stims/fractal3select.png'],
  ['static/stims/fractal4.jpg', 'static/stims/fractal4select.png'],
  ['static/stims/fractal5.jpg', 'static/stims/fractal5select.png'],
  ['static/stims/fractal6.jpg', 'static/stims/fractal6select.png'],
  ['static/stims/fractal7.jpg', 'static/stims/fractal7select.png'],
  ['static/stims/fractal8.jpg', 'static/stims/fractal8select.png'],
  ['static/stims/fractal9.jpg', 'static/stims/fractal9select.png'],
  ['static/stims/fractal10.jpg', 'static/stims/fractal10select.png'],
  ['static/stims/fractal11.jpg', 'static/stims/fractal11select.png'],
  ['static/stims/fractal12.jpg', 'static/stims/fractal12select.png']
];

// randomize and select four images
var stimShuffled = jsPsych.randomization.shuffle(stimArray);
var stims = stimShuffled.slice(0, 4);
jsPsych.pluginAPI.preloadImages(stims);

// Determine order of AB -CD Pairings
var ABFirst = Math.floor(Math.random() * 100);
var CDFirst = Math.floor(Math.random() * 100);
var ABOrderInit = [1, 2];
var CDOrderInit = [3, 4];
var ABOrder = jsPsych.randomization.shuffle(ABOrderInit);
var CDOrder = jsPsych.randomization.shuffle(CDOrderInit);
if (ABFirst >= CDFirst) {
  var orderMatrix = ABOrder.concat(CDOrder);
} else {
  var orderMatrix = CDOrder.concat(ABOrder);
}

// Assign correct probability to order
var probMatrix = [];
for (var i = 0; i < 4; i++) {
  if (orderMatrix[i] === 1) {
    probMatrix.push(PrA);
  } else if (orderMatrix[i] === 2) {
    probMatrix.push(PrB);
  } else if (orderMatrix[i] === 3) {
    probMatrix.push(PrC);
  } else if (orderMatrix[i] === 4) {
    probMatrix.push(PrD);
  }
}

// Add all stim information into matrix.
// We also add in some strings and the names of the CSS objects we will call later
// These CSS objects will determine where the options are drawn onscreen.
// [stimuli image, reward prob, option number, Option name, image position, option text position, option key]
var stimMatrix = [
  [stims[0][0],probMatrix[0],orderMatrix[0],'Option A','centered1','centeredText1','a'],
  [stims[1][0],probMatrix[1],orderMatrix[1],'Option S','centered2','centeredText2','s'],
  [stims[2][0],probMatrix[2],orderMatrix[2],'Option K','centered3','centeredText3','k'],
  [stims[3][0],probMatrix[3],orderMatrix[3],'Option L','centered4','centeredText4','l']
];

// Rearrange to account for randomization and trialOrder calls. Ensures proper stimuli are shown
var optionArrange = [[],[],[],[]]
for (var i = 0; i < 4; i++){
  for (var j = 0; j < 4; j++){
    if (stimMatrix[j][2] == i+1){
      optionArrange[i] = stimMatrix[j]
    }
  }
}

// This array will reference later to show the correct combination of options onscreen.
var trialOrder = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,3]]

// Create Random Train Trial Order
var ABtrial = Array(2).fill(0);
var CDtrial = Array(1).fill(1);
var trainTrialMatrix = ABtrial.concat(CDtrial);
var trainTrials = [];
for (let i = 0; i < 1; i++) {
  var trainBlock = jsPsych.randomization.shuffle(trainTrialMatrix);
  trainTrials = trainTrials.concat(trainBlock)
}

//  Create Random Transfer Trial Order
var ACtrial = Array(1).fill(2);
var BCtrial = Array(1).fill(3);
var ADtrial = Array(1).fill(4);
var BDtrial = Array(1).fill(5);
var transferTrialMatrix = ACtrial.concat(BCtrial, ADtrial, BDtrial);
var transferTrials = [];
for (let i = 0; i < 1; i++) {
  var transferBlock = jsPsych.randomization.shuffle(transferTrialMatrix);
  transferTrials = transferTrials.concat(transferBlock)
}

//All trial matrix
var allTrials = trainTrials.concat(transferTrials)

//[stims[0],probMatrix[0],orderMatrix[0],'Option A','centered1','centeredText1'],
// This function will be used to figure what images to show, and return the formmated HTML to show it onscreen.
var getStim = function() {
    console.log(trialOrder[0]) // console log is your friend when debugging A section on this below.
    var stimuli = [optionArrange[trialOrder[(allTrials[trialnum])][0]],optionArrange[trialOrder[(allTrials[trialnum])][1]]]
    var leftStim = [stimuli[0][3],stimuli[0][0],stimuli[0][4],stimuli[0][5]]
    var rightStim = [stimuli[1][3],stimuli[1][0],stimuli[1][4],stimuli[1][5]]

    // Here is the HTML. We define the image and tell it the image source.
    // We then create a couple divisions to hold the text that we want to show.
    // The text can be written out or called from a variable.
    // The hiearchial arrangement of the classes and divisions help keep things organized
    // We then return it to whatever called the function.
    return "<img class='"+leftStim[2]+"' src= '" + leftStim[1] + "'><div class='"+leftStim[3]+"'>" + leftStim[0] + "</div></img>"+
    "<img class='"+rightStim[2]+"' src= '" + rightStim[1] + "'><div class='"+rightStim[3]+"'>" + rightStim[0] + "</div></img>"+
    "<div class = promptText><p>Please choose which option you think has the best chance of giving a point using the Option Letter key on your keyboard...</p></div>"
}


// This function opens up the right keys for responses
var getChoices = function() {
    var stimuli = [optionArrange[trialOrder[(allTrials[trialnum])][0]],optionArrange[trialOrder[(allTrials[trialnum])][1]]]
    var leftChoice = stimuli[0][6]
    var rightChoice = stimuli[1][6]
    return [leftChoice,rightChoice] // returns the keys
}


// function to figure reward receipt
var getReward = function(a) { //this function takes an argument
    randNum = Math.random();
    if (a == 65) { // we use that argument in an if statment.
        probVal = probMatrix[0];
    } else if (a == 83) {
        probVal = probMatrix[1];
    } else if (a == 75) {
        probVal = probMatrix[2];
    } else if (a == 76) {
        probVal = probMatrix[3];
    }
    if (probVal >= randNum) {
        rewardMatrix.push(1) // we use the push command to send the value an array. Appends the value.
        return '1'
    } else if (probVal < randNum) {
        rewardMatrix.push(0)
    return '0'
    }
}


// Function to show proper feedback screen with reward shown
var getFeedback = function() {
    var respKey = dataMatrix[dataMatrix.length - 1] //Get the response
    var reward = getReward(respKey) // Here is where we call another function
    var rewardBox = '';
    if (reward == '0') {
        rewardBox = 'static/stims/whiteBlock0.png'; // gives a box with the reward value. Easier than drawing.
    } else if (reward == '1') {
        rewardBox = 'static/stims/whiteBlock1.png';
    }

    // Determine if this is train or test trial
    testShow = 0
    if (trialnum > 2){
        testShow = 1
    }

    // call in stim info
    var stimuli = stimMatrix // uses the nonshuffled array

    // Figure what response to show.
    if (respKey == 65) {
        optResp = 0
    } else if (respKey == 83) {
        optResp = 1
    } else if (respKey == 75) {
        optResp = 2
    } else if (respKey == 76) {
        optResp = 3
    }

    // Save some data about choice
    choiceMatrix.push(optResp);
    buttonPush.push(optResp);

    // Show the proper train or test feedback
    if (testShow == 1){
        return "<img class='"+stimuli[optResp][4]+"' src= '" + stims[optResp][1] + "'><div class='"+stimuli[optResp][5]+"'>" + stimuli[optResp][3] + "</div></img>"
    } else if (testShow == 0){
        return "<img class='"+stimuli[optResp][4]+"' src= '" + rewardBox + "'><div class='"+stimuli[optResp][5]+"'>" + stimuli[optResp][3] + "</div></img>"
    }
}


// function used to figure if best choice was chose, and save local data if needed
var getDataVal = function() {
    var bestChoice = 0 // Checks to see if the best choice (highest prob) was chosen
    if (optionArrange[[buttonPush[buttonPush.length - 1]]][1] == Math.max(optionArrange[trialOrder[(allTrials[trialnum])][0]][1],optionArrange[trialOrder[(allTrials[trialnum])][1]][1])) {
        bestChoice = 1
    } else {
        bestChoice = 0
    }

    // save it
    bestMatrix.push(bestChoice);

    // increment the trial number
    trialnum = trialnum + 1

    // This returns all of the data we want to save in an jsPsych.data object
    return {
        reactionTime: rtMatrix[rtMatrix.length - 1],
        reward: rewardMatrix[rewardMatrix.length - 1],
        bestOption: bestChoice,
        keyResponse: choiceMatrix[choiceMatrix.length-1],
        setSeen: allTrials[trialnum]
    }
}

// Generic intro screen.
var welcome = {
  type: "html-keyboard-response", // we use a keyboard response plugin. No keys defined, so any will work.
  stimulus: "Welcome to our experiment. Press any key to begin.", // This is the text to be displayed.
};


// We can get their age through survey text plugin. Other plugins can be used though
var ageScreen = {
  type: 'survey-text', // call the plugin
  questions: [{ // tell it what to ask and the size of the box itll show.
    prompt: "Please type your age in the box",
    rows: 1,
    columns: 5
  }],
}


// Get sex info through a multichoice response
// Multiple questions can be shown at once.
// You can also make certain question required to be answered
var GenderQ = ["Male", "Female", "Prefer not to respond"];
var EthnicityQ = ["Not Hispanic or Latino", "Hispanic or Latino", "Prefer not to answer"];
var RaceQ = ["American Indian or Alaskan Native", "Asian", "Native Hawaiin or Other Pacific Islander", "Black or African American", "White", "More than one Race", "Prefer not to answer"];
var demographicScreen = {
  type: 'survey-multi-choice',
  questions: [{
      prompt: "Please select your gender",
      options: GenderQ,
      required: true
    },
    {
      prompt: "Please select your ethnicity",
      options: EthnicityQ,
      required: true
    },
    {
      prompt: "Please select your race",
      options: RaceQ,
      required: true
    }
  ],
};


// Give some instructions. Since it is multiple lines, we must format the text in HTML
var trainingIntro = {
  type: "html-keyboard-response",
  stimulus: "<p>Welcome to our experiment.</p>" +
    "<p>In this task, you will be shown four options to choose from.</p><p>However, only two of the possible combinations of the " +
    "four options will be shown at any given time.</p>" +
    "Please read the labels for each option on each trial carefully to make " +
    "your choice about which option you think is the most rewarding.</p>" +
    "<p>Press any key to begin.</p>",
  post_trial_gap: 1000 // Here we give a delay in ms before the next screen is shown
};


// Here is our first trial screen.
var trialScreen = {
  type: 'html-keyboard-response',
  stimulus: getStim, // We call the getStim function to give us the option pairs. If you only have one image, you can explicitly call it here.
  choices: getChoices, // Get the keyboard responses
  post_trial_gap: 0, // No post trial gap for immediate feedback
  on_finish: function(data) { // On finish, we save some data and push to an array
    var keyPressed = data.key_press;
    dataMatrix.push(keyPressed);
    var rtVal = data.rt;
    rtMatrix.push(rtVal);
  }
};

// Feedback trial screens
var RewardFeed = {
  type: 'html-keyboard-response',
  stimulus: getFeedback, // Get the right feedback image and value.
  data: getDataVal, // this was the function that determined if best choice was made and saved all of the trial data
  trial_duration: 750, // show on screen for .75s
  post_trial_gap: 0, // start next trial
  response_ends_trial: false // makes it to where they cant end the trial early by spamming keys
}


// Transfer Trial instructions
var transferIntro = {
  type: 'html-keyboard-response',
  stimulus: "<p>You've been selected to take part in a bonus round of the experiment!</p>" +
    "<p>In this phase, you will again be shown four options to choose from.</p><p>However, this time, " +
    "the four options will be paired differently.</p>" +
    "Please read the labels for each option on each trial carefully to make " +
    "your choice about which option you think is the most rewarding.</p>" +
    "<p></p>" +
    "<p>In addition, the points received from your choices will no longer be shown, but the points will still be tracked in the background.</p>" +
    "<p>For each point you earn in this phase, you will accrue a bonus $0.05. </p>" +
    "<p></p>" +
    "<p>Press any key to begin.</p>",
}


// Signal end of the experiment
var ExpEnd = {
    type: 'html-keyboard-response',
    stimulus: 'The Experiment is now over... ',
    trial_duration: 1500 // end after 1.5s if no response made
}

//Forces fullscreen.
timeline.push({
    type: 'fullscreen',
    fullscreen_mode: true
});

// welcome screen will start first, followed by the age and demographic screens.
timeline.push(welcome)
timeline.push(ageScreen)
timeline.push(demographicScreen)

// The instructions will show
timeline.push(trainingIntro)

// We will then use a for loop to push the training trials.
for (let i = 0; i < allTrials.length; i++) {
   // Show instrux for test phase on the right trial
    if (i == 3){
        timeline.push(transferIntro)
    }
    timeline.push(trialScreen); // Shows trial, then feedback
    timeline.push(RewardFeed);

}
timeline.push(ExpEnd)
