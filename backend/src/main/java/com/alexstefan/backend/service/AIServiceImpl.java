package com.alexstefan.backend.service;

import com.alexstefan.backend.dto.AITaskRequest;
import com.alexstefan.backend.dto.AITaskResponse;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.stereotype.Service;

@Service
public class AIServiceImpl implements AIService {
    private final ChatModel chatModel;

    public AIServiceImpl(ChatModel chatModel){
        this.chatModel = chatModel;
    }

    public AITaskResponse generatedText(AITaskRequest userInfo){

        String prompt = "Pe baza mesajului din acolade vreau sa inventezi urmatoarele campuri Titlu,Descriere,Categorie,Data(an/luna/zi/ora/minut) si Status(De facut, In lucru, Finalizat) pentru un task.";
        prompt += "Returneaza rezultatul STRICT in format JSON curat, fara text inainte sau dupa.";
        prompt += "{" + userInfo.userPrompt() + "}";

        ChatResponse response = chatModel.call(new org.springframework.ai.chat.prompt.Prompt(prompt));
        String jsonResult = response.getResult().getOutput().getContent();

        return new AITaskResponse(jsonResult);
    }

}
