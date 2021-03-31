import { Stage } from '../util/stage';
import { diaLog } from '../util/diaLogs';
import { Direction } from '../util/globals';

export class DialogueSystem {
  loop(stage: Stage) {
    const playerArray = stage.entites.filter((x) => x.player);
    const player = playerArray[0];
    const npc = player.conversingWith;
    // const maxChatLength = npc.dialogueList.length - 1;
    //need to go through the chat loop
    if (
      player.inDialogue &&
      typeof player.dialogueStep === 'number' &&
      npc &&
      npc.dialogueList
    ) {
      const currentMessage = npc.dialogueList[player.dialogueStep]; // grabs the current chat message
      //check to see if the current message is a message or a question.
      if (currentMessage.m) {
        if (diaLog.lastEntry !== currentMessage.m) {
          diaLog.addEntryMid(currentMessage.m);
        }
      }
      //question isn't currently being used. Not sure I want an answer system atm.
      if (currentMessage.question) {
        if (
          diaLog.lastEntry !== currentMessage.m &&
          currentMessage.question &&
          diaLog.lastEntry !== currentMessage.question
        ) {
          diaLog.addEntryMid(currentMessage.question);
        }
      }
      //   displays chat.
    }
  }
}
