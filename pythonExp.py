# Import libraries and functions
from __future__ import absolute_import, division

# numpy imports
import numpy as np  # import numpy and abbreviate.
from numpy import (sin, cos, tan, log, log10, pi, average,
                   sqrt, std, deg2rad, rad2deg, linspace, asarray)
from numpy.random import random, randint, normal, shuffle

# system imports
import os 
import sys

# Psychopy imports
from psychopy import locale_setup
from psychopy import prefs
from psychopy import sound, gui, visual, core, data, event, logging, clock
from psychopy.constants import (NOT_STARTED, STARTED, PLAYING, PAUSED,
                                STOPPED, FINISHED, PRESSED, RELEASED, FOREVER)
from psychopy.hardware import keyboard

# Ensure that relative paths start from the same directory as this script
_thisDir = os.path.dirname(os.path.abspath(__file__))
os.chdir(_thisDir)


#Set up window
win = visual.Window(
    size=[1920, 1080], fullscr=True, screen=0, 
    winType='pyglet', allowGUI=False, allowStencil=False,
    monitor='testMonitor', color=[-1.000,-1.000,-1.000], colorSpace='rgb',
    blendMode='avg', useFBO=True, 
    units='pix')
# Pyglet is a type of window that psychopy provides. I am not sure of the difference as of yet.
# Monitor is a set of preferences made Tools -> monitor center tab in the psychopy window


# Set up Info
# Probabilities
PrA = .65
PrB = .35
PrC = .75
PrD = .25
PrX = [PrA,PrB,PrC,PrD]


# Graphic Variables - in px w/ 0,0 origin
stimX = [-550,-250,50,350]
stimY = 0
stimSize = (200,200)
textX = [-550,-250,50,350]
textY = 175
textSize = 30 # font size


# Get 4 random numbers for stimuli images
stimNum = np.arange(1,13,1) # numpy arange generates a vector of numbers between 1 and 12 with a difference 1 between each number.
shuffle(stimNum)


# Generate system paths for each of the four images to be called in the experiment
stims = ['','','','']
imType = '.jpg'
imPath = 'F:\\MTurk Jatos Exp File Transfer\\ABCDTriple\\static\\stims\\fractal'
for im in range(0,4):
    stims[im] = imPath + str(stimNum[im]) + imType


# Figure random order of options
ABFirst = random()
CDFirst = random()
ABOrder = [1,2]
CDOrder = [3,4]
shuffle(ABOrder)
shuffle(CDOrder)


# Put values in array in order
if ABFirst >= CDFirst:
    orderMat = [ABOrder[0],ABOrder[1],CDOrder[0],CDOrder[1]]
else:
    orderMat = [CDOrder[0],CDOrder[1],ABOrder[0],ABOrder[1]]


# Figure assignment of probabilities
probs = [PrX[orderMat[0]-1],PrX[orderMat[1]-1],
         PrX[orderMat[2]-1],PrX[orderMat[3]-1]]


# Create matrix of stimuli
# This cell array holds all of the information we will need on each trial
# The cell matrix can also be converted to an object if needed. 
stimMatrix = [
    [stims[0],probs[0],orderMat[0],'Option A',stimX[0],textX[0],'a','OptA'],
    [stims[1],probs[1],orderMat[1],'Option S',stimX[1],textX[1],'s','OptS'],
    [stims[2],probs[2],orderMat[2],'Option K',stimX[2],textX[2],'k','OptK'],
    [stims[3],probs[3],orderMat[3],'Option L',stimX[3],textX[3],'l','OptL']
]


# Option Pairs
trialOrder = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,3]]


# Shuffle stimMatrix to reflect the trial order
stimMat = [[],[],[],[]]
for i in range(0,4):
    for j in range(0,4):
        if stimMatrix[j][2]-1 == i:
            stimMat[i] = stimMatrix[j]


# Make stimuli compatible with PsychoPy
# We have to initialize them to placeholder values. WIll be modified each trial
image1 = visual.ImageStim(
    win=win,
    name=stimMat[0][7],
    image=stimMat[0][0], mask=None,
    ori=0, pos=(stimMat[0][4], stimY), 
    size=stimSize,
    color=[1,1,1], colorSpace='rgb', opacity=1,
    flipHoriz=False, flipVert=False,
    texRes=128, interpolate=True, depth=0.0)
image2 = visual.ImageStim(
    win=win,
    name=stimMat[1][7],
    image=stimMat[1][0], mask=None,
    ori=0, pos=(stimMat[1][4], stimY), 
    size=stimSize,
    color=[1,1,1], colorSpace='rgb', opacity=1,
    flipHoriz=False, flipVert=False,
    texRes=128, interpolate=True, depth=0.0)


# Text for option compat with psychopy - placeholder variable
text1 = visual.TextStim(
    win=win, 
    name=stimMat[0][7],
    text=stimMat[0][3],
    font='Arial',
    pos=(stimMat[0][5], textY), height=textSize, 
    wrapWidth=None, ori=0, 
    color='white', colorSpace='rgb', opacity=1, 
    languageStyle='LTR',
    depth=-2.0
)
text2 = visual.TextStim(
    win=win, 
    name=stimMat[1][7],
    text=stimMat[1][3],
    font='Arial',
    pos=(stimMat[1][5], textY), height=textSize, 
    wrapWidth=None, ori=0, 
    color='white', colorSpace='rgb', opacity=1, 
    languageStyle='LTR',
    depth=-2.0
)


# Tailor reward feedback stimuli - initialized placeholder
RewardSelect = visual.ImageStim(
    win=win,
    name=stimMat[0][7]+'RewSelect',
    image=stimMat[0][0], mask=None,
    ori=0, pos=(stimMat[0][4], stimY), 
    size=stimSize,
    color=[1,1,1], colorSpace='rgb', 
    opacity=1,
    flipHoriz=False, flipVert=False,
    texRes=128, interpolate=True, depth=0.0
)
RewardBox = visual.Rect(
    win=win, name=stimMat[0][7]+'Rew',
    width=stimSize[0], height=stimSize[1],
    ori=0, pos=(stimMat[0][4], 0),
    lineWidth=1, lineColor=[1,1,1], lineColorSpace='rgb',
    fillColor=[1,1,1], fillColorSpace='rgb',
    opacity=1, depth=0.0, interpolate=True
)
RewardBoxNoFeed = visual.Rect(
    win=win, name=stimMat[0][7]+'Rew',
    width=stimSize[0]+50, height=stimSize[1]+50,
    ori=0, pos=(stimMat[0][4], 0),
    lineWidth=1, lineColor=[1,1,1], lineColorSpace='rgb',
    fillColor=[.5,.5,.5], fillColorSpace='rgb',
    opacity=1, depth=0.0, interpolate=True
)
RewardText = visual.TextStim(
    win=win, name=stimMat[0][7]+'RewText',
    text='XXX',
    font='Arial',
    pos=(stimMat[0][4], 0), height=textSize, 
    wrapWidth=None, ori=0, 
    color='black', colorSpace='rgb', opacity=1, 
    languageStyle='LTR',
    depth=-3.0
)


# Generate arrays to hold trial number flags for training
ABTrial = [0]*2 # [x]*y will create an array that includes y number of x
CDTrial = [1]*1
ABTrial.extend(CDTrial) # Combines the two arrays while keeping the values numeric rather than float64
trainArray = ABTrial
trainTrials = []

# Create full list of trial flags with blocked randomization
for i in range(0,1):
    shuffle(trainArray)
    trainTrials.extend(trainArray)


# Generate arrays to hold trial number flags for transfer
ACTrial = [2]*1
BCTrial = [3]*1
ADTrial = [4]*1
BDTrial = [5]*1
ACTrial.extend(BCTrial)
ACTrial.extend(ADTrial)
ACTrial.extend(BDTrial)
transArray = ACTrial
transTrials = []

# Create full list of trial flags with blocked randomization
for i in range(0,1):
    shuffle(transArray)
    transTrials.extend(transArray)


# Combine all Trial Flags - This will be referenced to
# Determine the options shown on each trial
trainTrials.extend(transTrials)
allTrials = trainTrials


#Start Timers
expClock = core.Clock()


# Empty arrays for data file
trialOption = []
trialReward = []
trialProbs = []
trialSeen = []
trialRT = []


# Variable for showing feedback or no feedback
tranTrialTrig = False
trialCount = 0

# Start trials
for trial in range(len(allTrials)): # runs the right number of trials
    
    trialCount += 1
    # Trigger test trial?
    if trialCount > len(ABTrial): # references the total number of training trials (ABTrial is used as proxy)
        tranTrialTrig = True
    
    # Trial Info
    #[stims[0],probs[0],orderMat[0],'Option A',stimX[0],textX[0],'a']
    trialMat = [stimMat[trialOrder[allTrials[trial]][0]],stimMat[trialOrder[allTrials[trial]][1]]]
    
    # The below is for visual aid in determining variables, trialMat can be referenced directly for more concise code
    stims = [trialMat[0][0],trialMat[1][0]]
    stimPos = [trialMat[0][4],trialMat[1][4]]
    stimName = [trialMat[0][7],trialMat[1][7]]
    text = [trialMat[0][3],trialMat[1][3]]
    textPos = [trialMat[0][5],trialMat[1][5]]
    keys = [trialMat[0][6],trialMat[1][6]]
    probs = [trialMat[0][1],trialMat[1][1]]
    event.clearEvents()
    
    
    # Update stim objects
    image1.name = stimName[0]
    image1.image = stims[0]
    image1.pos = (stimPos[0],stimY)
    image2.name = stimName[1]
    image2.image = stims[1]
    image2.pos = (stimPos[1],stimY)
    
    text1.name = stimName[0]
    text1.text = text[0]
    text1.pos = (textPos[0],textY)
    text2.name = stimName[1]
    text2.text = text[1]
    text2.pos = (textPos[1],textY)
    
    # Combine both so the selected option text can be called
    textMat = [text1,text2]
    
    
    # Draw all items on screen
    image1.draw() # the .draw command draws the given object
    image2.draw()
    text1.draw()
    text2.draw()
    win.flip() # This flips it to the screen
    
    
    # get a response
    keyPressed=None
    rtStart = expClock.getTime() # start the clock for rt
    while keyPressed==None:
        # here we include our key variable to listen for the right keys
        trialResp=event.waitKeys(keyList=[keys[0],keys[1],'escape'],clearEvents=True)[0]
        if trialResp==keys[0]:
            rtEnd = expClock.getTime() # end the rt clock
            picked = 0
            keyPressed = 1
        elif trialResp==keys[1]:
            rtEnd = expClock.getTime()
            picked = 1
            keyPressed = 1
        elif trialResp=='escape':
            core.quit()  # abort experiment
        event.clearEvents()  # clear other (eg mouse) events - they clog the buffer
    
    
    #Figure RT and trial values.
    rt = rtEnd-rtStart # RT
    optChose = trialMat[picked][2] # option chose. A=1,B=2,C=3,D=4 
    trialProb = probs[picked] # prob value for reward determination
    
    
    # Figure reward receipt
    reward = 0
    shownRew = '0'
    if trialProb >= random(): # compares random number against prob value
        reward = 1
        shownRew = '1'
    
    
    # Show Train or Test Feedback?
    if tranTrialTrig == False:
        
        # Tailor train reward feedback stimuli
        RewardSelect.name = trialMat[picked][7]
        RewardSelect.image = trialMat[picked][0]
        RewardSelect.pos = (trialMat[picked][4], stimY)

        RewardBox.name = trialMat[picked][7]
        RewardBox.pos = (trialMat[picked][4], stimY)

        RewardText.name = trialMat[picked][7]
        RewardText.text = shownRew
        RewardText.pos = (trialMat[picked][4], stimY)


        # For selection animation last .30s
        for t in range(15):
            RewardSelect.setOpacity((sin(t)), log=False)
            RewardSelect.draw()
            win.flip()
            core.wait(.02)


        # Draw Feedback
        RewardBox.draw()
        RewardText.draw()
        textMat[picked].draw()
        win.flip()
        core.wait(.75)
    else:
        
        # Tailor test reward feedback stimuli
        RewardSelect.name = trialMat[picked][7]
        RewardSelect.image = trialMat[picked][0]
        RewardSelect.pos = (trialMat[picked][4], stimY)

        RewardBoxNoFeed.name = trialMat[picked][7]
        RewardBoxNoFeed.pos = (trialMat[picked][4], stimY)
        
        
        # Draw the selected box with a gray outline and show for .30s
        RewardBoxNoFeed.draw() # things are drawn in order called. 
        RewardSelect.draw()
        textMat[picked].draw()
        win.flip()
        core.wait(.75)
    
    
    # Determine Best Option (option with highest prob value)
    bestOption = 0
    if max(probs) == trialProb:
        bestOption = 1
    
    
    # Save the data - appends the current data to the prior made arrays.
    trialOption.append(optChose)
    trialReward.append(reward)
    trialProbs.append(trialProb)
    trialSeen.append(allTrials[trial])
    trialRT.append(rt)


dataHead = 'optionChose,reward,prob,setSeen,RT'
datafile = np.column_stack((trialOption,trialReward,trialProbs,trialSeen,trialRT))
print(datafile)
np.savetxt("test.csv", datafile, delimiter=",",header=dataHead)























