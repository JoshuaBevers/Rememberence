import { Stage } from '../util/stage';
import { diaLog } from '../util/diaLogs';
export class DialogueSystem {
  loop(stage: Stage) {
    //check to see if a dialogue needs to happen.
    const playerArray = stage.entites.filter((x) => x.player);
    const player = playerArray[0];
    const npc = player.conversingWith;

    if (player.inDialogue === true) {
      //check constants
      if (
        npc?.dialogueList !== undefined &&
        typeof player.dialogueStep === 'number'
      ) {
        //step and player dialogue step have been confirmed to exist.
        if (player.dialogueNext === true && player.inQuestion !== true) {
          player.dialogueStep++;
        }
        //check to see if current player input can corrospond to a possible answer.

        const step = player.dialogueStep;
        const currentMessage = npc.dialogueList[step];

        //check for current message
        if (currentMessage !== undefined) {
          // ends the dialogue if the label is end dialogue
          if (currentMessage.label === 'end dialogue') {
            player.inDialogue = false;
          }
          //checks to see if current message is .m and that it is not the same as last message.
          if (
            currentMessage.m !== undefined &&
            currentMessage.m !== diaLog.lastEntry
          ) {
            //adds the dialog and sets the next to false to prepare for another dialogue if requested.
            diaLog.addEntryMid(currentMessage.m);

            player.dialogueNext = false;
          }

          // handles dialogue questions
          if (currentMessage.answers !== undefined) {
            //clears and readds to last entry to make it look pretty.
            const lastMessage = diaLog.lastEntry;
            diaLog.clearEntries();
            diaLog.addEntryMid(lastMessage);
            //set player to in question to prevent space clicking.
            player.inQuestion = true;
            //set the count to display in a friendly manner for the player.

            let count = 1;
            currentMessage.answers.forEach((a) => {
              diaLog.addEntryHigh(count + '. ' + a);
              count = count + 1;
            });

            //handle answer input.
            if (player.questionAnswer !== undefined) {
              const pAnswer = player.questionAnswer;
              const lastDialogue = npc.dialogueList[player.dialogueStep]
                .answers![pAnswer];

              // the answer is the label in the dialogue system that dictates what message to display next.
              const answer = npc.dialogueList[player.dialogueStep].next![
                pAnswer
              ];
              if (answer === undefined) {
                player.questionAnswer = undefined;
              }

              if (player.questionAnswer !== undefined) {
                // clear the dialogue, add your answer, and find the next dialogue message to display it.
                diaLog.clearEntries();
                diaLog.addEntryHigh(lastDialogue);
                //searches for a dialogue label message that matches the answer.
                npc.dialogueList.forEach((m, index) => {
                  if (m.label === answer) {
                    player.dialogueStep = index;
                  }
                });
                player.inQuestion = false;
                console.log(player);
              }
            }
          }
          //checks to see if current step has a next property, if so, direct the message there.
          // this should usually be directing back to a base branch of some nature.
          if (currentMessage.next && currentMessage.answers === undefined) {
            npc.dialogueList.forEach((m, index) => {
              if (m.label === currentMessage.next![0]) {
                console.log(m);
                console.log(player);
                player.dialogueStep = index - 1;
              }
            });
          }
        } else {
          player.inDialogue = false;
        }
      }
    }
    player.questionAnswer = undefined;
  }
}
